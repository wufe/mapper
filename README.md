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

**Redundant mapping implementation idea**  

```typescript
mapper.createMap<ProductEntity, Product>(productSignature, Product)
    .forMember("items", opt =>
        opt.mapAs(itemSignature, Item, conf =>
            conf.preservingReferenceForOf("product", opt.source)
        )
    );
```