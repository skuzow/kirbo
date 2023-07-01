FROM node:16-alpine as builder
WORKDIR /usr/kirbo
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm i \
 && npm run build

FROM node:16-alpine
WORKDIR /usr/kirbo
COPY package.json ./
COPY --from=builder /usr/kirbo/dist ./dist
COPY --from=builder /usr/kirbo/src/config/.env ./
COPY .env* ./
RUN npm i --omit=dev
CMD ["npm", "start"]
