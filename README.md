# Mapper - Object to object mapper in Typescript

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
+ Override of pre-existing rules to behave differently in runtime (edge cases)
+ Array mapping

***

## How to

### Getting started

**Install**

> `yarn add @wufe/mapper`  

or  

> `npm i --save @wufe/mapper`

***

**Configuration**

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

***

### Map creation without signature

It is possible to create a map rule set without a signature, using the `mapTo` decorator.  

Syntax:
```typescript
@mapTo(Destination)
class Source {}
```

Example:  
```typescript
import { Mapper } from '@wufe/mapper';

class Destination {
    class Destination {
    destGreeting: string;
    constructor() {
        this.destGreeting = 'destination';
    }
}

@mapTo(Destination)
class Source {
    sourceGreeting: string;
    constructor() {
        this.sourceGreeting = 'source';
    }
}

const mapper = new Mapper();
mapper.createMap<Source, Destination>(Source)
    .forMember("destGreeting", opt => opt.mapFrom(src => src.sourceGreeting));

const sourceEntity = new Source();

const destinationEntity = mapper.map<Source, Destination>(sourceEntity);
```

***

### Examples

More examples are available in the [tests](https://github.com/Wufe/mapper/tree/master/src/tests) folder.

***

## Documentation

Check the documentation in the [wiki](https://github.com/Wufe/mapper/wiki).