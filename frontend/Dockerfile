FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_CONTACT_EMAIL=""
ARG VITE_COMPANY_ADDRESS=""
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL VITE_COMPANY_ADDRESS=$VITE_COMPANY_ADDRESS
RUN npm run build

FROM nginx:1.27-alpine
# Rendered to /etc/nginx/conf.d/default.conf by the base image's entrypoint (envsubst).
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=80 BACKEND_ADDR=backend:8080
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
