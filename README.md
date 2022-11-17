# Peleza portal
> An app to process new partner applications

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## DOCKER SETUP
```Dockerfile```
 * Docker build command ```docker build -t sendy-peleza-portal:latest --build-arg DOCKER_ENV=testing .```
 * Added ```ARG``` used to set the variable in the build command i.e. ```ARG DOCKER_ENV```
 * Saved it to the environment by setting ```ENV DOCKER_ENV=$DOCKER_ENV```

 ```Webpack```
 * In ```build.js``` we check for testing and default to production. We import the configuration file for test i.e. ```var webpackConfig = process.env.NODE_ENV == 'testing' ?  require('./webpack.test.conf') : require('./webpack.prod.conf')```
 * In the loaded config (```webpack.test.conf.js```) we load the test environment ```var env = config.test.env```
 * In the environment file (```test.env.js```) set the environment variables e.g. ```BASE_URL: 'qa.sendyit.com'```
 * In the Webpack base config (```webpack.base.conf.js```) set the publicPath condition to also check for the testing environment 
 ```javascript
    publicPath: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
 ```
