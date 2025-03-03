DOCKER_IMAGE = imago-search

docker-build:
	docker build -t $(DOCKER_IMAGE) .

docker-run:
	docker run -p 3000:3000 $(DOCKER_IMAGE)

docker-test:
	docker run $(DOCKER_IMAGE) npm test

docker-all: docker-build docker-run

run-local:
	npm i
	npm build
	num run start