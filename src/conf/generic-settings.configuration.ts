export interface IGenericSettingsConfiguration { // mapper configuration
    shouldRequireExplicitlySetProperties: (value: boolean) => this;
    shouldIgnoreSourcePropertiesIfNotInDestination: (value: boolean) => this;
    //#region To do
    shouldAutomaticallyMapArrays: (value: boolean) => this;
    shouldPreserveReferences: (value: boolean) => this;
    maxDepth: (value: number) => this;
    //#endregion
}