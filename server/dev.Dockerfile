FROM	node:23-alpine as base
ENV		NODE_ENV=development

WORKDIR	/app

COPY	package*.json ./
RUN		npm install
COPY	. .
RUN		npx prisma generate

EXPOSE	$PORT
EXPOSE	$PRISMA_STUDIO_PORT

CMD		npm run start:dev