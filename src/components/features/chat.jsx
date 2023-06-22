import React, { useState, useRef, useEffect, useContext } from 'react'
import styles from './chat.module.css'
import ChatMessage from './chat_messages'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PersonaContext } from '../../contexts/persona'

const Chat = (props) => {
  const [chats, setChats] = useState([])
  const messageRef = useRef(null)

  const persona = useContext(PersonaContext).persona

  const handleMessageSend = () => {
    const content = messageRef.current.value
    if(!content) return;
    messageRef.current.value = ""

    // cb: callback
    // cb := function(text: string, finished: boolean)
    const genshinContentGenerator = (cb) => {
      const fullContent = '你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相。'
      let idx = 0

      const elapsed = () => {
        const next = idx + Math.ceil(20 * Math.random() + 5)
        const finised = next >= fullContent.length
        cb(fullContent.substring(0, next), finised)
        idx = next

        if(!finised) setTimeout(elapsed, Math.random() * 900 + 300)
      }
      
      setTimeout(elapsed, Math.random() * 900 + 900)
    }

    setChats(chats => [...chats,
      {
        id: new Date().toISOString(),
        content: content,
        time: new Date(),
        avatar: '/default-avatar.png',
      },
      {
        id: `${new Date().toISOString()}-reply`,
        content_provider: genshinContentGenerator,
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
