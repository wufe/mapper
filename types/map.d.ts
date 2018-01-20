import { StringElementSelector } from "selectors";
import { ElementOperation, SourceElementOperation } from "operations";
export interface IGenericMap {
}
export interface IMap<S, D> extends IGenericMap {
    forMember: (selector: StringElementSelector<D>, operation: ElementOperation<S>) => this;
    forSourceMember: (selector: StringElementSelector<S>, operation: SourceElementOperation<D>) => this;
    map: (sourceEntity: S, destinationEntity?: D) => D;
}
export declare class Map<S, D> implements IMap<S, D> {
    private DestinationClass;
    private _destOperations;
    private _sourceOperations;
    constructor(DestinationClass: {
        new (): D;
    });
    forMember: (selector: StringElementSelector<D>, operation: ElementOperation<S>) => this;
    forSourceMember: (selector: StringElementSelector<S>, operation: ElementOperation<D>) => this;
    map: (sourceEntity: S, destinationEntity?: D) => D;
}
