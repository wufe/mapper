import { ElementSelector, ElementsType, StringElementSelector } from "selectors";
import { FieldConfiguration, IFieldConfiguration, TProjectionConfiguration } from "configuration";
import { MapSignature, Mapper } from "mapper";
import { TPreconditionConfiguration, IPreconditionConfiguration, PreconditionConfiguration } from "precondition";

export interface IOperationConfiguration<S, D, T> extends IPreconditionConfiguration<S, D> {
	mapFrom: ( selector: ElementSelector<T>, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D> ) => this;
	ignore: () => this;
	mapAs: (selector: ElementSelector<T>, signature: MapSignature, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D>) => this;
	withProjection: (projectionConfiguration: TProjectionConfiguration<S, D>) => this;
	depth: number;
	source: S;
	destination: D;
	getParent: <PS, PD>() => IOperationConfiguration<PS, PD, T>;
}

export interface ISourceOperationConfiguration<T> {
	ignore: () => this;
}

export type ElementOperation<S, D, T> = ( opt: IOperationConfiguration<S, D, T> ) => IOperationConfiguration<S, D, T>;
export type SourceElementOperation<T> = ( opt: ISourceOperationConfiguration<T> ) => ISourceOperationConfiguration<T>;

export type Operation<S, D, T, K> = {
	selector: StringElementSelector<T>;
	operation?: ElementOperation<S, D, K>;
};

export class OperationConfiguration<S, D, T> extends PreconditionConfiguration<S, D> implements IOperationConfiguration<S, D, T>, ISourceOperationConfiguration<T>{
	constructor(
		private _entity: T,
		public source: S,
		public destination: D,
		private _fieldConfiguration: FieldConfiguration<S, D> = new FieldConfiguration(),
		private _mapper: Mapper,
		public depth: number = 0,
		private parent?: any
	) {
		super();
		const conf = _fieldConfiguration as any;
		this.depth = conf.depth;
		this.parent = conf.parent;
	}

	getParent = <PS, PD>() => {
		return this.parent as IOperationConfiguration<PS, PD, T>;
	}

	selectedElement: T[keyof T];
	projectionConfiguration: TProjectionConfiguration<S, D>;
	
	arePreconditionsPassing = (preconditions: TPreconditionConfiguration<S, D>[]) => {
		if (preconditions) {
			// check preconditions
			return preconditions
				.reduce(
					(passing, pre) => pre(this.source, this.destination) ? passing : false, true
				);
		}
		return true;
	}

	mapFrom: (selector: ElementSelector<T>, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D> ) => this =
		(selector, configuration) => {
			if (configuration) {
				this._fieldConfiguration = configuration(this._fieldConfiguration) as FieldConfiguration<S, D>;
			}
			this.selectedElement = selector(this._entity);
			return this;
		};

	ignore = () => {
		this.selectedElement = undefined;
		return this;
	}

	mapAs = (selector: ElementSelector<T>, signature: MapSignature, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D>) => {
		this.selectedElement = this._mapper.map<T[keyof T], T[keyof T]>(signature, selector(this._entity), undefined, (conf: any) => {
			conf.depth++;
			conf.parent = this;
			if (configuration)
				return configuration(conf);
			return conf;
		});
		return this;
	}

    withProjection = (shapeConfiguration: TProjectionConfiguration<S, D>) => {
        this.projectionConfiguration = shapeConfiguration;
        return this;
    }
}
