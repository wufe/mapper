import { ElementSelector, ElementsType, StringElementSelector } from "selectors";

export interface IOperationConfiguration<T> {
	mapFrom: ( selector: ElementSelector<T> ) => ElementsType<T>;
	ignore: () => ElementsType<T>;
}

export interface ISourceOperationConfiguration<T> {
	ignore: () => ElementsType<T>;
}

export type ElementOperation<T> = ( opt: IOperationConfiguration<T> ) => ElementsType<T>;
export type SourceElementOperation<T> = ( opt: ISourceOperationConfiguration<T> ) => ElementsType<T>;

export type Operation<D, S> = {
	selector: StringElementSelector<D>;
	operation?: ElementOperation<S>;
};

export class OperationConfiguration<T> implements IOperationConfiguration<T>, ISourceOperationConfiguration<T>{
	ignore = () => undefined as ElementsType<T>;

	constructor(
		private _entity: T
	) {}

	mapFrom: (selector: ElementSelector<T>) => ElementsType<T> =
		(selector) => {
			return selector(this._entity);
		};
}
