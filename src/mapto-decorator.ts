import { TGenericClass } from "./mapper";
import { mappingsContainer } from "./mappings-container";

export function mapTo<S extends TGenericClass<S>, D>(destination: TGenericClass<D>): (source: S) => void {
    return (source) => {
        mappingsContainer.push({
            source,
            destination
        });
    }
}