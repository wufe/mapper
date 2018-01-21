export type TPreconditionConfiguration<T> = (element: T) => boolean;
export type TProjectionConfiguration<S, D> = (source: S, destination?: D) => Partial<D[keyof D]>;

export interface IFieldConfiguration<S, D> {
    sourcePrecondition: (configuration: TPreconditionConfiguration<S>) => this;
    destinationPrecondition: (configuration: TPreconditionConfiguration<D>) => this;
    withProjection: (projectionConfiguration: TProjectionConfiguration<S, D>) => this;
}

export class FieldConfiguration<S, D> implements IFieldConfiguration<S, D> {

    sourcePreconditions: TPreconditionConfiguration<S>[] = [];
    destinationPreconditions: TPreconditionConfiguration<D>[] = [];
    projectionConfiguration: TProjectionConfiguration<S, D>;

    sourcePrecondition = (configuration: TPreconditionConfiguration<S>) => {
        this.sourcePreconditions.push(configuration);
        return this;
    }

    destinationPrecondition = (configuration: TPreconditionConfiguration<D>) => {
        this.destinationPreconditions.push(configuration);
        return this;
    }

    withProjection = (shapeConfiguration: TProjectionConfiguration<S, D>) => {
        this.projectionConfiguration = shapeConfiguration;
        return this;
    }
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

export interface ISingleMapConfiguration<S, D> extends IMapConfiguration, IFieldConfiguration<S, D> { // map action configuration

}

export type TConfigurationSetter<T extends IConfiguration> = (configuration: T) => T;

export class Configuration<S, D> extends FieldConfiguration<S, D> implements ISingleMapConfiguration<S, D> {
    public explicitlySetProperties: boolean = false;
    public ignoreSourcePropertiesIfNotInDestination: boolean = false;

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

