FROM mhart/alpine-node

WORKDIR /app

COPY package* .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "dist/server.js"]
