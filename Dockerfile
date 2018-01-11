FROM node:8.9.4-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
COPY . .
RUN npm install -g -s --no-progress yarn && yarn
CMD ["yarn", "start"]
EXPOSE 3000