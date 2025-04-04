import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, auth } = ctx
    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId! },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return user
  }),
})
