import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { WebSocketServer, WebSocket } from 'ws'
import { appRouter } from './routers/_app'
import { createContext } from './context'
import { env } from '@/env'

const wss = new WebSocketServer({
  port: parseInt(env.WS_PORT),
})
const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
})
wss.on('connection', (ws: WebSocket) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})
console.log('✅ WebSocket Server listening on ws://localhost:3001')
process.on('SIGTERM', () => {
  console.log('SIGTERM')
  handler.broadcastReconnectNotification()
  wss.close()
})
