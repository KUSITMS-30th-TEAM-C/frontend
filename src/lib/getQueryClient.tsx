import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
        mutations: {
          retry: false,
        },
      },
    }),
)
export default getQueryClient
