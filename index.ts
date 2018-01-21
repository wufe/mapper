import { Mapper } from "mapper";

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

const mapper = new Mapper();
mapper.createMap<S, D>(mappingSignature, D)
    .forMember("a", opt =>
        opt.mapFrom(s => s.a)
    );

const source = new S();
source.a = '1234';

const mappedDestination = mapper.mapWith<S, D>(
    conf => {
        return conf
            .sourcePrecondition(source => source.a !== '123')
            .sourcePrecondition(source => source.a !== '321')
            .destinationPrecondition(destination => destination.a === undefined)
            .destinationPrecondition(destination => destination.c === undefined);
    },
    mappingSignature, source);
console.log(mappedDestination);