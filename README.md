# Cypress dotenv

Cypress plugin that enables compatability with [dotenv](https://www.npmjs.com/package/dotenv).  

## What does this thing do?
It will load any [`CYPRESS_*` environment variables](https://docs.cypress.io/guides/guides/environment-variables.html#Option-2-cypress-env-json) defined in your `.env` file so you can access them via `Cypress.env()` from within your tests as you would expect.  

For example.. if your `.env` file has something like this:
```text
CYPRESS_HELLO=hola
GOODBYE=adios
```

You can use `Cypress.env('HELLO`) to access its value.


## Install
```bash
npm install --save-dev cypress-dotenv
```
or
```
yarn add --dev cypress-dotenv
```

## Configure

Since this is a plugin, you will need to modify your file cypress/plugins/index.js to look something like this:

```javascript
const dotenvPlugin = require('cypress-dotenv');
module.exports = (on, config) => {
  config = dotenvPlugin(config)
  return config
}
```

## Options
This plugin takes two paramaters. The first parameter (which is mandatory) is the Cypress config object and the other is an optional [dotenv](https://www.npmjs.com/package/dotenv#config) config object.
