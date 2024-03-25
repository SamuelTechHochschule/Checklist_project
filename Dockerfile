ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3005

ENV NODE_ENV=production

WORKDIR /src

FROM base as build

COPY --link package*.json .
RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

FROM base 

ENV PORT=$PORT

EXPOSE 3005

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
