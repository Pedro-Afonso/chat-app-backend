/* eslint-disable no-console */
import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    SETUP: 'SETUP',
    JOIN_CHAT: 'JOIN_CHAT',
    START_TYPING: 'START_TYPING',
    STOP_TYPING: 'STOP_TYPING',
    SEND_MESSAGE: 'SEND_MESSAGE',
    CREATE_CHAT: 'CREATE_CHAT'
  },
  SERVER: {
    CONNECTED: 'CONNECTED',
    RECEIVED_MESSAGE: 'RECEIVED_MESSAGE',
    STARTED_TYPING: 'STARTED_TYPING',
    STOPPED_TYPING: 'STOPPED_TYPING',
    CREATED_CHAT: 'CREATED_CHAT'
  }
}

export const AppSocket = ({ io }: { io: Server }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`Conectado! ${socket.id}`)

    /*
     * When a user access a chat page
     */
    socket.on(EVENTS.CLIENT.SETUP, ({ userId }) => {
      /* const userId = user._id */
      socket.join(userId)
      socket.emit(EVENTS.SERVER.CONNECTED)
      console.log(`On setup, Socket ${socket.id} has entered in room ${userId}\n
      List of all rooms: ${[...socket.rooms]}`)
    })

    /*
     * When a user open a chat
     */
    socket.on(EVENTS.CLIENT.JOIN_CHAT, ({ chatId }) => {
      /* if (leave) {
        socket.leave(leave)
        console.log('User Leave Room: ' + leave)
      } */
      socket.join(chatId)
      console.log(`On join chat, Socket ${
        socket.id
      } has entered in room ${chatId}\n
      List of all rooms: ${[...socket.rooms]}`)
      /* console.log('User Joined Room: ' + chatId)
      console.log('List of all rooms', socket.rooms) */
    })

    /*
     * When a user start typing
     */
    socket.on(EVENTS.CLIENT.START_TYPING, ({ chatId }) => {
      console.log('user is typing: room ' + chatId)
      socket.in(chatId).emit(EVENTS.SERVER.STARTED_TYPING)
    })

    /*
     * When a user stop typing
     */
    socket.on(EVENTS.CLIENT.STOP_TYPING, ({ chatId }) => {
      console.log('user stopped typing: room ' + chatId)
      socket.in(chatId).emit(EVENTS.SERVER.STOPPED_TYPING)
    })

    /*
     * When a user send a message
     */
    interface ITESTE {
      chat?: { users?: { _id?: string }[] }
      sender?: {
        _id?: string
      }
    }

    socket.on(EVENTS.CLIENT.SEND_MESSAGE, (receivedMessage: ITESTE) => {
      const { chat, sender } = receivedMessage

      if (!chat?.users || !sender?._id) {
        console.log('Ocorreu um erro!')
        return
      }

      chat.users.forEach(({ _id }) => {
        if (!_id) return

        if (_id === sender._id) return

        socket.in(_id).emit(EVENTS.SERVER.RECEIVED_MESSAGE, receivedMessage)
      })
    })
  })
}
