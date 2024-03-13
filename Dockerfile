FROM node:latest

WORKDIR /example

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3005

CMD [ "npm", "run", "start" ]