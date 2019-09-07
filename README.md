![torii-shopping-api-header](https://user-images.githubusercontent.com/5593590/64252020-20eccd00-cf1a-11e9-8964-adb0e976cc93.png)

ToriiShopping API is a API Rest to retrieve products. Developed using typescript in Node.js and using hapijs framework.

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

## Libraries used in this project
[hapijs](https://github.com/hapijs/hapi)
[hapi boom](https://github.com/hapijs/boom)
## License

MIT License

Copyright (c) 2019 Jorge Sánchez Fernández

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
