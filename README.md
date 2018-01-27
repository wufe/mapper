# Mapper - Object to object mapper in Typescript

## This library is in development stage.

**Inspired by [Automapper](https://github.com/automapper/automapper)**

**Warning**: This is *NOT* a complete reimplementation of Automapper.  

## What is this

This library provides an API to map an object into another object, following previously set rules.  
It is designed with **redux**'s reducers in mind, so it is a perfect fit when used as application's state incremental modifier.  
It provides **immutability**, nested mapping capabilities and higly customizable configuration interfaces.  

Supports:
+ Immutability
+ Nested mapping
+ Redudant mapping
+ Denormalization helpers - *TODO*
+ Override of pre-existing rules to behave differently in runtime (edge cases)
+ Array mapping

## How to

### Getting started

Each map ruleset requires a mapping signature, to be able to identify object types at runtime.  

**Create a mapper and instantiate your first map ruleset**  
Syntax:  
`mapper.createMap<S, D>(signature: MapSignature, destination: { new(): D })`

```typescript
const mapper = new Mapper();
const sourceDestinationSignature: MapSignature = {
    source: Symbol('SourceClass'),
    destination: Symbol('DestinationClass')
};
mapper.createMap<SourceClass, DestinationClass>(sourceDestinationSignature, DestinationClass);
```

**To apply the mapping**  
Syntax:  
`mapper.map<S, D>(signature: MapSignature, source: S)`

```typescript
const sourceObject = new SourceClass();
sourceObject.a = 'a';
const destinationObject = mapper.map<SourceClass, DestinationClass>(sourceDestinationSignature, sourceObject);
// destinationObject.a is now 'a'
```

## Development notes

**Denormalization helpers ideas**

The library should flatten objects preserving references.  