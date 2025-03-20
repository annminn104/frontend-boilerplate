import { router } from '../trpc'

// Create a proper router with at least one procedure
export const appRouter = router({
  // Example procedure
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return { greeting: `Hello ${input.text}` };
  //   }),
})

// Export the router type
export type AppRouter = typeof appRouter
