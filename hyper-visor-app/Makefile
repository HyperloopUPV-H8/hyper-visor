# Variables
IMAGE_NAME = vite-app
DEV_COMPOSE_FILE = docker-compose.dev.yml
PROD_DOCKERFILE = Dockerfile.prod
DEV_DOCKERFILE = Dockerfile.dev
PORT = 3000

## 🔁 Desarrollo
dev-up:
	docker compose -f $(DEV_COMPOSE_FILE) up

dev-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

dev-build:
	docker build -f $(DEV_DOCKERFILE) -t $(IMAGE_NAME)-dev .

## 🚀 Producción
prod-build:
	docker build -f $(PROD_DOCKERFILE) -t $(IMAGE_NAME) .

prod-run:
	docker run -p $(PORT):80 $(IMAGE_NAME)

prod-down:
	@echo "Para producción sin docker-compose, usa 'docker ps' y 'docker stop <id>' o docker-compose.prod.yml si tienes uno."

## 📦 Docker Compose para producción (opcional)
compose-prod-up:
	docker compose -f docker-compose.prod.yml up --build

compose-prod-down:
	docker compose -f docker-compose.prod.yml down

## 🧹 Limpieza
clean:
	docker system prune -f

## 🔎 Ver contenedores
ps:
	docker ps

## 🌐 Abrir navegador (solo macOS/Linux con xdg-open)
open:
	xdg-open http://localhost:$(PORT) || open http://localhost:$(PORT)
