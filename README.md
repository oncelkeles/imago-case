# imago-case

### How to run

#### run locally:

You can use the makefile to run the command
`make run-local`

which will execute:

```
npm i
npm build
npm run start
```

#### dockerize and run

You can use the makefile to build and run the docker image

```
make dockerize
make run
```

or with one line
`make build-and-run`

which will execute:

```
docker build -t imago-search .
docker run -p 3000:3000 imago-search
```

### Docs

Basic search implementation using the test Elasticsearch server.

To make a search, you can use the endpoint `http://localhost:3000/api/search`, which accepts the following queries:
```
q: search text, (only one that is required)
page: page number for simple pagination
limit: number of data in the results
startDate: filter by date, beginning
endDate: filter by date, ending
```


### Test

In order to test, you can execute
`npm run test`
