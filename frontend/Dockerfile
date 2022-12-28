FROM node:16-alpine

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm install

COPY . .

EXPOSE 3000

COPY .env ./

RUN npm install

ARG BASE_URL
ENV BASE_URL $BASE_URL

RUN npm run build

FROM nginx
CMD ["nginx", "-g", "daemon off;"]