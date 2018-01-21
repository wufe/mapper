import { ElementSelector, ElementsType, StringElementSelector } from "selectors";
import { FieldConfiguration, IFieldConfiguration } from "configuration";
import { MapSignature, Mapper } from "mapper";

export interface IOperationConfiguration<S, D, T> {
	mapFrom: ( selector: ElementSelector<T>, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D> ) => ElementsType<T>;
	ignore: () => ElementsType<T>;
	mapAs: (selector: ElementSelector<T>, signature: MapSignature, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D>) => ElementsType<T>;
}

export interface ISourceOperationConfiguration<T> {
	ignore: () => ElementsType<T>;
}

export type ElementOperation<S, D, T> = ( opt: IOperationConfiguration<S, D, T> ) => ElementsType<T>;
export type SourceElementOperation<T> = ( opt: ISourceOperationConfiguration<T> ) => ElementsType<T>;

export type Operation<S, D, T, K> = {
	selector: StringElementSelector<T>;
	operation?: ElementOperation<S, D, K>;
};

export class OperationConfiguration<S, D, T> implements IOperationConfiguration<S, D, T>, ISourceOperationConfiguration<T>{
	constructor(
		private _entity: T,
		private _source: S,
		private _destination: D,
		private _fieldConfiguration: FieldConfiguration<S, D> = new FieldConfiguration(),
		private _mapper: Mapper
	) {}

	mapFrom: (selector: ElementSelector<T>, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D> ) => ElementsType<T> =
		(selector, configuration) => {
			if (configuration) {
				this._fieldConfiguration = configuration(this._fieldConfiguration) as FieldConfiguration<S, D>;
			}

			if (this._fieldConfiguration.sourcePreconditions || this._fieldConfiguration.destinationPrecondition) {
				// check preconditions
				const sourcePreconditionsPassing = this._fieldConfiguration.sourcePreconditions
					.reduce(
						(passing, pre) => pre(this._source) ? passing : false, true
					);
				const destinationPreconditionsPassing = this._fieldConfiguration.destinationPreconditions
					.reduce(
						(passing, pre) => pre(this._destination) ? passing : false, true
					);
				if (!sourcePreconditionsPassing || !destinationPreconditionsPassing)
					return;
			}

			return selector(this._entity);
		};

	ignore = () => undefined as ElementsType<T>;

	//#region To do
	mapAs = (selector: ElementSelector<T>, signature: MapSignature, configuration?: (fieldConfiguration: IFieldConfiguration<S, D>) => IFieldConfiguration<S, D>) => {
		if (configuration) {
			this._fieldConfiguration = configuration(this._fieldConfiguration) as FieldConfiguration<S, D>;
		}

		if (this._fieldConfiguration.sourcePreconditions || this._fieldConfiguration.destinationPrecondition) {
			// check preconditions
			const sourcePreconditionsPassing = this._fieldConfiguration.sourcePreconditions
				.reduce(
					(passing, pre) => pre(this._source) ? passing : false, true
				);
			const destinationPreconditionsPassing = this._fieldConfiguration.destinationPreconditions
				.reduce(
					(passing, pre) => pre(this._destination) ? passing : false, true
				);
			if (!sourcePreconditionsPassing || !destinationPreconditionsPassing)
				return;
		}

		return this._mapper.map<T[keyof T], T[keyof T]>(signature, selector(this._entity));
	}
	//#endregion
}
