# syntax=docker/dockerfile:1

FROM node:24.11-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:24.11-alpine AS dev
WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=5173

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM deps AS build
WORKDIR /app

COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
