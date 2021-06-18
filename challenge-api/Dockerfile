FROM node:14-alpine

WORKDIR /usr/src

RUN apk --no-cache add --virtual builds-deps build-base python

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

EXPOSE 8090

CMD ["npm", "start"]
