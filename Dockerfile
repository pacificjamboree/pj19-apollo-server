FROM node:8.11.2-alpine
WORKDIR /usr/src/app
RUN apk --no-cache add --virtual builds-deps build-base python procps
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN npm install -g -s --no-progress yarn && yarn
RUN npm rebuild bcrypt --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
