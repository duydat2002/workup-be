import { Server } from 'socket.io'
import handleProjectSocket from './project'

export const socketHandle = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('connection')

    socket.on('init', (userData) => {
      socket.data.user = userData
      socket.join(userData.id)
      userData.projects?.forEach((p: any) => {
        socket.join(p)
      })
      console.log(userData.id, userData.fullname)
    })

    handleProjectSocket(io, socket)

    socket.on('disconnect', () => {
      console.log('disconnect')
    })
  })
}
