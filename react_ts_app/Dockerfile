FROM node:17.4.0-alpine
WORKDIR /usr/src/app

# サーバーサイドのポート番号を変更
ENV PORT 3001
EXPOSE $PORT

COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
