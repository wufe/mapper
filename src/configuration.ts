import { IPreconditionConfiguration, PreconditionConfiguration } from "precondition";

export type TProjectionConfiguration<S, D> = (source: S, destination?: D) => Partial<D[keyof D]>;

export interface IFieldConfiguration<S, D> {
    
}

export class FieldConfiguration<S, D> extends PreconditionConfiguration<S, D> implements IFieldConfiguration<S, D>, IPreconditionConfiguration<S, D> {

    
}

export interface IConfiguration { // mapper configuration
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
    //#region To do
    shouldAutomaticallyMapArrays: (value: boolean) => this;
    shouldPreserveReference: (value: boolean) => this;
    maxDepth: (value: number) => this;
    //#endregion
}

export interface IMapConfiguration extends IConfiguration { // map configuration
    
}

export interface ISingleMapConfiguration<S, D> extends IMapConfiguration, IFieldConfiguration<S, D>, IPreconditionConfiguration<S, D> { // map action configuration
    
}

export type TConfigurationSetter<T extends IConfiguration> = (configuration: T) => T;

export class Configuration<S, D> extends FieldConfiguration<S, D> implements ISingleMapConfiguration<S, D> {
    explicitlySetProperties: boolean = false;
    ignoreSourcePropertiesIfNotInDestination: boolean = false;

    shouldRequireExplicitlySetProperties: (value: boolean) => this =
        (value = false) => {
            this.explicitlySetProperties = value;
            return this;
        };

    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this =
        (value = false) => {
            this.ignoreSourcePropertiesIfNotInDestination = value;
            return this;
        };

    //#region To do
    shouldAutomaticallyMapArrays = (value: boolean) => this;
    shouldPreserveReference = (value: boolean) => this;
    maxDepth = (value: number) => this;
    //#endregion
}

