import { ElementSelector, ElementsType, StringElementSelector } from "selectors";
export interface IOperationConfiguration<T> {
    mapFrom: (selector: ElementSelector<T>) => ElementsType<T>;
    ignore: () => ElementsType<T>;
}
export interface ISourceOperationConfiguration<T> {
    ignore: () => ElementsType<T>;
}
export declare type ElementOperation<T> = (opt: IOperationConfiguration<T>) => ElementsType<T>;
export declare type SourceElementOperation<T> = (opt: ISourceOperationConfiguration<T>) => ElementsType<T>;
export declare type Operation<D, S> = {
    selector: StringElementSelector<D>;
    operation?: ElementOperation<S>;
};
export declare class OperationConfiguration<T> implements IOperationConfiguration<T>, ISourceOperationConfiguration<T> {
    private _entity;
    ignore: () => T[keyof T];
    constructor(_entity: T);
    mapFrom: (selector: ElementSelector<T>) => ElementsType<T>;
}
