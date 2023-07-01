import { useCallback, useEffect, useState } from 'react';
import styles from './chat_messages.module.css'

const ChatMessage = (props) => {
  let messageContent = <></>
  switch(props.type) {
    case 'text':
      messageContent = <TextMessage {...props} />
      break;
    default:
      messageContent = <span> Unknown message type </span>
      break;
  }

  return (
    <>
      <div className={styles['chat-message']}>
        <div className={styles['chat-message-avatar-wrap']}>
          <img alt="messenger avatar" className={styles['chat-message-avatar']} src={props.avatar} />
        </div>
        { messageContent }
      </div>
    </>
  )
}

const TextMessage = (props) => {
  const time = props.time
  const [continuous, setContinues] = useState(props.continuous)
  const [content, setContent] = useState(continuous ? '' : props.content)

  const handleContentUpdate = useCallback((content, finished) => {
    setContent(content)
    setContinues(!finished)
    if(finished) props.generateDone(content)
  }, [props])

  useEffect(() => {
    if(props.continuous) props.content_provider(handleContentUpdate)
  }, [props, handleContentUpdate])

  return (
    <>
      <div className={styles['message-content-text']}>
        <p className={continuous ? styles['continuous'] : ''}> { content } </p>
        <p className={styles['message-timestamp']}> { new Date(time).toLocaleTimeString() } </p>
      </div>
    </>
  )
}

export default ChatMessage
