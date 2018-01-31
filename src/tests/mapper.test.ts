
import "mocha";
import { Mapper } from "mapper";
import { expect } from "chai";

describe("Mapper class", () => {
    it("should be instantiated", () => {
        const mapper = new Mapper();
        expect(mapper).to.be.a.instanceOf(Mapper);
    });
});

describe("Mapper", () => {

    class S {
        a: string;
        b: string;
        c: string;
    }
    class D {
        a: string;
        c: string;
        constructor() {
            this.c = 'sample';
        }
    }

    const mappingSignature = {
        source: Symbol('source'),
        destination: Symbol('destination')
    };
    it("should map without explicitly set properties", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D);

        const source = new S();
        source.a = 'a';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);
    });
    it("should map with explicitly set properties", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt => opt.mapFrom(s => s.a));

        const source = new S();
        source.a = 'a';
        source.b = 'b';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);

        expect((mappedDestination as any).b).to.not.be.undefined;
        expect((mappedDestination as any).b).to.equal(source.b);
    });
    it("should not map explicitly ignored properties not belonging to destination", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt => opt.mapFrom(s => s.a))
            .forSourceMember("b", opt => opt.ignore());

        const source = new S();
        source.a = 'a';
        source.b = 'b';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);

        expect((mappedDestination as any).b).to.be.undefined;
    });
    it("should not map explicitly ignored properties belonging to destination", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt => opt.ignore());

        const source = new S();
        source.a = 'a';
        source.b = 'b';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.be.undefined;

        expect((mappedDestination as any).b).to.not.be.undefined;
        expect((mappedDestination as any).b).to.equal(source.b);
    });
    it("should not map explicitly ignored properties belonging to destination, overriding previously set rule", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt => opt.mapFrom(s => s.a))
            .forMember("a", opt => opt.ignore());

        const source = new S();
        source.a = 'a';
        source.b = 'b';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.be.undefined;

        expect((mappedDestination as any).b).to.not.be.undefined;
        expect((mappedDestination as any).b).to.equal(source.b);
    });
    it("should map explicitly set ONLY properties, if configured so", () => {
        const mapper = new Mapper()
            .withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt => opt.mapFrom(s => s.a));

        const source = new S();
        source.a = 'a';
        source.b = 'b';
        source.c = 'c';

        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);

        expect((mappedDestination as any).b).to.be.undefined;
        expect(mappedDestination.c).to.not.equal(source.c);
    });
    it("should map NOT explicitly set ONLY properties, if configured so, overriding previously set configuration", () => {
        const mapper = new Mapper()
            .withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));
        mapper.createMap<S, D>(mappingSignature, D)
            .withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(false))
            .forMember("a", opt => opt.mapFrom(s => s.a));

        const source = new S();
        source.a = 'a';
        source.b = 'b';
        source.c = 'c';
        
        const mappedDestination = mapper.map<S, D>(mappingSignature, source);

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);

        expect((mappedDestination as any).b).to.not.be.undefined;
        expect((mappedDestination as any).b).to.equal(source.b);
        expect(mappedDestination.c).to.equal(source.c);
    });
    it("should map explicitly set ONLY properties, if configured so, overriding previously set configuration twice", () => {
        const mapper = new Mapper()
            .withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));
        mapper.createMap<S, D>(mappingSignature, D)
            .withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(false))
            .forMember("a", opt => opt.mapFrom(s => s.a));

        const source = new S();
        source.a = 'a';
        source.b = 'b';
        source.c = 'c';
        
        const mappedDestination = mapper.map<S, D>(mappingSignature, source, undefined, conf => conf.shouldRequireExplicitlySetProperties(true));

        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a).to.equal(source.a);

        expect((mappedDestination as any).b).to.not.equal(source.b);
        expect(mappedDestination.c).to.not.equal(source.c);
    });
    it("should check if preconditions are satisfied first", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt =>
                opt.mapFrom(s => s.a)
                    .withPrecondition(source => source.a === 'asd')
                    .withPrecondition((_, destination) => destination.a === undefined)
            );

        const source = new S();
        source.a = 'a';

        const firstMappedDestination = mapper.map<S, D>(mappingSignature, source);
        expect(firstMappedDestination.a).to.not.equal(source.a);

        source.a = 'asd';
        const secondMappedDestination = mapper.map<S, D>(mappingSignature, source);
        expect(secondMappedDestination.a).to.equal(source.a);

        const destination = new D();
        destination.a = 'definitely not undefined';
        const thirdMappedDestination = mapper.map<S, D>(mappingSignature, source, destination);
        expect(thirdMappedDestination.a).to.not.equal(source.a);
    });
    it("should check if chained preconditions are satisfied", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt =>
                opt.mapFrom(s => s.a)
                    .withPrecondition(source => source.a !== '123')
                    .withPrecondition(source => source.a !== '321')
                    .withPrecondition((_, destination) => destination.a === undefined)
                    .withPrecondition((_, destination) => destination.c === 'sample')
            );

        const source = new S();
        source.a = '123';

        const firstMappedDestination = mapper.map<S, D>(mappingSignature, source);
        expect(firstMappedDestination.a).to.not.equal(source.a);

        source.a = '321';
        const secondMappedDestination = mapper.map<S, D>(mappingSignature, source);
        expect(secondMappedDestination.a).to.not.equal(source.a);

        source.a = '1234';
        const thirdMappedDestination = mapper.map<S, D>(mappingSignature, source);
        expect(thirdMappedDestination.a).to.equal(source.a);

        const destination = new D();
        destination.c = 'definitely not "sample"';
        const fourthMappedDestination = mapper.map<S, D>(mappingSignature, source, destination);
        expect(fourthMappedDestination.a).to.not.equal(source.a);
    });
    it("should check if chained preconditions are satisfied on mapping action", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D)
            .forMember("a", opt =>
                opt.mapFrom(s => s.a)
                    .withPrecondition(source => source.a !== '12345')
            );

        const source = new S();
        source.a = '123';

        const firstMappedDestination = mapper.map<S, D>(
            mappingSignature, source, undefined, conf =>
                conf
                    .withPrecondition(source => source.a !== '123')
                    .withPrecondition(source => source.a !== '321')
                    .withPrecondition((_, destination) => destination.a === undefined)
                    .withPrecondition((_, destination) => destination.c === 'sample'));
        expect(firstMappedDestination.a).to.not.equal(source.a);

        source.a = '321';
        const secondMappedDestination = mapper.map<S, D>(
            mappingSignature, source, undefined, conf =>
                conf
                    .withPrecondition(source => source.a !== '123')
                    .withPrecondition(source => source.a !== '321')
                    .withPrecondition((_, destination) => destination.a === undefined)
                    .withPrecondition((_, destination) => destination.c === 'sample'));
        expect(secondMappedDestination.a).to.not.equal(source.a);

        source.a = '1234';
        const thirdMappedDestination = mapper.map<S, D>(
            mappingSignature, source, undefined, conf =>
                conf
                    .withPrecondition(source => source.a !== '123')
                    .withPrecondition(source => source.a !== '321')
                    .withPrecondition((_, destination) => destination.a === undefined)
                    .withPrecondition((_, destination) => destination.c === 'sample'));
        expect(thirdMappedDestination.a).to.equal(source.a);

        const destination = new D();
        destination.c = 'definitely not "sample"';
        const fourthMappedDestination = mapper.map<S, D>(
            mappingSignature, source, destination, conf =>
                conf
                    .withPrecondition(source => source.a !== '123')
                    .withPrecondition(source => source.a !== '321')
                    .withPrecondition((_, destination) => destination.a === undefined)
                    .withPrecondition((_, destination) => destination.c === 'sample'));
        expect(fourthMappedDestination.a).to.not.equal(source.a);

        source.a = '12345';
        const fifthMappedDestination = mapper.map<S, D>(
            mappingSignature, source, undefined, conf =>
            conf
                .withPrecondition(source => source.a !== '123')
                .withPrecondition(source => source.a !== '321')
                .withPrecondition((_, destination) => destination.a === undefined)
                .withPrecondition((_, destination) => destination.c === 'sample'));
        expect(fifthMappedDestination.a).to.not.equal(source.a);
    });
    it("should follow shape provided by configuration", () => {

        class Z {
            a: {
                text: string;
            };
        }

        const mapper = new Mapper();
        mapper.createMap<S, Z>(mappingSignature, Z)
            .forMember("a", opt =>
                opt.mapFrom(s => s.a)
                    .withProjection(source => ({
                        text: source.a
                    }))
            );

        const source = new S();
        source.a = '123';

        const mappedDestination = mapper.map<S, Z>(mappingSignature, source);
        expect(mappedDestination.a).to.not.be.undefined;
        expect(mappedDestination.a.text).to.equal(source.a);
    });
    it("should be able to map arrays", () => {
        const mapper = new Mapper();
        mapper.createMap<S, D>(mappingSignature, D);

        const s1 = new S();
        s1.a = 'a1';
        const s2 = new S();
        s2.a = 'a2';
        const sources: S[] = [ s1, s2 ];

        const mappedDestinations = mapper.mapArray<S, D>(mappingSignature, sources);
        expect(mappedDestinations.length).to.equal(2);
        expect(mappedDestinations[0].a).to.equal(s1.a);
        expect(mappedDestinations[1].a).to.equal(s2.a);
    });
    it("should be able to map complex objects", () => {
        class S1 {
            a: S2;
        }

        class S2 {
            s: string = 's';
        }

        class D1 {
            a: D2;
        }

        class D2 {
            d: string = 'd';
        }

        const source = new S1();
        source.a = new S2();

        const S1D1Signature = {
            source: Symbol('S1'),
            destination: Symbol('D1')
        };
        const S2D2Signature = {
            source: Symbol('S2'),
            destination: Symbol('D2')
        };

        const mapper = new Mapper();
        mapper.withConfiguration(conf => conf.shouldRequireExplicitlySetProperties(true));
        mapper.createMap<S1, D1>(S1D1Signature, D1)
            .forMember('a', opt => opt.mapAs(source => source.a, S2D2Signature));
        mapper.createMap<S2, D2>(S2D2Signature, D2)
            .forMember('d', opt => opt.mapFrom(source => source.s));

        const mappedDestination = mapper.map<S1, D1>(S1D1Signature, source);

        expect(mappedDestination.a.d).to.equal(source.a.s);
    });
    it("should complete the example", () => {
        class ProductEntity {
            productName: string;
            complexObject: {
                value: string;
            };
            prices: Array<PriceEntity>;
        }
        class PriceEntity {
            price: number;
        }
        
        class ProductModel {
            name: string;
            prices: Array<PriceModel>;
            complexObject: {
                value: string;
            };
        }
        class PriceModel {
            amount: number;
            product: ProductModel;
        }
        const productSign = {
            source: Symbol('ProductEntity'),
            destination: Symbol('ProductModel')
        };
        
        const priceSign = {
            source: Symbol('PriceEntity'),
            destination: Symbol('PriceModel')
        };
        
        const mapper = new Mapper();
        mapper
            .withConfiguration(conf => conf
                .shouldRequireExplicitlySetProperties(true) // Explicitly set properties only
                .shouldAutomaticallyMapArrays(true));       // Map arrays also
        
        mapper.createMap<ProductEntity, ProductModel>(productSign, ProductModel)
            .forMember('name', opt => opt.mapFrom(src => src.productName))
            .forMember('prices', opt => opt.mapAs(src => src.prices, priceSign))
            .forMember('complexObject', opt => opt
                .mapFrom(src => src.complexObject)
                .immutably()
            );
        
        mapper.createMap<PriceEntity, PriceModel>(priceSign, PriceModel)
            .forMember('amount', opt => opt.mapFrom(src => src.price))
            .forMember('product', opt => opt
                .mapFrom(() => {
                    const parent = opt.getParent<ProductEntity, ProductModel>();
                    // preserve a reference of the product in which this price is contained
                    return parent && parent.destination;
                })
                .withPrecondition(() => {
                    // Precondition not required but recommended
                    const parent = opt.getParent<ProductEntity, ProductModel>();
                    return parent && (parent.signature === productSign);
                })
            );
            
        const productSource = new ProductEntity();
        productSource.productName = 'The mighty product.';
        productSource.complexObject = {
            value: 'aaa'
        };
        productSource.prices = [13, 41, 57, 40].map(p => {
            const priceEntity = new PriceEntity();
            return priceEntity;
        });

        const productWithImmutability = mapper.map<ProductEntity, ProductModel>(productSign, productSource);

        // So immutability works
        expect(productWithImmutability.complexObject).to.not.equal(productSource.complexObject);
        expect(productWithImmutability.prices[0].product.prices[0].product.prices[0].product).to.equal(productWithImmutability);

    });
});