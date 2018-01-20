/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = __webpack_require__(2);
class Mapper {
    constructor() {
        this._mappings = [];
        this.createMap = ({ source, destination }, destinationEntity) => {
            const map = new map_1.Map(destinationEntity);
            this._mappings.push({
                source,
                destination,
                map
            });
            return map;
        };
        this.map = ({ source, destination }, sourceEntity, destinationEntity) => {
            let mapping = this._mappings
                .filter(m => m.source === source && m.destination === destination)[0];
            if (mapping) {
                let map = mapping.map;
                return map.map(sourceEntity, destinationEntity);
            }
            return;
        };
    }
}
exports.Mapper = Mapper;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const operations_1 = __webpack_require__(3);
class Map {
    constructor(DestinationClass) {
        this.DestinationClass = DestinationClass;
        this._destOperations = [];
        this._sourceOperations = [];
        this.forMember = (selector, operation) => {
            this._destOperations.push({
                selector,
                operation
            });
            return this;
        };
        this.forSourceMember = (selector, operation) => {
            this._sourceOperations.push({
                selector,
                operation
            });
            return this;
        };
        this.map = (source, destination) => {
            if (!source)
                return;
            let destinationObject = destination !== undefined ? destination : new this.DestinationClass();
            let mappedProperties = [];
            for (let destOperation of this._destOperations) {
                let operationConfiguration = new operations_1.OperationConfiguration(source);
                let newValue = destOperation.operation(operationConfiguration);
                if (newValue !== undefined)
                    destinationObject[destOperation.selector] = newValue;
                mappedProperties.push(destOperation.selector);
            }
            for (let sourceOperation of this._sourceOperations) {
                let operationConfiguration = new operations_1.OperationConfiguration(destinationObject);
                let newValue = sourceOperation.operation(operationConfiguration);
                if (newValue !== undefined)
                    source[sourceOperation.selector] = newValue;
                mappedProperties.push(sourceOperation.selector);
            }
            for (let key in source) {
                if (source[key] !== undefined && mappedProperties.indexOf(key) == -1) {
                    destinationObject[key] = source[key];
                }
            }
            return destinationObject;
        };
    }
}
exports.Map = Map;
;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class OperationConfiguration {
    constructor(_entity) {
        this._entity = _entity;
        this.ignore = () => undefined;
        this.mapFrom = (selector) => {
            return selector(this._entity);
        };
    }
}
exports.OperationConfiguration = OperationConfiguration;


/***/ })
/******/ ]);