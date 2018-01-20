import { IGenericMap, IMap, Map } from "map";
import { IConfiguration, Configuration } from "configuration";

export type MapSignature = {
	source: symbol;
	destination: symbol;
};

export type Mapping = MapSignature & {
	map: IGenericMap;
}

export class Mapper {
    private _mappings: Mapping[] = [];
    private _configuration = new Configuration();

    withConfiguration: (mapConfiguration: (configurationObject: IConfiguration) => void) => this =
        (mapConfiguration) => {
            mapConfiguration(this._configuration);
            return this;
        };

	createMap = <S, D>({
		source,
		destination
	}: MapSignature, destinationEntity: { new(): D }): IMap<S, D> => {
		const map = new Map<S, D>(destinationEntity, this._configuration);
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