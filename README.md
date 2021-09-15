# Cypress dotenv

Cypress plugin that enables compatability with [dotenv](https://www.npmjs.com/package/dotenv).  

[![Build Status](https://travis-ci.org/morficus/cypress-dotenv.svg?branch=master)](https://travis-ci.org/morficus/cypress-dotenv)
[![Maintainability](https://api.codeclimate.com/v1/badges/0d189dae8e924ada81ad/maintainability)](https://codeclimate.com/github/morficus/cypress-dotenv/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0d189dae8e924ada81ad/test_coverage)](https://codeclimate.com/github/morficus/cypress-dotenv/test_coverage)

Please note that as of v2.0 this plugin only support Node v10+, Cypress 8+ and dotenv 10+  
If you are still using older versions, then please install v1.x instead 

## What does this thing do?
It will load any [`environment variables`](https://docs.cypress.io/guides/guides/environment-variables.html#Option-2-cypress-env-json) defined in your `.env` file so you can access them via `Cypress.env()` from within your tests as you would expect.

Any [Cypress config options](https://docs.cypress.io/guides/references/configuration.html) defined in your `.env` will also be applied and take precedence over what is in your `cypress.json` file. See the [Cypress docs for details on this](https://docs.cypress.io/guides/references/configuration.html#Environment-Variables)

For example, if your `.env` file has something like this:

```text
CYPRESS_HELLO=hola
GOODBYE=adios
```

You can use `Cypress.env('HELLO')` to access its value.

## Install
You will also need to install the original `dotenv` package along with `cypress-dotenv`
```bash
npm install --save-dev dotenv cypress-dotenv 
```
or
```
yarn add --dev dotenv cypress-dotenv
```

## Configure

Since this is a plugin, you will need to modify your file `cypress/plugins/index.js` to look something like this:

```javascript
const dotenvPlugin = require('cypress-dotenv');
module.exports = (on, config) => {
  config = dotenvPlugin(config)
  return config
}
```

## Options
This plugin takes three paramaters. The first parameter (which is mandatory) is the Cypress config object. 

The second is an optional [dotenv](https://www.npmjs.com/package/dotenv#config) config object.

The third is an optional [all] boolean parameter, which is set to false by default. If set to true, it returns all available environmental variables, not limited to those prefixed with CYPRESS_.
