import { Mapper } from "mapper";

import { Mapper } from "mapper";

class ProductEntity {
    items: ItemEntity[] = [];
}

class ItemEntity {
    constructor(private id: number) {}
}

const source = new ProductEntity();
source.items = [1,2,3].map(x => new ItemEntity(x));

class Product {
    items: Item[] = [];
}

class Item {
    id: number;
    product: Product;
}

const productSignature = {
    source: Symbol('ProductEntity'),
    destination: Symbol('Product')
};
const itemSignature = {
    source: Symbol('ItemEntity'),
    destination: Symbol('Item')
};

const mapper = new Mapper();
mapper.createMap<ProductEntity, Product>(productSignature, Product)
    .forMember("items", opt =>
        opt.mapFrom(source => source.items)
            .withProjection((source, dest) => {
                const ret = mapper
                    .mapArray<ItemEntity, Item>(itemSignature, source.items);
                ret.forEach(items => items.product = dest);
                return ret;
            })
    );
mapper.createMap<ItemEntity, Item>(itemSignature, Item);

const mappedDestination = mapper.map<ProductEntity, Product>(productSignature, source);

console.log(mappedDestination);

console.log(mappedDestination.items[0].product.items[0].product.items[0].product);