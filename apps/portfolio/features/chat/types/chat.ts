import { User } from '@prisma/client'

export interface Message {
  id: string
  content: string
  createdAt: string
  userId: string
  user: Pick<User, 'id' | 'email'>
}

export interface Participant {
  id: string
  userId: string
  user: Pick<User, 'id' | 'email'>
}

export interface RoomListItem {
  id: string
  name: string
  created_at: string
  participant_count: number
  last_message:
    | {
        content: string
        created_at: string
        user: {
          email: string
        }
      }
    | undefined
}

export interface Room {
  id: string
  name: string
  messages: Message[]
  participants: Participant[]
}

export interface RoomEvent {
  type: 'messageCreated' | 'participantJoined' | 'participantLeft'
  roomId: string
  message?: Message
  participant?: Participant
  participantId?: string
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'
