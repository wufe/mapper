import { IGenericMap, IMap, Map } from "./map";
import { TMapperConfigurationSetter, IMapperConfiguration, buildMapperConfiguration, MapperConfiguration } from "./conf/mapper.configuration";
import { TMapActionConfigurationSetter } from "./conf/map-action.configuration";

export type MapSignature = {
	source: symbol;
	destination: symbol;
};

export type TGenericClass<T = any> = { new(...args: any[]): T };

export type TMapping = MapSignature & {
	map: IGenericMap;
}

export type TImplicitMapping = {
    source: TGenericClass;
    map: IGenericMap;
};

export class Mapper {
	private _mappings: TMapping[] = [];
	private _implicitMappings: TImplicitMapping[] = [];
	
	private configuration: IMapperConfiguration = buildMapperConfiguration();

    withConfiguration(mapperConfiguration: TMapperConfigurationSetter): this { 
		this.configuration = buildMapperConfiguration(mapperConfiguration);
		return this;
	}

	createMap<S, D>(signature: MapSignature, destination: TGenericClass<D>): IMap<S, D>;
	createMap<S, D>(source: TGenericClass<S>): IMap<S, D>;

	createMap<S, D>(sourceOrSignature: any, destination?: TGenericClass<D>): IMap<S, D> {
		let map: IMap<S, D>;
		if (typeof sourceOrSignature === 'function') {
			// Implicit map
			const source: TGenericClass<S> = sourceOrSignature;
			map = new Map<S, D>(this.configuration as MapperConfiguration, this);
			this._implicitMappings.push({
				map,
				source
			});
		} else {
			// Explicit map
			const signature: MapSignature = sourceOrSignature;
			map = new Map<S, D>(
				destination,
				this.configuration as MapperConfiguration,
				signature,
				this
			);
			this._mappings.push({
				source: signature.source,
				destination: signature.destination,
				map
			});
		}
		return map;
	};

	map<S, D>(signature: MapSignature, source: S, destination?: D, actionConfiguration?: TMapActionConfigurationSetter<S, D>): D;
	map<S, D>(source: S, destination?: D, actionConfiguration?: TMapActionConfigurationSetter<S, D>): D;

	map<S, D>(
		signatureOrSource: any,
		sourceOrDestination?: any,
		destinationOrActionConfiguration?: any,
		actionConfiguration?: any
	) {
		if (typeof destinationOrActionConfiguration === 'function' ||
			typeof sourceOrDestination === 'undefined' ||
			(
				(
					signatureOrSource !== undefined &&
					sourceOrDestination !== undefined &&
					destinationOrActionConfiguration === undefined
				) && !(
					Object.keys(signatureOrSource).length === 2 &&
					typeof signatureOrSource.source === 'symbol' &&
					typeof signatureOrSource.destination === 'symbol'
				)
			)
		) {
			// Implicit map
			const source: S = signatureOrSource;
			const destination: D = sourceOrDestination;
			const actionConfiguration: TMapActionConfigurationSetter<S, D> = destinationOrActionConfiguration;
			const map = this.getImplicitMap<S, D>(source);
			if (!map)
				return;
			return map.map(source, destination, destinationOrActionConfiguration);
		} else {
			// Explicit map
			const {source, destination} = signatureOrSource as MapSignature;
			const sourceEntity: S = sourceOrDestination;
			const destinationEntity: D = destinationOrActionConfiguration;
			const mapActionConfiguration: TMapActionConfigurationSetter<S, D> = actionConfiguration;
			const map = this.getMap<S, D>({ source, destination });
			if (!map)
				return;
			return map.map(sourceEntity, destinationEntity, mapActionConfiguration) as D;
		}
	}

	// map<S, D>(
	// 	{ source, destination }: MapSignature,
	// 	sourceEntity: S,
	// 	destinationEntity?: D,
	// 	mapActionConfiguration?: TMapActionConfigurationSetter<S, D>
	// ): D {
	// 	const map = this.getMap<S, D>({ source, destination });
	// 	if (!map)
	// 		return;
	// 	return map.map(sourceEntity, destinationEntity, mapActionConfiguration) as D;
	// }

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
		mapActionConfiguration?: TMapActionConfigurationSetter<S, D>
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

	private getMap<S, D>(signature: MapSignature): Map<S, D> {
		let map: IGenericMap;
		// Explicit map
		const {source, destination} = signature as MapSignature;
		const mapping = this._mappings
			.find(m => m.source === source && m.destination === destination);
		if(mapping)
			map = mapping.map;
		return map as Map<S, D>;
	}

	private getImplicitMap<S, D>(source: S): Map<S, D> {
		let map: IGenericMap;
		const mapping = this._implicitMappings.find(
			mapping => source instanceof mapping.source
		);
		if (mapping)
			map = mapping.map;
		return map as Map<S, D>;
	}
}