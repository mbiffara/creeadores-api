FROM node:20-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends libssl3 \
  && rm -rf /var/lib/apt/lists/*

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
