import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { protectedProcedure, router } from '../trpc'
import { prisma } from '@/lib/prisma'

// Event emitter for real-time updates
const ee = new EventEmitter()

export const chatRouter = router({
  // Get all rooms
  getRooms: protectedProcedure.query(async () => {
    const rooms = await prisma.room.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return rooms.map(room => ({
      id: room.id,
      name: room.name,
      created_at: room.createdAt.toISOString(),
      participant_count: room._count.participants,
      last_message: room.messages[0]
        ? {
            content: room.messages[0].content,
            created_at: room.messages[0].createdAt.toISOString(),
            user: {
              email: room.messages[0].user.email,
            },
          }
        : undefined,
    }))
  }),

  // Get a single room with messages
  getRoom: protectedProcedure.input(z.object({ roomId: z.string() })).query(async ({ input, ctx }) => {
    const room = await prisma.room.findUnique({
      where: { id: input.roomId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    })

    if (!room) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room not found',
      })
    }

    return {
      ...room,
      messages: room.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        userId: msg.userId,
        user: msg.user,
      })),
    }
  }),

  // Create a new room
  createRoom: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const room = await prisma.room.create({
      data: {
        name: input.name,
        participants: {
          create: {
            userId: ctx.auth.userId ?? '',
          },
        },
      },
    })

    ee.emit('roomCreated', room)
    return room
  }),

  // Join a room
  joinRoom: protectedProcedure.input(z.object({ roomId: z.string() })).mutation(async ({ input, ctx }) => {
    const participant = await prisma.participant.create({
      data: {
        roomId: input.roomId,
        userId: ctx.auth.userId ?? '',
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    })

    ee.emit('participantJoined', {
      roomId: input.roomId,
      participant: {
        id: participant.id,
        email: participant.user.email,
      },
    })

    return participant
  }),

  // Leave a room
  leaveRoom: protectedProcedure.input(z.object({ roomId: z.string() })).mutation(async ({ input, ctx }) => {
    const participant = await prisma.participant.delete({
      where: {
        roomId_userId: {
          roomId: input.roomId,
          userId: ctx.auth.userId ?? '',
        },
      },
    })

    ee.emit('participantLeft', {
      roomId: input.roomId,
      participantId: participant.id,
    })

    return participant
  }),

  // Send a message
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await prisma.message.create({
        data: {
          content: input.content,
          roomId: input.roomId,
          userId: ctx.auth.userId ?? '',
        },
        include: {
          user: {
            select: { email: true },
          },
        },
      })

      ee.emit('messageCreated', {
        roomId: input.roomId,
        message: {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          userId: message.userId,
          user: {
            email: message.user.email,
          },
        },
      })

      return message
    }),

  // Mark room as read
  markAsRead: protectedProcedure.input(z.object({ roomId: z.string() })).mutation(async ({ input, ctx }) => {
    return prisma.participant.update({
      where: {
        roomId_userId: {
          roomId: input.roomId,
          userId: ctx.auth.userId ?? '',
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })
  }),

  // Subscribe to room events
  onRoomEvent: protectedProcedure.input(z.object({ roomId: z.string() })).subscription(({ input }) => {
    return observable<any>(emit => {
      const onMessage = (data: any) => {
        if (data.roomId === input.roomId) {
          emit.next(data)
        }
      }

      ee.on('messageCreated', onMessage)
      ee.on('participantJoined', onMessage)
      ee.on('participantLeft', onMessage)

      return () => {
        ee.off('messageCreated', onMessage)
        ee.off('participantJoined', onMessage)
        ee.off('participantLeft', onMessage)
      }
    })
  }),
})
