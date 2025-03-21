import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const contactRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      // Implement email sending logic here
      return { success: true }
    }),
})
