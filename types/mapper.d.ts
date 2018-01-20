import { IGenericMap, IMap } from "map";
export declare type MapSignature = {
    source: symbol;
    destination: symbol;
};
export declare type Mapping = MapSignature & {
    map: IGenericMap;
};
export declare class Mapper {
    private _mappings;
    createMap: <S, D>({source, destination}: MapSignature, destinationEntity: new () => D) => IMap<S, D>;
    map: <S, D>({source, destination}: MapSignature, sourceEntity: S, destinationEntity?: D) => D;
}
