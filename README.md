# hangman

## Deployed version

Live API Documentation - http://artem.northeurope.cloudapp.azure.com/documentation

The game UI - http://artem.northeurope.cloudapp.azure.com

## Install and run locally

```
npm install
npm start
```

## Basic description

The API is entirely mocked and covered with unit tests - https://github.com/ladrower/hangman/tree/master/src/mock/game

The mocked HttpFactrory is provided to the injector in this line - https://github.com/ladrower/hangman/blob/master/src/index.tsx#L30

## Brief Architecture Description

The architecture is based on the Inversion of Control principle and Reactive Store.

There is a simple Dependency Injection technique built with a help of Reflect.Metadata API and Typescript Decorators
and covered with basic unit tests - https://github.com/ladrower/hangman/blob/master/src/infrastructure/ioc/index.spec.tsx

All the services can simply ask for the related dependencies in their constructors.

*Stores* are special types of services that are used by *Components* and provide all the domain logic.

The hierarchical injection principle for the Stores is achieved using the React.Context API.

Meaning that different instances of the same Store can be used by different components.

Components lower in the tree can either inherit or get their own instance of the Store.

It also means that when some module is unloaded - all the associated scoped Stores can be safely garbage collected.

For instance: Auth and Router stores are global and defined on the root level - https://github.com/ladrower/hangman/blob/master/src/index.tsx#L42

But the Documentation store is only provided for the documentation page 
and is automatically destroyed when the route navigates out of the documentation page - https://github.com/ladrower/hangman/blob/master/src/app/App.tsx#L20 

If we want to preserve the state of the documentation page between routes - we just need to move it higher to the root level.

The Store API is covered with basic unit tests - https://github.com/ladrower/hangman/blob/master/src/infrastructure/store/index.spec.tsx


Communication with a backend is implemented using HttpReader service that synchronously returns an observable resource (IHttpResource) - https://github.com/ladrower/hangman/blob/master/src/infrastructure/resource/HttpReader.ts

This approach eliminates the issue with requests cancellation, because we literally forget about any previous resourse and override it with a new one synchronously allowing the former one to be garbage collected since no one has a closure with it.

