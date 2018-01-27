import { IGenericSettingsConfiguration } from "conf/generic-settings.configuration";
import { IPreconditionConfiguration } from "conf/precondition.configuration";
import { IMapConfiguration, MapConfiguration } from "conf/map.configuration";

export interface IMapActionConfiguration<S, D> extends IMapConfiguration<S, D> {}

export type TMapActionConfigurationSetter<S, D> = (configuration: IMapActionConfiguration<S, D>) => IMapActionConfiguration<S, D>;

export class MapActionConfiguration<S, D> extends MapConfiguration<S, D> implements IMapActionConfiguration<S, D> {

}

export function buildMapActionConfiguration<S, D>(
    configurationSetter?: TMapActionConfigurationSetter<S, D>,
    configurationObject: IMapActionConfiguration<S, D> = new MapActionConfiguration()
): IMapActionConfiguration<S, D> {
    return configurationSetter ?
        configurationSetter(configurationObject) : configurationObject;
}