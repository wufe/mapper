import { Mapper } from "mapper";

class ProductEntity {
    items: ItemEntity[] = [];
    item: ItemEntity;
}

class ItemEntity {
    constructor(private id: number) {}
}

const source = new ProductEntity();
source.items = [1,2,3].map(x => new ItemEntity(x));
source.item = new ItemEntity(4);

class Product {
    items: Item[] = [];
    item: Item;
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
    .forMember("item", opt =>
        opt.mapAs(source => source.item, itemSignature)
    );
mapper.createMap<ItemEntity, Item>(itemSignature, Item)
    .forMember("product", opt => opt
        .withPrecondition(() => opt.getParent()!.signature === productSignature)
        .mapFrom(() => opt.getParent<ProductEntity, Product>()!.destination)
    );

const mappedDestination = mapper.map<ProductEntity, Product>(productSignature, source);

console.log(mappedDestination);

console.log(mappedDestination.item.product.item.product.item.product);