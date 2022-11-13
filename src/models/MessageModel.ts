import { model, Schema, Types } from 'mongoose'

interface IMessage {
  _id: Types.ObjectId
  sender: Types.ObjectId
  content: string
  chat: Types.ObjectId
  readBy: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  __v?: number
}

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

export const MessageModel = model<IMessage>('Chat', messageSchema)
