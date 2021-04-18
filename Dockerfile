FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon npm

RUN npm install --no-optional

COPY . .