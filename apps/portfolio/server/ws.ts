import { WebSocket, WebSocketServer } from 'ws'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Define message types
const MessageSchema = z.object({
  type: z.enum(['NEW_COMMENT', 'COMMENT_UPDATED', 'COMMENT_DELETED']),
  data: z.any(),
})

type Message = z.infer<typeof MessageSchema>

export function createWSServer(port: number) {
  const wss = new WebSocketServer({ port })
  const clients = new Set<WebSocket>()

  wss.on('connection', ws => {
    clients.add(ws)
    console.log('Client connected')

    ws.on('message', async data => {
      try {
        const message = MessageSchema.parse(JSON.parse(data.toString()))
        broadcastMessage(message, ws)
      } catch (error) {
        console.error('Invalid message format:', error)
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
      console.log('Client disconnected')
    })

    // Send initial data
    sendInitialData(ws)
  })

  function broadcastMessage(message: Message, sender?: WebSocket) {
    const data = JSON.stringify(message)
    clients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  async function sendInitialData(ws: WebSocket) {
    try {
      const recentComments = await prisma.comment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          post: true,
        },
      })

      ws.send(
        JSON.stringify({
          type: 'INITIAL_DATA',
          data: { recentComments },
        })
      )
    } catch (error) {
      console.error('Error sending initial data:', error)
    }
  }

  return {
    wss,
    broadcast: broadcastMessage,
  }
}
