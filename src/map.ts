import { StringElementSelector } from "selectors";
import { Mapper } from "mapper";
import { TMapConfigurationSetter, buildMapConfiguration, IMapConfiguration } from "conf/map.configuration";
import { TOperationConfigurationSetter, TSourceOperationConfigurationSetter, TOperationConfiguration, TSourceOperationConfiguration, OperationConfiguration, SourceOperationConfiguration } from "conf/operation.configuration";
import { TMapActionConfigurationSetter, MapActionConfiguration } from "conf/map-action.configuration";
import { MapperConfiguration, IMapperConfiguration } from "conf/mapper.configuration";

export interface IGenericMap {}

export interface IMap<S, D> extends IGenericMap {
    withConfiguration: (mapConfiguration: TMapConfigurationSetter<S, D>) => this;
	forMember: ( selector: StringElementSelector<D>, operation: TOperationConfigurationSetter<S, D> ) => this;
	forSourceMember: ( selector: StringElementSelector<S>, operation: TSourceOperationConfigurationSetter ) => this;
	map: (sourceEntity: S, destinationEntity?: D) => D;
}

export class Map<S, D> implements IMap<S, D>{

	private destinationOperations: Array<TOperationConfiguration<S, D>> = [];
	private sourceOperations: Array<TSourceOperationConfiguration<S>> = [];

	private mapConfigurationSetter: TMapConfigurationSetter<S, D>;

	constructor(
        private DestinationClass: { new(): D },
		private mapperConfiguration: MapperConfiguration,
		private mapper: Mapper
    ) {}
    
    private filterOperationsBySelector(selector: StringElementSelector<D>) {
        this.destinationOperations = this.destinationOperations.filter(opt => opt.selector !== selector);
	}

	private filterSourceOperationsBySelector(selector: StringElementSelector<S>) {
		this.sourceOperations = this.sourceOperations.filter(opt => opt.selector !== selector);
	}

	/**
	 * It executes the configuration mapping at runtime,
	 * so we store the mapperConfigurationSetter.
	 * 
	 * We will call it before mapping,
	 * applying IMMUTABLY the new configuration.
	 */
    withConfiguration = (mapConfigurationSetter: TMapConfigurationSetter<S, D>) => {
		this.mapConfigurationSetter = mapConfigurationSetter;
		return this;
	}

	/**
	 * Adds mapping operation (mapFrom, ignore, etc..) to an array.
	 * 
	 * Filters operation with the same selector first.
	 */
	forMember = (selector: StringElementSelector<D>, operation: TOperationConfigurationSetter<S, D>) => {
		this.filterOperationsBySelector(selector);
		this.destinationOperations.push({
			selector,
			operation
		});
		return this;
	}

	forSourceMember = (selector: StringElementSelector<S>, operation: TSourceOperationConfigurationSetter) => {
		this.filterSourceOperationsBySelector(selector);
		this.sourceOperations.push({
			selector,
			operation
		});
		return this;
	};

	map = (source: S, destination?: D, mapActionConfigurationSetter?: TMapActionConfigurationSetter<S, D>): D => {
		const configuration = new MapActionConfiguration<S, D>();
		configuration.mapperSettings = {
			...this.mapperConfiguration.mapperSettings
		};
		if (this.mapConfigurationSetter)
			this.mapConfigurationSetter(configuration);
		if (mapActionConfigurationSetter)
			mapActionConfigurationSetter(configuration);
		return this.internalMap(configuration, source, destination);
	};

	private internalMap(configuration: MapActionConfiguration<S, D>, source: S, destination?: D) {
		if (!source)
			return;
		let destinationObject: D = destination !== undefined ? destination : new this.DestinationClass();
		let mappedProperties: string[] = [];
		for(let destOperation of this.destinationOperations){
			let operationConfiguration =
				new OperationConfiguration<S, D>(source, {
					depth: undefined,
					destination: destinationObject,
					mapper: this.mapper,
					parent: undefined,
					signature: undefined,
					source: source
				});
			destOperation.operation(operationConfiguration);
			const preconditionsPassing = operationConfiguration.arePreconditionsSatisfied() &&
				configuration.arePreconditionsSatisfied(source, destinationObject);
			const newValue = preconditionsPassing ?
				operationConfiguration.getValue() : undefined;
			
			if(newValue !== undefined)
				destinationObject[destOperation.selector] = newValue;
			mappedProperties.push(destOperation.selector);
		}
		for(let sourceOperation of this.sourceOperations){
			let operationConfiguration = new SourceOperationConfiguration();
			sourceOperation.operation(operationConfiguration);
			// source operations are ignore-only,
			// so the addition in the array of mapped properties
			// should be enough
			mappedProperties.push(sourceOperation.selector);
		}
		if (!configuration.mapperSettings.requireExplicitlySetProperties) {
			for(let key in source){
				if (source[key] !== undefined && mappedProperties.indexOf(key) == -1) {
					const destinationHasTheProperty = Object.keys(destinationObject).indexOf(key) > -1;
					const shouldMap = destinationHasTheProperty || !configuration.mapperSettings.ignoreSourcePropertiesIfNotInDestination;
					if (shouldMap) {
						(destinationObject as D & {
							[index: string]: any;
						})[key] = source[key];
					}
				}
			}
		}
		return destinationObject;
	}
};
