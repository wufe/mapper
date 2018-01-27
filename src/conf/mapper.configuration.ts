import { IGenericSettingsConfiguration } from "conf/generic-settings.configuration";

export type TMapperConfigurationSetter = (configuration: IMapperConfiguration) => IMapperConfiguration;

export type TMapperSettings = {
    requireExplicitlySetProperties: boolean;
    ignoreSourcePropertiesIfNotInDestination: boolean;
    automaticallyMapArrays: boolean;
    maxDepth: number;
    automaticallyApplyImmutability: boolean;
};

export interface IMapperConfiguration extends IGenericSettingsConfiguration {}

export class MapperConfiguration implements IMapperConfiguration {

    mapperSettings: TMapperSettings = {
        automaticallyMapArrays: true,
        ignoreSourcePropertiesIfNotInDestination: false,
        maxDepth: 3,
        requireExplicitlySetProperties: false,
        automaticallyApplyImmutability: false
    };

    shouldRequireExplicitlySetProperties = (value: boolean) => {
        this.mapperSettings.requireExplicitlySetProperties = value
        return this;
    }

    shouldIgnoreSourcePropertiesIfNotInDestination = (value: boolean) => {
        this.mapperSettings.ignoreSourcePropertiesIfNotInDestination = value
        return this;
    }

    shouldAutomaticallyMapArrays = (value: boolean) => {
        this.mapperSettings.automaticallyMapArrays = value
        return this;
    }

    shouldAutomaticallyApplyImmutability = (value: boolean) => {
        this.mapperSettings.automaticallyApplyImmutability = value
        return this;
    }

    maxDepth = (value: number) => {
        this.mapperSettings.maxDepth = value
        return this;
    } 
}

export function buildMapperConfiguration(
    configurationSetter?: TMapperConfigurationSetter,
    configurationObject: IMapperConfiguration = new MapperConfiguration()
): IMapperConfiguration {
    return configurationSetter ?
        configurationSetter(configurationObject) : configurationObject;
}