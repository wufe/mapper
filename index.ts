import { Mapper } from "mapper";

class S {
    a: string;
    b: string;
    c: string;
}
class D {
    a: {
        text: string;
    };
    c: string;
    constructor() {
        this.c = 'sample';
    }
}

const mappingSignature = {
    source: Symbol('source'),
    destination: Symbol('destination')
};

class Z {
    a: {
        text: string;
    };
}

const mapper = new Mapper();
mapper.createMap<S, Z>(mappingSignature, Z)
    .forMember("a", opt =>
        opt.mapFrom(
            s => s.a,
            conf =>
                conf
                    .withProjection(source => ({
                        text: source.a
                    }))
        )
    );

const source = new S();
source.a = '123';

const mappedDestination = mapper.map<S, Z>(mappingSignature, source);
console.log(mappedDestination);