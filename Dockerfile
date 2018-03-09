FROM node:8.9.4-alpine
WORKDIR /usr/src/app
RUN apk --no-cache add --virtual builds-deps build-base python
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN npm install -g -s --no-progress yarn && yarn
RUN npm rebuild bcrypt --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
