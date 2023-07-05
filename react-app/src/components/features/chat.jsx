import React, { useState, useRef, useEffect, useContext } from 'react'
import styles from './chat.module.css'
import ChatMessage from './chat_messages'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PersonaContext } from '../../contexts/persona'

import { FetchChatResponse } from '../../api/chat'

const Chat = (props) => {
  const [chats, setChats] = useState([])
  const messageRef = useRef(null)

  const persona = useContext(PersonaContext).persona

  const handleMessageSend = () => {
    const content = messageRef.current.value
    if(!content) return;
    messageRef.current.value = ""

    const privataContentGenerator = (payload) => {
      // cb: callback
      // cb := function(text: string, finished: boolean)
      return (cb) => {
        FetchChatResponse(payload).then(r => {
          cb(r.data.result, true)
        })
      }
    }

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

  const handleGenerateDone = (id, text) => {
    setChats(chats => {
      const lastChat = chats.at(-1)
      lastChat.continuous = false
      lastChat.content = text
      return [...chats.slice(0, -1), lastChat]
    })
  }


  return (
    <div className={styles['chat-message']}>
      { chats && chats.length !== 0 ?
        (
          <div className={styles['chat-message-list']}>
            { chats.map(chat => (
              <ChatMessage key={chat.id} type="text" {...chat} generateDone={(text) => handleGenerateDone(chat.id, text)}/>
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
          rows="2"
        />
        <button className={styles['send-button']} onClick={handleMessageSend}>
          <PaperAirplaneIcon />
        </button>
      </div>
    </div>
  )
}

export default Chat
