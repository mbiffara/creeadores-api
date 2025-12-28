FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "run", "start"]
