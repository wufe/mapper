# Mapper

### Object to object mapper in Typescript

**Inspired by [Automapper](https://github.com/automapper/automapper)**

This library provides an API to map an object into another object, following previously set rules.  
It is designed with redux's reducers in mind, so it is a perfect fit when used as application's state incremental modifier.

Supports:
+ ~~Immutability~~
+ ~~Nested mapping~~
+ Redudant mapping
+ Denormalization helpers
+ ~~Override of pre-existing rules to behave differently in runtime (edge cases)~~
+ ~~Array mapping~~

**Redundant mapping implementation ideas**  

```typescript
mapper.createMap<ProductEntity, Product>(productSignature, Product)
    .forMember("items", opt =>
        opt.mapAs(itemSignature, Item)
    );
mapper.createMap<ItemEntity, Item>(itemSignature, Item)
    .forMember("product", opt =>
        opt.mapFrom(() => opt.parent.destination)
    );
```

**Denormalization helpers ideas**

The library should flatten objects preserving references.  
