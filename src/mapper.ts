import { IGenericMap, IMap, Map } from "map";
import { IConfiguration, Configuration, IMapConfiguration, ISingleMapConfiguration, TConfigurationSetter } from "configuration";

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

    withConfiguration: (mapperConfiguration: TConfigurationSetter<IConfiguration>) => this =
        (mapperConfiguration) => {
            mapperConfiguration(this._configuration);
            return this;
        };

	createMap<S, D>({
		source,
		destination
	}: MapSignature, destinationEntity: { new(): D }): IMap<S, D> {
		const map = new Map<S, D>(destinationEntity, this._configuration as Configuration<S, D>);
		this._mappings.push({
			source,
			destination,
			map
		});
		return map;
	};

	mapWith<S, D>(
		mapActionConfiguration: TConfigurationSetter<ISingleMapConfiguration<S, D>>,
		{source, destination}: MapSignature,
		sourceEntity: S,
		destinationEntity?: D
	): D {
		const map = this.getMap<S, D>({ source, destination });
		if (!map)
			return;
		return map.mapWith(mapActionConfiguration, sourceEntity, destinationEntity);
	}

	map<S, D>(
		{ source, destination }: MapSignature,
		sourceEntity: S,
		destinationEntity?: D
	): D {
		const map = this.getMap<S, D>({ source, destination });
		if (!map)
			return;
		return map.map(sourceEntity, destinationEntity);
	}

	private getMap<S, D>({source, destination}: MapSignature): Map<S, D> {
		let mapping: Mapping = this._mappings
			.find(m => m.source === source && m.destination === destination);
		if (mapping)
			return mapping.map as Map<S, D>;
		return;
	}
}