APP_CONTAINER := app
PROD_CONTAINER := app-prod

.PHONY: build build-prod up up-prod down shell install build-app dev

build:
	docker compose build app

build-prod:
	docker compose build app-prod

up:
	docker compose up app

up-prod:
	docker compose up app-prod

down:
	docker compose down

shell:
	docker compose exec $(APP_CONTAINER) sh

install:
	docker compose exec $(APP_CONTAINER) npm install $(PKG)

build-app:
	docker compose exec $(APP_CONTAINER) npm run build

dev:
	docker compose up app
