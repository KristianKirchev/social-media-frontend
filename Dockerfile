### STAGE 1: Build ###
#FROM node:18.15.0-alpine AS build
#WORKDIR /usr/src/app
#COPY package.json package-lock.json ./
#RUN npm install
#COPY . .
#RUN npm run build

### STAGE 2: Run ###
#FROM nginx:1.17.1-alpine
#COPY nginx/nginx.conf /etc/nginx/nginx.conf
#COPY --from=build /usr/src/app/dist/social-media-frontend /usr/share/nginx/html


FROM nginx:1.17.1-alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY /dist/social-media-frontend /usr/share/nginx/html