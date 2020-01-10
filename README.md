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

## Brief Archiecture Description

The architecture is based on the Inversion of Control principle.
The is a simple Dependency Injection technique built with the help of Reflect.Metadata API and Typescript Decorators
and covered with basic unit tests - https://github.com/ladrower/hangman/blob/master/src/infrastructure/ioc/index.spec.tsx

All the services can simply ask for the related dependencies in their constructors.

Stores are special types of Services that are used by the Components and provide all the domain logic.

The hierarchical injection principle for the Stores is achived using the React.Context API.
Meaning that different instances of the same Store can be used by different Components.

It also means that when some module is unloaded - all the associated scoped Stores are garbage collected.

For instance: Auth and Router stores are global and defined on the root level - https://github.com/ladrower/hangman/blob/master/src/index.tsx#L42

But the Documentation store is only provided for the documentation page 
and is automatically destroyed when the route navigates out of the documentation page - https://github.com/ladrower/hangman/blob/master/src/app/App.tsx#L20 

The Store API is covered with basic unit tests - https://github.com/ladrower/hangman/blob/master/src/infrastructure/store/index.spec.tsx
