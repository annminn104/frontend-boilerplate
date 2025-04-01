import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type WebSocketMessage = {
  type: 'NEW_COMMENT' | 'COMMENT_UPDATED' | 'COMMENT_DELETED' | 'INITIAL_DATA'
  data: any
}

export function useWebSocket(wsUrl: string) {
  const ws = useRef<WebSocket | null>(null)
  const queryClient = useQueryClient()

  const connect = useCallback(() => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log('WebSocket connected')
      }

      ws.current.onmessage = event => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          switch (message.type) {
            case 'NEW_COMMENT':
            case 'COMMENT_UPDATED':
            case 'COMMENT_DELETED':
              // Invalidate comments query to trigger a refetch
              queryClient.invalidateQueries({ queryKey: ['comments'] })
              break
            case 'INITIAL_DATA':
              // Update comments cache with initial data
              queryClient.setQueryData(['comments'], (oldData: any) => ({
                ...oldData,
                recentComments: message.data.recentComments,
              }))
              break
            default:
              console.warn('Unknown message type:', message.type)
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      }

      ws.current.onclose = () => {
        console.log('WebSocket disconnected')
        // Attempt to reconnect after a delay
        setTimeout(connect, 3000)
      }

      ws.current.onerror = error => {
        console.error('WebSocket error:', error)
        ws.current?.close()
      }
    }
  }, [wsUrl, queryClient])

  useEffect(() => {
    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((type: WebSocketMessage['type'], data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  return {
    sendMessage,
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  }
}
