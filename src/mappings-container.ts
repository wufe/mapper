import { TGenericClass } from "./mapper";
import { IGenericMap } from "./map";

export type TMappingsContainer = {
    source: TGenericClass;
    destination: TGenericClass;
}[];

export const mappingsContainer: TMappingsContainer = [];