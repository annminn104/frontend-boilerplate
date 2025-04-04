import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { uneval } from 'devalue'
import superjson from 'superjson'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformer = {
  input: superjson,
  output: {
    serialize: (object: any) => uneval(object),
    // This `eval` only ever happens on the **client**
    deserialize: (object: any) => eval(`(${object})`),
  },
}
