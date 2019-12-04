![torii-shopping-api-header](https://user-images.githubusercontent.com/5593590/64252020-20eccd00-cf1a-11e9-8964-adb0e976cc93.png)

ToriiShopping API is a API Rest to retrieve products. Developed using TypeScript in Node.js and using hapijs framework.

## Setup

```
$ yarn install
```

## Development

Start development server:

```
$ yarn start-dev
```

This will open the development server at port 8000 or port asigned in process.env.PORT with automaticatic restart the server when a typescript file change.
Use [nodemon](https://github.com/remy/nodemon) to automaticatic restart.

## Production

Start development server:

```
$ yarn start
```

This will open the development server at port 8000 or port asigned in process.env.PORT 

## Tests

Run unit tests:

```
$ yarn test
```

## Secure

This API is secure using [Json Web Tokens](https://jwt.io/).

Token header must to be in the request to avoid 401 unauthorized.

Previously request to /login endpoint with your credentials and the response contains a temporal token to use in the 
following requests.

When the token is expired the server response 401 unauthorized and you should request to login again with your credentials.

## Libraries used in this project
* [hapijs](https://github.com/hapijs/hapi)
* [hapi boom](https://github.com/hapijs/boom)
* [apac](https://github.com/dmcquay/node-apac)
* [dotenv](https://github.com/motdotla/dotenv)
* [hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2)
* [node-fetch](https://github.com/bitinn/node-fetch)
## License
Torii Shopping is [GNU GPLv3](https://github.com/xurxodev/torii-shopping-api/blob/master/LICENSE) license.
