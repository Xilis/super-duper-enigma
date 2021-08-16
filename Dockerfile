FROM node:16 AS base
WORKDIR /actionhero
COPY public ./public
COPY package*.json tsconfig*.json ./

FROM base AS builder
RUN npm ci
COPY src ./src
RUN npm run build

FROM base as release
COPY --from=builder /actionhero/dist /actionhero/dist
RUN npm ci --production
CMD ["node", "dist/server.js"]
