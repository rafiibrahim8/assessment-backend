FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json src .env ./
RUN npm install
# Make this port match on .env file
EXPOSE 8000
RUN npm run create-admin -- --username admin --password admin123
CMD ["npm", "start"]
