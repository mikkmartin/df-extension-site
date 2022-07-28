import type { AppRouter } from 'pages/api/[trpc]'
import { createTRPCClient, createTRPCClientProxy } from '@trpc/client'

const baseUrl =
  typeof window !== 'undefined' || process.browser
    ? ''
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`

const client = createTRPCClient<AppRouter>({
  url: `${baseUrl}/api`,
})
export const api = createTRPCClientProxy(client)
