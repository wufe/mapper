
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
        expect(mappedDestination.c).to.not.be.undefined;
        expect(mappedDestination.c).to.equal(source.c);
    });
});