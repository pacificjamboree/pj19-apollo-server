FROM node:10.10.0-alpine
RUN apk --no-cache add --virtual builds-deps build-base python procps shadow
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/sh nodejs && mkdir -p /usr/src/app && chown nodejs:nodejs /usr/src/app
USER nodejs
WORKDIR /usr/src/app
RUN apk --no-cache add --virtual builds-deps build-base python procps
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN yarn
RUN npm rebuild bcrypt --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
