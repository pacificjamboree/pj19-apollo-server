FROM node:10.10.0-alpine
RUN apk --no-cache add --virtual builds-deps build-base python procps shadow
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/sh nodejs && mkdir -p /usr/src/app && chown nodejs:nodejs /usr/src/app
USER nodejs
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN mkdir -p /home/nodejs/.cache/yarn
RUN yarn install --pure-lockfile
RUN npm rebuild bcrypt --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
