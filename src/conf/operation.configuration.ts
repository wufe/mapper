import { ElementSelector, StringElementSelector } from "selectors";
import { MapSignature, Mapper } from "mapper";
import { IPreconditionConfiguration, TPrecondition } from "conf/precondition.configuration";
import { MapActionConfiguration } from "conf/map-action.configuration";
import { TParent } from "conf/map.configuration";

export type TOperationConfigurationSetter<S, D> = (opt: IOperationConfiguration<S, D>) => IOperationConfiguration<S, D>;
export type TSourceOperationConfigurationSetter = (opt: ISourceOperationConfiguration) => ISourceOperationConfiguration;

export type TOperationConfiguration<S, D> = {
	selector: StringElementSelector<D>;
	operation?: TOperationConfigurationSetter<S, D>;
};

export type TSourceOperationConfiguration<S> = {
	selector: StringElementSelector<S>;
	operation?: TSourceOperationConfigurationSetter;
}

export type TOperationConfigurationSettings<S, D> = {
	preconditions: Array<TPrecondition<S, D>>;
	selected: any;
	projection: any;
	immutably: boolean;
};

export interface IOperationConfiguration<S, D> extends IPreconditionConfiguration<S, D> {
	mapFrom: (selector: ElementSelector<S>) => this;
	ignore: () => this;
	mapAs: (selector: ElementSelector<S>, signature: MapSignature) => this;
	withProjection: (projectionConfiguration: TProjectionConfiguration<S, D>) => this;
	immutably: (value?: boolean) => this;
	depth: number;
	source: S;
	destination: D;
	signature: MapSignature;
	getParent: <PS, PD>() => IOperationConfiguration<PS, PD>;
}

export interface ISourceOperationConfiguration {
	ignore: () => this;
}

export type TProjectionConfiguration<S, D> = (source: S, destination?: D) => any;

export class OperationConfiguration<S, D> implements IOperationConfiguration<S, D> {

	private mapper: Mapper;
	private parent: any;
	source: S;
	destination: D;
	signature: MapSignature;
	depth: number;

	constructor(
		private entity: S,
		{
			mapper,
			source,
			destination,
			signature,
			depth,
			parent
		}: {
			mapper: Mapper;
			source: S;
			destination: D;
			signature: MapSignature;
			depth: number;
			parent: TParent;
		}
	) {
		this.mapper = mapper;
		this.source = source;
		this.destination = destination;
		this.signature = signature;
		this.depth = depth;
		this.parent = parent;
	}

	operationConfigurationSettings: TOperationConfigurationSettings<S, D> = {
		preconditions: [],
		selected: undefined,
		projection: undefined,
		immutably: undefined
	};

	mapFrom = (selector: ElementSelector<S>) => {
		this.operationConfigurationSettings.selected = selector(this.entity);
		return this;
	}

	ignore = () => {
		return this;
	}

	mapAs = (selector: ElementSelector<S>, signature: MapSignature) => {
		this.operationConfigurationSettings.selected =
			this.mapper.map(signature, selector(this.entity), undefined, configuration => {
				(configuration as MapActionConfiguration<any, any>).setParent({
					signature: this.signature,
					depth: this.depth,
					source: this.source,
					destination: this.destination,
					parent: this.parent
				});
				return configuration;
			});
		return this;
	}

	withProjection = (projectionConfiguration: TProjectionConfiguration<S, D>) => {
		this.operationConfigurationSettings.projection = projectionConfiguration;
		return this;
	}

	getParent = <PS, PD>() => {
		return this.parent as IOperationConfiguration<PS, PD>;
	}

	withPrecondition = (precondition: TPrecondition<S, D>) => {
		this.operationConfigurationSettings.preconditions.push(precondition);
		return this;
	}

	immutably = (value: boolean = true) => {
		this.operationConfigurationSettings.immutably = value;
		return this;
	}

	//#region Class-only methods
	getValue = () => {
		return this.operationConfigurationSettings.projection ?
			this.operationConfigurationSettings.projection(this.source, this.destination) :
			this.operationConfigurationSettings.selected;
	}

	arePreconditionsSatisfied = () => {
		return this.operationConfigurationSettings.preconditions
			.reduce((passing, pre) =>
				pre(this.source, this.destination) ? passing : false,
				true);
	}
	//#endregion
	
}

export class SourceOperationConfiguration implements ISourceOperationConfiguration {
	shouldIgnore = false;

	ignore = () => {
		this.shouldIgnore = true;
		return this;
	}
}