import { ElementSelector, ElementsType, StringElementSelector } from "selectors";
import { FieldConfiguration, IFieldConfiguration } from "configuration";

export interface IOperationConfiguration<T> {
	mapFrom: ( selector: ElementSelector<T> ) => ElementsType<T>;
	ignore: () => ElementsType<T>;
}

export interface ISourceOperationConfiguration<T> {
	ignore: () => ElementsType<T>;
}

export type ElementOperation<T> = ( opt: IOperationConfiguration<T> ) => ElementsType<T>;
export type SourceElementOperation<T> = ( opt: ISourceOperationConfiguration<T> ) => ElementsType<T>;

export type Operation<SEntity, DEntity, D, S> = {
	selector: StringElementSelector<D>;
	operation?: ElementOperation<S>;
};

export class OperationConfiguration<S, D, T> implements IOperationConfiguration<T>, ISourceOperationConfiguration<T>{
	private _fieldConfiguration: IFieldConfiguration<S, D> = new FieldConfiguration();

	constructor(
		private _entity: T
	) {}

	mapFrom: (selector: ElementSelector<T>, fieldConfiguration?: IFieldConfiguration<S, D>) => ElementsType<T> =
		(selector, fieldConfiguration) => {
			if (fieldConfiguration)
				this._fieldConfiguration = fieldConfiguration;
			return selector(this._entity);
		};

	ignore = () => undefined as ElementsType<T>;
}
