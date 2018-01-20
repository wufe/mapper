export interface IConfiguration {
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
}

export class Configuration implements IConfiguration {
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