FROM node:18-alpine

WORKDIR /app

COPY . .

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
