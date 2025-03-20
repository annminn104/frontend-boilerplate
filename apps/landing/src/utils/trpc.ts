import { createTRPCReact } from '@trpc/react-query'
// Rename the imported type to avoid conflict
import type { AppRouter as RouterType } from '../server/api/root'

// Define a minimal interface that matches what your components expect
export interface AppRouter {
  // Add any procedure types your components are trying to use
  // For example:
  // hello: {
  //   useQuery: any;
  // };
}

// Use the renamed type
export const trpc = createTRPCReact<RouterType>()
