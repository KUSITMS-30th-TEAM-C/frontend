FROM node:18-alpine

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY package.json ./
COPY server.js ./

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
