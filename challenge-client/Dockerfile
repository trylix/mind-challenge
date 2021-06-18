FROM node:14-alpine

WORKDIR /usr/src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM nginx:alpine

COPY --from=0 /usr/src/build /usr/share/nginx/html

COPY --from=0 /usr/src/nginx.conf /etc/nginx/conf.d/default.conf
