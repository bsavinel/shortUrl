MAKEFILE_ENV=.env

all:
	docker compose --env-file ${MAKEFILE_ENV} up

up: all

down:
	docker compose --env-file ${MAKEFILE_ENV} down

in-client:
	docker compose --env-file ${MAKEFILE_ENV} exec -it client sh

in-server:
	docker compose  --env-file ${MAKEFILE_ENV} exec -it server sh

studio:
	docker-compose --env-file  ${MAKEFILE_ENV} exec -d server npx prisma studio --port 5555

module:
	npm install --prefix ./client
	npm install --prefix ./server
	cd server && npx prisma generate

clean: down
	rm -rf ./client/node_modules
	rm -rf ./server/node_modules
	rm -rf server/src/generated
	rm -rf client/src/generated
	docker rm -f client-laika nestjs-laika postgres || true
	docker volume rm -f postgres_data || true
	docker network rm -f network || true

fclean: clean
	rm -rf ./server/dist
	rm -rf ./client/dist
	docker rmi -f nestjs-dev

re: fclean all

.PHONY: server client all