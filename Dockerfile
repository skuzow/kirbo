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
COPY .env ./
COPY --from=builder /usr/kirbo/dist ./dist
RUN npm i --only=production
CMD ["npm", "start"]
