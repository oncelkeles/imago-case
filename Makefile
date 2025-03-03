DOCKER_IMAGE = imago-search

dockerize:
	docker build -t $(DOCKER_IMAGE) .

run:
	docker run -p 3000:3000 $(DOCKER_IMAGE)

docker-test:
	docker run $(DOCKER_IMAGE) npm test

build-and-run: dockerize run

run-local:
	npm i
	npm build
	num run start