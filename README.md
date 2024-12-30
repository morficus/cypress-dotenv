# Cypress dotenv

Cypress plugin that enables compatibility with [dotenv](https://www.npmjs.com/package/dotenv).  

> [!NOTE]
> If you need support for Cypress v9 or below, please use [v2.x of this plugin](https://github.com/morficus/cypress-dotenv/tree/v2.0.2)


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

Version 3.x of this plugin only supports Cypress v10+. For instructions on how to set up this plugin with older versions of Cypress, please refer to the [v2.x README](https://github.com/morficus/cypress-dotenv/tree/v2.0.2?tab=readme-ov-file#configure)


Since this is a plugin, you will need to modify your `cypress.config.js` to look something like this

```typescript
import { defineConfig } from 'cypress'
import dotenvPlugin from 'cypress-dotenv'

export default defineConfig({
 e2e: {
	...
	setupNodeEvents(on, config) {
		const updatedConfig = dotenvPlugin(config, null, true)
		// continue loading other plugins
		return updatedConfig
	},
	},
	...
})
```



## Options
This plugin takes three parameters:

1. The first parameter (which is mandatory) is the Cypress config object. 
1. The second is an optional [dotenv](https://www.npmjs.com/package/dotenv#config) config object.
1. The third (called `all`) is an optional boolean parameter, which is set to false by default. If set to true, it returns all available environmental variables, not limited to those prefixed with CYPRESS_.
