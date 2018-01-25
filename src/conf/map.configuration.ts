import { IGenericSettingsConfiguration } from "conf/generic-settings.configuration";
import { IMapperConfiguration, MapperConfiguration } from "conf/mapper.configuration";
import { IPreconditionConfiguration, TPrecondition } from "conf/precondition.configuration";

/**
 * Should contain map-only configuration.
 */
export interface IMapConfiguration<S, D> extends IMapperConfiguration, IPreconditionConfiguration<S, D> {
    
}

export type TMapConfigurationSetter<S, D> = (configuration: IMapConfiguration<S, D>) => IMapConfiguration<S, D>;

/**
 * Should contain map-only settings.
 */
export type TMapSettings<S, D> = {
    preconditions: Array<TPrecondition<S, D>>;
};

export class MapConfiguration<S, D> extends MapperConfiguration implements IMapConfiguration<S, D> {

    mapSettings: TMapSettings<S, D> = {
        preconditions: []
    };

    withPrecondition = (precondition: TPrecondition<S, D>) => {
        this.mapSettings.preconditions.push(precondition);
        return this;
    }

    arePreconditionsSatisfied = (source: S, destination: D) => {
		return this.mapSettings.preconditions
			.reduce((passing, pre) =>
				pre(source, destination) ? passing : false,
				true);
	}
}

export function buildMapConfiguration<S, D>(
    configurationSetter?: TMapConfigurationSetter<S, D>,
    configurationObject: IMapConfiguration<S, D> = new MapConfiguration()
): IMapConfiguration<S, D> {
    return configurationSetter ?
        configurationSetter(configurationObject) : configurationObject;
}