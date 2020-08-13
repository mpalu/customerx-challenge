FROM node:alpine

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 8080

CMD [ "node", "app.js" ]