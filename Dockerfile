FROM node:lts-slim
WORKDIR /usr/src/transient

RUN npm i -g pnpm

# install and generate dependencies
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm i

# build application
COPY . ./
RUN pnpm build

# run
CMD [ "pnpm", "start" ]