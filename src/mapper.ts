import { IGenericMap, IMap, Map } from "map";
import { IConfiguration, Configuration, IMapConfiguration, ISingleMapConfiguration, TConfigurationSetter } from "configuration";
import { TMapperConfigurationSetter, IMapperConfiguration, buildMapperConfiguration, MapperConfiguration } from "conf/mapper.configuration";
import { TMapActionConfigurationSetter } from "conf/map-action.configuration";

export type MapSignature = {
	source: symbol;
	destination: symbol;
};

export type Mapping = MapSignature & {
	map: IGenericMap;
}

export class Mapper {
    private _mappings: Mapping[] = [];
	
	private configuration: IMapperConfiguration = buildMapperConfiguration();

    withConfiguration(mapperConfiguration: TMapperConfigurationSetter): this { 
		this.configuration = buildMapperConfiguration(mapperConfiguration);
		return this;
	}

	createMap<S, D>(signature: MapSignature, destinationEntity: { new(): D }): IMap<S, D> {
		const map = new Map<S, D>(
			destinationEntity,
			this.configuration as MapperConfiguration,
			signature,
			this
		);
		this._mappings.push({
			source: signature.source,
			destination: signature.destination,
			map
		});
		return map;
	};

	map<S, D>(
		{ source, destination }: MapSignature,
		sourceEntity: S,
		destinationEntity?: D,
		mapActionConfiguration?: TMapActionConfigurationSetter<S, D>
	): D {
		const map = this.getMap<S, D>({ source, destination });
		if (!map)
			return;
		return map.map(sourceEntity, destinationEntity, mapActionConfiguration) as D;
	}

	mapMany<S, D>(
		{ source, destination }: MapSignature,
		sourceEntity: S,
		destinationEntity?: D,
		mapActionConfiguration?: TMapActionConfigurationSetter<S, D>
	): Array<D> {
		const map = this.getMap<S, D>({ source, destination });
		if (!map)
			return;
		return map.map(sourceEntity, destinationEntity, mapActionConfiguration) as Array<D>;
	}

	mapArray<S, D>(
		{source, destination}: MapSignature,
		sourceArray: S[],
		destinationArray?: D[],
		mapActionConfiguration?: TConfigurationSetter<ISingleMapConfiguration<S, D>>
	): D[] {
		const map = this.getMap<S, D>({ source, destination });
		if (!map)
			return [];
		if (!destinationArray || sourceArray.length !== destinationArray.length)
			return sourceArray
				.map(sourceEntity => this.map({ source, destination }, sourceEntity, undefined, mapActionConfiguration));
		sourceArray
			.forEach((sourceEntity, index) => destinationArray[index] = this.map({ source, destination }, sourceEntity, destinationArray[index], mapActionConfiguration));
		return destinationArray;
	}

	private getMap<S, D>({source, destination}: MapSignature): Map<S, D> {
		let mapping: Mapping = this._mappings
			.find(m => m.source === source && m.destination === destination);
		if (mapping)
			return mapping.map as Map<S, D>;
		return;
	}
}