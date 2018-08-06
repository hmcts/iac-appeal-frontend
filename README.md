# ia-appeal-frontend

Immigration &amp; Asylum appeal frontend

## Purpose

Immigration &amp; Asylum appeal frontend is a Node.js/Express/Nunjucks based web application to submit appeal cases for Immigration & Asylum Appellants and Legal Representatives

### Prerequisites

To run the project you will need to have the following installed:

* Node.js
* Yarn

For information about the software versions used to build this application and a complete list of it's dependencies see package.json

### Running the application

You can run the application as follows:

```
yarn install
yarn dev
```

These commands will download any required dependencies, and start a webserver listening on port `3000`

### Using the application

Right now only the Hello World endpoint exists:

```
curl http://localhost:3000/hello-world
```

### Running verification tests:

You can run the tests as follows:

```
yarn test
yarn test:nsp
```
