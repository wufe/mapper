const { Mapper } = require("../lib/index");
const { expect } = require('chai');

describe("Mapper class", () => {
    it("should be instantiated", () => {
        const mapper = new Mapper();
        expect(mapper).to.be.a.instanceOf(Mapper);
    });
});

describe("Simple mapping", () => {
    it("should be accomplished", () => {
        const mapper = new Mapper();
        const sourceSymbol = Symbol('source');
        const destinationSymbol = Symbol('destination');
        mapper.createMap({
            source: sourceSymbol,
            destination: destinationSymbol
        }, {});

        const sourceEntity = { a: 'a' };
        const destinationEntity = {};

        const mappedDestination = mapper.map({
            source: sourceSymbol,
            destination: destinationSymbol
        }, sourceEntity, destinationEntity);

        expect(mappedDestination === destinationEntity).to.be.true;
        expect(destinationEntity.a).to.not.be.undefined;
        expect(destinationEntity.a).to.equals(sourceEntity.a);
    });
});