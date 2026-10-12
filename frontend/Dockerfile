FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_CONTACT_EMAIL=""
ARG VITE_CONTACT_PHONE=""
ARG VITE_COMPANY_ADDRESS=""
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL VITE_CONTACT_PHONE=$VITE_CONTACT_PHONE VITE_COMPANY_ADDRESS=$VITE_COMPANY_ADDRESS
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
