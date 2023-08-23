import { useState, useRef, useContext, useEffect } from 'react'
import styles from './chat.module.css'
import ChatMessage from './chat_messages'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PersonaContext } from '../../contexts/persona'

import { FetchChatResponse, GetChatHistory } from '../../api/chat'
import { ContentGeneratorCallbackFunction, ChatMessageType } from 'types/chat'

const Chat = () => {
  const [chats, setChats] = useState<ChatMessageType[]>([])
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  const persona = useContext(PersonaContext).persona

  useEffect(() => {
    var history: ChatMessageType[] = []

    GetChatHistory({ chat_uid: 'test' }).then(r => {
      for (var i = 0; i < r.data.history.length; ++i) {
        if (r.data.history[i].sender === 'user') {
          history.push(
            {
              id: new Date().toISOString(),
              content: r.data.history[i].message,
              time: new Date(),
              avatar: 'default-avatar.png',
            }
          )
        } else {
          history.push(
            {
              id: `${new Date().toISOString()}-reply`,
              content: r.data.history[i].message,
              time: new Date(),
              avatar: persona.avatar,
            }
          )
        }
      }
      setChats(history)

    }).catch(Error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMessageSend = () => {
    if (!messageRef.current) return

    const content = messageRef.current.value
    if (!content) return;

    messageRef.current.value = ""

    const privataContentGenerator = (payload: any) => {
      return (cb: ContentGeneratorCallbackFunction) => {
        FetchChatResponse(payload).then(r => {
          cb(r.data.result, true)
        })
      }
    }

    console.log(privataContentGenerator({ text: content }))

    setChats(chats => [...chats,
    {
      id: new Date().toISOString(),
      content: content,
      time: new Date(),
      avatar: 'default-avatar.png',
    },
    {
      id: `${new Date().toISOString()}-reply`,
      content_provider: privataContentGenerator({ text: content }),
      time: new Date(),
      avatar: persona.avatar,
      continuous: true,
    }
    ])
  }

  const handleGenerateDone = (id: string, text: string) => {
    setChats(chats => {
      const lastChat = chats.at(-1)
      if (!lastChat) return chats

      return [...chats.slice(0, -1), {
        id: lastChat.id,
        content: text,
        time: lastChat.time,
        avatar: lastChat.avatar,
      }]
    })
  }


  return (
    <div className={styles['chat-message']}>
      {chats && chats.length !== 0 ?
        (
          <div className={styles['chat-message-list']}>
            {chats.map(chat => (
              <ChatMessage key={chat.id} type="text" {...chat} generateDone={(text: string) => handleGenerateDone(chat.id, text)} />
            ))}
          </div>
        )
        :
        (
          <div className={styles['chat-message-hint']}>
            <span>Enter a Message Below to Chat with {persona.name}!</span>
          </div>
        )
      }

      <div className={styles['chat-message-send-area']}>
        <textarea
          ref={messageRef}
          className={styles['send-message']}
          placeholder="Enter messages..."
          onKeyUp={(key) => key.key === 'Enter' && !key.shiftKey ? handleMessageSend() : null}
          rows={2}
        />
        <button className={styles['send-button']} onClick={handleMessageSend}>
          <PaperAirplaneIcon />
        </button>
      </div>
    </div>
  )
}

export default Chat
