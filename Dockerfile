FROM node:10.15.3-alpine
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk --no-cache add --virtual \
  builds-deps \
  build-base \
  python \
  procps \
  shadow \
  chromium \
  harfbuzz \
  nss && \
  groupadd -r nodejs && \
  useradd -m -r -g nodejs -s /bin/sh nodejs && \
  mkdir -p /usr/src/app && \
  chown nodejs:nodejs /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
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
