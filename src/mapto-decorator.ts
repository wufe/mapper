import { TGenericClass } from "./mapper";
import { mappingsContainer } from "./mappings-container";

export function mapTo<S extends TGenericClass<S>, D>(destination: TGenericClass<D>, reverse = false): (source: S) => void {
    return (source) => {
        mappingsContainer.push({
            source,
            destination
        });
        if (reverse) {
            mappingsContainer.push({ source: destination, destination: source });
        }
    }
}