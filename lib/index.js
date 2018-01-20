(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
var map_1 = __webpack_require__(2);
var Mapper = (function () {
    function Mapper() {
        var _this = this;
        this._mappings = [];
        this.createMap = function (_a, destinationEntity) {
            var source = _a.source, destination = _a.destination;
            var map = new map_1.Map(destinationEntity);
            _this._mappings.push({
                source: source,
                destination: destination,
                map: map
            });
            return map;
        };
        this.map = function (_a, sourceEntity, destinationEntity) {
            var source = _a.source, destination = _a.destination;
            var mapping = _this._mappings
                .filter(function (m) { return m.source === source && m.destination === destination; })[0];
            if (mapping) {
                var map = mapping.map;
                return map.map(sourceEntity, destinationEntity);
            }
            return;
        };
    }
    return Mapper;
}());
exports.Mapper = Mapper;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var operations_1 = __webpack_require__(3);
var Map = (function () {
    function Map(DestinationClass) {
        var _this = this;
        this.DestinationClass = DestinationClass;
        this._destOperations = [];
        this._sourceOperations = [];
        this.forMember = function (selector, operation) {
            _this._destOperations.push({
                selector: selector,
                operation: operation
            });
            return _this;
        };
        this.forSourceMember = function (selector, operation) {
            _this._sourceOperations.push({
                selector: selector,
                operation: operation
            });
            return _this;
        };
        this.map = function (source, destination) {
            if (!source)
                return;
            var destinationObject = destination !== undefined ? destination : new _this.DestinationClass();
            var mappedProperties = [];
            for (var _i = 0, _a = _this._destOperations; _i < _a.length; _i++) {
                var destOperation = _a[_i];
                var operationConfiguration = new operations_1.OperationConfiguration(source);
                var newValue = destOperation.operation(operationConfiguration);
                if (newValue !== undefined)
                    destinationObject[destOperation.selector] = newValue;
                mappedProperties.push(destOperation.selector);
            }
            for (var _b = 0, _c = _this._sourceOperations; _b < _c.length; _b++) {
                var sourceOperation = _c[_b];
                var operationConfiguration = new operations_1.OperationConfiguration(destinationObject);
                var newValue = sourceOperation.operation(operationConfiguration);
                if (newValue !== undefined)
                    source[sourceOperation.selector] = newValue;
                mappedProperties.push(sourceOperation.selector);
            }
            for (var key in source) {
                if (source[key] !== undefined && mappedProperties.indexOf(key) == -1) {
                    destinationObject[key] = source[key];
                }
            }
            return destinationObject;
        };
    }
    return Map;
}());
exports.Map = Map;
;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OperationConfiguration = (function () {
    function OperationConfiguration(_entity) {
        var _this = this;
        this._entity = _entity;
        this.ignore = function () { return undefined; };
        this.mapFrom = function (selector) {
            return selector(_this._entity);
        };
    }
    return OperationConfiguration;
}());
exports.OperationConfiguration = OperationConfiguration;


/***/ })
/******/ ]);
});