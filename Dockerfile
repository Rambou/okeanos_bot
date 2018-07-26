# maintained by Bousios Nikolaos a.k.a. Rambou (rambou.gr)
FROM node:8.9-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN mkdir /data
VOLUME [ "/data" ]

CMD npm start