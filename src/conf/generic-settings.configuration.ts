export interface IGenericSettingsConfiguration { // mapper configuration
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
    shouldAutomaticallyMapArrays: (value: boolean) => this;
    shouldAutomaticallyApplyImmutability: (value: boolean) => this;
    //#region To do
    maxDepth: (value: number) => this;
    //#endregion
}