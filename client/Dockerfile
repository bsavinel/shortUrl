FROM	node:latest

EXPOSE	3000

RUN 	apt install bash
RUN		apt update
RUN		apt upgrade -y

WORKDIR	/var/www

COPY	package.json .
RUN		npm i


CMD		npm run dev