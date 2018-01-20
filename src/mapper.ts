import { IGenericMap, IMap, Map } from "map";

export type MapSignature = {
	source: symbol;
	destination: symbol;
};

export type Mapping = MapSignature & {
	map: IGenericMap;
}

export class Mapper {
	private _mappings: Mapping[] = [];

	createMap = <S, D>({
		source,
		destination
	}: MapSignature, destinationEntity: { new(): D }): IMap<S, D> => {
		const map = new Map<S, D>(destinationEntity);
		this._mappings.push({
			source,
			destination,
			map
		});
		return map;
	};

	map = <S, D>({ source, destination }: MapSignature, sourceEntity: S, destinationEntity?: D): D => {
		let mapping: Mapping = this._mappings
			.filter(m => m.source === source && m.destination === destination)[0];
		if(mapping){
			let map: Map<S, D> = mapping.map as Map<S, D>;
			return map.map(sourceEntity, destinationEntity);
		}
		return;
	}
}