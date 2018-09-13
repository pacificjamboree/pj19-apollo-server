FROM node:10.10.0-alpine
WORKDIR /usr/src/app
RUN apk --no-cache add --virtual builds-deps build-base python procps
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN yarn
RUN npm rebuild bcrypt --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
