import { ChatResponseOK } from 'api/chat'
import * as chat from 'privataclient/chat'
import { FetchChatReply } from '@/api/chat'
import { EventEmitter } from 'events'
import { AxiosResponse } from 'axios'
import { FeatureDaemon } from 'context/FeatureDaemon'

declare interface ChatProvisioner extends FeatureDaemon {
  constructor(): this,
  new_chat(role: string): chat.Conversation,
  on(event: 'conversation_update', listener: (c: chat.Conversation) => void): this,
}

class ChatProvisioner extends EventEmitter {
  public name: string = "chat"
  // conversation_id to bool map
  public _generating_lock: Record<string, boolean>
  public conversations: Record<string, chat.Conversation>

  public get generating() {
    return this._generating_lock
  }

  constructor() {
    super()
    this._generating_lock = {}
    this.conversations = {}
  }

  private set_generating(con_id: string, value: boolean) {
    this.generating[con_id] = value
    this.emit('generating_status_changed', con_id, value)
  }

  new_chat = (role: string) => {
    // fetch backend to generate uuid
    const id = Math.floor(Math.random() * 114514 * 1919810).toString();

    if (!this.conversations[id]) {
      this.conversations[id] = {
        role,
        title: 'New Conversation',
        history: [],
      }
    }

    return this.conversations[id]
  }

  say = async (conversation_id: string, text: string) => {
    const conversation = this.conversations[conversation_id]

    conversation.history.push({
      sender: 'user',
      time: new Date(),
      message: { type: 'text', content: text, enerating: false }
    })
    this.emit('conversation_update', this.conversations[0])

    this.set_generating(conversation_id, true)
    FetchChatReply(text)
      .then((r) => {
        const data = r.data as ChatResponseOK
        conversation.history.push({
          sender: 'ai',
          time: new Date(),
          message: { type: "text", content: data.result, generating: false }
        })
        this.emit('conversation_update', this.conversations[0])
      })
      .catch((e: AxiosResponse<chat.ErrorMessage>) => {
        conversation.history.push({
          sender: 'ai',
          time: new Date(),
          message: { type: "error", code: -1, generating: false, message: e.data.message }
        })
        this.emit('conversation_update', conversation)
      })
      .finally(() => {
        this.set_generating(conversation_id, false)
      })
  }
}

export default ChatProvisioner
