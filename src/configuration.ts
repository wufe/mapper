export type TPreconditionConfiguration<T> = (element: T) => boolean;

export interface IFieldConfiguration<S, D> {
    sourcePrecondition: (configuration: TPreconditionConfiguration<S>) => this;
    destinationPrecondition: (configuration: TPreconditionConfiguration<D>) => this;
}

export class FieldConfiguration<S, D> implements IFieldConfiguration<S, D> {

    sourcePreconditions: TPreconditionConfiguration<S>[] = [];
    destinationPreconditions: TPreconditionConfiguration<D>[] = [];

    sourcePrecondition(configuration: TPreconditionConfiguration<S>) {
        this.sourcePreconditions.push(configuration);
        return this;
    }

    destinationPrecondition(configuration: TPreconditionConfiguration<D>) {
        this.destinationPreconditions.push(configuration);
        return this;
    }
}

export interface IConfiguration {
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
}

export interface IMapConfiguration extends IConfiguration {
    
}

export interface ISingleMapConfiguration<S, D> extends IMapConfiguration, IFieldConfiguration<S, D> {

}

export type TConfigurationSetter<T extends IConfiguration> = (configuration: T) => T;

export class Configuration<S, D> implements ISingleMapConfiguration<S, D> {
    sourcePrecondition: (configuration: TPreconditionConfiguration<S>) => this;
    destinationPrecondition: (configuration: TPreconditionConfiguration<D>) => this;
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
}

