<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

Start the application with `npx nest start -- run` and open [http://localhost:3000](http://localhost:3000) in your browser.

## API docs

To enable API documentation, run the application with `npx nest start -- run --genDocs true` and open [http://localhost:3000/docs/swagger-ui](http://localhost:3000/docs/swagger-ui) in your browser.

You can also save the documentation in a json file with `npx nest start -- doc -t json` or `npx nest start -- doc -t yml` for (yaml).

## Database

The application use a mongo database.

### Production

In _production_ mode, you need to set the environment variable `MONGO_URI` to the mongo database url.

### Development

In _development_ mode, the application use a local mongo database, you can use docker.
We provide a docker-compose file to start a mongo database.

No need to change the mongo url in the application, the docker-compose file will set the correct url.

But if you want to use your own mongo database, you can set the environment variable `MONGO_DEV_URI` to the mongo database url.

## Firebase Admin

You need to the environment variable `FIREBASE_CONFIG_PATH` to the path of the firebase admin config file.

By default you need to put the config at `.firebase.config.json`.

## Tests

To run the tests, you need to run :

```bash
npm run test
```

## Administrators

To set the administrators, you need to set the environment variable `ADMIN_EMAILS` to a list of emails separated by a comma.
