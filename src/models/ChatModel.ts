import { model, Schema, Types } from 'mongoose'

interface IChat {
  _id: Types.ObjectId
  name: string
  isGroupChat: boolean
  users: Types.ObjectId[]
  latestMessage: Types.ObjectId
  groupAdmin: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  __v?: number
}

const chatSchema = new Schema(
  {
    name: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

export const ChatModel = model<IChat>('Chat', chatSchema)
