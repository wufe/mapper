# Mapper

## This library is in development stage.

### Object to object mapper in Typescript

**Inspired by [Automapper](https://github.com/automapper/automapper)**

This library provides an API to map an object into another object, following previously set rules.  
It is designed with redux's reducers in mind, so it is a perfect fit when used as application's state incremental modifier.

Supports:
+ ~~Immutability~~
+ ~~Nested mapping~~
+ ~~Redudant mapping~~
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
        opt
            .withPrecondition(() => opt.parent.signature === productSignature)
            .mapFrom(() => opt.parent.destination)
    );
```

So the parent should have
+ depth
+ source
+ destination
+ signature
+ parent

**Denormalization helpers ideas**

The library should flatten objects preserving references.  

**References & immutability**

The idea is to preserve reference by default on sub-objects mapping.
*e.g*
```
class Obj {
    property: { // this property is references by default
        a: string;
    };
}
```

So the configuration should accept an "*automaticallyApplyImmutability*" and a "*immutably*"  
function on the operation configuration.  

**TODO**

+ Preserve references?
+ Max depth?