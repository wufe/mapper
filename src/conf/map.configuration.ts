import { IGenericSettingsConfiguration } from "conf/generic-settings.configuration";
import { IMapperConfiguration, MapperConfiguration } from "conf/mapper.configuration";
import { IPreconditionConfiguration, TPrecondition } from "conf/precondition.configuration";
import { MapSignature } from "mapper";

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
    parent?: TParent;
};

export type TParent = {
    signature: MapSignature;
    depth: number;
    source: any;
    destination: any;
    parent: TParent;
};

export class MapConfiguration<S, D> extends MapperConfiguration implements IMapConfiguration<S, D> {

    mapSettings: TMapSettings<S, D> = {
        preconditions: []
    };

    withPrecondition = (precondition: TPrecondition<S, D>) => {
        this.mapSettings.preconditions.push(precondition);
        return this;
    }

    //#region Class-only methods
    arePreconditionsSatisfied = (source: S, destination: D) => {
		return this.mapSettings.preconditions
			.reduce((passing, pre) =>
				pre(source, destination) ? passing : false,
				true);
    }
    
    setParent = (parent: TParent) => {
        this.mapSettings.parent = parent;
    }

    getParent = () => {
        return this.mapSettings.parent;
    }
    //#endregion
}

export function buildMapConfiguration<S, D>(
    configurationSetter?: TMapConfigurationSetter<S, D>,
    configurationObject: IMapConfiguration<S, D> = new MapConfiguration()
): IMapConfiguration<S, D> {
    return configurationSetter ?
        configurationSetter(configurationObject) : configurationObject;
}