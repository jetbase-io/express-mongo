FROM node:10.15.3

VOLUME /root/.npm

RUN apt-get update

VOLUME /root/.npm

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm install bcrypt
ADD package.json /usr/src/app
RUN npm install
ADD . /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=local
ENV DB_URL=mongodb://admin:jetbase@127.0.0.1:27017/jetbase
ENV PORT=3001
ENV JWT_SECRET=shhhhhhared-secret

EXPOSE 3001

CMD npm start
