export interface IConfiguration {
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
}

export interface IMapConfiguration extends IConfiguration {
    
}

export interface ISingleMapConfiguration extends IMapConfiguration {

}

export class Configuration implements ISingleMapConfiguration {
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