import { Server, Socket } from 'socket.io'

export default function handleProjectSocket(io: Server, socket: Socket) {
  socket.on('project:join', (projectId) => {
    console.log('project:join')
    socket.join(projectId)
  })

  socket.on('project:leave', (projectId) => {
    console.log('project:leave')
    socket.leave(projectId)
  })

  socket.on('task:create', () => {})
}
