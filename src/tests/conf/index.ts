/**
 * There are 4 types of configuration objects:
 * 
 * + IGenericSettingsConfiguration
 *      + shouldRequireExplicitlySetProperties
 *      + shouldIgnoreSourcePropertiesIfNotInDestination
 *      + shouldAutomaticallyMapArrays
 *      + shouldPreserveReference
 *      + maxDepth
 * 
 * + IPreconditionConfiguration
 *      + withPrecondition
 * 
 * + IMapperConfiguration extends IGenericSettingsConfiguration - new Mapper().withConfiguration()
 * + IMapConfiguration extends IGenericSettingsConfiguration    - new Mapper().createMap()
 * + IFieldConfiguration extends IPreconditionConfiguration     - new Mapper().createMap().forMember()
 * + IMapActionConfiguration extends IGenericSettingsConfiguration, IPreconditionConfiguration - new Mapper().map()
 * 
 * An additional type of configuration is the operation object
 * 
 * + IOperationConfiguration
 *      + mapFrom
 *      + ignore
 *      + mapAs
 *      + withProjection
 *      + getParent
 *      + depth
 *      + source
 *      + destination
 */