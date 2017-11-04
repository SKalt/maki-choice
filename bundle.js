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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(12)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/*!
 * Vue.js v2.5.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.functionalOptions = undefined;
  this.functionalScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children);
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production' && inject) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if (inBrowser && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  // static trees can be rendered once and cached on the contructor options
  // so every instance shares the same cached trees
  var renderFns = this.$options.staticRenderFns;
  var cached = renderFns.cached || (renderFns.cached = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.functionalScopeId = options._scopeId;
        vnode.functionalContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.functionalContext = contextVm;
    vnode.functionalOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        if (slot._rendered) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && cached$$1 !== current) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }

      var ref = this;
      var cache = ref.cache;
      var keys = ref.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.2';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(
            config.ignoredElements.length &&
            config.ignoredElements.some(function (ignore) {
              return isRegExp(ignore)
                ? ignore.test(tag)
                : ignore === tag
            })
          ) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.functionalScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.functionalContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE9 || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */















// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

/* harmony default export */ __webpack_exports__["a"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(4), __webpack_require__(5), __webpack_require__(7).setImmediate))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__maki_choice_vue__ = __webpack_require__(9);


// import Inline from 'vue-inline';

// var req = require.context('./maki/icons', true, /\.svg$/);
// const icons = {};
// req.keys().forEach((key) => {
//   // console.log(key);
//   icons[key] = req(key);
//   if (!icons[key]) alert(key);
// });
// Vue.use(Inline, {
//   data:icons
// });

new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__maki_choice_vue__["a" /* default */]).$mount('#maki-choice');


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(8);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(4)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_maki_choice_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0223ae8b_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_maki_choice_vue__ = __webpack_require__(323);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(10)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0223ae8b"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_maki_choice_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0223ae8b_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_maki_choice_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "maki-choice.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0223ae8b", Component.options)
  } else {
    hotAPI.reload("data-v-0223ae8b", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6b002778", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0223ae8b\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./maki-choice.vue", function() {
     var newContent = require("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0223ae8b\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./maki-choice.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*div {\n  display: inline-block;\n}*/\ninput[data-v-0223ae8b]{\n  padding:4px;\n  width: 100%;\n}\n", "", {"version":3,"sources":["/home/steven/programming/maki-choice/maki-choice.vue?8954cf00"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAuEA;;GAEA;AACA;EACA,YAAA;EACA,YAAA;CACA","file":"maki-choice.vue","sourcesContent":["<template>\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-md-6 col-sm-12\">\n        <input\n          class=\"col-xs-12\"\n          type=\"text\"\n          placeholder=\"search icon names and themes\"\n          v-model=\"search\"\n          >\n        </input>\n        <!-- searched icons -->\n        <div class=\"col-xs-12\">\n          <icon-pair\n            v-for=\"icon in icons\"\n            v-bind=\"icon\"\n            :search=\"search\"\n            :key=\"icon.name\"\n            v-on:clicked=\"showIcon\"\n            v-on:hovered=\"showIcon\"\n          ></icon-pair>\n        </div>\n      </div>\n      <display-icon-pair v-bind=\"shown\"></display-icon-pair>\n    </div>\n  </div>\n</template>\n<script>\nimport presentIcons from './svg.js';\nimport maki from 'maki';\nimport iconPair from './icon-pair.vue';\nimport displayIconPair from './display-icon-pair.vue';\nconsole.log(presentIcons);\nconst icons = [];\nconst named = new Set()\nfor (let theme in maki.layouts.streets){\n  for (let name of maki.layouts.streets[theme]){\n    icons.push({name, theme});\n    named.add(name);\n  }\n}\nlet theme = 'unclassified'\nfor (let name of presentIcons.filter(icon => !named.has(icon))){\n  icons.push({name, theme});\n}\nexport default {\n  mounted(){\n    // HACK: to remove all non-displaying svg\n    Array.from(document.querySelectorAll('metadata'))\n      .map(el => el.parentElement)\n      .forEach(svg => svg.appendChild(svg.querySelector('path')))\n  },\n  data(){\n    return {\n      search:'',\n      icons,\n      shown:{\n        name:'',\n        theme:''\n      }\n    };\n  },\n  methods:{\n    showIcon(toShow){\n      this.shown = toShow;\n    }\n  },\n  components:{iconPair, displayIconPair}\n}\n</script>\n<style scoped>\n/*div {\n  display: inline-block;\n}*/\ninput{\n  padding:4px;\n  width: 100%;\n}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__svg_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_maki__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_maki___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_maki__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_pair_vue__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__display_icon_pair_vue__ = __webpack_require__(318);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





console.log(__WEBPACK_IMPORTED_MODULE_0__svg_js__["a" /* default */]);
const icons = [];
const named = new Set()
for (let theme in __WEBPACK_IMPORTED_MODULE_1_maki___default.a.layouts.streets){
  for (let name of __WEBPACK_IMPORTED_MODULE_1_maki___default.a.layouts.streets[theme]){
    icons.push({name, theme});
    named.add(name);
  }
}
let theme = 'unclassified'
for (let name of __WEBPACK_IMPORTED_MODULE_0__svg_js__["a" /* default */].filter(icon => !named.has(icon))){
  icons.push({name, theme});
}
/* harmony default export */ __webpack_exports__["a"] = ({
  mounted(){
    // HACK: to remove all non-displaying svg
    Array.from(document.querySelectorAll('metadata'))
      .map(el => el.parentElement)
      .forEach(svg => svg.appendChild(svg.querySelector('path')))
  },
  data(){
    return {
      search:'',
      icons,
      shown:{
        name:'',
        theme:''
      }
    };
  },
  methods:{
    showIcon(toShow){
      this.shown = toShow;
    }
  },
  components:{iconPair: __WEBPACK_IMPORTED_MODULE_2__icon_pair_vue__["a" /* default */], displayIconPair: __WEBPACK_IMPORTED_MODULE_3__display_icon_pair_vue__["a" /* default */]}
});


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_inline__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_inline___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_inline__);



var req = __webpack_require__(17);
const icons = {};
const all = new Set();
req.keys().forEach((key) => {
  // console.log(key);
  icons[key] = req(key);
  all.add(key
    .replace('.svg', '')
    .replace('-15', '')
    .replace('-11', '')
    .replace('./', '')
  );
});
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_1_vue_inline___default.a, {
  data:icons
});

/* harmony default export */ __webpack_exports__["a"] = (Array.from(all));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assign = _interopDefault(__webpack_require__(16));

var makeComponent = function (data) {
  if ( data === void 0 ) data = {};

  return ({
  name: 'inline',
  functional: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  render: function (h, ctx) {
    var value = data[ctx.props.name];
    if (typeof value === 'string') {
      return h('span', assign({domProps: {innerHTML: value}}, ctx.data))
    }
    return h('span', ctx.data, value)
  }
});
};

var index = function (Vue, ref) {
  var data = ref.data;

  return Vue.component('inline', makeComponent(data));
};

exports['default'] = index;
exports.makeComponent = makeComponent;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./aerialway-11.svg": 18,
	"./aerialway-15.svg": 19,
	"./airfield-11.svg": 20,
	"./airfield-15.svg": 21,
	"./airport-11.svg": 22,
	"./airport-15.svg": 23,
	"./alcohol-shop-11.svg": 24,
	"./alcohol-shop-15.svg": 25,
	"./america-football-11.svg": 26,
	"./america-football-15.svg": 27,
	"./amusement-park-11.svg": 28,
	"./amusement-park-15.svg": 29,
	"./aquarium-11.svg": 30,
	"./aquarium-15.svg": 31,
	"./art-gallery-11.svg": 32,
	"./art-gallery-15.svg": 33,
	"./attraction-11.svg": 34,
	"./attraction-15.svg": 35,
	"./bakery-11.svg": 36,
	"./bakery-15.svg": 37,
	"./bank-11.svg": 38,
	"./bank-15.svg": 39,
	"./bar-11.svg": 40,
	"./bar-15.svg": 41,
	"./barrier-11.svg": 42,
	"./barrier-15.svg": 43,
	"./baseball-11.svg": 44,
	"./baseball-15.svg": 45,
	"./basketball-11.svg": 46,
	"./basketball-15.svg": 47,
	"./bbq-11.svg": 48,
	"./bbq-15.svg": 49,
	"./beer-11.svg": 50,
	"./beer-15.svg": 51,
	"./bicycle-11.svg": 52,
	"./bicycle-15.svg": 53,
	"./bicycle-share-11.svg": 54,
	"./bicycle-share-15.svg": 55,
	"./blood-bank-11.svg": 56,
	"./blood-bank-15.svg": 57,
	"./buddhism-11.svg": 58,
	"./buddhism-15.svg": 59,
	"./building-11.svg": 60,
	"./building-15.svg": 61,
	"./building-alt1-11.svg": 62,
	"./building-alt1-15.svg": 63,
	"./bus-11.svg": 64,
	"./bus-15.svg": 65,
	"./cafe-11.svg": 66,
	"./cafe-15.svg": 67,
	"./campsite-11.svg": 68,
	"./campsite-15.svg": 69,
	"./car-11.svg": 70,
	"./car-15.svg": 71,
	"./castle-11.svg": 72,
	"./castle-15.svg": 73,
	"./cemetery-11.svg": 74,
	"./cemetery-15.svg": 75,
	"./cinema-11.svg": 76,
	"./cinema-15.svg": 77,
	"./circle-11.svg": 78,
	"./circle-15.svg": 79,
	"./circle-stroked-11.svg": 80,
	"./circle-stroked-15.svg": 81,
	"./city-11.svg": 82,
	"./city-15.svg": 83,
	"./clothing-store-11.svg": 84,
	"./clothing-store-15.svg": 85,
	"./college-11.svg": 86,
	"./college-15.svg": 87,
	"./commercial-11.svg": 88,
	"./commercial-15.svg": 89,
	"./cricket-11.svg": 90,
	"./cricket-15.svg": 91,
	"./cross-11.svg": 92,
	"./cross-15.svg": 93,
	"./dam-11.svg": 94,
	"./dam-15.svg": 95,
	"./danger-11.svg": 96,
	"./danger-15.svg": 97,
	"./defibrillator-11.svg": 98,
	"./defibrillator-15.svg": 99,
	"./dentist-11.svg": 100,
	"./dentist-15.svg": 101,
	"./doctor-11.svg": 102,
	"./doctor-15.svg": 103,
	"./dog-park-11.svg": 104,
	"./dog-park-15.svg": 105,
	"./drinking-water-11.svg": 106,
	"./drinking-water-15.svg": 107,
	"./embassy-11.svg": 108,
	"./embassy-15.svg": 109,
	"./emergency-phone-11.svg": 110,
	"./emergency-phone-15.svg": 111,
	"./entrance-11.svg": 112,
	"./entrance-15.svg": 113,
	"./entrance-alt1-11.svg": 114,
	"./entrance-alt1-15.svg": 115,
	"./farm-11.svg": 116,
	"./farm-15.svg": 117,
	"./fast-food-11.svg": 118,
	"./fast-food-15.svg": 119,
	"./fence-11.svg": 120,
	"./fence-15.svg": 121,
	"./ferry-11.svg": 122,
	"./ferry-15.svg": 123,
	"./fire-station-11.svg": 124,
	"./fire-station-15.svg": 125,
	"./florist-11.svg": 126,
	"./florist-15.svg": 127,
	"./fuel-11.svg": 128,
	"./fuel-15.svg": 129,
	"./gaming-11.svg": 130,
	"./gaming-15.svg": 131,
	"./garden-11.svg": 132,
	"./garden-15.svg": 133,
	"./garden-center-11.svg": 134,
	"./garden-center-15.svg": 135,
	"./gift-11.svg": 136,
	"./gift-15.svg": 137,
	"./golf-11.svg": 138,
	"./golf-15.svg": 139,
	"./grocery-11.svg": 140,
	"./grocery-15.svg": 141,
	"./hairdresser-11.svg": 142,
	"./hairdresser-15.svg": 143,
	"./harbor-11.svg": 144,
	"./harbor-15.svg": 145,
	"./heart-11.svg": 146,
	"./heart-15.svg": 147,
	"./heliport-11.svg": 148,
	"./heliport-15.svg": 149,
	"./home-11.svg": 150,
	"./home-15.svg": 151,
	"./horse-riding-11.svg": 152,
	"./horse-riding-15.svg": 153,
	"./hospital-11.svg": 154,
	"./hospital-15.svg": 155,
	"./ice-cream-11.svg": 156,
	"./ice-cream-15.svg": 157,
	"./industry-11.svg": 158,
	"./industry-15.svg": 159,
	"./information-11.svg": 160,
	"./information-15.svg": 161,
	"./karaoke-11.svg": 162,
	"./karaoke-15.svg": 163,
	"./landmark-11.svg": 164,
	"./landmark-15.svg": 165,
	"./landuse-11.svg": 166,
	"./landuse-15.svg": 167,
	"./laundry-11.svg": 168,
	"./laundry-15.svg": 169,
	"./library-11.svg": 170,
	"./library-15.svg": 171,
	"./lighthouse-11.svg": 172,
	"./lighthouse-15.svg": 173,
	"./lodging-11.svg": 174,
	"./lodging-15.svg": 175,
	"./logging-11.svg": 176,
	"./logging-15.svg": 177,
	"./marker-11.svg": 178,
	"./marker-15.svg": 179,
	"./marker-stroked-11.svg": 180,
	"./marker-stroked-15.svg": 181,
	"./mobile-phone-11.svg": 182,
	"./mobile-phone-15.svg": 183,
	"./monument-11.svg": 184,
	"./monument-15.svg": 185,
	"./mountain-11.svg": 186,
	"./mountain-15.svg": 187,
	"./museum-11.svg": 188,
	"./museum-15.svg": 189,
	"./music-11.svg": 190,
	"./music-15.svg": 191,
	"./natural-11.svg": 192,
	"./natural-15.svg": 193,
	"./park-11.svg": 194,
	"./park-15.svg": 195,
	"./park-alt1-11.svg": 196,
	"./park-alt1-15.svg": 197,
	"./parking-11.svg": 198,
	"./parking-15.svg": 199,
	"./parking-garage-11.svg": 200,
	"./parking-garage-15.svg": 201,
	"./pharmacy-11.svg": 202,
	"./pharmacy-15.svg": 203,
	"./picnic-site-11.svg": 204,
	"./picnic-site-15.svg": 205,
	"./pitch-11.svg": 206,
	"./pitch-15.svg": 207,
	"./place-of-worship-11.svg": 208,
	"./place-of-worship-15.svg": 209,
	"./playground-11.svg": 210,
	"./playground-15.svg": 211,
	"./police-11.svg": 212,
	"./police-15.svg": 213,
	"./post-11.svg": 214,
	"./post-15.svg": 215,
	"./prison-11.svg": 216,
	"./prison-15.svg": 217,
	"./rail-11.svg": 218,
	"./rail-15.svg": 219,
	"./rail-light-11.svg": 220,
	"./rail-light-15.svg": 221,
	"./rail-metro-11.svg": 222,
	"./rail-metro-15.svg": 223,
	"./ranger-station-11.svg": 224,
	"./ranger-station-15.svg": 225,
	"./recycling-11.svg": 226,
	"./recycling-15.svg": 227,
	"./religious-christian-11.svg": 228,
	"./religious-christian-15.svg": 229,
	"./religious-jewish-11.svg": 230,
	"./religious-jewish-15.svg": 231,
	"./religious-muslim-11.svg": 232,
	"./religious-muslim-15.svg": 233,
	"./residential-community-11.svg": 234,
	"./residential-community-15.svg": 235,
	"./restaurant-11.svg": 236,
	"./restaurant-15.svg": 237,
	"./roadblock-11.svg": 238,
	"./roadblock-15.svg": 239,
	"./rocket-11.svg": 240,
	"./rocket-15.svg": 241,
	"./school-11.svg": 242,
	"./school-15.svg": 243,
	"./scooter-11.svg": 244,
	"./scooter-15.svg": 245,
	"./shelter-11.svg": 246,
	"./shelter-15.svg": 247,
	"./shop-11.svg": 248,
	"./shop-15.svg": 249,
	"./skiing-11.svg": 250,
	"./skiing-15.svg": 251,
	"./slaughterhouse-11.svg": 252,
	"./slaughterhouse-15.svg": 253,
	"./snowmobile-11.svg": 254,
	"./snowmobile-15.svg": 255,
	"./soccer-11.svg": 256,
	"./soccer-15.svg": 257,
	"./square-11.svg": 258,
	"./square-15.svg": 259,
	"./square-stroked-11.svg": 260,
	"./square-stroked-15.svg": 261,
	"./stadium-11.svg": 262,
	"./stadium-15.svg": 263,
	"./star-11.svg": 264,
	"./star-15.svg": 265,
	"./star-stroked-11.svg": 266,
	"./star-stroked-15.svg": 267,
	"./suitcase-11.svg": 268,
	"./suitcase-15.svg": 269,
	"./sushi-11.svg": 270,
	"./sushi-15.svg": 271,
	"./swimming-11.svg": 272,
	"./swimming-15.svg": 273,
	"./teahouse-11.svg": 274,
	"./teahouse-15.svg": 275,
	"./telephone-11.svg": 276,
	"./telephone-15.svg": 277,
	"./tennis-11.svg": 278,
	"./tennis-15.svg": 279,
	"./theatre-11.svg": 280,
	"./theatre-15.svg": 281,
	"./toilet-11.svg": 282,
	"./toilet-15.svg": 283,
	"./town-11.svg": 284,
	"./town-15.svg": 285,
	"./town-hall-11.svg": 286,
	"./town-hall-15.svg": 287,
	"./triangle-11.svg": 288,
	"./triangle-15.svg": 289,
	"./triangle-stroked-11.svg": 290,
	"./triangle-stroked-15.svg": 291,
	"./veterinary-11.svg": 292,
	"./veterinary-15.svg": 293,
	"./village-11.svg": 294,
	"./village-15.svg": 295,
	"./volcano-11.svg": 296,
	"./volcano-15.svg": 297,
	"./warehouse-11.svg": 298,
	"./warehouse-15.svg": 299,
	"./waste-basket-11.svg": 300,
	"./waste-basket-15.svg": 301,
	"./water-11.svg": 302,
	"./water-15.svg": 303,
	"./wetland-11.svg": 304,
	"./wetland-15.svg": 305,
	"./wheelchair-11.svg": 306,
	"./wheelchair-15.svg": 307,
	"./zoo-11.svg": 308,
	"./zoo-15.svg": 309
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 17;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Aerialway\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,4.5H6V3.1c0.1992-0.1183,0.3512-0.3021,0.43-0.52L9.5,2C9.7761,2,10,1.7761,10,1.5S9.7761,1,9.5,1 L6.25,1.61C5.8847,1.1957,5.2528,1.156,4.8386,1.5213C4.713,1.6321,4.6172,1.7726,4.56,1.93L1.5,2.5C1.2239,2.5,1,2.7239,1,3 s0.2239,0.5,0.5,0.5l3.25-0.61C4.8213,2.9732,4.9057,3.0442,5,3.1v1.4H2c-0.5523,0-1,0.4477-1,1V9c0,0.5523,0.4477,1,1,1h7 c0.5523,0,1-0.4477,1-1V5.5C10,4.9477,9.5523,4.5,9,4.5z M5,8.5H2.5v-3H5V8.5z M8.5,8.5H6v-3h2.5V8.5z\"></path></svg>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13,5H8V2.6c0.1854-0.1047,0.3325-0.2659,0.42-0.46L13.5,1.5C13.7761,1.5,14,1.2761,14,1s-0.2239-0.5-0.5-0.5L8.28,1.15 C8.0954,0.9037,7.8077,0.7562,7.5,0.75C7.0963,0.752,6.7334,0.9966,6.58,1.37L1.5,2C1.2239,2,1,2.2239,1,2.5S1.2239,3,1.5,3 l5.22-0.65C6.7967,2.4503,6.8917,2.5351,7,2.6V5H2C1.4477,5,1,5.4477,1,6v7c0,0.5523,0.4477,1,1,1h11c0.5523,0,1-0.4477,1-1V6 C14,5.4477,13.5523,5,13,5z M7,11H3V7h4V11z M12,11H8V7h4V11z\"></path></svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"airfield-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccsccccccccccccccsc\" d=\"M5,0.5H3.5C3,0.5,3,0,3.5,0h4 C8,0,8,0.5,7.5,0.5H6C6,0.5,6.5,1,6.5,2v1H11v1.5l-4.5,2L6,10l1.5,0.5V11h-4v-0.5L5,10L4.5,6.5L0,4.5V3h4.5V2C4.5,1,5,0.5,5,0.5z\"></path></svg>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"airfield-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccsccccccccccccccsc\" d=\"M6.8182,0.6818H4.7727 C4.0909,0.6818,4.0909,0,4.7727,0h5.4545c0.6818,0,0.6818,0.6818,0,0.6818H8.1818c0,0,0.8182,0.5909,0.8182,1.9545V4h6v2L9,8l-0.5,5 l2.5,1.3182V15H4v-0.6818L6.5,13L6,8L0,6V4h6V2.6364C6,1.2727,6.8182,0.6818,6.8182,0.6818z\"></path></svg>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"airport-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M6.5,6.4V6L11,6.5V5L6.5,3.2V1.5c0-1-0.5-1.5-1-1.5s-1,0.5-1,1.5v1.7L0,5v1.4L4.5,6v0.4v1.1v1.8L3,10v1l2.5-0.5L8,11v-1 L6.5,9.2V7.5V6.4z\"></path></svg>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"airport-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path7712-0\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccccccsccc\" d=\"M15,6.8182L15,8.5l-6.5-1 l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182 L15,6.8182z\"></path></svg>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M7,4v2.5c0.0018,0.6341,0.4021,1.1986,1,1.41V10H7.5C7.2239,10,7,10.2239,7,10.5S7.2239,11,7.5,11h2 c0.2761,0,0.5-0.2239,0.5-0.5S9.7761,10,9.5,10H9V7.91c0.5979-0.2114,0.9982-0.7759,1-1.41V4H7z M9.5,6.5c0,0.5523-0.4477,1-1,1 s-1-0.4477-1-1v-2h2V6.5z M4.21,2.85V2.5c0.1961,0,0.355-0.1589,0.355-0.355S4.4061,1.79,4.21,1.79V1.44 c0.0001-0.1933-0.1566-0.3501-0.3499-0.3501c-0.0034,0-0.0068,0-0.0101,0.0001H3.14C2.9468,1.0845,2.7857,1.2366,2.7801,1.4299 C2.78,1.4332,2.78,1.4366,2.78,1.44v0.35c-0.1961,0-0.355,0.1589-0.355,0.355S2.5839,2.5,2.78,2.5v0.35C2.79,3.87,1,5,1,6v4.25 c-0.0056,0.3866,0.3033,0.7044,0.6899,0.71c0.0067,0.0001,0.0134,0.0001,0.0201,0h3.58c0.3628-0.0329,0.6561-0.3097,0.71-0.67V6 C6,5.09,4.21,3.81,4.21,2.85z M3.5,9C2.6716,9,2,8.3284,2,7.5S2.6716,6,3.5,6S5,6.6716,5,7.5S4.3284,9,3.5,9z\"></path></svg>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,4h-4v3.44l0,0c0,0,0,0,0,0.06c0.003,0.9096,0.6193,1.7026,1.5,1.93V13H11c-0.2761,0-0.5,0.2239-0.5,0.5 S10.7239,14,11,14h2c0.2761,0,0.5-0.2239,0.5-0.5S13.2761,13,13,13h-0.5V9.43c0.8807-0.2274,1.497-1.0204,1.5-1.93c0,0,0,0,0-0.06 l0,0V4z M13,7.5c0,0.5523-0.4477,1-1,1s-1-0.4477-1-1V5h2V7.5z M5.5,2.5V2C5.7761,2,6,1.7761,6,1.5S5.7761,1,5.5,1V0.5 C5.5,0.2239,5.2761,0,5,0H4C3.7239,0,3.5,0.2239,3.5,0.5V1C3.2239,1,3,1.2239,3,1.5S3.2239,2,3.5,2v0.5C3.5,3.93,1,5.57,1,7v6 c0,0.5523,0.4477,1,1,1h5c0.5318-0.0465,0.9535-0.4682,1-1V7C8,5.65,5.5,3.85,5.5,2.5z M4.5,12C3.1193,12,2,10.8807,2,9.5 S3.1193,7,4.5,7S7,8.1193,7,9.5S5.8807,12,4.5,12z\"></path></svg>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.53,2C2.47,2,1,5.5,1,5.5S2.47,9,5.53,9S10,5.5,10,5.5S8.6,2,5.53,2z M7,6H4C3.7239,6,3.5,5.7761,3.5,5.5S3.7239,5,4,5h3 c0.2761,0,0.5,0.2239,0.5,0.5S7.2761,6,7,6z\"></path></svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M7.53,3C3.09,3,1,7.5,1,7.5S3.09,12,7.53,12S14,7.5,14,7.5S12,3,7.53,3z M11,7v1.5C11,8.7761,10.7761,9,10.5,9 S10,8.7761,10,8.5V8H8v0.5C8,8.7761,7.7761,9,7.5,9S7,8.7761,7,8.5V8H5v0.5C5,8.7761,4.7761,9,4.5,9S4,8.7761,4,8.5v-2 C4,6.2239,4.2239,6,4.5,6S5,6.2239,5,6.5V7h2V6.5C7,6.2239,7.2239,6,7.5,6S8,6.2239,8,6.5V7h2V6.5C10,6.2239,10.2239,6,10.5,6 S11,6.2239,11,6.5V7z\"></path></svg>"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"amusement-park-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5082\" d=\"M5.5,1C3.0206,1,1,3.0206,1,5.5c0,1.7919,1.0627,3.3316,2.584,4.0547L2.5,11h6L7.416,9.5547 C8.9373,8.8316,10,7.2919,10,5.5C10,3.0206,7.9794,1,5.5,1z M5.375,2.0117v1.9941c-0.3108,0.026-0.6057,0.1482-0.8438,0.3496 L3.1191,2.9434C3.7146,2.3888,4.5013,2.0428,5.375,2.0117z M5.625,2.0117c0.8737,0.0311,1.6604,0.3771,2.2559,0.9316L6.4688,4.3555 c-0.0007-0.0007-0.0013-0.0013-0.002-0.002C6.229,4.1532,5.9348,4.0317,5.625,4.0059V2.0117z M2.9434,3.1191l1.4121,1.4121 c-0.0007,0.0007-0.0013,0.0013-0.002,0.002C4.1532,4.771,4.0317,5.0652,4.0059,5.375H2.0117 C2.0428,4.5013,2.3888,3.7146,2.9434,3.1191z M8.0566,3.1191C8.6112,3.7146,8.9572,4.5013,8.9883,5.375H6.9941 c-0.026-0.3108-0.1482-0.6057-0.3496-0.8438L8.0566,3.1191z M2.0117,5.625h1.9941c0.026,0.3108,0.1482,0.6057,0.3496,0.8438 L2.9434,7.8809C2.3888,7.2854,2.0428,6.4987,2.0117,5.625z M6.9941,5.625h1.9941C8.9572,6.4987,8.6112,7.2854,8.0566,7.8809 L6.6445,6.4688c0.0007-0.0007,0.0013-0.0013,0.002-0.002C6.8468,6.229,6.9683,5.9348,6.9941,5.625z M4.5312,6.6445 c0.0007,0.0007,0.0013,0.0013,0.002,0.002C4.6716,6.7624,4.8297,6.8524,5,6.9121v2.0391C4.2765,8.8476,3.6278,8.5303,3.1191,8.0566 L4.5312,6.6445z M6.4688,6.6445l1.4121,1.4121C7.3722,8.5303,6.7235,8.8476,6,8.9512V6.9121C6.1711,6.852,6.33,6.7613,6.4688,6.6445 z\"></path></svg>"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"amusement-park-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5082\" d=\"M7.5,0C3.919,0,1,2.919,1,6.5c0,2.3161,1.2251,4.3484,3.0566,5.5H4l-1,2h9l-1-2h-0.0566 C12.7749,10.8484,14,8.8161,14,6.5C14,2.919,11.081,0,7.5,0z M7.375,1.5059v3.5c-0.3108,0.026-0.6057,0.1482-0.8438,0.3496 L4.0566,2.8809C4.9243,2.0555,6.0851,1.5376,7.375,1.5059z M7.625,1.5059c1.2899,0.0317,2.4507,0.5496,3.3184,1.375L8.4688,5.3555 c-0.0007-0.0007-0.0013-0.0013-0.002-0.002C8.229,5.1532,7.9348,5.0317,7.625,5.0059V1.5059z M3.8809,3.0566l2.4746,2.4746 c-0.0007,0.0007-0.0013,0.0013-0.002,0.002C6.1532,5.771,6.0317,6.0652,6.0059,6.375h-3.5 C2.5376,5.0851,3.0555,3.9243,3.8809,3.0566z M11.1191,3.0566c0.8254,0.8676,1.3433,2.0285,1.375,3.3184h-3.5 c-0.026-0.3108-0.1482-0.6057-0.3496-0.8438L11.1191,3.0566z M2.5059,6.625h3.5c0.026,0.3108,0.1482,0.6057,0.3496,0.8438 L3.8809,9.9434C3.0555,9.0757,2.5376,7.9149,2.5059,6.625z M8.9941,6.625h3.5c-0.0317,1.2899-0.5496,2.4507-1.375,3.3184 L8.6445,7.4688c0.0007-0.0007,0.0013-0.0013,0.002-0.002C8.8468,7.229,8.9683,6.9348,8.9941,6.625z M6.5312,7.6445 c0.0007,0.0007,0.0013,0.0013,0.002,0.002C6.6716,7.7624,6.8297,7.8524,7,7.9121v3.5625c-1.1403-0.1124-2.1606-0.6108-2.9434-1.3555 L6.5312,7.6445z M8.4688,7.6445l2.4746,2.4746c-0.7828,0.7447-1.803,1.243-2.9434,1.3555V7.9121 C8.1711,7.852,8.33,7.7613,8.4688,7.6445z\"></path></svg>"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg2\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"aquarium-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path3338\" inkscape:connector-curvature=\"0\" d=\"M8,1C7.1243,1,6.1491,1.092,4.9961,1.5273 C3.8431,1.9622,2.8479,2.6569,2,3.5C1.1477,4.3474,0,6,0,6.5s1.1354,1.9426,2.6777,2.6211 c1.5424,0.6784,2.3909,0.7983,3.2832,0.8945c0.7968,0.086,1.9424-0.027,2.8848-0.2324C9.5925,9.6205,10.9937,9.3099,11,9 c0,0-2.7561-0.063-3-0.5c-0.2486-0.4448-0.2494-1.5858,0-2c0.258-0.4283,2.5,1,2.5,1c0.6439,0.2576,0.6439-4.2576,0-4 c0,0-2.2768,1.4474-2.5,1C7.7506,4,7.7506,3,8,2.5C8.2232,2.0526,11,2,11,2C11,1.5,8.8757,1,8,1z M3.5137,4.502 c0.5598,0.0001,1.0136,0.4539,1.0137,1.0137C4.5272,6.0754,4.0735,6.5292,3.5137,6.5293C2.9539,6.5292,2.5001,6.0754,2.5,5.5156 C2.5001,4.9558,2.9539,4.5021,3.5137,4.502z\"></path></svg>"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg2\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"aquarium-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path style=\"fill:#010101;\" d=\"M10.9,11.6c-0.3-0.6-0.3-2.3,0-2.8c0.4-0.6,3.4,1.4,3.4,1.4c0.9,0.4,0.9-6.1,0-5.7 c0,0-3.1,2.1-3.4,1.4c-0.3-0.7-0.3-2.1,0-2.8C11.2,2.5,15,2.4,15,2.4C15,1.7,12.1,1,10.9,1S8.4,1.1,6.8,1.8C5.2,2.4,3.9,3.4,2.7,4.6 S0,8.2,0,8.9s1.5,2.8,3.7,3.7s3.3,1.1,4.5,1.3c1.1,0.1,2.6,0,3.9-0.3c1-0.2,2.9-0.7,2.9-1.1C15,12.3,11.2,12.2,10.9,11.6z M4.5,9.3 C3.7,9.3,3,8.6,3,7.8s0.7-1.5,1.5-1.5S6,7,6,7.8S5.3,9.3,4.5,9.3z\"></path></svg>"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M8.21,3L5.85,0.65C5.6555,0.4539,5.339,0.4526,5.1429,0.6471C5.1419,0.6481,5.141,0.649,5.14,0.65L2.79,3H1.5 C1.2239,3,1,3.2239,1,3.5v6C1,9.7761,1.2239,10,1.5,10h8C9.7761,10,10,9.7761,10,9.5v-6C10,3.2239,9.7761,3,9.5,3H8.21z M5.5,1.71 L6.79,3H4.21L5.5,1.71z M9,9H2V4h7V9z M4.5,5.5C4.5,5.7761,4.2761,6,4,6S3.5,5.7761,3.5,5.5S3.7239,5,4,5S4.5,5.2239,4.5,5.5z M8,8 H4l0.75-1.5l0.5,1L6.5,5L8,8z\"></path></svg>"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M10.71,4L7.85,1.15C7.6555,0.9539,7.339,0.9526,7.1429,1.1471C7.1419,1.1481,7.141,1.149,7.14,1.15L4.29,4H1.5 C1.2239,4,1,4.2239,1,4.5v9C1,13.7761,1.2239,14,1.5,14h12c0.2761,0,0.5-0.2239,0.5-0.5v-9C14,4.2239,13.7761,4,13.5,4H10.71z M7.5,2.21L9.29,4H5.71L7.5,2.21z M13,13H2V5h11V13z M5,8C4.4477,8,4,7.5523,4,7s0.4477-1,1-1s1,0.4477,1,1S5.5523,8,5,8z M12,12 H4.5L6,9l1.25,2.5L9.5,7L12,12z\"></path></svg>"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"attraction-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect7143\" style=\"fill:#010101;\" d=\"M4.5,1.5c0,0-0.5,0-0.7,0.5L3.5,2.5H1c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h9 c0.6,0,1-0.4,1-1v-5c0-0.6-0.4-1-1-1H7.5L7.2,2C7,1.5,6.5,1.5,6.5,1.5H4.5z M5.5,3.5C6.9,3.5,8,4.6,8,6S6.9,8.5,5.5,8.5S3,7.4,3,6 S4.1,3.5,5.5,3.5z M5.5,5c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S6.1,5,5.5,5z\"></path></svg>"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"attraction-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect7143\" d=\"M6,2C5.446,2,5.2478,2.5045,5,3L4.5,4h-2C1.669,4,1,4.669,1,5.5v5C1,11.331,1.669,12,2.5,12h10 c0.831,0,1.5-0.669,1.5-1.5v-5C14,4.669,13.331,4,12.5,4h-2L10,3C9.75,2.5,9.554,2,9,2H6z M2.5,5C2.7761,5,3,5.2239,3,5.5 S2.7761,6,2.5,6S2,5.7761,2,5.5S2.2239,5,2.5,5z M7.5,5c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3s-3-1.3431-3-3S5.8431,5,7.5,5z M7.5,6.5C6.6716,6.5,6,7.1716,6,8l0,0c0,0.8284,0.6716,1.5,1.5,1.5l0,0C8.3284,9.5,9,8.8284,9,8l0,0C9,7.1716,8.3284,6.5,7.5,6.5 L7.5,6.5z\"></path></svg>"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bakery-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5836\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"zcczcczzcccczccccczccccc\" d=\"M4.5,2c-1,0-1,1-1,1L5,7.5 C5,7.5,5,8,5.5,8S6,7.5,6,7.5L7.5,3c0,0,0-1-1-1H4.5z M9,3.5l-2,4h1.5l1,1H10c1,0,1-0.9,1-0.9V6.3L9,3.5z M0,6.3v1.2 c0,0,0.0296,1.0097,1,1c0.9704-0.0097,0.5,0,0.5,0l1-1H4l-2-4L0,6.3z\"></path></svg>"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bakery-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5230\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccssccccsccsccscsccscc\" d=\"M5.2941,4.3824L6,9.5 c0,0,0,1,1,1h1c1,0,1-1,1-1l0.7059-5.1176C9.7059,3,7.5,3,7.5,3S5.291,3,5.2941,4.3824z M3.5,5C2,5,2,6,2,6l1,4h1.5 c0.755,0,0.7941-0.7647,0.7941-0.7647L4.5,5H3.5z M1.5,7.5c0,0-0.6176-0.0294-1.0588,0.4118C0,8.3529,0,8.7941,0,8.7941V11h0.8824 C2,11,2,10,2,10L1.5,7.5z\"></path><path id=\"path5230-2\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sccsccscsccscc\" d=\"M11.5,5C13,5,13,6,13,6l-1,4h-1.5 c-0.755,0-0.7941-0.7647-0.7941-0.7647L10.5,5H11.5z M13.5,7.5c0,0,0.6176-0.0294,1.0588,0.4118C15,8.3529,15,8.7941,15,8.7941V11 h-0.8824C13,11,13,10,13,10L13.5,7.5z\"></path></svg>"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bank-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5622\" d=\"M1,2C0,2,0,3,0,3v5c0,1,1,1,1,1h9c1,0,1-1,1-1V3c0,0,0-1-1-1H1z M1,3h1.5C2.7761,3,3,3.2239,3,3.5 S2.7761,4,2.5,4S2,3.7761,2,3.5L1.5,4C1.7761,4,2,4.2239,2,4.5S1.7761,5,1.5,5S1,4.7761,1,4.5V3z M5.5,3c1.1046,0,2,1.1193,2,2.5 S6.6046,8,5.5,8s-2-1.1193-2-2.5S4.3954,3,5.5,3z M8.5,3H10v1.5C10,4.7761,9.7761,5,9.5,5S9,4.7761,9,4.5S9.2239,4,9.5,4L9,3.5 C9,3.7761,8.7761,4,8.5,4S8,3.7761,8,3.5S8.2239,3,8.5,3z M1.5,6C1.7761,6,2,6.2239,2,6.5S1.7761,7,1.5,7L2,7.5 C2,7.2239,2.2239,7,2.5,7S3,7.2239,3,7.5S2.7761,8,2.5,8H1V6.5C1,6.2239,1.2239,6,1.5,6z M9.5,6C9.7761,6,10,6.2239,10,6.5V8H8.5 C8.2239,8,8,7.7761,8,7.5S8.2239,7,8.5,7S9,7.2239,9,7.5L9.5,7C9.2239,7,9,6.7761,9,6.5S9.2239,6,9.5,6z\"></path><path id=\"path5835\" d=\"M4.9023,4.25C4.8261,4.321,4.7584,4.4051,4.7012,4.5h1.5977c-0.0572-0.0949-0.125-0.179-0.2012-0.25H4.9023z M4.5859,4.75C4.5575,4.8303,4.5359,4.9141,4.5215,5h1.959C6.4661,4.9141,6.4445,4.8303,6.416,4.75H4.5859z M4.5,5.25 C4.4998,5.3339,4.5063,5.4177,4.5195,5.5h1.959C6.4924,5.4178,6.4996,5.334,6.5,5.25H4.5z M4.5859,5.75 C4.6171,5.8387,4.6564,5.9226,4.7031,6h1.5957c0.046-0.0775,0.0847-0.1614,0.1152-0.25H4.5859z M4.9023,6.25 c0.0109,0.0107,0.022,0.0211,0.0332,0.0312L4.5,6.5h2L6.0645,6.2812C6.0757,6.2711,6.0868,6.2607,6.0977,6.25H4.9023z M4.582,6.75 C4.611,6.8289,4.638,6.9091,4.6914,7h1.627c0.0524-0.091,0.0778-0.1711,0.1055-0.25H4.582z M4.8926,7.25 C5.0395,7.3915,5.2332,7.5,5.5,7.5c0.2739,0,0.4701-0.1085,0.6172-0.25H4.8926z\"></path></svg>"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bank-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect5668\" d=\"M1,3C0.446,3,0,3.446,0,4v7c0,0.554,0.446,1,1,1h13c0.554,0,1-0.446,1-1V4c0-0.554-0.446-1-1-1H1z M1,4h1.5 C2.7761,4,3,4.2239,3,4.5S2.7761,5,2.5,5S2,4.7761,2,4.5L1.5,5C1.7761,5,2,5.2239,2,5.5S1.7761,6,1.5,6S1,5.7761,1,5.5V4z M7.5,4 C8.8807,4,10,5.567,10,7.5l0,0C10,9.433,8.8807,11,7.5,11S5,9.433,5,7.5S6.1193,4,7.5,4z M12.5,4H14v1.5C14,5.7761,13.7761,6,13.5,6 S13,5.7761,13,5.5S13.2239,5,13.5,5L13,4.5C13,4.7761,12.7761,5,12.5,5S12,4.7761,12,4.5S12.2239,4,12.5,4z M7.5,5.5 c-0.323,0-0.5336,0.1088-0.6816,0.25h1.3633C8.0336,5.6088,7.823,5.5,7.5,5.5z M6.625,6C6.5795,6.091,6.5633,6.1711,6.5449,6.25 h1.9102C8.4367,6.1711,8.4205,6.091,8.375,6H6.625z M6.5,6.5v0.25h2V6.5H6.5z M6.5,7v0.25h2V7H6.5z M6.5,7.5v0.25h2V7.5H6.5z M6.5,8 L6.25,8.25h2L8.5,8H6.5z M6,8.5c0,0,0.0353,0.1024,0.1016,0.25H8.375L8,8.5H6z M1.5,9C1.7761,9,2,9.2239,2,9.5S1.7761,10,1.5,10 L2,10.5C2,10.2239,2.2239,10,2.5,10S3,10.2239,3,10.5S2.7761,11,2.5,11H1V9.5C1,9.2239,1.2239,9,1.5,9z M6.2383,9 C6.2842,9.0856,6.3144,9.159,6.375,9.25h2.2676C8.7092,9.1121,8.75,9,8.75,9H6.2383z M13.5,9C13.7761,9,14,9.2239,14,9.5V11h-1.5 c-0.2761,0-0.5-0.2239-0.5-0.5s0.2239-0.5,0.5-0.5s0.5,0.2239,0.5,0.5l0.5-0.5C13.2239,10,13,9.7761,13,9.5S13.2239,9,13.5,9z M6.5664,9.5c0.0786,0.0912,0.1647,0.1763,0.2598,0.25h1.4199C8.3462,9.6727,8.4338,9.5883,8.5,9.5H6.5664z\"></path></svg>"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bar-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path15601-4-2_2_\" inkscape:connector-curvature=\"0\" d=\"M5.4883,1C4.9759,1,0.5,1,1,1.5L5,6v2.5C5,9,2.5,9,2.5,10h6 C8.5,9,6,9,6,8.5V6l4-4.5C10.5,1,6.0006,1,5.4883,1z M2.5,2h6l-1,1h-4L2.5,2z\"></path></svg>"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bar-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sccsccsccszccccz\" d=\"M7.5,1c-2,0-7,0.25-6.5,0.75L7,8v4 c0,1-3,0.5-3,2h7c0-1.5-3-1-3-2V8l6-6.25C14.5,1.25,9.5,1,7.5,1z M7.5,2c2.5,0,4.75,0.25,4.75,0.25L11.5,3h-8L2.75,2.25 C2.75,2.25,5,2,7.5,2z\"></path></svg>"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>barrier-11</title><path d=\"M9.5,2h-8a.5.5,0,0,0-.5.5v4a.5.5,0,0,0,.5.5H2V9.5a.5.5,0,0,0,1,0V9H8v.5a.5.5,0,0,0,1,0V7h.5a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,9.5,2ZM2,3H3.5l3,3h-2L2,3.5ZM2,6V4.5L3.5,6ZM3,8V7H8V8ZM9,6H7.5l-3-3h2L9,5.5ZM9,4.5,7.5,3H9Z\"></path></svg>"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>barrier-15</title><path d=\"M13,3H2A1,1,0,0,0,1,4v6a1,1,0,0,0,1,1H3v2.5a.5.5,0,0,0,1,0V13h7v.5a.5.5,0,0,0,1,0V11h1a1,1,0,0,0,1-1V4A1,1,0,0,0,13,3Zm0,1V6L11,4ZM9.5,4,13,7.5V10L7,4Zm-4,6L2,6.5V4l6,6ZM2,10V8l2,2Zm9,2H4V11h7Zm-.207-2H9.5l-6-6h2l6,6Z\"></path></svg>"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M7,3c0,0.5523-0.4477,1-1,1S5,3.5523,5,3s0.4477-1,1-1S7,2.4477,7,3z M9.85,10.24L9.85,10.24l-3-4.85 C6.7391,5.2011,6.5603,5.0616,6.35,5H2.5C2.2239,5,2,5.2239,2,5.5S2.2239,6,2.5,6H5l0.92,1.09l-2.73,3l0,0 C3.0637,10.1876,2.9928,10.3405,3,10.5C3,10.7761,3.2239,11,3.5,11c0.1224-0.0006,0.2401-0.047,0.33-0.13l0,0l3-2.71L9,10.81l0,0 c0.0912,0.1178,0.231,0.1877,0.38,0.19c0.2761,0,0.5-0.2239,0.5-0.5C9.8938,10.4122,9.8834,10.3223,9.85,10.24z M4,0.28 C4,0.1254,3.8746,0,3.72,0C3.6221,0.0262,3.5348,0.0821,3.47,0.16L2,4.59C1.9941,4.6331,1.9941,4.6769,2,4.72 C2,4.8746,2.1254,5,2.28,5c0.1015-0.0243,0.1926-0.0803,0.26-0.16L4,0.41C4.006,0.3669,4.006,0.3231,4,0.28z\"></path></svg>"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M10,3.5C10,4.3284,9.3284,5,8.5,5S7,4.3284,7,3.5S7.6716,2,8.5,2S10,2.6716,10,3.5z M7,0.28C7,0.1254,6.8746,0,6.72,0 c0,0,0,0,0,0C6.6221,0.0262,6.5348,0.0821,6.47,0.16L4,4.59C3.9941,4.6331,3.9941,4.6769,4,4.72C4,4.8746,4.1254,5,4.28,5 c0.1015-0.0243,0.1926-0.0803,0.26-0.16L7,0.41C7.006,0.3669,7.006,0.3231,7,0.28z M12.9,14.2L12.9,14.2L10,6.39l0,0 C9.9526,6.1627,9.7522,5.9999,9.52,6h-5c-0.2761,0-0.5,0.2239-0.5,0.5S4.2439,7,4.52,7H7l1.45,2.51l-4.27,4.61l0,0 C4.0659,14.2132,3.9998,14.3527,4,14.5C4,14.7761,4.2239,15,4.5,15c0.1224-0.0006,0.2401-0.047,0.33-0.13l0,0l4.45-4.15l2.76,4l0,0 c0.0895,0.1592,0.2574,0.2584,0.44,0.26c0.2796,0.0002,0.5092-0.2207,0.52-0.5C12.9958,14.3787,12.961,14.281,12.9,14.2z\"></path></svg>"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M11,1c0,0.5523-0.4477,1-1,1S9,1.5523,9,1s0.4477-1,1-1S11,0.4477,11,1z M4.5,3C5.3284,3,6,2.3284,6,1.5S5.3284,0,4.5,0 S3,0.6716,3,1.5S3.6716,3,4.5,3z M8.39,9.69L6,6.59V4.5h0.5c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0l1.5-2l0,0 C8.4661,2.1909,8.4974,2.0969,8.5,2C8.4962,1.7239,8.2692,1.5032,7.9931,1.507C7.8597,1.5088,7.7326,1.5639,7.64,1.66l0,0L6.25,3.5 H2.5C2.3632,3.5018,2.233,3.5596,2.14,3.66l0,0l-2,2.54l0,0C0.0599,6.2807,0.0104,6.3868,0,6.5C0,6.7761,0.2239,7,0.5,7 c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0L2.74,4.5H3v2.09l-2.39,3.1l0,0C0.5387,9.7776,0.4999,9.8871,0.5,10 c0,0.2761,0.2239,0.5,0.5,0.5c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0L3.94,7h1.12l2.52,3.27l0,0 C7.6705,10.4145,7.8295,10.5016,8,10.5c0.2761,0,0.5-0.2239,0.5-0.5C8.4979,9.8905,8.4592,9.7849,8.39,9.7l0,0V9.69z\"></path></svg>"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M9,3.5C9,4.3284,8.3284,5,7.5,5S6,4.3284,6,3.5S6.6716,2,7.5,2S9,2.6716,9,3.5z M14,1c-0.5523,0-1,0.4477-1,1s0.4477,1,1,1 s1-0.4477,1-1S14.5523,1,14,1z M11.89,13.19L9,9.58V6.5h0.5c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0l1.94-2.42l0,0l0.06-0.08l0,0 C11.9661,3.6909,11.9974,3.5969,12,3.5c-0.0038-0.2761-0.2308-0.4968-0.5069-0.493C11.3597,3.0088,11.2326,3.0639,11.14,3.16l0,0 L9.26,5.5H5.5C5.3632,5.5018,5.233,5.5596,5.14,5.66l0,0l-2,2.54l0,0C3.0599,8.2807,3.0104,8.3868,3,8.5C3,8.7761,3.2239,9,3.5,9 c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0L5.74,6.5H6v3.08l-2.89,3.61l0,0c-0.0692,0.0849-0.1079,0.1905-0.11,0.3 c0,0.2761,0.2239,0.5,0.5,0.5c0.1669-0.0018,0.3214-0.0885,0.41-0.23l0,0l3-3.77h1.15l3,3.77l0,0 c0.0886,0.1415,0.2431,0.2282,0.41,0.23c0.2761,0,0.5-0.2239,0.5-0.5c-0.0021-0.1095-0.0408-0.2151-0.11-0.3l0,0H11.89z\"></path></svg>"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>bbq-11</title><path d=\"M4,1.75c0,0,0-1,1-1c0,0,0.5,0,0.5-0.5C5.5,0.1119,5.6119,0,5.75,0S6,0.1119,6,0.25c0,0,0,1-1,1c0,0-0.5,0-0.5,0.5 C4.5,1.8881,4.3881,2,4.25,2S4,1.8881,4,1.75z M2.25,2C2.3881,2,2.5,1.8881,2.5,1.75c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1 C4,0.1119,3.8881,0,3.75,0S3.5,0.1119,3.5,0.25c0,0.5-0.5,0.5-0.5,0.5c-1,0-1,1-1,1C2,1.8881,2.1119,2,2.25,2z M6.25,2 C6.3881,2,6.5,1.8881,6.5,1.75c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C8,0.1119,7.8881,0,7.75,0S7.5,0.1119,7.5,0.25 c0,0.5-0.5,0.5-0.5,0.5c-1,0-1,1-1,1C6,1.8881,6.1119,2,6.25,2z M9.75,0C9.6119,0,9.5,0.1119,9.5,0.25c0,0.5-0.5,0.5-0.5,0.5 c-1,0-1,1-1,1C8,1.8881,8.1119,2,8.25,2S8.5,1.8881,8.5,1.75c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C10,0.1119,9.8881,0,9.75,0z M6.6746,5.865C6.6745,5.8654,6.6741,5.8657,6.674,5.866l2.3,4.782v0.009c0.055,0.1215,0.0014,0.2646-0.12,0.32 c-0.1237,0.0574-0.2705,0.0037-0.328-0.12L7.845,9.5H4c0,0.2029-0.0411,0.4036-0.1209,0.5901 C3.5532,10.8518,2.6717,11.205,1.91,10.8792c-0.7617-0.3259-1.115-1.2074-0.7891-1.9691C1.4468,8.1484,2.3283,7.7952,3.09,8.121 c0.0531,0.0208,0.1048,0.0449,0.155,0.072L4.278,5.85C2.9692,5.5125,2.0408,4.351,2,3h7C9,3,8.9985,5.2823,6.6746,5.865z M3.25,9.5 c0-0.4142-0.3358-0.75-0.75-0.75S1.75,9.0858,1.75,9.5s0.3358,0.75,0.75,0.75S3.25,9.9142,3.25,9.5z M6.1731,5.9562 C5.9635,5.9829,5.7419,6,5.5,6C5.2147,6,4.787,5.953,4.787,5.953l-1.144,2.58C3.7659,8.6688,3.8607,8.8275,3.922,9h3.673 L6.1731,5.9562z\"></path></svg>"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>grill-15</title><path d=\"M9.32,7.655C10.8782,7.108,11.9471,5.6506,12,4H3c0.053,1.6299,1.0978,3.0728,2.63,3.631L4.923,9.044 c-1.3571-0.2355-2.6482,0.6737-2.8837,2.0308s0.6737,2.6482,2.0308,2.8837C4.9927,14.1187,5.9273,13.7485,6.49,13h4.223l0.335,0.717 c0.0836,0.1735,0.2594,0.2836,0.452,0.283c0.0733,0.0003,0.1457-0.0158,0.212-0.047c0.2497-0.117,0.3575-0.4141,0.241-0.664 L9.32,7.655z M4.5,12.75c-0.6904,0-1.25-0.5596-1.25-1.25s0.5596-1.25,1.25-1.25s1.25,0.5596,1.25,1.25 C5.7484,12.1897,5.1897,12.7484,4.5,12.75z M6.95,12c0.2066-1.007-0.2268-2.0374-1.091-2.594L6.6,7.923 c0.577,0.1042,1.168,0.1042,1.745,0l1.9,4.07L6.95,12z M4.75,1C4.6119,1,4.5,1.1119,4.5,1.25c0,0.5-0.5,0.5-0.5,0.5c-1,0-1,1-1,1 C3,2.8881,3.1119,3,3.25,3S3.5,2.8881,3.5,2.75c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C5,1.1119,4.8881,1,4.75,1z M6.75,1 C6.6119,1,6.5,1.1119,6.5,1.25c0,0.5-0.5,0.5-0.5,0.5c-1,0-1,1-1,1C5,2.8881,5.1119,3,5.25,3S5.5,2.8881,5.5,2.75 c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C7,1.1119,6.8881,1,6.75,1z M8.75,1C8.6119,1,8.5,1.1119,8.5,1.25c0,0.5-0.5,0.5-0.5,0.5 c-1,0-1,1-1,1C7,2.8881,7.1119,3,7.25,3S7.5,2.8881,7.5,2.75c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C9,1.1119,8.8881,1,8.75,1z M10.75,1 c-0.1381,0-0.25,0.1119-0.25,0.25c0,0.5-0.5,0.5-0.5,0.5c-1,0-1,1-1,1C9,2.8881,9.1119,3,9.25,3S9.5,2.8881,9.5,2.75 c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C11,1.1119,10.8881,1,10.75,1z M12.75,1c-0.1381,0-0.25,0.1119-0.25,0.25c0,0.5-0.5,0.5-0.5,0.5 c-1,0-1,1-1,1C11,2.8881,11.1119,3,11.25,3s0.25-0.1119,0.25-0.25c0-0.5,0.5-0.5,0.5-0.5c1,0,1-1,1-1C13,1.1119,12.8881,1,12.75,1z\"></path></svg>"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,1c-2.3,0-3,0.66-3,0.66v2c0.0328,0.9197,0.2577,1.8223,0.66,2.65c0.376,0.9646,0.376,2.0354,0,3c0,0,0,0.66,2.32,0.66 S7.8,9.31,7.8,9.31c-0.376-0.9646-0.376-2.0354,0-3c0.4023-0.8277,0.6272-1.7303,0.66-2.65v-2C8.46,1.66,7.8,1,5.5,1z M5.5,9.28 C4.9736,9.3066,4.4465,9.2458,3.94,9.1c0.1326-0.4787,0.1999-0.9732,0.2-1.47h2.72c-0.0144,0.2198-0.0144,0.4402,0,0.66 C6.8939,8.5635,6.9474,8.8342,7.02,9.1C6.5269,9.2448,6.0136,9.309,5.5,9.29V9.28z M7.82,3.28c-1.5116,0.4425-3.1184,0.4425-4.63,0 L3.18,2c1.5151-0.4422,3.1249-0.4422,4.64,0c0,0,0.03,1.33,0,1.33L7.82,3.28z\"></path></svg>"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12,5V2c0,0-1-1-4.5-1S3,2,3,2v3c0.0288,1.3915,0.3706,2.7586,1,4c0.6255,1.4348,0.6255,3.0652,0,4.5c0,0,0,1,3.5,1 s3.5-1,3.5-1c-0.6255-1.4348-0.6255-3.0652,0-4.5C11.6294,7.7586,11.9712,6.3915,12,5z M7.5,13.5 c-0.7966,0.035-1.5937-0.0596-2.36-0.28c0.203-0.7224,0.304-1.4696,0.3-2.22h4.12c-0.004,0.7504,0.097,1.4976,0.3,2.22 C9.0937,13.4404,8.2966,13.535,7.5,13.5z M7.5,5C6.3136,5.0299,5.1306,4.8609,4,4.5v-2C5.131,2.1411,6.3137,1.9722,7.5,2 C8.6863,1.9722,9.869,2.1411,11,2.5v2C9.8694,4.8609,8.6864,5.0299,7.5,5z\"></path></svg>"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bicycle-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4804\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccsssscccssscccccssssscccsssc\" style=\"fill:#010101;\" d=\" M6.5,1.5c-0.6761-0.01-0.6761,1.0096,0,1H7V3.211L4.252,4.7813L3.7383,3.5h0.7148c0.6761,0.01,0.6761-1.0096,0-1H2.4258 c-0.6761-0.01-0.6761,1.0096,0,1h0.2344l0.4316,1.0781C2.9011,4.5311,2.7047,4.5001,2.5,4.5001c-1.3748,0-2.5,1.1252-2.5,2.5 s1.1252,2.5,2.5,2.5S5,8.3748,5,7.0001c0-0.4713-0.1399-0.9078-0.3691-1.2852l2.4707-1.4121L7.5039,4.711 C6.6216,5.0981,6,5.9792,6,7.0001c0,1.3748,1.1252,2.5,2.5,2.5s2.5-1.1252,2.5-2.5c0-1.2959-1.0034-2.3575-2.2695-2.4766L8,3.793V2 c0-0.2761-0.2239-0.5-0.5-0.5H6.5z M2.5,5.5C3.3344,5.5,4,6.1657,4,7S3.3344,8.5,2.5,8.5S1,7.8344,1,7S1.6656,5.5,2.5,5.5z M8.4551,5.504h0.002c0.0299,0.003,0.06,0.003,0.0898,0C9.3587,5.5289,10,6.1818,10,7.0001c0,0.8344-0.6656,1.5-1.5,1.5 S7,7.8345,7,7.0001C7,6.1811,7.6424,5.5279,8.4551,5.504L8.4551,5.504z\"></path></svg>"

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bicycle-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><sodipodi:namedview bordercolor=\"#666666\" borderopacity=\"1\" gridtolerance=\"10\" guidetolerance=\"10\" id=\"namedview3364\" inkscape:current-layer=\"svg4619\" inkscape:cx=\"4.6281545\" inkscape:cy=\"10.703675\" inkscape:document-units=\"px\" inkscape:object-nodes=\"true\" inkscape:object-paths=\"true\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:snap-bbox=\"true\" inkscape:snap-intersection-paths=\"true\" inkscape:snap-smooth-nodes=\"true\" inkscape:window-height=\"755\" inkscape:window-maximized=\"0\" inkscape:window-width=\"1280\" inkscape:window-x=\"0\" inkscape:window-y=\"23\" inkscape:zoom=\"128\" objecttolerance=\"10\" pagecolor=\"#ffffff\" showgrid=\"true\"><inkscape:grid color=\"#ff0000\" empspacing=\"2\" id=\"grid3368\" opacity=\"0.1254902\" spacingx=\"0.5\" spacingy=\"0.5\" type=\"xygrid\"></inkscape:grid></sodipodi:namedview><path id=\"path4668\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccsssscccsssscccccsccccsssscssscccccc\" d=\" M7.5,2c-0.6761-0.01-0.6761,1.0096,0,1H9v1.2656l-2.8027,2.334L5.2226,4H5.5c0.6761,0.01,0.6761-1.0096,0-1h-2 c-0.6761-0.01-0.6761,1.0096,0,1h0.6523L5.043,6.375C4.5752,6.1424,4.0559,6,3.5,6C1.5729,6,0,7.5729,0,9.5S1.5729,13,3.5,13 S7,11.4271,7,9.5c0-0.6699-0.2003-1.2911-0.5293-1.8242L9.291,5.3262l0.4629,1.1602C8.7114,7.0937,8,8.2112,8,9.5 c0,1.9271,1.5729,3.5,3.5,3.5S15,11.4271,15,9.5S13.4271,6,11.5,6c-0.2831,0-0.5544,0.0434-0.8184,0.1074L10,4.4023V2.5 c0-0.2761-0.2239-0.5-0.5-0.5H7.5z M3.5,7c0.5923,0,1.1276,0.2119,1.5547,0.5527l-1.875,1.5625 c-0.5109,0.4273,0.1278,1.1945,0.6406,0.7695l1.875-1.5625C5.8835,8.674,6,9.0711,6,9.5C6,10.8866,4.8866,12,3.5,12S1,10.8866,1,9.5 S2.1133,7,3.5,7L3.5,7z M11.5,7C12.8866,7,14,8.1134,14,9.5S12.8866,12,11.5,12S9,10.8866,9,9.5c0-0.877,0.4468-1.6421,1.125-2.0879 l0.9102,2.2734c0.246,0.6231,1.1804,0.2501,0.9297-0.3711l-0.9082-2.2695C11.2009,7.0193,11.3481,7,11.5,7L11.5,7z\"></path></svg>"

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bike-share-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><sodipodi:namedview bordercolor=\"#666666\" borderopacity=\"1\" gridtolerance=\"10\" guidetolerance=\"10\" id=\"namedview3424\" inkscape:bbox-nodes=\"true\" inkscape:bbox-paths=\"true\" inkscape:current-layer=\"svg4764\" inkscape:cx=\"1.2197585\" inkscape:cy=\"4.8663967\" inkscape:document-units=\"px\" inkscape:object-nodes=\"true\" inkscape:object-paths=\"true\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:snap-bbox=\"true\" inkscape:snap-bbox-edge-midpoints=\"true\" inkscape:snap-intersection-paths=\"true\" inkscape:snap-smooth-nodes=\"true\" inkscape:window-height=\"784\" inkscape:window-maximized=\"0\" inkscape:window-width=\"1495\" inkscape:window-x=\"16\" inkscape:window-y=\"0\" inkscape:zoom=\"45.254834\" objecttolerance=\"10\" pagecolor=\"#ffffff\" showgrid=\"true\"><inkscape:grid color=\"#ff0000\" empspacing=\"2\" id=\"grid3436\" opacity=\"0.1254902\" spacingx=\"0.5\" spacingy=\"0.5\" type=\"xygrid\"></inkscape:grid></sodipodi:namedview><path id=\"path4632\" inkscape:connector-curvature=\"0\" d=\"M8,0.0004c-0.5523,0-1,0.4477-1,1s0.4477,1,1,1s1-0.4477,1-1 S8.5523,0.0004,8,0.0004z M6.0137,2.0004C5.8763,1.9967,5.7436,2.0497,5.6465,2.1468l-2,2c-0.1952,0.1953-0.1952,0.5118,0,0.707 L5,6.2074v2.293C4.9961,8.7765,5.2168,9.0035,5.4929,9.0074C5.7691,9.0114,5.9961,8.7907,6,8.5145 c0.0001-0.0047,0.0001-0.0094,0-0.0141v-2.5c0.0005-0.1323-0.0515-0.2594-0.1445-0.3535l-0.752-0.752l1.166-1.2031l0.832,1.1094 C7.1958,4.9263,7.3433,5.0001,7.5,5.0004h2c0.2762,0.0039,0.5032-0.2168,0.5071-0.4929c0.0039-0.2761-0.2168-0.5032-0.493-0.5071 c-0.0047-0.0001-0.0094-0.0001-0.0141,0H7.75L6.4004,2.1996C6.3086,2.0777,6.1662,2.0043,6.0137,2.0004z M2.3633,6.0043 C2.113,6.0182,1.8615,6.0708,1.6191,6.1625C0.6498,6.5293,0.0049,7.46,0.0039,8.4965s0.6411,1.9703,1.6094,2.3398 s2.0683,0.1,2.7578-0.6738c0.1831-0.2068,0.164-0.5229-0.0428-0.706C4.1219,9.2736,3.8064,9.2924,3.623,9.4984 c-0.4154,0.4663-1.0709,0.627-1.6543,0.4043C1.3853,9.68,1.003,9.1229,1.0039,8.4984S1.3886,7.319,1.9727,7.098 c0.584-0.221,1.2402-0.0592,1.6543,0.4082C3.8101,7.713,4.1262,7.7322,4.3329,7.549c0.2068-0.1831,0.226-0.4992,0.0428-0.706 C4.3755,6.8427,4.3752,6.8425,4.375,6.8422C4.0314,6.4543,3.5855,6.1936,3.1035,6.0746C2.8625,6.0151,2.6136,5.9904,2.3633,6.0043 L2.3633,6.0043z M8.6426,6.0043C8.3923,5.9904,8.1433,6.0151,7.9023,6.0746c-0.482,0.119-0.9298,0.3797-1.2734,0.7676 c-0.1834,0.2071-0.1641,0.5237,0.043,0.707s0.5237,0.1641,0.707-0.043C7.793,7.0388,8.4472,6.877,9.0312,7.098 C9.6153,7.319,9.9991,7.8739,10,8.4984S9.6186,9.68,9.0352,9.9027c-0.5834,0.2227-1.2389,0.062-1.6543-0.4043 c-0.1729-0.2153-0.4877-0.2497-0.703-0.0768s-0.2497,0.4877-0.0768,0.703c0.0106,0.0132,0.0218,0.0258,0.0337,0.0378 c0.6895,0.7739,1.7895,1.0434,2.7578,0.6738C10.3609,10.4667,11.0015,9.5329,11,8.4964c-0.001-1.0365-0.6439-1.9671-1.6133-2.334 C9.1444,6.0708,8.8928,6.0182,8.6426,6.0043L8.6426,6.0043z\"></path></svg>"

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"bike-share-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><sodipodi:namedview bordercolor=\"#666666\" borderopacity=\"1\" gridtolerance=\"10\" guidetolerance=\"10\" id=\"namedview3364\" inkscape:current-layer=\"svg4619\" inkscape:cx=\"0.18747857\" inkscape:cy=\"7.9979934\" inkscape:document-units=\"px\" inkscape:object-nodes=\"true\" inkscape:object-paths=\"true\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:snap-bbox=\"true\" inkscape:snap-intersection-paths=\"true\" inkscape:snap-smooth-nodes=\"true\" inkscape:window-height=\"755\" inkscape:window-maximized=\"0\" inkscape:window-width=\"1280\" inkscape:window-x=\"0\" inkscape:window-y=\"23\" inkscape:zoom=\"1\" objecttolerance=\"10\" pagecolor=\"#ffffff\" showgrid=\"false\"><inkscape:grid color=\"#ff0000\" empspacing=\"2\" id=\"grid3368\" opacity=\"0.1254902\" spacingx=\"0.5\" spacingy=\"0.5\" type=\"xygrid\"></inkscape:grid></sodipodi:namedview><path id=\"circle4604\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sssssccccccccccccccccccccssssssssssssssssssss\" d=\" M10,1C9.4477,1,9,1.4477,9,2c0,0.5523,0.4477,1,1,1s1-0.4477,1-1C11,1.4477,10.5523,1,10,1z M8.1445,2.9941 c-0.13,0.0005-0.2547,0.0517-0.3477,0.1426l-2.6406,2.5c-0.2256,0.2128-0.2051,0.5775,0.043,0.7637L7,7.75v2.75 c-0.01,0.6762,1.0096,0.6762,1,0v-3c0.0003-0.1574-0.0735-0.3057-0.1992-0.4004L7.0332,6.5234l1.818-1.7212l0.7484,0.9985 C9.6943,5.9265,9.8426,6.0003,10,6h1.5c0.6761,0.01,0.6761-1.0096,0-1h-1.25L9.5,4L8.9004,3.1992 C8.8103,3.0756,8.6685,3,8.5156,2.9941H8.1445z M3,7c-1.6569,0-3,1.3432-3,3s1.3431,3,3,3s3-1.3432,3-3S4.6569,7,3,7z M12,7 c-1.6569,0-3,1.3432-3,3s1.3431,3,3,3s3-1.3432,3-3S13.6569,7,12,7z M3,8c1.1046,0,2,0.8954,2,2s-0.8954,2-2,2s-2-0.8954-2-2 S1.8954,8,3,8z M12,8c1.1046,0,2,0.8954,2,2s-0.8954,2-2,2s-2-0.8954-2-2S10.8954,8,12,8z\"></path></svg>"

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>blood-bank-11</title><path d=\"M8.40515,4.64435H8.40643L5.5,1,2.59308,4.64435H2.59485A3.37087,3.37087,0,0,0,2,6.55859,3.464,3.464,0,0,0,5.5,9.98822,3.464,3.464,0,0,0,9,6.55859,3.37087,3.37087,0,0,0,8.40515,4.64435ZM8,7H6V9H5V7H3V6H5V4H6V6H8V7Z\"></path></svg>"

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><title>blood-bank-15</title><path d=\"M11.2,7.1L11.2,7.1L7.5,2L3.8,7.1h0C3.3,7.8,3,8.7,3,9.6C3,12,5,14,7.5,14c0,0,0,0,0,0C10,14,12,12,12,9.6c0,0,0,0,0,0 C12,8.7,11.7,7.8,11.2,7.1z M10,10H8v2H7v-2H5V9h2V7h1v2h2V10z\"></path></svg>"

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 11 11\"><path d=\"M11.0016,5.8008v-0.5H9.9895C9.93427,4.28235,9.53269,3.31335,8.8513,2.5544l0.8271-0.8271l-0.354-0.3541L8.5012,2.2 c-0.75994-0.68207-1.73031-1.08369-2.75-1.1382V0h-0.5v1.0622c-0.99761,0.05474-1.94816,0.442-2.7,1.1l-0.876-0.886L1.32,1.6282 L2.19,2.5C1.48299,3.26753,1.06626,4.25789,1.0118,5.3H0v0.5h1.0121C1.06715,6.81867,1.46863,7.78795,2.15,8.5472L1.3229,9.3743 l0.3543,0.3541L2.5,8.9013c0.75994,0.68207,1.73031,1.08369,2.75,1.1382v0.9621h0.5v-0.9621 C6.77029,9.98353,7.74071,9.58012,8.5,8.8963l0.82,0.8311l0.3551-0.3521L8.8553,8.5412c0.67858-0.75782,1.07864-1.72428,1.1342-2.74 h1.0121V5.8008z M9.5624,5.3008H6.1009l2.4483-2.4444C9.15109,3.53478,9.50787,4.39554,9.5624,5.3008z M8.1952,2.5L5.7508,4.9467 V1.4892C6.65579,1.54295,7.51655,1.89889,8.1952,2.5z M5.2508,1.4892v3.4L2.85,2.4614C3.5221,1.88298,4.36561,1.5414,5.2508,1.4892z M2.4914,2.8092l2.46,2.4914H1.4392c0.05523-0.92636,0.42665-1.80572,1.0522-2.4912L2.4914,2.8092z M1.4392,5.8008h3.4615 L2.4524,8.2452C1.85051,7.56682,1.49373,6.70606,1.4392,5.8008z M2.8064,8.6008l2.4444-2.4469v3.4575 C4.34592,9.55774,3.4852,9.20206,2.8064,8.6013V8.6008z M5.7508,9.6108V6.1109l2.45,2.4814 c-0.67905,0.60519-1.54206,0.96416-2.45,1.0191V9.6108z M8.5508,8.2366L6.1479,5.8008h3.4145 C9.5079,6.70256,9.15336,7.56019,8.5552,8.2372h-0.004L8.5508,8.2366z\"></path></svg>"

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 15 15\"><path d=\"M13.4978,6.9989h-0.5329c-0.09997-1.10708-0.53528-2.15731-1.2478-3.0105l0.378-0.3784 c0.19605-0.19447,0.19733-0.51105,0.00286-0.7071C11.90698,2.71037,11.59733,2.70518,11.4,2.8912l0,0l-0.0123,0.0123L11.01,3.2815 c-0.85331-0.71298-1.90385-1.14864-3.0113-1.2488V1.5c0-0.27614-0.22386-0.5-0.5-0.5s-0.5,0.22386-0.5,0.5v0.5327 C5.8916,2.13306,4.84144,2.56871,3.9884,3.2815L3.61,2.9C3.41007,2.70952,3.09358,2.71717,2.9031,2.9171 c-0.184,0.19312-0.184,0.49668,0,0.6898l0.3784,0.3775C2.56787,4.83856,2.13216,5.89031,2.0327,6.9989H1.5 c-0.27614,0-0.5,0.22386-0.5,0.5s0.22386,0.5,0.5,0.5h0.5327c0.09987,1.10695,0.535,2.15711,1.2473,3.0103l-0.3779,0.3779 c-0.19538,0.19514-0.19557,0.51173-0.00043,0.70711c0.19053,0.19076,0.49798,0.19611,0.69503,0.01209L3.609,12.094l0.3779-0.3779 c0.8533,0.71312,1.90395,1.1488,3.0115,1.2488v0.5329c0,0.27614,0.22386,0.5,0.5,0.5s0.5-0.22386,0.5-0.5v-0.5329 c1.10719-0.10026,2.15744-0.53592,3.0105-1.2488l0.3779,0.3779c0.19514,0.19538,0.51173,0.19557,0.70711,0.00043 c0.19076-0.19053,0.19611-0.49798,0.01209-0.69503l-0.0123-0.0123l0,0l-0.3779-0.3779c0.71283-0.8531,1.14848-1.90333,1.2488-3.0105 h0.5329c0.27609-0.00544,0.49549-0.23366,0.49006-0.50975C13.98227,7.22064,13.76611,7.00435,13.4978,6.9989z M7.9987,3.0505 c0.83871,0.09248,1.63383,0.42154,2.2926,0.9488l-2.15,2.15c-0.04663-0.0218-0.09436-0.04116-0.143-0.058V3.0505H7.9987z M6.9987,3.0505V6.091c-0.04864,0.01684-0.09637,0.0362-0.143,0.058l-2.15-2.15c0.65897-0.52726,1.45431-0.85622,2.2932-0.9485 H6.9987z M3.9987,4.7062l2.15,2.15c-0.0218,0.04663-0.04116,0.09436-0.058,0.143H3.0505 c0.09243-0.83886,0.42154-1.63413,0.9489-2.293L3.9987,4.7062z M3.0505,7.9987H6.091c0.01687,0.04863,0.03623,0.09636,0.058,0.143 l-2.15,2.15C3.47173,9.63281,3.14276,8.83753,3.0505,7.9987z M6.9989,11.9471c-0.83871-0.09248-1.63383-0.42154-2.2926-0.9488 l2.15-2.15c0.04663,0.0218,0.09436,0.04116,0.143,0.058v3.0405L6.9989,11.9471z M7.9989,11.9471V8.9066 c0.04864-0.01683,0.09638-0.03619,0.143-0.058l2.15,2.15c-0.65895,0.5273-1.4543,0.85627-2.2932,0.9485H7.9989z M10.9989,10.2914 l-2.15-2.15c0.02177-0.04664,0.04113-0.09437,0.058-0.143h3.0415c-0.09276,0.83901-0.42232,1.6343-0.9502,2.293H10.9989z M8.9066,6.9989c-0.01684-0.04864-0.0362-0.09637-0.058-0.143l2.15-2.15c0.52726,0.65877,0.85632,1.45389,0.9488,2.2926H8.9066 V6.9989z\"></path></svg>"

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M2,1v9h4V6h2v4h1V1H2z M5,9H3V6h2V9z M5,5H3V3h2V5z M8,5H6V3h2V5z\"></path></svg>"

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M3,2v11h5v-3h3v3h1V2H3z M7,12H4v-2h3V12z M7,9H4V7h3V9z M7,6H4V4h3V6z M11,9H8V7h3V9z M11,6H8V4h3V6z\"></path></svg>"

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><title>buildings</title><path d=\"M8,9.5v-5C8,4.2,7.8,4,7.5,4H6V1L3,2v7.5H2V10h7V9.5H8z M5,9.5H4V3h1V9.5z\"></path></svg>"

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><title>buildings</title><path d=\"M11,13.5v-9C11,4.2,10.8,4,10.5,4H9V1L5,2.1v11.4H2V14h11v-0.5H11z M7,13.5V3h1v10.5H7z\"></path></svg>"

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bus-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path8043\" inkscape:connector-curvature=\"0\" d=\"M3,0C2,0,1,0.5312,1,2v4v3.5c0,0,0,0.5,0.5,0.5L2,10.0156V10.5 c0,0,0,0.5,0.5,0.5H3c0,0,0.5,0,0.5-0.5v-0.4844L7.5,10v0.5c0,0,0,0.5,0.5,0.5h0.5C9,11,9,10.5,9,10.5v-0.4844L9.5,10 c0,0,0.5,0,0.5-0.5V6V2c0-1.5-1-2-2-2H3z M3.75,1h3.5C7.3885,1,7.5,1.1115,7.5,1.25S7.3885,1.5,7.25,1.5h-3.5 C3.6115,1.5,3.5,1.3885,3.5,1.25S3.6115,1,3.75,1z M3,2h5c1,0,1,1,1,1v2c0,0,0,1-1,1H3C2,6,2,5,2,5V3C2,3,2,2,3,2z M2.75,7.5 c0.4142,0,0.75,0.3358,0.75,0.75C3.5,8.6642,3.1642,9,2.75,9S2,8.6642,2,8.25C2,7.8358,2.3358,7.5,2.75,7.5z M8.25,7.5 C8.6642,7.5,9,7.8358,9,8.25C9,8.6642,8.6642,9,8.25,9C7.8358,9,7.5,8.6642,7.5,8.25C7.5,7.8358,7.8358,7.5,8.25,7.5z\"></path></svg>"

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"bus-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path8043\" d=\"M4,0C2.6364,0,1,0.7433,1,2.7461v5.4531V12c0,0,0,1,1,1v1c0,0,0,1,1,1s1-1,1-1v-1h7v1c0,0,0,1,1,1s1-1,1-1v-1 c0,0,1,0,1-1V2.7461C14,0.7006,12.764,0,11.4004,0H4z M4.25,1.5h6.5C10.8885,1.5,11,1.6115,11,1.75S10.8885,2,10.75,2h-6.5 C4.1115,2,4,1.8885,4,1.75S4.1115,1.5,4.25,1.5z M3,3h9c1,0,1,0.9668,1,0.9668V7c0,0,0,1-1,1H3C2,8,2,7,2,7V4C2,4,2,3,3,3z M3,10 c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1S2.4477,10,3,10z M12,10c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1 S11.4477,10,12,10z\"></path></svg>"

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M7,9.5C7,9.7761,6.7761,10,6.5,10h-4C2.2239,10,2,9.7761,2,9.5S2.2239,9,2.5,9h4C6.7761,9,7,9.2239,7,9.5z M8,3H7V2H2v4 c0.0016,1.3807,1.1222,2.4987,2.5029,2.4971C5.4948,8.4959,6.3921,7.9085,6.79,7H8c1.1046,0,2-0.8954,2-2S9.1046,3,8,3z M8,6H7V4h1 c0.5523,0,1,0.4477,1,1S8.5523,6,8,6z\"></path></svg>"

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12,5h-2V3H2v4c0.0133,2.2091,1.8149,3.9891,4.024,3.9758C7.4345,10.9673,8.7362,10.2166,9.45,9H12c1.1046,0,2-0.8954,2-2 S13.1046,5,12,5z M12,8H9.86C9.9487,7.6739,9.9958,7.3379,10,7V6h2c0.5523,0,1,0.4477,1,1S12.5523,8,12,8z M10,12.5 c0,0.2761-0.2239,0.5-0.5,0.5h-7C2.2239,13,2,12.7761,2,12.5S2.2239,12,2.5,12h7C9.7761,12,10,12.2239,10,12.5z\"></path></svg>"

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.92,2.19C5.7745,1.9553,5.4663,1.8829,5.2316,2.0284C5.166,2.0691,5.1107,2.1244,5.07,2.19L1.5,8h-1 C0.2724,7.9555,0.0517,8.104,0.0072,8.3316C0.0034,8.3509,0.001,8.3704,0,8.39V9.5C-0.0056,9.7706,0.2092,9.9944,0.4798,10 c0.0067,0.0001,0.0135,0.0001,0.0202,0h10c0.2706,0.0056,0.4944-0.2092,0.5-0.4798c0.0001-0.0067,0.0001-0.0135,0-0.0202V8.39 c-0.0123-0.2316-0.21-0.4095-0.4416-0.3972C10.5388,7.9938,10.5193,7.9962,10.5,8h-1L5.92,2.19z M5.5,3l3,5h-6L5.5,3z\"></path></svg>"

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"campsite-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect3335\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccccccc\" style=\"fill:#010101;\" d=\"M7,1.5 l-5.5,9H1c-1,0-1,1-1,1v1c0,0,0,1,1,1h13c1,0,1-1,1-1v-1c0,0,0-1-1-1h-0.5L8,1.5C7.8,1.1,7.2,1.1,7,1.5z M7.5,5l3.2,5.5H4.2L7.5,5z\"></path></svg>"

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,4L8.11,1.34C8.0418,1.1381,7.8531,1.0016,7.64,1H3.36C3.1469,1.0016,2.9582,1.1381,2.89,1.34L2,4C1.4477,4,1,4.4477,1,5 v3h1v1c0,0.5523,0.4477,1,1,1s1-0.4477,1-1V8h3v1c0,0.5523,0.4477,1,1,1s1-0.4477,1-1V8h1V5C10,4.4477,9.5523,4,9,4z M3,7 C2.4477,7,2,6.5523,2,6s0.4477-1,1-1s1,0.4477,1,1S3.5523,7,3,7z M3,4l0.62-2h3.76L8,4H3z M8,7C7.4477,7,7,6.5523,7,6s0.4477-1,1-1 s1,0.4477,1,1S8.5523,7,8,7z\"></path></svg>"

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,7c-0.004-0.6904-0.4787-1.2889-1.15-1.45l-1.39-3.24l0,0l0,0l0,0C11.3833,2.1233,11.2019,2.001,11,2H4 C3.8124,2.0034,3.6425,2.1115,3.56,2.28l0,0l0,0l0,0L2.15,5.54C1.475,5.702,0.9994,6.3059,1,7v3.5h1v1c0,0.5523,0.4477,1,1,1 s1-0.4477,1-1v-1h7v1c0,0.5523,0.4477,1,1,1s1-0.4477,1-1v-1h1V7z M4.3,3h6.4l1.05,2.5h-8.5L4.3,3z M3,9C2.4477,9,2,8.5523,2,8 s0.4477-1,1-1s1,0.4477,1,1S3.5523,9,3,9z M12,9c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S12.5523,9,12,9z\"></path></svg>"

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M8.67,0.81v1.48C8.6812,2.6709,8.3815,2.9888,8.0006,3C8.0004,3,8.0002,3,8,3H3.09c-0.381,0.0056-0.6944-0.2988-0.7-0.6799 C2.3899,2.3134,2.3899,2.3067,2.39,2.3V0.81c0-0.1905,0.1545-0.345,0.345-0.345S3.08,0.6195,3.08,0.81V1.5H4V1l0,0 c0-0.2761,0.2239-0.5,0.5-0.5S5,0.7239,5,1l0,0v0.5h1V1l0,0c0-0.2761,0.2239-0.5,0.5-0.5S7,0.7239,7,1l0,0v0.5h1V0.81 C7.9679,0.625,8.0919,0.449,8.2769,0.4169c0.185-0.0321,0.361,0.0919,0.3931,0.2769C8.6767,0.7323,8.6767,0.7716,8.67,0.81z M10.06,9.63c0,0.1933-0.1567,0.35-0.35,0.35h0H1.35C1.1567,9.9799,1.0001,9.8231,1.0002,9.6298 C1.0004,9.4366,1.1569,9.2801,1.35,9.28H1.7c0.3754,0.0112,0.6888-0.284,0.7-0.6594c0.0004-0.0135,0.0004-0.0271,0-0.0406 c0,0,0.7-3.2,0.7-3.89C3.0944,4.3145,3.3943,4.0056,3.7699,4C3.7766,3.9999,3.7833,3.9999,3.79,4h3.48 c0.3754-0.0112,0.6888,0.284,0.7,0.6594c0.0004,0.0135,0.0004,0.0271,0,0.0406c0,0.7,0.7,3.89,0.7,3.89 c-0.0112,0.3754,0.284,0.6888,0.6594,0.7c0.0135,0.0004,0.0271,0.0004,0.0406,0h0.34c0.1933,0,0.35,0.1567,0.35,0.35v0V9.63z M6.5,7.5c0-0.5523-0.4477-1-1-1s-1,0.4477-1,1v2h2V7.5z\"></path></svg>"

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11,4H4C3.4477,4,3,3.5523,3,3V0.5C3,0.2239,3.2239,0,3.5,0S4,0.2239,4,0.5V2h1V1c0-0.5523,0.4477-1,1-1s1,0.4477,1,1v1h1V1 c0-0.5523,0.4477-1,1-1s1,0.4477,1,1v1h1V0.5C11,0.2239,11.2239,0,11.5,0S12,0.2239,12,0.5V3C12,3.5523,11.5523,4,11,4z M14,14.5 c0,0.2761-0.2239,0.5-0.5,0.5h-12C1.2239,15,1,14.7761,1,14.5S1.2239,14,1.5,14H2c0.5523,0,1-0.4477,1-1c0,0,1-6,1-7 c0-0.5523,0.4477-1,1-1h5c0.5523,0,1,0.4477,1,1c0,1,1,7,1,7c0,0.5523,0.4477,1,1,1h0.5c0.2723-0.0001,0.4946,0.2178,0.5,0.49V14.5z M9,10.5C9,9.6716,8.3284,9,7.5,9S6,9.6716,6,10.5V14h3V10.5z\"></path></svg>"

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M8.65,8H8l0,0l1-5.61c0.0167-0.1981-0.1304-0.3722-0.3286-0.3889C8.6577,1.9999,8.6438,1.9996,8.63,2H7.16 c0-0.65-0.7-1-1.67-1S3.66,1.35,3.66,2H2.35C2.1512,2.0048,1.994,2.1699,1.9988,2.3686C1.999,2.3758,1.9994,2.3829,2,2.39L3,8l0,0 H2.35C2.1567,7.9999,1.9999,8.1566,1.9999,8.3499c0,0.0034,0,0.0068,0.0001,0.0101V10h7V8.36 c0.0055-0.1932-0.1466-0.3543-0.3399-0.3599C8.6568,8,8.6534,8,8.65,8z M7,5H4V4h3V5z\"></path></svg>"

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11.46,12h-0.68L12,3.55c0.0175-0.2867-0.2008-0.5332-0.4874-0.5507C11.4884,2.9979,11.4641,2.9981,11.44,3h-1.18 c0-0.92-1.23-2-2.75-2S4.77,2.08,4.77,3H3.54C3.253,2.9885,3.0111,3.2117,2.9995,3.4987C2.9988,3.5158,2.999,3.5329,3,3.55L4.2,12 H3.55C3.2609,11.9886,3.0162,12.2112,3,12.5V14h9v-1.51C11.9839,12.2067,11.7435,11.9886,11.46,12z M4.5,5h6v1h-6V5z\"></path></svg>"

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,5.5v2C10,7.7761,9.7761,8,9.5,8S9,7.7761,9,7.5l0,0C8.9427,7.2478,8.7433,7.0523,8.49,7H8v1.63 C8,8.8343,7.8343,9,7.63,9H1.37C1.1657,9,1,8.8343,1,8.63V5.37C1,5.1657,1.1657,5,1.37,5h6.26C7.8343,5,8,5.1657,8,5.37V6h0.49 C8.7433,5.9477,8.9427,5.7522,9,5.5C9,5.2239,9.2239,5,9.5,5S10,5.2239,10,5.5z M2.5,2C1.6716,2,1,2.6716,1,3.5S1.6716,5,2.5,5 S4,4.3284,4,3.5S3.3284,2,2.5,2z M2.5,4C2.2239,4,2,3.7761,2,3.5S2.2239,3,2.5,3S3,3.2239,3,3.5S2.7761,4,2.5,4z M6,1 C4.8954,1,4,1.8954,4,3s0.8954,2,2,2s2-0.8954,2-2S7.1046,1,6,1z M6,4C5.4477,4,5,3.5523,5,3s0.4477-1,1-1s1,0.4477,1,1 S6.5523,4,6,4z\"></path></svg>"

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,7.5v2c0,0.2761-0.2239,0.5-0.5,0.5S13,9.7761,13,9.5c0,0,0.06-0.5-1-0.5h-1v2.5c0,0.2761-0.2239,0.5-0.5,0.5h-8 C2.2239,12,2,11.7761,2,11.5v-4C2,7.2239,2.2239,7,2.5,7h8C10.7761,7,11,7.2239,11,7.5V8h1c1.06,0,1-0.5,1-0.5 C13,7.2239,13.2239,7,13.5,7S14,7.2239,14,7.5z M4,3C2.8954,3,2,3.8954,2,5s0.8954,2,2,2s2-0.8954,2-2S5.1046,3,4,3z M4,6 C3.4477,6,3,5.5523,3,5s0.4477-1,1-1s1,0.4477,1,1S4.5523,6,4,6z M8.5,2C7.1193,2,6,3.1193,6,4.5S7.1193,7,8.5,7S11,5.8807,11,4.5 S9.8807,2,8.5,2z M8.5,6C7.6716,6,7,5.3284,7,4.5S7.6716,3,8.5,3S10,3.6716,10,4.5S9.3284,6,8.5,6z\"></path></svg>"

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,5.5C10,7.9853,7.9853,10,5.5,10S1,7.9853,1,5.5S3.0147,1,5.5,1S10,3.0147,10,5.5z\"></path></svg>"

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z\"></path></svg>"

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"circle-stroked-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path8564-5-6-2\" inkscape:connector-curvature=\"0\" d=\"M5.5,0C8.5376,0,11,2.4624,11,5.5S8.5376,11,5.5,11S0,8.5376,0,5.5 S2.4624,0,5.5,0z M5.5,1.2222c-2.3626,0-4.2778,1.9152-4.2778,4.2778S3.1374,9.7778,5.5,9.7778S9.7778,7.8626,9.7778,5.5 S7.8626,1.2222,5.5,1.2222z\"></path></svg>"

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"circle-stroked-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path8564-5-6-4\" inkscape:connector-curvature=\"0\" d=\"M7.5,0C11.6422,0,15,3.3578,15,7.5S11.6422,15,7.5,15 S0,11.6422,0,7.5S3.3578,0,7.5,0z M7.5,1.6666c-3.2217,0-5.8333,2.6117-5.8333,5.8334S4.2783,13.3334,7.5,13.3334 s5.8333-2.6117,5.8333-5.8334S10.7217,1.6666,7.5,1.6666z\"></path></svg>"

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 11 11\"><path d=\"M9.7514,3h-0.75V1.25c0-0.13807-0.11193-0.25-0.25-0.25C8.75137,1,8.75133,1,8.7513,1h-0.5 c-0.13807,0-0.25,0.11193-0.25,0.25V3h-0.75c-0.13807,0-0.25,0.11193-0.25,0.25v3.751H5.2518c-0.13862,0-0.251,0.11238-0.251,0.251 v2.5c0.0011,0.13784,0.11315,0.249,0.251,0.249h4.5006c0.13768-0.00055,0.249-0.11232,0.249-0.25V3.25 C10.0014,3.11193,9.88947,3,9.7514,3z M6.0009,8.0012h1v1h-1V8.0012z M9.0009,9.0012h-1v-1h1V9.0012z M9.0009,7.0012h-1v-1h1V7.0012 z M9.0009,5.0012h-1v-1h1V5.0012z M6.0009,1.2507C6.00129,1.11263,5.88967,1.00039,5.7516,1C5.75133,1,5.75107,1,5.7508,1H3.25 C3.11193,1,3,1.11193,3,1.25V2H2.25C2.11193,2,2,2.11193,2,2.25V3H1.25C1.11193,3,1,3.11193,1,3.25v6.5014 c0,0.13807,0.11193,0.25,0.25,0.25H4V6.0009h2V1.25L6.0009,1.2507z M3,9.0013H2v-1h1V9.0013z M3,7.0013H2v-1h1V7.0013z M3,5.0013H2 v-1h1V5.0013z M5,5.0013H4v-1h1V5.0013z M5,3.0013H4V2h1v1V3.0013z\"></path></svg>"

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 15 15\"><path d=\"M13.6368,3.9994h-1.6387V1.3608C11.99804,1.16148,11.83642,0.99994,11.6371,1l0,0h-0.278 c-0.19932,0-0.3609,0.16158-0.3609,0.3609l0,0v2.6385H9.36c-0.19932,0-0.3609,0.16158-0.3609,0.3609l0,0l0,0v5.6381h-3.637 c-0.20042,0-0.3629,0.16248-0.3629,0.3629v3.2745c0.00055,0.20003,0.16287,0.3619,0.3629,0.3619h8.2747 c0.19932,0,0.3609-0.16158,0.3609-0.3609l0,0V4.36c0-0.19932-0.16158-0.3609-0.3609-0.3609l0,0L13.6368,3.9994z M6.9989,11.9981h-1 v-1h1V11.9981z M8.9989,11.9981h-1v-1h1V11.9981z M10.9989,11.9981h-1v-1h1V11.9981z M10.9989,9.9981h-1v-1h1V9.9981z M10.9989,7.9981h-1v-1h1V7.9981z M10.9989,5.9981h-1v-1h1V5.9981z M12.9989,11.9971h-1v-1h1V11.9971z M12.9989,9.9971h-1v-1h1 V9.9971z M12.9989,7.9971h-1v-1h1V7.9971z M12.9989,5.9971h-1v-1h1V5.9971z M7.9987,1.3608C7.99864,1.16152,7.83708,1,7.6378,1H5.36 C5.16068,1,4.9991,1.16158,4.9991,1.3609l0,0V3H3.36C3.16138,3.00049,3.00049,3.16138,3,3.36l0,0v0.6394H1.3608 C1.16164,3.99945,1.00017,4.16084,1,4.36l0,0v9.2765c0,0.19932,0.16158,0.3609,0.3609,0.3609h2.6385V8.9986h3.9993V1.3608z M3,11.9981H2v-1h1V11.9981z M3,9.9981H2v-1h1V9.9981z M3,7.9981H2v-1h1V7.9981z M3,5.9981H2v-1h1V5.9981z M5,7.9981H4v-1h1V7.9981z M5,5.9981H4v-1h1V5.9981z M7,7.9981H6v-1h1V7.9981z M7,5.9981H6v-1h1V5.9981z M7,3.9981H6V3h1v1V3.9981z\"></path></svg>"

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"clothing-store-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect4181-0-0\" inkscape:connector-curvature=\"0\" inkscape:export-filename=\"/Users/MapBox/Desktop/clothing-store.png\" inkscape:export-xdpi=\"90\" inkscape:export-ydpi=\"90\" sodipodi:nodetypes=\"cccccccccccccc\" d=\" M2.5,1l-2,2v2h2v5h6V5h2V3l-2-2H7L5.5,4L4,1H2.5z\"></path></svg>"

/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"clothing-store-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect4181-0-0\" inkscape:connector-curvature=\"0\" inkscape:export-filename=\"/Users/MapBox/Desktop/clothing-store.png\" inkscape:export-xdpi=\"90\" inkscape:export-ydpi=\"90\" sodipodi:nodetypes=\"cccccccccccccc\" d=\" M3.5,1L0,4v3h2.9L3,14h9V7h3V4l-3.5-3H10L7.5,5L5,1H3.5z\"></path></svg>"

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"svg4764\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><g><path d=\"M2,7.3c0.3-0.2,0.5-0.5,0.5-0.8c0-0.4-0.2-0.7-0.6-0.9V4.4L5.5,6L11,3.5L5.5,1L0,3.5L1.2,4v1.6 C0.8,5.8,0.6,6.1,0.6,6.5c0,0.3,0.2,0.6,0.5,0.8L0.6,9c-0.3,1,0.5,1,0.5,1h1c0,0,0.8,0,0.5-1L2,7.3z\"></path><path d=\"M3.5,6.2c0,0.1,0,0.2,0,0.3c0,0.4-0.2,0.8-0.4,1.1C3.3,8,3.5,8.4,3.5,9v0.6C4,9.8,4.7,10,5.5,10 C8,10,9,8.5,9,8.5v-3L5.5,7.1L3.5,6.2z\"></path></g></svg>"

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"svg4619\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><path d=\"M7.5,1L0,4.5l2,0.9v1.7C1.4,7.3,1,7.9,1,8.5s0.4,1.2,1,1.4V10l-0.9,2.1 C0.8,13,1,14,2.5,14s1.7-1,1.4-1.9L3,10c0.6-0.3,1-0.8,1-1.5S3.6,7.3,3,7.1V5.9L7.5,8L15,4.5L7.5,1z M11.9,7.5l-4.5,2L5,8.4v0.1 c0,0.7-0.3,1.3-0.8,1.8l0.6,1.4v0.1C4.9,12.2,5,12.6,4.9,13c0.7,0.3,1.5,0.5,2.5,0.5c3.3,0,4.5-2,4.5-3L11.9,7.5L11.9,7.5z\"></path></svg>"

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M0,5c-0.0224-1.0854,0.3309-2.1451,1-3h9c0.6691,0.8549,1.0224,1.9146,1,3H0z M2,6v5h4V7h2v4h1V6H2z M5,9H3V7h2V9z\"></path></svg>"

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,7H1c0.0881-1.3829,0.427-2.7383,1-4h11C13.5731,4.2617,13.9119,5.6171,14,7z M3,8h9v6h-1V9H8v5H3V8z M4,11h3V9H4V11z\"></path></svg>"

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M6,1c0,0.5523-0.4477,1-1,1S4,1.5523,4,1s0.4477-1,1-1S6,0.4477,6,1z M8.88,5.18l-1-2l0,0l0,0 C7.7859,3.0671,7.647,3.0012,7.5,3H2.77C2.3827,2.9815,2.0467,3.2651,2,3.65l0,0l-1,6.71l0,0c-0.0068,0.0464-0.0068,0.0936,0,0.14 C1,10.7761,1.2239,11,1.5,11c0.2307,0.0129,0.4391-0.1371,0.5-0.36l0,0l1.22-3.89l0,0l0.21-0.83l0.4,0.44l0,0L5,7.6v2.9 C5,10.7761,5.2239,11,5.5,11S6,10.7761,6,10.5v-3l0,0l0,0C5.9971,7.3984,5.9621,7.3004,5.9,7.22l0,0L4.45,5.5L5.5,4h1.71l0.92,1.84 l0,0C8.2247,5.9439,8.3594,6.0022,8.5,6C8.7723,6.0001,8.9946,5.7822,9,5.51C8.9826,5.3931,8.9418,5.2808,8.88,5.18z M10.5,8 C10.2239,8,10,8.2239,10,8.5S10.2239,9,10.5,9S11,8.7761,11,8.5S10.7761,8,10.5,8z M8.69,8V7.25C8.69,7.1119,8.5781,7,8.44,7 S8.19,7.1119,8.19,7.25V8C8.0378,8.0855,7.9426,8.2455,7.94,8.42v2.08c0,0.2761,0.2239,0.5,0.5,0.5s0.5-0.2239,0.5-0.5V8.41 C8.9339,8.2391,8.8392,8.0837,8.69,8z\"></path></svg>"

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M8,1.5C8,2.3284,7.3284,3,6.5,3S5,2.3284,5,1.5S5.6716,0,6.5,0S8,0.6716,8,1.5z M10.88,7.18L10.88,7.18l-2-2l0,0l0,0 C8.7815,5.0616,8.6339,4.9952,8.48,5H3.75C3.3736,4.9915,3.0508,5.2669,3,5.64l0,0l-1,7.7l0,0c-0.0068,0.0464-0.0068,0.0936,0,0.14 c0,0.2761,0.2239,0.5,0.5,0.5c0.2251,0.0153,0.4315-0.1251,0.5-0.34l0,0l1.2-3.89l0,0l0.26-0.83l0.4,0.44l0,0L6,10.6v2.9 C6,13.7761,6.2239,14,6.5,14S7,13.7761,7,13.5v-3l0,0l0,0c-0.0081-0.0788-0.0356-0.1544-0.08-0.22l0,0L5.48,8.5l1-2.5h1.71l2,1.84 l0,0c0.0928,0.1077,0.2278,0.1697,0.37,0.17C10.8163,7.9791,11.007,7.7581,11,7.5C10.9997,7.3824,10.9571,7.2688,10.88,7.18z M14,11.27c-0.4142,0-0.75,0.3358-0.75,0.75s0.3358,0.75,0.75,0.75s0.75-0.3358,0.75-0.75S14.4142,11.27,14,11.27z M10.76,9.74V9 c0-0.1381-0.1119-0.25-0.25-0.25S10.26,8.8619,10.26,9v0.74c-0.1522,0.0855-0.2474,0.2455-0.25,0.42v3.34 c0,0.2761,0.2239,0.5,0.5,0.5s0.5-0.2239,0.5-0.5v-3.34C11.0074,9.9855,10.9122,9.8255,10.76,9.74z\"></path></svg>"

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M2.2,1.19l3.3,3.3L8.8,1.2C8.9314,1.0663,9.1127,0.9938,9.3,1C9.6761,1.0243,9.9757,1.3239,10,1.7 c0.0018,0.1806-0.0705,0.3541-0.2,0.48L6.49,5.5L9.8,8.82C9.9295,8.9459,10.0018,9.1194,10,9.3C9.9757,9.6761,9.6761,9.9757,9.3,10 c-0.1873,0.0062-0.3686-0.0663-0.5-0.2L5.5,6.51L2.21,9.8c-0.1314,0.1337-0.3127,0.2062-0.5,0.2C1.3265,9.98,1.02,9.6735,1,9.29 C0.9982,9.1094,1.0705,8.9359,1.2,8.81L4.51,5.5L1.19,2.18C1.0641,2.0524,0.9955,1.8792,1,1.7C1.0243,1.3239,1.3239,1.0243,1.7,1 C1.8858,0.9912,2.0669,1.06,2.2,1.19z\"></path></svg>"

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M2.64,1.27L7.5,6.13l4.84-4.84C12.5114,1.1076,12.7497,1.0029,13,1c0.5523,0,1,0.4477,1,1 c0.0047,0.2478-0.093,0.4866-0.27,0.66L8.84,7.5l4.89,4.89c0.1648,0.1612,0.2615,0.3796,0.27,0.61c0,0.5523-0.4477,1-1,1 c-0.2577,0.0107-0.508-0.0873-0.69-0.27L7.5,8.87l-4.85,4.85C2.4793,13.8963,2.2453,13.9971,2,14c-0.5523,0-1-0.4477-1-1 c-0.0047-0.2478,0.093-0.4866,0.27-0.66L6.16,7.5L1.27,2.61C1.1052,2.4488,1.0085,2.2304,1,2c0-0.5523,0.4477-1,1-1 C2.2404,1.0029,2.4701,1.0998,2.64,1.27z\"></path></svg>"

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,7.51c0,0.2761-0.2239,0.5-0.5,0.5l0,0C9.241,8.0319,9.0006,8.1539,8.83,8.35c-0.2714,0.2887-0.6175,0.4964-1,0.6 C7.2185,9.1316,6.5566,8.9924,6.07,8.58L5.73,8.23c-0.2997-0.2948-0.7803-0.2948-1.08,0L5,9.38 c0.0664,0.268-0.0971,0.5392-0.3651,0.6055C4.5908,9.9965,4.5454,10.0013,4.5,10h-3C1.2239,10,1,9.7761,1,9.5v-8 C0.9999,1.2277,1.2178,1.0054,1.49,1h0.7c0.2346-0.0011,0.4384,0.1611,0.49,0.39L3.41,3.9l0.1-0.06C3.67,3.72,3.82,3.57,4,3.44 c0.7076-0.5968,1.7424-0.5968,2.45,0C6.6,3.57,6.74,3.71,6.89,3.83c0.2847,0.2546,0.7153,0.2546,1,0l0.41-0.4 C8.6306,3.1458,9.0541,2.9928,9.49,3l0,0c0.2761,0,0.5,0.2239,0.5,0.5S9.7661,4,9.49,4l0,0C9.231,4.0219,8.9906,4.1439,8.82,4.34 c-0.2714,0.2887-0.6175,0.4964-1,0.6C7.2085,5.1216,6.5466,4.9824,6.06,4.57L5.73,4.23C5.4324,3.9262,4.9449,3.9213,4.6411,4.2189 C4.6374,4.2226,4.6337,4.2263,4.63,4.23C4.49,4.35,4.36,4.48,4.21,4.6C4.0521,4.7221,3.8768,4.8198,3.69,4.89l0.67,2.32 c0.6727-0.3402,1.4836-0.2458,2.06,0.24c0.15,0.13,0.29,0.27,0.44,0.39c0.2847,0.2546,0.7153,0.2546,1,0L8.3,7.42 C8.6321,7.1394,9.0554,6.99,9.49,7l0,0C9.7661,6.9944,9.9944,7.2137,10,7.4898C10.0001,7.4965,10.0001,7.5033,10,7.51z\"></path></svg>"

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.94,9.5c0,0.2761-0.2239,0.5-0.5,0.5l0,0c-0.259,0.0219-0.4994,0.1439-0.67,0.34c-0.2714,0.2887-0.6175,0.4964-1,0.6 c-0.6115,0.1816-1.2734,0.0424-1.76-0.37l-0.39-0.35c-0.2976-0.3038-0.7851-0.3087-1.0889-0.0111 C8.5274,10.2126,8.5237,10.2163,8.52,10.22c-0.14,0.12-0.27,0.25-0.42,0.37c-0.7278,0.5784-1.7663,0.5489-2.46-0.07L5.3,10.19 l-0.1-0.06l0.3,1.22l0.49,2c0.0829,0.2634-0.0634,0.5441-0.3267,0.6271C5.6105,13.9937,5.5553,14.0014,5.5,14h-4 C1.2239,14,1,13.7761,1,13.5v-12C1,1.2239,1.2239,1,1.5,1h1.1c0.2346-0.0011,0.4384,0.1611,0.49,0.39L4,5.06V5.2 c0.6569-0.314,1.4361-0.2205,2,0.24c0.16,0.13,0.31,0.28,0.47,0.41c0.2847,0.2546,0.7153,0.2546,1,0c0.16-0.13,0.31-0.28,0.47-0.41 c0.7076-0.5968,1.7424-0.5968,2.45,0c0.15,0.13,0.29,0.27,0.44,0.39c0.2847,0.2546,0.7153,0.2546,1,0l0.47-0.41 c0.3163-0.2672,0.7159-0.4157,1.13-0.42l0,0c0.2761,0,0.5,0.2239,0.5,0.5S13.7061,6,13.43,6l0,0 c-0.259,0.0219-0.4994,0.1439-0.67,0.34c-0.2714,0.2887-0.6175,0.4964-1,0.6C11.1485,7.1216,10.4866,6.9824,10,6.57L9.67,6.23 C9.3724,5.9262,8.8849,5.9213,8.5811,6.2189C8.5774,6.2226,8.5737,6.2263,8.57,6.23C8.43,6.35,8.3,6.48,8.15,6.6 C7.4222,7.1784,6.3837,7.1489,5.69,6.53L5.3,6.19c-0.2847-0.2546-0.7153-0.2546-1,0L4.24,6.24L4.93,9 C5.3226,9.029,5.6965,9.1793,6,9.43c0.16,0.13,0.31,0.28,0.47,0.41c0.2847,0.2546,0.7153,0.2546,1,0c0.16-0.13,0.31-0.28,0.47-0.41 c0.7076-0.5968,1.7424-0.5968,2.45,0c0.15,0.13,0.29,0.27,0.44,0.39c0.2847,0.2546,0.7153,0.2546,1,0l0.47-0.41 c0.3177-0.2636,0.7172-0.4085,1.13-0.41l0,0c0.2761-0.0055,0.5044,0.2138,0.5099,0.4899C13.94,9.4933,13.94,9.4966,13.94,9.5z\"></path></svg>"

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M6.62,8.5l3.11,1.55l-0.45,0.89L5.5,9.06l-3.78,1.89l-0.45-0.89L4.38,8.5l-3.1-1.55l0.45-0.89L5.5,7.94l3.78-1.89l0.44,0.9 L6.62,8.5z M8.5,3.21V3.5l-1,1v1l-2,1l-2-1v-1l-1-1V3C2.4438,1.3994,3.6958,0.0562,5.2964,0C5.3643-0.0024,5.4322-0.0024,5.5,0 c1.7059,0.0484,3.0495,1.4705,3.0011,3.1764C8.5008,3.1876,8.5004,3.1988,8.5,3.21z M4.71,2.71c0-0.4363-0.3537-0.79-0.79-0.79 S3.13,2.2737,3.13,2.71c0,0.4363,0.3537,0.79,0.79,0.79l0,0C4.3563,3.5,4.71,3.1463,4.71,2.71z M5,4.5H4.5v1H5V4.5z M6.5,4.5H6v1 h0.5V4.5z M7.86,2.71c0-0.4363-0.3537-0.79-0.79-0.79S6.28,2.2737,6.28,2.71S6.6337,3.5,7.07,3.5l0,0 C7.5063,3.5,7.86,3.1463,7.86,2.71z\"></path></svg>"

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.94,14.68c-0.0749,0.194-0.262,0.3215-0.47,0.32c-0.0595,0.0107-0.1205,0.0107-0.18,0L7.5,12.56L1.7,15 c-0.2572,0.1005-0.5472-0.0266-0.6476-0.2838C1.0516,14.7141,1.0508,14.7121,1.05,14.71c-0.1291-0.2441-0.0358-0.5467,0.2084-0.6757 C1.2845,14.0205,1.3118,14.009,1.34,14l4.85-2l-4.85-2C1.0758,9.9197,0.9267,9.6404,1.007,9.3762s0.3596-0.4133,0.6238-0.333 C1.6545,9.0504,1.6776,9.0594,1.7,9.07l5.8,2.41l5.8-2.41c0.2494-0.1185,0.5477-0.0124,0.6662,0.237 c0.1185,0.2494,0.0124,0.5477-0.237,0.6662C13.7068,9.9839,13.6837,9.9928,13.66,10L8.8,12l4.85,2 c0.2607,0.091,0.3983,0.3761,0.3074,0.6368C13.9523,14.6515,13.9465,14.6659,13.94,14.68z M12,4.23v0.45 c-0.0021,0.2129-0.0722,0.4196-0.2,0.59C11.2414,5.8883,10.6399,6.4664,10,7v1.16c0.0015,0.208-0.126,0.3951-0.32,0.47L7.52,9.5 H7.45L5.28,8.63C5.1016,8.5428,4.9917,8.3584,5,8.16V7C4.3528,6.4675,3.7446,5.8893,3.18,5.27C3.0593,5.0972,2.9963,4.8907,3,4.68 V4.23C3.1669,2.0117,4.8974,0.2307,7.11,0h0.36l0,0h0.39C10.0862,0.2131,11.8348,1.9997,12,4.23z M6,4c0-0.5523-0.4477-1-1-1 S4,3.4477,4,4s0.4477,1,1,1S6,4.5523,6,4z M7,7c0-0.2761-0.2239-0.5-0.5-0.5S6,6.7239,6,7v0.5C6,7.7761,6.2239,8,6.5,8 S7,7.7761,7,7.5V7z M9,7c0-0.2761-0.2239-0.5-0.5-0.5S8,6.7239,8,7v0.5C8,7.7761,8.2239,8,8.5,8S9,7.7761,9,7.5V7z M11,4 c0-0.5523-0.4477-1-1-1S9,3.4477,9,4s0.4477,1,1,1S11,4.5523,11,4z\"></path></svg>"

/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>defibrillator-11</title><path d=\"M1.42,4.7955C-0.2131,1.5291,3.9327-.6514,5.512,2.6149,7.0914-.6514,11.2371,1.5291,9.6039,4.7955c-0.0225.0377-.0483,0.0732-0.071,0.1108H8.3867L7.5586,3.252a0.65,0.65,0,0,0-1.1172,0L5,6.1338,4.5586,5.252A0.6243,0.6243,0,0,0,4,4.9063H1.4913C1.4685,4.8687,1.4427,4.8332,1.42,4.7955ZM8,6.1563a0.6243,0.6243,0,0,1-.5586-0.3457L7,4.9287,5.5586,7.8105a0.6241,0.6241,0,0,1-1.1172,0L3.6133,6.1563H2.3006a24.2269,24.2269,0,0,0,2.8973,3.449L5.2134,9.6208A0.44,0.44,0,0,0,5.835,9.6053a24.2289,24.2289,0,0,0,2.8905-3.449H8Z\"></path></svg>"

/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>defibrillator-15</title><path d=\"M1.55,6.3381C-0.8368,1.7416,5.18-1.3228,7.502,3.2737c2.3215-4.5965,8.3387-1.5322,5.9523,3.0644-0.0869.1671-.2028,0.3456-0.3114,0.5212H11.335L9.5205,4.1377A0.6252,0.6252,0,0,0,8.42,4.2524l-1.6484,4.12-1.33-1.33A0.6254,0.6254,0,0,0,5,6.8594H1.8611C1.7525,6.6837,1.6366,6.5052,1.55,6.3381ZM11,8.1094a0.6263,0.6263,0,0,1-.5205-0.2783L9.1387,5.82,7.58,9.7168a0.6245,0.6245,0,0,1-.4546.38A0.6047,0.6047,0,0,1,7,10.1094a0.6251,0.6251,0,0,1-.4419-0.1826L4.7412,8.1094H2.7358a42.67,42.67,0,0,0,4.46,4.6732,0.4642,0.4642,0,0,0,.6222,0,43.26,43.26,0,0,0,4.4505-4.6732H11Z\"></path></svg>"

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.48,6C4.857,6.0823,4.3088,6.4527,4,7c-0.46,1.21-0.14,3-0.82,3S2.7,8.49,2.5,7C2.2864,6.3547,2.0326,5.7235,1.74,5.11 C1.53,3.7,1,1.28,2.67,1S4.35,2.52,5.5,2.52S6.67,0.72,8.33,1s1.14,2.7,0.93,4.11C8.9674,5.7235,8.7136,6.3547,8.5,7 c-0.2,1.49,0,3-0.68,3S7.46,8.21,7,7C6.6912,6.4527,6.143,6.0823,5.52,6l0,0H5.48z\"></path></svg>"

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M4.36,14c-1,0-0.56-2.67-0.86-5c-0.1-0.76-1-1.49-1.12-2.06C2,5,1.39,1.44,3.66,1S6,3,7.54,3s1.57-2.36,3.85-2 s1.59,3.9,1.29,5.9c-0.1,0.45-1.1,1.48-1.18,2.06c-0.33,2.4,0.32,5-0.8,5c-0.93,0-1.32-2.72-2-4.5C8.43,8.63,8.06,8,7.54,8 C6,8,5.75,14,4.36,14z\"></path></svg>"

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9.5,5.87c0.0017-0.8174-0.6596-1.4813-1.477-1.483S6.5417,5.0466,6.54,5.864C6.5386,6.54,6.9955,7.131,7.65,7.3v0.42 c0,1.0245-0.8305,1.855-1.855,1.855S3.94,8.7445,3.94,7.72l0,0C3.9776,6.8275,4.3787,5.9893,5.05,5.4H5 c0.718-0.4684,1.1564-1.2628,1.17-2.12V1.79c0-0.613-0.4969-1.11-1.11-1.11c-0.0033,0-0.0067,0-0.01,0H4.5 c-0.2043,0-0.37,0.1657-0.37,0.37S4.2957,1.42,4.5,1.42h0.55c0.2043,0,0.37,0.1657,0.37,0.37v1.49l0,0 c0,1.0178-0.8222,1.8445-1.84,1.85V5.4l0,0V5.13C2.5583,5.1355,1.7255,4.3117,1.72,3.29c0-0.0033,0-0.0067,0-0.01l0,0V1.79 c0-0.2043,0.1657-0.37,0.37-0.37l0,0h0.52c0.2043,0,0.37-0.1657,0.3699-0.3701C2.9799,0.8456,2.8143,0.68,2.61,0.68H2.09 C1.4848,0.6909,0.9999,1.1847,1,1.79v1.49C0.9978,4.1241,1.4086,4.9158,2.1,5.4l0,0c0.6676,0.591,1.065,1.429,1.1,2.32 c0,1.4332,1.1618,2.595,2.595,2.595S8.39,9.1532,8.39,7.72V7.3C9.0424,7.1316,9.4986,6.5438,9.5,5.87z M8,6.61 c-0.4087,0-0.74-0.3313-0.74-0.74S7.5913,5.13,8,5.13s0.74,0.3313,0.74,0.74l0,0C8.74,6.2787,8.4087,6.61,8,6.61z\"></path></svg>"

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M5.5,7C4.1193,7,3,5.8807,3,4.5l0,0v-2C3,2.2239,3.2239,2,3.5,2H4c0.2761,0,0.5-0.2239,0.5-0.5S4.2761,1,4,1H3.5 C2.6716,1,2,1.6716,2,2.5v2c0.0013,1.1466,0.5658,2.2195,1.51,2.87l0,0C4.4131,8.1662,4.9514,9.297,5,10.5C5,12.433,6.567,14,8.5,14 s3.5-1.567,3.5-3.5V9.93c1.0695-0.2761,1.7126-1.367,1.4365-2.4365C13.1603,6.424,12.0695,5.7809,11,6.057 C9.9305,6.3332,9.2874,7.424,9.5635,8.4935C9.7454,9.198,10.2955,9.7481,11,9.93v0.57c0,1.3807-1.1193,2.5-2.5,2.5S6,11.8807,6,10.5 c0.0511-1.2045,0.5932-2.3356,1.5-3.13l0,0C8.4404,6.7172,9.001,5.6448,9,4.5v-2C9,1.6716,8.3284,1,7.5,1H7 C6.7239,1,6.5,1.2239,6.5,1.5S6.7239,2,7,2h0.5C7.7761,2,8,2.2239,8,2.5v2l0,0C8,5.8807,6.8807,7,5.5,7 M11.5,9 c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S12.0523,9,11.5,9z\"></path></svg>"

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg2\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"dog-park-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect4698\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccscsccccssccccccccccccscccsccscssccsscc\" d=\"M7.5,1 c0,0-0.3457,0.0371-0.5,0.5l-0.5,2l2,1.5H10c1,0,1-1,1-1L9.5,2.5C9,2,8.5,2,8,2V1.5C8,1.5,8,1,7.5,1z M2.5,2 c0,0-0.3534-0.0069-0.7227,0.1777S1,2.8333,1,3.5v0.9648C0.9996,4.4766,0.9996,4.4883,1,4.5V5v0.5C1,6.5,1,7,0.5,7C0.5,7,0,7,0,7.5 v2c0,0,0,0.5,0.5,0.5S1,9.5,1,9.5V8c0.3537,0,0.6906-0.1371,1-0.2988V9.5c0,0,0,0.5,0.5,0.5S3,9.5,3,9.5V7h3l0.6641,1.9922 C7,9.9999,7.5,10,7.5,10H8c0,0,0.5,0,0.5-0.5S8,9,8,9V6.5C8,5.6094,7.3678,5.2449,7,5L5.498,4H2V3.5 c0-0.3333,0.0919-0.3624,0.2227-0.4277C2.3534,3.0069,2.5,3,2.5,3C3.1762,3.0096,3.1762,1.9904,2.5,2z\"></path></svg>"

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" version=\"1.1\" id=\"svg2\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"dog-park-15.svg\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><metadata id=\"metadata13\"><rdf:RDF><cc:Work rdf:about><dc:format>image/svg+xml</dc:format><dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\"></dc><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id=\"defs11\"></defs><sodipodi:namedview pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1\" objecttolerance=\"10\" gridtolerance=\"10\" guidetolerance=\"10\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:window-width=\"1899\" inkscape:window-height=\"779\" id=\"namedview9\" showgrid=\"false\" inkscape:zoom=\"15.733333\" inkscape:cx=\"-1.1122881\" inkscape:cy=\"7.5\" inkscape:window-x=\"0\" inkscape:window-y=\"0\" inkscape:window-maximized=\"0\" inkscape:current-layer=\"svg2\"></sodipodi><g id=\"g3\"><path style=\"fill:#010101;\" d=\"M 10.300781 1.2207031 C 9.9144812 1.2207031 9.6 1.2 9.5 2 L 9.0996094 4.5214844 L 11.5 6.5 L 13.5 6.5 C 14.9 6.5 15 5.5410156 15 5.5410156 L 13.099609 3.3222656 C 12.399609 2.6222656 11.7 2.5 11 2.5 L 11 2 C 11 2 11.067481 1.2206031 10.300781 1.2207031 z M 4.75 1.5 C 4.75 1.5 3.7992187 1.5206031 3.1992188 1.7207031 C 2.5992187 1.9207031 2 2.6210938 2 3.6210938 L 2 7.5214844 C 2 9.2214844 1.3 9.5 1 9.5 C 1 9.5 0 9.5214844 0 10.521484 L 0 12.720703 C 0 12.720703 0.00078125 13.521484 0.80078125 13.521484 L 1 13.521484 L 1.5 13.521484 L 2 13.521484 L 2 13.021484 L 2 12.822266 C 2 12.422266 1.8 12.221094 1.5 12.121094 L 1.5 11.021484 C 2.5 11.021484 2.6 10.820703 3 10.720703 L 3.5507812 12.917969 C 3.6507813 13.217969 3.7507813 13.417578 4.0507812 13.517578 L 5.0507812 13.517578 L 6 13.5 L 6 12.699219 C 6 12.022819 5 12 5 12 L 5 9.5 L 8.5 9.5 L 9.1992188 12.121094 C 9.5992188 13.521094 10.5 13.5 10.5 13.5 L 11 13.5 L 12 13.5 L 12 12.699219 C 12 11.987419 11 12 11 12 L 11.099609 7.921875 L 8 5.5 L 3.5 5.5 L 3.5 3.5 C 3.5 3.1 3.7765 3.0053 4 3 C 4.4941 2.9882 4.75 3 4.75 3 C 5.1642 3 5.5 2.6642 5.5 2.25 C 5.5 1.8358 5.1642 1.5 4.75 1.5 z M 11.75 4 C 11.8881 4 12 4.1119 12 4.25 C 12 4.3881 11.8881 4.5 11.75 4.5 C 11.6119 4.5 11.5 4.3881 11.5 4.25 C 11.5 4.1119 11.6119 4 11.75 4 z \" id=\"path5\"></path></g></svg>"

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>drinking-water-11</title><path d=\"M5,11H3a0.51,0.51,0,0,1-.5-0.4L1,5.6A0.5,0.5,0,0,1,1.5,5h5A0.5,0.5,0,0,1,7,5.6l-1.49,5A0.51,0.51,0,0,1,5,11ZM2.76,8L5.22,8,5.89,6H2.11Z\"></path><path d=\"M4.5,0h0A1.5,1.5,0,0,0,3,1.51v2a0.5,0.5,0,0,0,.5.5h1A0.5,0.5,0,0,0,5,3.5v-1A0.5,0.5,0,0,1,5.5,2H10V0H4.5Z\"></path></svg>"

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>drinking-water-15</title><path d=\"M6,1A2,2,0,0,0,4,3V6.5a0.5,0.5,0,0,0,.5.5h2A0.5,0.5,0,0,0,7,6.5v-2A0.5,0.5,0,0,1,7.5,4H14V1H6Z\"></path><path d=\"M7,15H4a0.5,0.5,0,0,1-.48-0.38L2,8.62A0.5,0.5,0,0,1,2.5,8h6A0.5,0.5,0,0,1,9,8.62l-1.5,6A0.5,0.5,0,0,1,7,15ZM3.65,11l3.71,0L7.86,9H3.14Z\"></path></svg>"

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,2C4.6014,2.0766,3.7537,2.4494,3.09,3.06C3.0316,3.1262,2.9995,3.2117,3,3.3v3.32 C2.9889,6.8074,3.1318,6.9684,3.3193,6.9796C3.4115,6.985,3.5021,6.9527,3.57,6.89C4.1239,6.4637,4.8011,6.2286,5.5,6.22 C6.61,6.22,6.85,7,8,7c0.6869-0.0671,1.3313-0.3629,1.83-0.84C9.9401,6.0917,10.0051,5.9695,10,5.84V2.37 c0.0309-0.1908-0.0987-0.3705-0.2896-0.4014C9.6387,1.9569,9.5652,1.9679,9.5,2C9.0686,2.3529,8.5507,2.5842,8,2.67 C6.85,2.67,6.65,2,5.5,2z M1.5,1.5c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1S0.9477,1.5,1.5,1.5z M2,4.5v6 C2,10.7761,1.7761,11,1.5,11S1,10.7761,1,10.5v-6C1,4.2239,1.2239,4,1.5,4S2,4.2239,2,4.5z\"></path></svg>"

/***/ }),
/* 109 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M6.65,2C5.43,2,4.48,3.38,4.11,3.82C4.0365,3.9102,3.9975,4.0237,4,4.14v4.4C3.9884,8.7827,4.1758,8.9889,4.4185,9.0005 C4.528,9.0057,4.6355,8.9699,4.72,8.9c0.4665-0.6264,1.1589-1.0461,1.93-1.17C8.06,7.73,8.6,9,10.07,9 c0.9948-0.0976,1.9415-0.4756,2.73-1.09c0.1272-0.0934,0.2016-0.2422,0.2-0.4V2.45c0.0275-0.2414-0.1459-0.4595-0.3874-0.487 C12.5332,1.954,12.4527,1.9668,12.38,2c-0.6813,0.5212-1.4706,0.8834-2.31,1.06C8.6,3.08,8.12,2,6.65,2z M2.5,3 c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S3.0523,3,2.5,3z M3,4v9.48c0,0.2761-0.2239,0.5-0.5,0.5S2,13.7561,2,13.48V4 c0-0.2761,0.2239-0.5,0.5-0.5S3,3.7239,3,4z\"></path></svg>"

/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>emergency-phone-11</title><path d=\"M8.87,8.53a.73.73,0,0,0,0-1l-.74-.74a.73.73,0,0,0-1,0ZM4.27,3.97a.73.73,0,0,0,0-1l-.71-.71a.73.73,0,0,0-1,0ZM3.04,5.65,5.35,7.96a.37.37,0,0,0,.52,0l.44-.43L8.07,9.27A2.27,2.27,0,0,1,6.73,10h-1a1.345,1.345,0,0,1-1-.52L1.52,6.27a1.345,1.345,0,0,1-.52-1v-1a2.27,2.27,0,0,1,.73-1.34L3.47,4.69l-.43.44a.37.37,0,0,0,0,.52M8,2.5H6.5v1H8V5H9V3.5h1.5v-1H9V1H8Z\"></path></svg>"

/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>emergency-phone-15</title><path d=\"M7.875,11.49a.51.51,0,0,0,.72,0l.72-.72,2.18,2.16-.37.37a2.24,2.24,0,0,1-1.44.7H8.24a2.24,2.24,0,0,1-1.45-.7L1.72,8.23A2.24,2.24,0,0,1,1,6.78V5.33a2.24,2.24,0,0,1,.72-1.45l.36-.36L4.26,5.69l-.73.73a.51.51,0,0,0,0,.72Zm4.72.38a1,1,0,0,0,.036-1.414h0l-.036-.036-.72-.72a1,1,0,0,0-1.414-.036h0l-.036.036ZM5.315,4.62a1,1,0,0,0,.036-1.414h0L4.595,2.45a1,1,0,0,0-1.414-.036h0L3.14,2.45ZM10,2V4H8V5h2V7h1V5h2V4H11V2Z\"></path></svg>"

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M4,2.25C4,1.8358,4.3358,1.5,4.75,1.5S5.5,1.8358,5.5,2.25S5.1642,3,4.75,3S4,2.6642,4,2.25z M9.27,4H7.88 C7.6856,3.998,7.4985,4.0736,7.36,4.21l-4,4C3.224,8.344,3.0409,8.4194,2.85,8.42H1.73C1.3268,8.42,1,8.7468,1,9.15l0,0 c0,0.4032,0.3268,0.73,0.73,0.73h1.89c0.1909-0.0006,0.374-0.076,0.51-0.21l4-4C8.2644,5.5576,8.4348,5.4972,8.61,5.5h0.66 C9.6732,5.5,10,5.1732,10,4.77l0,0c0.0221-0.4026-0.2863-0.7468-0.6889-0.7689C9.2974,4.0003,9.2837,4,9.27,4z M4.75,3.5 C4.3358,3.5,4,3.8358,4,4.25V6l1.5-1.5V4.25C5.5,3.8358,5.1642,3.5,4.75,3.5z\"></path></svg>"

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M7,6.5v-1c0-0.5523-0.4477-1-1-1s-1,0.4477-1,1v3L7,6.5z M4.65,10.56L5,3c0-0.5523,0.4477-1,1-1s1,0.4477,1,1S6.5523,4,6,4 S5,3.5523,5,3L4.65,10.56z\"></path><path d=\"M14,6L14,6c0,0.5523-0.4477,1-1,1h-1.58c-0.2658-0.0015-0.5213,0.1028-0.71,0.29l-5.42,5.42 c-0.1863,0.1847-0.4377,0.2889-0.7,0.29H2c-0.5523,0-1-0.4477-1-1l0,0c0-0.5523,0.4477-1,1-1h1.59 c0.2623-0.0011,0.5137-0.1053,0.7-0.29l5.42-5.42C9.8987,5.1028,10.1542,4.9985,10.42,5H13C13.5523,5,14,5.4477,14,6z\"></path></svg>"

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>entrance-alt1-11</title><path d=\"M4.793,7.263A.5.5,0,0,0,5.5,7.97L7.743,5.677a.25.25,0,0,0,0-.354h0L5.489,3.042a.5.5,0,0,0-.707.707L6,5H1.5a.5.5,0,0,0,0,1H6ZM9,1H4.5a.5.5,0,0,0,0,1h4a.5.5,0,0,1,.5.5v6a.5.5,0,0,1-.5.5h-4a.5.5,0,0,0,0,1H9a1,1,0,0,0,1-1V2A1,1,0,0,0,9,1Z\"></path></svg>"

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>entrance-alt1-15</title><path d=\"M6.554,9.639a.5.5,0,0,0,.707.707L9.928,7.669a.25.25,0,0,0,0-.354h0L7.261,4.639a.5.5,0,0,0-.707.707L8.2,7H1.5a.5.5,0,0,0,0,1H8.2ZM12,1H5.5a.5.5,0,0,0,0,1h6a.5.5,0,0,1,.5.5v10a.5.5,0,0,1-.5.5H5.25a.5.5,0,0,0,0,1H12a1,1,0,0,0,1-1V2A1,1,0,0,0,12,1Z\"></path></svg>"

/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>farm-11</title><path d=\"M6,5L4,4,2,5,1,7v3l1.5,0V8h3v2L7,10V7ZM5,7H3V5.5H5V7Z\" fill=\"#231f20\"></path><path d=\"M10,2A1,1,0,0,0,8,2v8h2V2Z\" fill=\"#010101\"></path></svg>"

/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>farm-15</title><path d=\"M8,7L5,5,2,7,1,9v4H3V11H7v2H9V9ZM6,9H4V7H6V9Zm8,4H11V3.5a1.5,1.5,0,0,1,3,0V13Z\" fill=\"#010101\"></path></svg>"

/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,8L10,8c0,1.1046-0.8954,2-2,2H3c-1.1046,0-2-0.8954-2-2H10z M10,5H1C0.4477,5,0,5.4477,0,6s0.4477,1,1,1h9 c0.5523,0,1-0.4477,1-1S10.5523,5,10,5z M8.55,1H2.46C1.6537,1,1,1.6536,1,2.46c0,0.0033,0,0.0067,0,0.01V4h9V2.47 C10.0055,1.6637,9.3564,1.0055,8.55,1C8.55,1,8.55,1,8.55,1z M3.55,3C3.2752,3.0276,3.0301,2.8273,3.0025,2.5525 C2.9749,2.2777,3.1753,2.0326,3.45,2.005c0.2748-0.0276,0.5199,0.1727,0.5475,0.4475C3.9991,2.4683,3.9999,2.4841,4,2.5 C4,2.7761,3.7761,3,3.5,3H3.55z M7.55,3C7.2752,3.0276,7.0301,2.8273,7.0025,2.5525S7.1753,2.0326,7.45,2.005 c0.2748-0.0276,0.5199,0.1727,0.5475,0.4475C7.9991,2.4683,7.9999,2.4841,8,2.5C8,2.7761,7.7761,3,7.5,3H7.55z\"></path></svg>"

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,8c0,0.5523-0.4477,1-1,1H2C1.4477,9,1,8.5523,1,8s0.4477-1,1-1h11C13.5523,7,14,7.4477,14,8z M3.5,10H2 c0,1.6569,1.3431,3,3,3h5c1.6569,0,3-1.3431,3-3H3.5z M3,6H2V4c0-1.1046,0.8954-2,2-2h7c1.1046,0,2,0.8954,2,2v2H3z M11,4.5 C11,4.7761,11.2239,5,11.5,5S12,4.7761,12,4.5S11.7761,4,11.5,4S11,4.2239,11,4.5z M9,3.5C9,3.7761,9.2239,4,9.5,4S10,3.7761,10,3.5 S9.7761,3,9.5,3S9,3.2239,9,3.5z M7,4.5C7,4.7761,7.2239,5,7.5,5S8,4.7761,8,4.5S7.7761,4,7.5,4S7,4.2239,7,4.5z M5,3.5 C5,3.7761,5.2239,4,5.5,4S6,3.7761,6,3.5S5.7761,3,5.5,3S5,3.2239,5,3.5z M3,4.5C3,4.7761,3.2239,5,3.5,5S4,4.7761,4,4.5 S3.7761,4,3.5,4S3,4.2239,3,4.5z\"></path></svg>"

/***/ }),
/* 120 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>fence-11</title><path d=\"M9.5,7H9V5h.5a.5.5,0,0,0,0-1H9V3l-.278-.555a.254.254,0,0,0-.443,0L8,3V4H7V3l-.278-.555a.254.254,0,0,0-.443,0L6,3V4H5V3l-.278-.555a.254.254,0,0,0-.443,0L4,3V4H3V3l-.278-.555a.254.254,0,0,0-.443,0L2,3V4H1.5a.5.5,0,0,0,0,1H2V7H1.5a.5.5,0,0,0,0,1H2v.5a.5.5,0,0,0,1,0V8H4v.5a.5.5,0,0,0,1,0V8H6v.5a.5.5,0,0,0,1,0V8H8v.5a.5.5,0,0,0,1,0V8h.5a.5.5,0,0,0,0-1ZM3,7V5H4V7ZM5,7V5H6V7ZM7,7V5H8V7Z\"></path></svg>"

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>fence-15</title><path d=\"M13.5,10H13V7h.5a.5.5,0,0,0,0-1H13V4l-.286-.573a.249.249,0,0,0-.424-.006L12,4V6H11V4l-.286-.573a.249.249,0,0,0-.424-.006L10,4V6H9V4l-.286-.573a.249.249,0,0,0-.424-.006L8,4V6H7V4l-.286-.573a.249.249,0,0,0-.424-.006L6,4V6H5V4l-.286-.573a.249.249,0,0,0-.424-.006L4,4V6H3V4l-.286-.573a.249.249,0,0,0-.424-.006L2,4V6H1.5a.5.5,0,0,0,0,1H2v3H1.5a.5.5,0,0,0,0,1H2v1.5a.5.5,0,0,0,1,0V11H4v1.5a.5.5,0,0,0,1,0V11H6v1.5a.5.5,0,0,0,1,0V11H8v1.5a.5.5,0,0,0,1,0V11h1v1.5a.5.5,0,0,0,1,0V11h1v1.5a.5.5,0,0,0,1,0V11h.5a.5.5,0,0,0,0-1ZM3,10V7H4v3Zm2,0V7H6v3Zm2,0V7H8v3Zm2,0V7h1v3Zm2,0V7h1v3Z\"></path></svg>"

/***/ }),
/* 122 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M11,9.45v0.77c-0.2167,0.0089-0.4213,0.1022-0.57,0.26c-0.2266,0.2196-0.5054,0.3779-0.81,0.46 c-0.5149,0.1365-1.0639,0.0296-1.49-0.29L7.8,10.38c-0.2669-0.2313-0.6631-0.2313-0.93,0c-0.12,0.09-0.23,0.2-0.35,0.28 c-0.6333,0.452-1.4889,0.4316-2.1-0.05l-0.33-0.27c-0.2457-0.185-0.5843-0.185-0.83,0c-0.16,0.11-0.3,0.25-0.46,0.36 c-0.601,0.4185-1.399,0.4185-2,0l-0.26-0.21C0.4009,10.3346,0.2078,10.238,0,10.22V9.45c0.2162-0.0231,0.4345,0.015,0.63,0.11 C0.8642,9.6894,1.0882,9.8365,1.3,10c0.1841,0.1814,0.4478,0.2567,0.7,0.2c0.093-0.0244,0.181-0.0651,0.26-0.12 c0.13-0.09,0.25-0.2,0.38-0.3c0.616-0.4518,1.454-0.4518,2.07,0l0.4,0.31c0.2416,0.1752,0.5684,0.1752,0.81,0l0.4-0.31 c0.6181-0.4567,1.4619-0.4567,2.08,0l0.38,0.3c0.2437,0.18,0.5763,0.18,0.82,0L10,9.77C10.2882,9.5546,10.6403,9.4419,11,9.45z M2.61,7.61L1,5l1-0.91V1.15C2.0163,0.5061,2.546-0.0057,3.19,0h4.62C8.454-0.0057,8.9837,0.5061,9,1.15v2.94L10,5L8.39,7.62 C7.5729,7.0755,6.4952,7.1324,5.74,7.76L5.5,8l0,0L5.3,7.82C4.5536,7.1506,3.4512,7.0646,2.61,7.61z M2.81,3.61L5.5,2l2.69,1.63 V1.15c0.0114-0.1985-0.1403-0.3686-0.3388-0.38c-0.0137-0.0008-0.0275-0.0008-0.0412,0H3.19 C2.9915,0.7586,2.8214,0.9103,2.81,1.1088c-0.0008,0.0137-0.0008,0.0275,0,0.0412v2.48V3.61z\"></path></svg>"

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M5.33,11c0.6745,0.009,1.3262,0.245,1.85,0.67l0.26,0.23h0.05l0.31-0.28c0.9817-0.8115,2.379-0.8846,3.44-0.18L13.5,7L12,6 V2.45c-0.0466-0.8-0.6989-1.4305-1.5-1.45H10c0.0343-0.518-0.3579-0.9657-0.8759-1C9.0828-0.0027,9.0413-0.0027,9,0H6 C5.482-0.0343,5.0343,0.3579,5,0.8759C4.9973,0.9172,4.9973,0.9587,5,1H4.5C3.6989,1.0195,3.0466,1.65,3,2.45V6L1.5,7l2.25,4.53 C4.2143,11.2041,4.7631,11.02,5.33,11z M4,2.45c0.0105-0.2594,0.2293-0.4611,0.4886-0.4506C4.4924,1.9996,4.4962,1.9998,4.5,2h6 c0.259-0.0171,0.4829,0.1789,0.5,0.4379c0.0014,0.0207,0.0014,0.0414,0,0.0621v3l-3.5-2L4,5.45C4,5.45,4,2.45,4,2.45z M14,13v1 c-0.2626,0.0194-0.5069,0.1416-0.68,0.34c-0.2717,0.2883-0.6178,0.4959-1,0.6c-0.6147,0.1815-1.2795,0.0425-1.77-0.37l-0.39-0.35 c-0.3043-0.3026-0.7957-0.3026-1.1,0c-0.14,0.12-0.27,0.25-0.42,0.37c-0.7328,0.5856-1.7814,0.556-2.48-0.07l-0.39-0.35 c-0.2864-0.2502-0.7136-0.2502-1,0c-0.19,0.15-0.36,0.32-0.55,0.47c-0.7043,0.5215-1.6732,0.4968-2.35-0.06l-0.31-0.27 C1.4153,14.1443,1.2172,14.0346,1,14v-1c0.2585-0.032,0.5205,0.0169,0.75,0.14c0.2782,0.1722,0.5424,0.3661,0.79,0.58 c0.2051,0.2235,0.5147,0.319,0.81,0.25c0.1125-0.0333,0.2177-0.0876,0.31-0.16c0.16-0.12,0.29-0.26,0.45-0.39 c0.7106-0.5888,1.7394-0.5888,2.45,0c0.16,0.13,0.31,0.28,0.47,0.41c0.2864,0.2502,0.7136,0.2502,1,0c0.16-0.13,0.31-0.28,0.47-0.41 c0.7123-0.5943,1.7477-0.5943,2.46,0c0.15,0.13,0.29,0.27,0.44,0.39c0.2864,0.2502,0.7136,0.2502,1,0l0.47-0.41 C13.1895,13.1408,13.5886,12.9995,14,13z\"></path></svg>"

/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"fire-station-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path10041-3-2\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccsssccccsssc\" d=\"M5.5,0l-2,4L2,2 C1.595,2.7121,0,4.1667,0,6c0,2.7001,2.7999,5,5.5,5S11,8.7001,11,6c0-1.8333-1.595-3.2879-2-4L7.5,4L5.5,0z M5.5,5.5 c0,0,2,1.585,2,3c0,0.6111-0.7778,1.2778-2,1.2778s-2-0.6667-2-1.2778C3.5,7.1336,5.5,5.5,5.5,5.5z\"></path></svg>"

/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"fire-station-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path10041-3-3\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccsssccccsssc\" d=\"M7.5,0.5L5,4.5l-1.5-2 C2.9452,3.4753,0.8036,5.7924,0.8036,8.3036C0.8036,12.002,3.8017,15,7.5,15s6.6964-2.998,6.6964-6.6964 c0-2.5112-2.1416-4.8283-2.6964-5.8036l-1.5,2L7.5,0.5z M7.5,7c0,0,2.5,2.5618,2.5,4.5c0,0.8371-0.8259,2-2.5,2S5,12.3371,5,11.5 C5,9.6283,7.5,7,7.5,7z\"></path></svg>"

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>florist-11</title><path d=\"M1,2.5a3.1,3.1,0,0,0-1-2A3.9,3.9,0,0,1,2,2l.526-2,.437,2a3.9,3.9,0,0,1,2-1.5,3.1,3.1,0,0,0-1,2A1.307,1.307,0,0,1,2.662,4H2.409A1.36,1.36,0,0,1,1,2.5ZM9,8.982l2-.437L9,8.018a3.9,3.9,0,0,0,1.5-2,3.1,3.1,0,0,1-2,1A1.36,1.36,0,0,0,7,8.427V8.68a1.307,1.307,0,0,0,1.5,1.3,3.1,3.1,0,0,1,2,1A3.9,3.9,0,0,0,9,8.982ZM3.4,7.9,6.113,5.181a1.382,1.382,0,0,1-.436-.271L3.044,7.543l-.279-.279A11.045,11.045,0,0,0,3,4.5H2.5a15.272,15.272,0,0,1-.161,2.338L2.251,6.75a.247.247,0,0,0-.4.071L.059,10.657a.27.27,0,0,0-.026.108.25.25,0,0,0,.25.25.27.27,0,0,0,.089-.021L.378,11l3.8-1.85a.247.247,0,0,0,.068-.4l-.063-.063A12.768,12.768,0,0,1,6.5,8.5V8a10.381,10.381,0,0,0-2.724.275ZM7.243,2.522a.75.75,0,0,1,.018-1.5.739.739,0,0,1,.561.266.75.75,0,1,1,1.383,0,.739.739,0,0,1,.561-.266.75.75,0,0,1,.014,1.5.748.748,0,1,1-.561,1.26A.728.728,0,0,1,9.263,4a.75.75,0,1,1-1.5,0,.737.737,0,0,1,.05-.238.739.739,0,0,1-.558.26.75.75,0,0,1-.012-1.5ZM7.761,2.5a.75.75,0,1,0,.75-.75A.75.75,0,0,0,7.761,2.5Z\"></path></svg>"

/***/ }),
/* 127 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>florist-15</title><path d=\"M1.5,1A2.7,2.7,0,0,1,4,3l.5-3L5,3A2.7,2.7,0,0,1,7.5,1c-.2.03-1,.26-1,2v.083A1.959,1.959,0,0,1,4.5,5H4.417A1.959,1.959,0,0,1,2.5,3C2.5,1.261,1.7,1.03,1.5,1ZM12.012,11l3-.5-3-.5A2.686,2.686,0,0,0,14,7.5c-.03.2-.248,1-1.988,1a2,2,0,0,0,0,4c1.739,0,1.958.8,1.988,1A2.686,2.686,0,0,0,12.012,11ZM9.688,5.548a1,1,0,0,1,0-2,1,1,0,0,1,0-2,.986.986,0,0,1,.852.507l.023-.012a.978.978,0,0,1-.116-.444,1,1,0,1,1,2,0,.978.978,0,0,1-.116.444l.019.01a.986.986,0,0,1,.85-.5,1,1,0,0,1,.025,2,1,1,0,0,1-.025,2,.986.986,0,0,1-.85-.5l-.016.009a.978.978,0,0,1,.113.44,1,1,0,0,1-2,0,.978.978,0,0,1,.113-.44l-.02-.011a.986.986,0,0,1-.852.507Zm.71-1.995A1.051,1.051,0,1,0,11.449,2.5,1.051,1.051,0,0,0,10.4,3.553v0ZM4.946,11.444l-.516-.515L8.892,6.475A1.746,1.746,0,0,1,8.44,6.22L4.076,10.575l-.519-.518A16.051,16.051,0,0,0,4.912,6a3.373,3.373,0,0,1-.412.035c-.041,0-.073-.008-.112-.01A16.953,16.953,0,0,1,3.131,9.631L2.76,9.26a.246.246,0,0,0-.4.079L.231,14.445a.287.287,0,0,0-.016.089.25.25,0,0,0,.25.25.289.289,0,0,0,.1-.019l5.1-2.124a.246.246,0,0,0,.079-.4l-.372-.372a16.874,16.874,0,0,1,3.612-1.256c0-.059-.015-.106-.015-.166A3.349,3.349,0,0,1,9,10.089,16.076,16.076,0,0,0,4.946,11.444Z\"></path></svg>"

/***/ }),
/* 128 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9.5,3H9V1.5l0,0C9,1.2239,8.7761,1,8.5,1S8,1.2239,8,1.5l0,0V3c0,0.5523,0.4477,1,1,1v4.25C9,8.3881,8.8881,8.5,8.75,8.5 S8.5,8.3881,8.5,8.25V6.5C8.5,5.6716,7.8284,5,7,5V2c0-0.5523-0.4477-1-1-1H2C1.4477,1,1,1.4477,1,2v7c0,0.5523,0.4477,1,1,1h4 c0.5523,0,1-0.4477,1-1V6c0.2761,0,0.5,0.2239,0.5,0.5v1.75c0,0.6904,0.5596,1.25,1.25,1.25S10,8.9404,10,8.25V3.5 C10,3.2239,9.7761,3,9.5,3z M6,4.5C6.0056,4.7706,5.7908,4.9944,5.5202,5C5.5201,5,5.5201,5,5.52,5h-3 C2.2384,5.0056,2.0056,4.7818,2,4.5002C2,4.5001,2,4.5001,2,4.5l0,0V3c0-0.2761,0.2239-0.5,0.5-0.5h3C5.7761,2.5,6,2.7239,6,3V4.5z\"></path></svg>"

/***/ }),
/* 129 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13,6L13,6v5.5c0,0.2761-0.2239,0.5-0.5,0.5S12,11.7761,12,11.5v-2C12,8.6716,11.3284,8,10.5,8H9V2c0-0.5523-0.4477-1-1-1H2 C1.4477,1,1,1.4477,1,2v11c0,0.5523,0.4477,1,1,1h6c0.5523,0,1-0.4477,1-1V9h1.5C10.7761,9,11,9.2239,11,9.5v2 c0,0.8284,0.6716,1.5,1.5,1.5s1.5-0.6716,1.5-1.5V5c0-0.5523-0.4477-1-1-1l0,0V2.49C12.9946,2.2178,12.7723,1.9999,12.5,2 c-0.2816,0.0047-0.5062,0.2367-0.5015,0.5184C11.9987,2.5289,11.9992,2.5395,12,2.55V5C12,5.5523,12.4477,6,13,6s1-0.4477,1-1 s-0.4477-1-1-1 M8,6.5C8,6.7761,7.7761,7,7.5,7h-5C2.2239,7,2,6.7761,2,6.5v-3C2,3.2239,2.2239,3,2.5,3h5C7.7761,3,8,3.2239,8,3.5 V6.5z\"></path></svg>"

/***/ }),
/* 130 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>gaming</title><path d=\"M9.715,5.8a2.046,2.046,0,0,0-2-1.8h-1.7V2.5c0-.2.2-.5.4-.5h2.1a.472.472,0,0,0,.5-.5.472.472,0,0,0-.5-.5h-2a1.453,1.453,0,0,0-1.5,1.4V4h-1.8a2.046,2.046,0,0,0-2,1.8l-.2,2.8a.991.991,0,0,0,.8,1.1,1.613,1.613,0,0,0,.9-.3L4.115,8h2.8l1.4,1.4a1.071,1.071,0,0,0,1.4.1,1.613,1.613,0,0,0,.3-.9ZM4.015,7h-2V6a.945.945,0,0,1,1-1h1Zm5,0h-2V5h1a1,1,0,0,1,1,1Z\"></path></svg>"

/***/ }),
/* 131 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><title>gaming</title><path d=\"M13.1,12.5c-0.6,0.3-1.4,0.1-1.8-0.5l-1.1-1.4H4.8L3.7,12l0,0c-0.5,0.7-1.4,0.8-2.1,0.3c-0.5-0.4-0.7-1-0.6-1.5l0.7-3.7l0,0 C1.9,5.9,3,5,4.2,5v0H7V3.5C7,2.7,7.6,2,8.4,2h3.1C11.8,2,12,2.2,12,2.5S11.8,3,11.5,3h-3C8.2,3,8,3.2,8,3.4c0,0,0,0.1,0,0.1V5h2.8 v0c1.2,0,2.3,0.9,2.5,2.1l0,0l0.7,3.7l0,0C14.1,11.5,13.8,12.2,13.1,12.5z M6,7.5C6,6.7,5.3,6,4.5,6S3,6.7,3,7.5S3.7,9,4.5,9 S6,8.3,6,7.5z M12,7.5C12,7.2,11.8,7,11.5,7H11V6.5C11,6.2,10.8,6,10.5,6S10,6.2,10,6.5V7H9.5C9.2,7,9,7.2,9,7.5S9.2,8,9.5,8H10v0.5 C10,8.8,10.2,9,10.5,9S11,8.8,11,8.5V8h0.5C11.8,8,12,7.8,12,7.5z\"></path></svg>"

/***/ }),
/* 132 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,6c0.0043,2.2091-1.783,4.0035-3.9922,4.0078C5.9218,10.008,5.8358,10.0054,5.75,10 c-2.2048,0.1381-4.1041-1.5374-4.2422-3.7422C1.5024,6.172,1.4998,6.086,1.5,6c1.6411-0.1206,3.1886,0.7762,3.9,2.26V5h-2 C2.9085,5.0055,2.5056,4.6116,2.5001,4.1201C2.5,4.1167,2.5,4.1134,2.5,4.11V1.84C2.492,1.6469,2.6421,1.4838,2.8352,1.4758 C2.9567,1.4708,3.0721,1.5292,3.14,1.63L4.28,3l1.17-2.33c0.0996-0.1657,0.3146-0.2193,0.4803-0.1197 C5.9794,0.5798,6.0205,0.6209,6.05,0.67L7.22,3l1.13-1.38c0.0982-0.1665,0.3128-0.2219,0.4793-0.1237 C8.946,1.5651,9.0125,1.6951,9,1.83v2.28C9,4.6015,8.6016,5,8.1101,5.0001C8.1067,5.0001,8.1034,5,8.1,5h-2v3.26 C6.8114,6.7762,8.3589,5.8794,10,6z\"></path></svg>"

/***/ }),
/* 133 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13,8c0,3.31-2.19,6-5.5,6S2,11.31,2,8c2.2643,0.0191,4.2694,1.4667,5,3.61V7H4.5C3.6716,7,3,6.3284,3,5.5v-3 C3,2.2239,3.2239,2,3.5,2c0.1574,0,0.3056,0.0741,0.4,0.2l1.53,2l1.65-3c0.1498-0.232,0.4593-0.2985,0.6913-0.1487 C7.8308,1.0898,7.8815,1.1404,7.92,1.2l1.65,3l1.53-2c0.1657-0.2209,0.4791-0.2657,0.7-0.1C11.9259,2.1944,12,2.3426,12,2.5v3 C12,6.3284,11.3284,7,10.5,7H8v4.61C8.7306,9.4667,10.7357,8.0191,13,8z\"></path></svg>"

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>garden-center-11</title><path d=\"M10.875,5.1642l-0.007-.008-0.029-.029-0.971-.971A0.5,0.5,0,0,0,9,4.4952V5.6429L7,7.6458V3A2,2,0,0,0,3,3,2,2,0,0,0,3,7V8A1,1,0,0,0,4,9H6a0.9843,0.9843,0,0,0,.8328-0.48L9.3606,5.9893H10.422A0.5,0.5,0,0,0,10.875,5.1642ZM1.5,5A1.5,1.5,0,0,1,3,3.5v3A1.5,1.5,0,0,1,1.5,5Zm2-2a1.5,1.5,0,0,1,3,0h-3Z\"></path></svg>"

/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = "<svg viewBox=\"0 0 15 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M4,5L4,4.5C4,3.12 5.12,2 6.5,2C7.88,2 9,3.12 9,4.5L9,10.293L11.365,7.928L11.018,6.633C11.018,6.631 11.017,6.629 11.017,6.627L11.016,6.627L11.016,6.627C10.973,6.461 11.016,6.276 11.147,6.146C11.342,5.951 11.659,5.951 11.854,6.146L13.854,8.146C14.049,8.341 14.049,8.658 13.854,8.853C13.724,8.983 13.541,9.027 13.375,8.984C13.375,8.984 13.375,8.984 13.375,8.984C13.372,8.983 13.369,8.982 13.365,8.981L12.072,8.635L9,11.707L9,12C9,12.552 8.552,13 8,13L5,13C4.448,13 4,12.552 4,12L4,11.536L1.732,9.268C0.757,8.292 0.757,6.708 1.732,5.732C2.22,5.244 2.86,5 3.5,5L3.5,5L4,5ZM4,6L3.5,6L3.5,6C3.116,6 2.732,6.147 2.439,6.439C1.854,7.025 1.854,7.975 2.439,8.561L4,10.121L4,6ZM8,5L8,4.5C8,3.672 7.328,3 6.5,3C5.672,3 5,3.672 5,4.5L5,5L8,5Z\" style=\"fill:black;\"></path></svg>"

/***/ }),
/* 136 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M0,5h4.5v1H0V5z M1,9.79C1,10.4583,1.5417,11,2.21,11c0.0033,0,0.0067,0,0.01,0h2.3V7H1V9.79z M7.64,4H3.36 C2.6675,4.0686,2.0505,3.5629,1.9819,2.8704C1.9696,2.7467,1.9757,2.6219,2,2.5C1.9503,1.7229,2.5399,1.0526,3.3171,1.0028 C3.3513,1.0006,3.3857,0.9997,3.42,1c1.0141-0.0115,1.8944,0.6969,2.1,1.69C5.7292,1.699,6.6072,0.9924,7.62,1 c0.7893,0.026,1.4081,0.687,1.3821,1.4763C9.0016,2.4909,9.0009,2.5055,9,2.52c0.1185,0.6913-0.3458,1.3478-1.0371,1.4664 C7.8563,4.0046,7.7478,4.0092,7.64,4z M4.82,3.25c0.0388-0.7888-0.5692-1.4597-1.358-1.4986C3.448,1.7508,3.434,1.7503,3.42,1.75 C3.0447,1.7369,2.7298,2.0306,2.7168,2.4059C2.7157,2.4373,2.7167,2.4688,2.72,2.5C2.6811,2.8735,2.9524,3.2079,3.3259,3.2468 C3.3572,3.25,3.3886,3.2511,3.42,3.25H4.82z M7.62,3.25c0.3753,0.0131,0.6902-0.2806,0.7032-0.6559 c0.0011-0.0314,0-0.0628-0.0032-0.0941c0.0221-0.3915-0.2773-0.7268-0.6688-0.7489C7.6408,1.7505,7.6304,1.7501,7.62,1.75 C6.8304,1.7656,6.2029,2.4184,6.2186,3.208C6.2188,3.222,6.2193,3.236,6.22,3.25H7.62z M6.52,5v1H11V5H6.52z M6.52,11h2.29 c0.6604-0.0109,1.1901-0.5495,1.19-1.21V7H6.52V11z\"></path></svg>"

/***/ }),
/* 137 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M6.5,5v2H0V5H6.5z M8.5,5v2H15V5H8.5z M1,8v4.5C1,13.3284,1.6716,14,2.5,14h4V8H1z M8.5,8v6h4c0.8284,0,1.5-0.6716,1.5-1.5 V8H8.5z M10.5,0c-1.4033-0.0444-2.6497,0.8904-3,2.25C7.1497,0.8904,5.9033-0.0444,4.5,0c-1.0709-0.0337-1.9663,0.8072-2,1.8781 C2.4987,1.9187,2.4987,1.9594,2.5,2C2.3443,2.9427,2.9822,3.8331,3.9249,3.9888C4.0853,4.0153,4.2486,4.0191,4.41,4h6.13 c0.9548,0.1497,1.8503-0.5029,2-1.4577c0.0282-0.1797,0.0282-0.3626,0-0.5423c0.0002-1.1046-0.895-2.0002-1.9996-2.0004 C10.5269-0.0004,10.5135-0.0003,10.5,0z M4.5,3c-0.506,0.0463-0.9537-0.3264-1-0.8323C3.4949,2.1119,3.4949,2.0558,3.5,2 C3.4537,1.494,3.8264,1.0463,4.3323,1C4.3881,0.9949,4.4442,0.9949,4.5,1c1.1046,0,2,0.8954,2,2H4.5z M10.5,3h-2 c0-1.1046,0.8954-2,2-2c0.5523,0,1,0.4477,1,1c0.0463,0.506-0.3264,0.9537-0.8323,1C10.6119,3.0051,10.5558,3.0051,10.5,3z\"></path></svg>"

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"golf-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path11685\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssccssccscccccsccsccssssssssss\" d=\"M4.0492,0.638 C3.5323,1.1814,4.2729,1.813,4.7284,1.3132l0.4953-0.5434l2.3326,1.3937L3.3063,4.5C3.0126,4.6615,2.9648,4.9407,3.0724,5.2212 l0.8886,2.3165l-0.9355,2.8046C2.8974,10.7268,3.1975,10.991,3.5001,11c0.1954,0.0058,0.3919-0.093,0.4747-0.3413l0.9199-2.7636 l0.8535-0.2832L6,8.1172V10.5c0,0,0,0.5,0.5,0.5S7,10.5,7,10.5V8.1172C7,8,6.9893,7.8618,6.9358,7.7548L5.6546,4.415l2.5528-1.4035 c0.1868-0.0802,0.2901-0.2535,0.2901-0.5115c0-0.2259-0.2177-0.413-0.4564-0.5556L4.9047,0.0706 c-0.1595-0.0953-0.2749-0.043-0.3226,0.0071L4.0492,0.638z M3,2.0002c-0.5523,0-1,0.4477-1,1s0.4477,1,1,1s1-0.4477,1-1 S3.5523,2.0002,3,2.0002z\"></path></svg>"

/***/ }),
/* 139 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"golf-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path11758\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccccccccscccccssccsssss\" style=\"fill:#010101;\" d=\" M3.3999,1.1c0,0.1,0,0.2,0,0.2c0,0.4,0.3,0.7,0.7,0.7c0.3,0,0.5-0.2,0.6-0.5l0,0L4.9,1l5.6,2.3L6.6,6C6.2,6.3,6.2,6.7,6.3,7.1 l0.9,2.1l-1.3,3.9C5.7,13.6,6.1,14,6.5,14c0.3,0,0.5-0.1,0.6-0.5l1.4-4l0.1,0.3v3.5c0,0,0,0.7,0.7,0.7s0.7-0.7,0.7-0.7V10 c0-0.2,0-0.3-0.1-0.5L8.5,6.1l2.7-1.9c0.2-0.2,0.4-0.3,0.4-0.6s-0.2-0.5-0.4-0.6L4,0.1c-0.0878,0-0.118,0.0179-0.2001,0.1 L3.3999,1.1z M5.5,3C4.7,3,4,3.7,4,4.5S4.7,6,5.5,6S7,5.3,7,4.5S6.2999,3,5.5,3z\"></path></svg>"

/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"grocery-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect7842-7\" d=\"M9.75,1.5C9.7464,1.4999,9.4324,1.4942,9.1191,1.6875C8.8041,1.8819,8.5,2.3013,8.5,3H8.2539H1l0.75,3.5 C1.8571,7,2.5,7,2.5,7h6c0,0-0.0027,0.2466-0.1523,0.4961S7.9306,8,7.25,8H2C1.6619,7.9952,1.6619,8.5048,2,8.5h1.25h4 c0.8194,0,1.302-0.3705,1.5273-0.7461C9.0027,7.3784,9,7,9,7V3c0-0.567,0.1959-0.7725,0.3809-0.8867 C9.5659,1.9991,9.7461,2,9.7461,2C9.7474,2,9.7487,2,9.75,2h0.5c0.3381,0.0048,0.3381-0.5048,0-0.5H9.7539H9.75z M7.25,8.5 C6.8358,8.5,6.5,8.8358,6.5,9.25S6.8358,10,7.25,10S8,9.6642,8,9.25S7.6642,8.5,7.25,8.5z M3.25,8.5C2.8358,8.5,2.5,8.8358,2.5,9.25 S2.8358,10,3.25,10S4,9.6642,4,9.25S3.6642,8.5,3.25,8.5z\"></path></svg>"

/***/ }),
/* 141 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"grocery-15.svg\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><metadata id=\"metadata15\"><rdf:RDF><cc:Work rdf:about><dc:format>image/svg+xml</dc:format><dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\"></dc><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id=\"defs13\"></defs><sodipodi:namedview pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1\" objecttolerance=\"10\" gridtolerance=\"10\" guidetolerance=\"10\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:window-width=\"1751\" inkscape:window-height=\"731\" id=\"namedview11\" showgrid=\"false\" inkscape:zoom=\"15.733333\" inkscape:cx=\"-1.1122881\" inkscape:cy=\"7.5\" inkscape:window-x=\"20\" inkscape:window-y=\"43\" inkscape:window-maximized=\"0\" inkscape:current-layer=\"svg4619\"></sodipodi><g id=\"g3\"><path d=\"M 13.199219 1.5 C 13.199219 1.5 11.808806 1.4588 11.253906 2 C 10.720406 2.5202 10.5 2.9177 10.5 4 L 1.1992188 4 L 2.59375 8.8144531 C 2.59725 8.8217531 2.6036219 8.8287375 2.6074219 8.8359375 C 2.8418219 9.4932375 3.4545469 9.9666406 4.1855469 9.9941406 C 4.1885469 9.9954406 4.1992187 10 4.1992188 10 L 10.699219 10 L 10.699219 10.199219 C 10.699219 10.199219 10.7 10.500391 10.5 10.900391 C 10.3 11.300391 10.200391 11.5 9.4003906 11.5 L 2.9003906 11.5 C 1.9003906 11.5 1.9003906 13 2.9003906 13 L 4.0996094 13 L 4.1992188 13 L 9.0996094 13 L 9.1992188 13 L 9.3007812 13 C 10.500781 13 11.399219 12.299609 11.699219 11.599609 C 11.999219 10.899609 12 10.300781 12 10.300781 L 12 10 L 12 4 C 12 3.4764 12.228619 3 12.699219 3 L 13.25 3 C 13.6642 3 14 2.6642 14 2.25 C 14 1.8358 13.6642 1.5 13.25 1.5 L 13.199219 1.5 z M 9.1992188 13 C 8.5992188 13 8.1992188 13.4 8.1992188 14 C 8.1992188 14.6 8.5992187 15 9.1992188 15 C 9.7992187 15 10.199219 14.6 10.199219 14 C 10.199219 13.4 9.7992188 13 9.1992188 13 z M 4.1992188 13 C 3.5992188 13 3.1992188 13.4 3.1992188 14 C 3.1992188 14.6 3.5992187 15 4.1992188 15 C 4.7992188 15 5.1992188 14.6 5.1992188 14 C 5.1992188 13.4 4.7992187 13 4.1992188 13 z \" id=\"path5\"></path></g></svg>"

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"hairdresser-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path6232\" d=\"M1.5,2C0.6716,2,0,2.6716,0,3.5v1C0,5,0.5,5,0.5,5h1C3,5,4,5.5,4,5.5S3,6,1.5,6h-1C0.5,6,0,6,0,6.5v1 C0,8.3284,0.6716,9,1.5,9S3,8.3284,3,7.5V6.8848C3.8082,6.727,4.5865,6.4316,5.2246,6.1426L8.5,8C10,8.75,11,8,11,8L6.5,5.5L11,3 c0,0-1-0.75-2.5,0L5.2246,4.8574C4.5866,4.5684,3.8081,4.2731,3,4.1152V3.5039C3,3.5026,3,3.5013,3,3.5C3,2.6716,2.3284,2,1.5,2z M1.5,3C1.7761,3,2,3.2239,2,3.5S1.7761,4,1.5,4S1,3.7761,1,3.5S1.2239,3,1.5,3z M5.2324,5.25c0.0059-0.0002,0.0117-0.0002,0.0176,0 c0.1381,0,0.25,0.1119,0.25,0.25S5.3881,5.75,5.25,5.75S5,5.6381,5,5.5C4.9997,5.3685,5.1013,5.2592,5.2324,5.25z M1.5,7 C1.7761,7,2,7.2239,2,7.5S1.7761,8,1.5,8S1,7.7761,1,7.5S1.2239,7,1.5,7z\"></path></svg>"

/***/ }),
/* 143 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"hairdresser-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path style=\"fill:#010101;\" d=\"M15,3c0,0-2-0.6-3.5,0.5l-4.3,3C6.4,5.9,5.2,5.2,4,4.8V4c0-1.1-0.9-2-2-2C0.9,2,0,2.9,0,4v1.5 C0,6,0.5,6,0.5,6H2h0.5C4.5,6,6,7.5,6,7.5S4.5,9,2.5,9H2H0.5C0.5,9,0,9,0,9.5V11c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2v-0.8 c1.2-0.4,2.4-1.1,3.2-1.7l4.3,3C13,12.6,15,12,15,12L8.5,7.5L15,3z M3,5H2H1V4c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1V5z M3,11 c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1v-1h1h1V11z M7.25,8c-0.2761,0-0.5-0.2239-0.5-0.5S6.9739,7,7.25,7s0.5,0.2239,0.5,0.5 S7.5261,8,7.25,8z\"></path></svg>"

/***/ }),
/* 144 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"harbor-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5263\" d=\"M5.5,0C4.1193,0,3,1.1193,3,2.5c0.0018,1.0981,0.7217,2.0466,1.75,2.3711V9.416 c-0.659-0.115-1.3381-0.3753-1.8926-0.8574C2.0886,7.8901,1.5,6.8297,1.5,5c0.0055-0.4226-0.3391-0.7664-0.7617-0.7598 C0.3248,4.2467-0.0054,4.5865,0,5c0,2.1703,0.7731,3.7349,1.873,4.6914S4.3333,11,5.5,11s2.527-0.3521,3.627-1.3086S11,7.1703,11,5 c0.0143-1.0142-1.5143-1.0142-1.5,0c0,1.8297-0.5886,2.8901-1.3574,3.5586C7.5881,9.0407,6.909,9.3011,6.25,9.416V4.875 C7.2795,4.55,7.9999,3.5995,8,2.5C8,1.1193,6.8807,0,5.5,0z M5.5,1.5c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1 S4.9477,1.5,5.5,1.5z\"></path></svg>"

/***/ }),
/* 145 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"harbor-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5263\" d=\"M7.5,0C5.5,0,4,1.567,4,3.5c0.0024,1.5629,1.0397,2.902,2.5,3.3379v6.0391 c-0.9305-0.1647-1.8755-0.5496-2.6484-1.2695C2.7992,10.6273,2.002,9.0676,2.002,6.498c0.0077-0.5646-0.4531-1.0236-1.0176-1.0137 C0.4329,5.493-0.0076,5.9465,0,6.498c0,3.0029,1.0119,5.1955,2.4902,6.5723C3.9685,14.4471,5.8379,15,7.5,15 c1.6656,0,3.535-0.5596,5.0117-1.9395S14.998,9.4868,14.998,6.498c0.0648-1.3953-2.0628-1.3953-1.998,0 c0,2.553-0.7997,4.1149-1.8535,5.0996C10.3731,12.3203,9.4288,12.7084,8.5,12.875V6.8418C9.9607,6.4058,10.9986,5.0642,11,3.5 C11,1.567,9.5,0,7.5,0z M7.5,2C8.3284,2,9,2.6716,9,3.5S8.3284,5,7.5,5S6,4.3284,6,3.5S6.6716,2,7.5,2z\"></path></svg>"

/***/ }),
/* 146 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10.06,4.76c-1.1682,1.9568-2.5794,3.7577-4.2,5.36c-0.1865,0.1961-0.4967,0.2038-0.6927,0.0173 C5.1614,10.1316,5.1556,10.1259,5.15,10.12C3.5259,8.5183,2.1113,6.7173,0.94,4.76c-1.82-3.64,2.8-6.07,4.56-2.43 C7.26-1.31,11.88,1.12,10.06,4.76z\"></path></svg>"

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75 C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z\"></path></svg>"

/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"heliport-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path10415\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssccccccsccsscssccsccssssssssscsccccsc\" d=\"M3,1 C2.723,1,2.5,1.223,2.5,1.5S2.7236,1.9824,3,2h3v2H2.9141h-0.002C2.7004,3.4014,2.1349,3.0009,1.5,3C0.6716,3,0,3.6716,0,4.5 S0.6716,6,1.5,6c0.3794-0.0007,0.7444-0.1452,1.0215-0.4043L4.5,8.5c0.6812,1,1.5,1,2,1h3.5352c0,0,0.9648-0.0008,0.9648-1v-1 c0-0.5-0.5-1-0.5-1l-2-2c0,0-0.5-0.5-1-0.5H7V2h3c0.277,0,0.5-0.223,0.5-0.5S10.277,1,10,1H3z M1.5,4C1.7761,4,2,4.2239,2,4.5 S1.7761,5,1.5,5S1,4.7761,1,4.5S1.2239,4,1.5,4z M7.75,5C7.75,5,8,5,8.5,5.5L10,7H7.5C7.5,7,7,7,7,6.5v-1C7,5.5,7,5,7.5,5H7.75z\"></path></svg>"

/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"heliport-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path10415\" inkscape:connector-curvature=\"0\" d=\"M4,2C3,2,3,3,4,3h4v1C7.723,4,7.5,4.223,7.5,4.5V5H5H3.9707H3.9316 C3.7041,4.1201,2.9122,3.5011,2,3.5c-1.1046,0-2,0.8954-2,2s0.8954,2,2,2c0.3722-0.001,0.7368-0.1058,1.0527-0.3027L5.5,10.5 C6.5074,11.9505,8.3182,12,9,12h5c0,0,1,0,1-1v-0.9941C15,9.2734,14.874,8.874,14.5,8.5l-3-3c0,0-0.5916-0.5-1.2734-0.5H9.5V4.5 C9.5,4.223,9.277,4,9,4V3h4c1,0,1-1,0-1C13,2,4,2,4,2z M2,4.5c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1 C1,4.9477,1.4477,4.5,2,4.5z M10,6c0.5,0,0.7896,0.3231,1,0.5L13.5,9H10c0,0-1,0-1-1V7C9,7,9,6,10,6z\"></path></svg>"

/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 11 11\"><path d=\"M10.0015,4.7507c0,0.13807-0.11193,0.25-0.25,0.25H1.25c-0.13807,0-0.25-0.11193-0.25-0.25 c-0.00054-0.07163,0.02839-0.14033,0.08-0.19l4.2378-3.4545l0.016-0.016c0.10112-0.09209,0.2577-0.08493,0.35,0.016l2.3174,1.8892 V1.5c0-0.27614,0.22386-0.5,0.5-0.5s0.5,0.22386,0.5,0.5v2.31l0.92,0.75C9.9731,4.60979,10.00215,4.67878,10.0015,4.7507z M2,9.7514 c-0.00111,0.13696,0.10902,0.24889,0.24598,0.25c0.00001,0,0.00001,0,0.00002,0h2.7547v-2h1v2h2.7526 c0.13697,0,0.248-0.11103,0.248-0.248l0,0l0,0V6.0009H2V9.7514z\"></path></svg>"

/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 15 15\"><path d=\"M2,13.7478c0,0.13807,0.11193,0.25,0.25,0.25h3.749v-3h3v3h3.749c0.13807,0,0.25-0.11193,0.25-0.25V7.9987H2 C2,7.9987,2,13.7478,2,13.7478z M13.93,6.5778l-0.9319-0.8189V2c0-0.55228-0.44771-1-1-1s-1,0.44772-1,1v2L7.6808,1.09 C7.5863,0.9897,7.42846,0.98478,7.3279,1.079L7.3169,1.09L1.0678,6.553C0.9734,6.65376,0.97856,6.81197,1.07932,6.90637 C1.12478,6.94896,1.18451,6.97304,1.2468,6.9739L3,6.9989h10.7468c0.13807,0.00046,0.25037-0.1111,0.25083-0.24917 C13.99784,6.68592,13.97365,6.62445,13.93,6.5779V6.5778z\"></path></svg>"

/***/ }),
/* 152 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>horse-riding-11</title><path d=\"M4,1A1,1,0,1,1,5,2,1,1,0,0,1,4,1Zm6.88,3.5L9,3V2.5L7,5H6L7,6V7.014a.5.5,0,1,1-1,0V6.5L4,5H3a1,1,0,0,0-.8.446A1.189,1.189,0,0,0,1.247,5,1.076,1.076,0,0,0,0,5.988C0,7.3.635,7.471.635,7.471a.33.33,0,0,0,.115.023A.253.253,0,0,0,1,7.25V6a.49.49,0,0,1,.48-.5H1.5A.5.5,0,0,1,2,6V8.014l-.3.6a1.609,1.609,0,0,0-.2.6v1.542A.244.244,0,0,0,1.744,11,.255.255,0,0,0,2,10.756V9.514a.367.367,0,0,1,.1-.3l.9-1.2V9l.467,1.816A.256.256,0,0,0,3.709,11a.25.25,0,0,0,.25-.25v-.016l-.242-1.61a.6.6,0,0,1,.025-.236L3.8,8.714,4,8H6V9l.466,1.816A.256.256,0,0,0,6.709,11a.25.25,0,0,0,.25-.25L6.718,9.124a.6.6,0,0,1,.025-.236L7,8a.877.877,0,0,0,.934-.661L8.5,4.5a.6.6,0,0,0,.71.454.562.562,0,0,0,.143-.07l.9.116a.721.721,0,0,0,.392.1A.331.331,0,0,0,11,4.784.406.406,0,0,0,10.88,4.5ZM6,3.5A.51.51,0,0,0,5.5,3h-1a.482.482,0,0,0-.5.5V5H6Z\"></path></svg>"

/***/ }),
/* 153 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>horse-riding-15</title><path d=\"M6,1A1,1,0,1,1,7,2,1,1,0,0,1,6,1ZM8,3.5a.484.484,0,0,0,0-.058A.472.472,0,0,0,7.5,3h-1a.484.484,0,0,0-.058,0A.472.472,0,0,0,6,3.5V7H8Zm6.85,3.644L12.8,4.8l.085-.509a.478.478,0,0,0,.008-.063.25.25,0,0,0-.25-.25.346.346,0,0,0-.158.056L9,7H8L9,8V9.5a.5.5,0,0,1-1,0v-1L6,7H4a1.5,1.5,0,0,0-1.243.661A1.466,1.466,0,0,0,1.563,7H1.5A1.449,1.449,0,0,0,0,8.4v.086A3.781,3.781,0,0,0,.559,10.4a.278.278,0,0,0,.191.1A.25.25,0,0,0,1,10.25V9s-.02-.924.753-1c.5-.048.747.253.747.5V11L2,13v1.75a.25.25,0,0,0,.25.25.254.254,0,0,0,.25-.234V13L4,11v1l.5,2.8a.255.255,0,0,0,.246.2A.25.25,0,0,0,5,14.754H5L4.855,12.3,5.5,11H8v1l.508,2.813A.257.257,0,0,0,8.75,15,.25.25,0,0,0,9,14.75V12l.367-1a1.155,1.155,0,0,0,.543-.6l2.161-3.767a.863.863,0,0,0,1.023.4l1.066.818a.591.591,0,0,0,.35.135.487.487,0,0,0,.475-.4A.552.552,0,0,0,14.85,7.144Z\"></path></svg>"

/***/ }),
/* 154 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,4H7V1C6.9616,0.4644,6.5356,0.0384,6,0H5C4.4644,0.0384,4.0384,0.4644,4,1v3H1C0.4644,4.0384,0.0384,4.4644,0,5v1 c0.0384,0.5356,0.4644,0.9616,1,1h3v3c0.0384,0.5356,0.4644,0.9616,1,1h1c0.5356-0.0384,0.9616-0.4644,1-1V7h3 c0.5356-0.0384,0.9616-0.4644,1-1V5C11,4.4477,10.5523,4,10,4z\"></path></svg>"

/***/ }),
/* 155 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"hospital-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect4194\" inkscape:connector-curvature=\"0\" style=\"fill:#010101;\" d=\"M7,1C6.4,1,6,1.4,6,2v4H2C1.4,6,1,6.4,1,7v1 c0,0.6,0.4,1,1,1h4v4c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V9h4c0.6,0,1-0.4,1-1V7c0-0.6-0.4-1-1-1H9V2c0-0.6-0.4-1-1-1H7z\"></path></svg>"

/***/ }),
/* 156 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M4,6c0.541,0.0007,1.0676-0.1748,1.5-0.5C5.9324,5.8252,6.459,6.0007,7,6l-1,4.69c-0.1082,0.2541-0.4019,0.3723-0.656,0.264 c-0.1188-0.0506-0.2134-0.1452-0.264-0.264L4,6z M7,2H6.91c0.2826-0.7787-0.1195-1.6391-0.8982-1.9218S4.3726,0.1978,4.09,0.9765 C3.97,1.3071,3.97,1.6694,4.09,2H4C3.1716,2,2.5,2.6716,2.5,3.5S3.1716,5,4,5s1.5-0.6716,1.5-1.5l0,0l0,0l0,0 C5.5,4.3284,6.1716,5,7,5s1.5-0.6716,1.5-1.5S7.8284,2,7,2z\"></path></svg>"

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M5.44,8.17c0.7156,0.0006,1.414-0.2194,2-0.63C7.9037,7.8634,8.4391,8.0693,9,8.14h0.44L8,13.7 c-0.1082,0.2541-0.4019,0.3723-0.656,0.264C7.2252,13.9134,7.1306,13.8188,7.08,13.7L5.44,8.17z\"></path><path d=\"M11.44,4.67c0,1.1046-0.8954,2-2,2s-2-0.8954-2-2l0,0l0,0l0,0c0,1.1046-0.8954,2-2,2s-2-0.8954-2-2s0.8954-2,2-2h0.12 C5.1756,1.6345,5.7035,0.4834,6.739,0.099s2.1866,0.1435,2.571,1.179c0.1667,0.449,0.1667,0.9429,0,1.3919h0.13 C10.5446,2.67,11.44,3.5654,11.44,4.67z\"></path></svg>"

/***/ }),
/* 158 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,1v8H1V6l2.11-1.78C3.43,3.9,4,3.91,4,4.36V6l2.13-1.86c0.1854-0.2047,0.5016-0.2203,0.7062-0.0349 C6.9472,4.2056,7.0073,4.3505,7,4.5V8h2V1H10z\"></path></svg>"

/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,1v12H1V8.72c0.0016-0.1419,0.0634-0.2764,0.17-0.37l3-3.22c0.2074-0.1823,0.5234-0.1618,0.7056,0.0456 C4.9568,5.268,5.0011,5.387,5,5.51v3l3.16-3.37c0.2025-0.1878,0.5188-0.1759,0.7066,0.0266C8.9532,5.2599,9.0009,5.3827,9,5.51V11h3 V1H14z\"></path></svg>"

/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"information-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect8399\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssssscccccccccccc\" style=\"fill:#010101;\" d=\" M5.5989,0.9391c-0.6,0-1.1,0.5-1.1,1.1s0.5,1.1,1.1,1.1s1.1-0.5,1.1-1.1S6.1989,0.9391,5.5989,0.9391z M3,4L2.9989,4.7391 C2.9989,4.7391,4.5,4.6353,4.5,6v1.5c0,1.5-1.5011,1.7391-1.5011,1.7391L3,10h5.2L8.1989,9.2391c0,0-1.2,0-1.2-1.5L7,5c0,0,0-1-1-1 H3z\"></path></svg>"

/***/ }),
/* 161 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"information-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect8399\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssssscccccccccccc\" style=\"fill:#010101;\" d=\"M7.5,1 C6.7,1,6,1.7,6,2.5S6.7,4,7.5,4S9,3.3,9,2.5S8.3,1,7.5,1z M4,5v1c0,0,2,0,2,2v2c0,2-2,2-2,2v1h7v-1c0,0-2,0-2-2V6c0-0.5-0.5-1-1-1H4 z\"></path></svg>"

/***/ }),
/* 162 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M4.5,4.4l-2,2l-1,1C1,7.8,0.9,8.5,1.2,9.1l0.6,0.7c0.6,0.4,1.3,0.2,1.7-0.3l1-1l2-2L4.5,4.4z M3.1,8.5L2.5,7.8l2-2l0.7,0.7 L3.1,8.5z M5,2l1-1h3l1,1v3L9,6H8L5,3V2z\"></path></svg>"

/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>karaoke</title><g><path d=\"M12.1,2.952A2.988,2.988,0,0,0,6.99,4.917l3.142,3.142A2.988,2.988,0,0,0,12.1,2.952Z\"></path><path d=\"M4.672,8.255,2.55,10.377a1,1,0,0,0,0,1.414l.707.707a1,1,0,0,0,1.414,0l2.121-2.121L8.914,8.255,6.793,6.134Zm.741,2.087-.707-.707L6.793,7.548l.707.707Z\"></path></g></svg>"

/***/ }),
/* 164 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><title>landmark</title><path d=\"M9.5,9H8V5h1l1-2C9.3,3.1,8.7,3.1,8,3C7.3,2.7,6.6,2.4,6,2V1.5C6,1.2,5.8,1,5.5,1S5,1.2,5,1.5V2C4.4,2.4,3.7,2.7,3,3 C2.3,3.1,1.7,3.1,1,3l1,2h1v4H1.5C1.2,9,1,9.2,1,9.5S1.2,10,1.5,10h8C9.8,10,10,9.8,10,9.5S9.8,9,9.5,9z M7,9H4V5h3V9z\"></path></svg>"

/***/ }),
/* 165 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12.5,12H12v-0.5c0-0.3-0.2-0.5-0.5-0.5H11V6h1l1-2c-1,0.1-2,0.1-3,0C9.2,3.4,8.6,2.8,8,2V1.5C8,1.2,7.8,1,7.5,1 S7,1.2,7,1.5V2C6.4,2.8,5.8,3.4,5,4C4,4.1,3,4.1,2,4l1,2h1v5c0,0-0.5,0-0.5,0C3.2,11,3,11.2,3,11.5V12H2.5C2.2,12,2,12.2,2,12.5V13 h11v-0.5C13,12.2,12.8,12,12.5,12z M7,11H5V6h2V11z M10,11H8V6h2V11z\"></path><title>landmark</title></svg>"

/***/ }),
/* 166 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>landuse-11</title><path d=\"M1,4.749.995,2.057a.251.251,0,0,1,.1-.2L3.344.057A.251.251,0,0,1,3.657.052l2.249,1.8a.251.251,0,0,1,.094.2v2.7A.251.251,0,0,1,5.751,5h-1.5A.251.251,0,0,1,4,4.749V3H3V4.752A.251.251,0,0,1,2.746,5h-1.5A.247.247,0,0,1,1,4.749Zm4.753,2.6h0a.248.248,0,0,0-.173.072L4,9V6.5a.5.5,0,0,0-1,0V9H2V6.5a.5.5,0,0,0-1,0v4.25a.25.25,0,0,0,.25.25h4.5A.249.249,0,0,0,6,10.752V7.6A.25.25,0,0,0,5.753,7.347ZM11,3.253v6.5a.247.247,0,0,1-.247.247H7.247A.247.247,0,0,1,7,9.753v-6.5A.252.252,0,0,1,7.252,3H8V2.248A.248.248,0,0,1,8.248,2H9.754A.246.246,0,0,1,10,2.246V3h.747A.253.253,0,0,1,11,3.253ZM10,8H8V9h2Zm0-2H8V7h2Zm0-2H8V5h2Z\"></path></svg>"

/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>landuse-15</title><path d=\"M8.911,3.854A.248.248,0,0,1,9,4.044V7.75A.25.25,0,0,1,8.75,8H6.25A.25.25,0,0,1,6,7.75V6H5V7.75A.25.25,0,0,1,4.75,8H2.25A.25.25,0,0,1,2,7.75v-3.7a.248.248,0,0,1,.089-.19L5.343,1.132a.245.245,0,0,1,.315,0ZM7.752,9.5a.248.248,0,0,0-.138.042L5,11.5H4v-2a.5.5,0,0,0-1,0v2H2v-2a.5.5,0,0,0-1,0v4.25a.25.25,0,0,0,.25.25h6.5A.25.25,0,0,0,8,13.75v-4A.248.248,0,0,0,7.752,9.5ZM14,6.245v6.5a.253.253,0,0,1-.253.253H10.253A.253.253,0,0,1,10,12.747V6.25A.249.249,0,0,1,10.25,6H11V5.249A.249.249,0,0,1,11.249,5h1.5A.253.253,0,0,1,13,5.253V6h.755A.245.245,0,0,1,14,6.245ZM13,11H11v1h2Zm0-2H11v1h2Zm0-2H11V8h2Z\"></path></svg>"

/***/ }),
/* 168 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"laundry-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path3291\" d=\"M5,0L4,2H2c0,0-1,0-1,1v7c0,0,0,1,1,1h7c1,0,1-1,1-1V1c0-1-1-1-1-1H5z M6,1h3v1H6V1z M5.5,4 C6.8807,4,8,5.1193,8,6.5S6.8807,9,5.5,9S3,7.8807,3,6.5S4.1193,4,5.5,4z\"></path></svg>"

/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"laundry-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path3291-2\" inkscape:connector-curvature=\"0\" d=\"M8,1L6,3H3c0,0-1,0-1,1v9c0,1,1,1,1,1h9c0,0,1,0,1-1V2c0-1-1-1-1-1 S8,1,8,1z M8.5,2h2C10.777,2,11,2.223,11,2.5S10.777,3,10.5,3h-2C8.223,3,8,2.777,8,2.5S8.223,2,8.5,2z M7.5,6 c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3s-3-1.3431-3-3S5.8431,6,7.5,6z\"></path></svg>"

/***/ }),
/* 170 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"library-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path5\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\" d=\" M0,1v7c3.26,0,5.4902,2,5.4902,2S7.76,8,11,8V1C7,1,5.4902,2.7246,5.4902,2.7246S4,1,0,1z M1,2c1.1953-0.0313,3.053,0.4015,4,1.3477 L5.5,4L6,3.3477C6.9615,2.4183,8.8009,1.9878,10,2v5C8,7,6.6456,7.8564,5.4902,8.7812C4.3506,7.8533,3,7,1,7V2z M2,3.3027v0.1816 c0.8234,0.1688,2.0997,0.6868,3,1.1758V4.4316C4.0828,3.9535,2.8241,3.46,2,3.3027z M9,3.3027C8.1759,3.46,6.9172,3.9535,6,4.4316 v0.2285c0.9003-0.489,2.1766-1.007,3-1.1758V3.3027z M2,4.2227v0.1816c0.8217,0.1539,2.0985,0.6584,3,1.1328V5.3418 C4.0827,4.8663,2.8238,4.3752,2,4.2227z M9,4.2227C8.1762,4.3752,6.9173,4.8663,6,5.3418v0.1953 c0.9015-0.4744,2.1783-0.9789,3-1.1328V4.2227z M2,5.1172v0.1816c0.8216,0.1547,2.0984,0.659,3,1.1328V6.2363 C4.0825,5.7614,2.8236,5.2707,2,5.1172z M9,5.1172C8.1764,5.2707,6.9175,5.7614,6,6.2363v0.1953 c0.9016-0.4738,2.1784-0.9781,3-1.1328V5.1172z M2,6v0.1816C2.8201,6.322,4.097,6.811,5,7.2695V7.1191 C4.0825,6.6445,2.8236,6.1538,2,6z M9,6C8.1764,6.1538,6.9175,6.6445,6,7.1191v0.1504C6.903,6.811,8.1799,6.322,9,6.1816V6z\"></path></svg>"

/***/ }),
/* 171 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M7.47,4.92C7.47,4.92,5.7,3,1,3v8c4.7,0,6.47,2,6.47,2S9.3,11,14,11V3C9.3,3,7.47,4.92,7.47,4.92z M13,10 c-1.9614,0.0492-3.8727,0.6299-5.53,1.68C5.836,10.6273,3.9432,10.0459,2,10V4c3.4,0.26,4.73,1.6,4.75,1.61l0.73,0.74L8.2,5.6 c0,0,1.4-1.34,4.8-1.6V10z M8,10.24l-0.1-0.17c1.3011-0.5931,2.6827-0.9907,4.1-1.18v0.2c-1.3839,0.1953-2.7316,0.5929-4,1.18V10.24 z M8,9.24L7.9,9.07C9.2016,8.4802,10.5832,8.086,12,7.9v0.2c-1.3844,0.1988-2.7321,0.5997-4,1.19V9.24z M8,8.24L7.9,8.07 C9.2015,7.48,10.5831,7.0857,12,6.9v0.2c-1.3845,0.1981-2.7323,0.599-4,1.19V8.24z M8,7.24L7.9,7.07 C9.2013,6.4794,10.583,6.0851,12,5.9v0.2c-1.3844,0.1986-2.7321,0.5996-4,1.19V7.24z M6.9,10.24C5.6639,9.6641,4.3499,9.2733,3,9.08 v-0.2c1.3872,0.2028,2.7358,0.6141,4,1.22L6.9,10.24z M6.9,9.24C5.6629,8.671,4.3488,8.2869,3,8.1V7.9 c1.386,0.2027,2.7341,0.6105,4,1.21L6.9,9.24z M6.9,8.24C5.6631,7.6705,4.3489,7.2863,3,7.1V6.9c1.3868,0.199,2.7354,0.607,4,1.21 L6.9,8.24z M6.9,7.24C5.6629,6.671,4.3488,6.2869,3,6.1V5.9c1.386,0.2024,2.7342,0.6102,4,1.21L6.9,7.24z\"></path></svg>"

/***/ }),
/* 172 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M7,6l1,5H3l1-5h1.2V2H4.28C4.1042,1.9823,3.9759,1.8255,3.9936,1.6496C4.0042,1.544,4.0665,1.4504,4.16,1.4L5.38,1 c0.0762-0.0347,0.1638-0.0347,0.24,0l1.22,0.4c0.1555,0.0839,0.2136,0.2781,0.1296,0.4336C6.9192,1.927,6.8257,1.9894,6.72,2H5.81v4 H7z M8,3v0.5L11,3V2.5L8,3z M8,5.5L11,6V5.5L8,5V5.5z M3,3L0,2.5V3l3,0.5V3z M3,5L0,5.5V6l3-0.5V5z\"></path></svg>"

/***/ }),
/* 173 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M4.5,6L0,7V6.5l4.5-1V6z M4.5,3.5L0,2.5V3l4.5,1V3.5z M10.5,3.5V4L15,3V2.5L10.5,3.5z M10.5,6L15,7V6.5l-4.5-1V6z M8,7V2 h2.5c0.2761,0.0552,0.5448-0.1239,0.6-0.4c0.0552-0.2761-0.1239-0.5448-0.4-0.6l-3-1C7.5696-0.0586,7.4204-0.0586,7.29,0l-3,1 c-0.2761,0.0552-0.4552,0.3239-0.4,0.6S4.2139,2.0552,4.49,2H7v5H5l-2,7h9l-2-7H8z\"></path></svg>"

/***/ }),
/* 174 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect6430\" d=\"M1.5,2C1.2239,2,1,2.2239,1,2.5v6C1,8.7761,1.2239,9,1.5,9S2,8.7761,2,8.5V8h7v0.5C9,8.7761,9.2239,9,9.5,9 S10,8.7761,10,8.5v-1C10,7.2239,9.7761,7,9.5,7H2V2.5C2,2.2239,1.7761,2,1.5,2z M3.5,2c-0.5523,0-1,0.4477-1,1s0.4477,1,1,1 s1-0.4477,1-1S4.0523,2,3.5,2z M6,3C5.4477,3,5,3.4477,5,4v1H3C2.7239,5,2.5,5.2239,2.5,5.5S2.7239,6,3,6h7V5c0-1.1046-0.8954-2-2-2 H6z\"></path></svg>"

/***/ }),
/* 175 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"lodging-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect6507\" style=\"fill:#010101;\" d=\"M0.5,2.5C0.2,2.5,0,2.7,0,3v7.5v2C0,12.8,0.2,13,0.5,13S1,12.8,1,12.5V11h13v1.5 c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-2c0-0.3-0.2-0.5-0.5-0.5H1V3C1,2.7,0.8,2.5,0.5,2.5z M3.5,3C2.7,3,2,3.7,2,4.5l0,0 C2,5.3,2.7,6,3.5,6l0,0C4.3,6,5,5.3,5,4.5l0,0C5,3.7,4.3,3,3.5,3L3.5,3z M7,4C5.5,4,5.5,5.5,5.5,5.5V7h-3C2.2,7,2,7.2,2,7.5v1 C2,8.8,2.2,9,2.5,9H6h9V6.5C15,4,12.5,4,12.5,4H7z\"></path></svg>"

/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>logging-11</title><path d=\"M9.25,1a.409.409,0,0,0-.11.01.668.668,0,0,0-.44.24L8,2H7.263A.25.25,0,0,0,7,2.236a.243.243,0,0,0,0,.025V3H6.263a.256.256,0,0,0-.19.073A.248.248,0,0,0,6,3.252V4H5.237a.275.275,0,0,0-.164.073A.248.248,0,0,0,5,4.252V5H4.249a.257.257,0,0,0-.176.075l.178.178.5.5L8.5,2H9v.5L5.25,6.25l.5.5.177.177A.249.249,0,0,0,6,6.749V6h.751a.25.25,0,0,0,.176-.073A.266.266,0,0,0,7,5.759V5h.748A.248.248,0,0,0,8,4.756H8V4h.751a.267.267,0,0,0,.176-.073A.258.258,0,0,0,9,3.733V3l.78-.72a.734.734,0,0,0,.21-.42L10,1.75A.755.755,0,0,0,9.25,1ZM2,8,1.569,6.8h0a1.422,1.422,0,0,1-.07-.465V6.25A.25.25,0,0,1,1.749,6h1a.25.25,0,0,0,0-.5H1.5A.5.5,0,0,0,1,6v.415a2,2,0,0,0,.106.642L1.57,8.43a1.841,1.841,0,0,0,.1.24,1.551,1.551,0,0,0,.624.643,1.342,1.342,0,0,0,1.315,0C3.869,9.122,5,8,5,8L3.5,6.5Z\"></path></svg>"

/***/ }),
/* 177 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>logging-15</title><path d=\"M13.91,3.41,13.5,3l.2-.28c.02-.03.04-.05.06-.08A.969.969,0,0,0,14,1.99a1,1,0,0,0-1.62-.77c-.03.02-.06.05-.09.07L12,1.5l-.386-.386a.354.354,0,0,0-.525.475l.417.417-.5.5-.392-.392a.354.354,0,0,0-.525.475L10.5,3l-.5.5-.381-.381a.354.354,0,1,0-.528.472h0l.028.028L9.5,4,9,4.5l-.395-.395a.354.354,0,0,0-.517.483L8.5,5,8,5.5l-.365-.365a.354.354,0,0,0-.556.439h0C7.1,5.6,7.508,6,7.508,6L7,6.5l-.394-.392a.392.392,0,0,0-.5-.028.384.384,0,0,0-.028.5L6.1,6.6l.4.4L6,7.5l-.4-.4a.37.37,0,0,0-.5,0L6.248,8.244,12.09,2.41,12.5,2H13v.5l-.41.41L6.751,8.749,7.9,9.9a.355.355,0,0,0,0-.5l-.008-.009L7.5,9,8,8.5l.384.384a.354.354,0,0,0,.528-.472L8.5,8,9,7.5l.38.38a.354.354,0,0,0,.528-.472l-.02-.02L9.5,7l.5-.5.377.377A.35.35,0,0,0,10.64,7a.347.347,0,0,0,.252-.6L10.5,6l.5-.5.38.38a.354.354,0,0,0,.528-.472L11.88,5.38,11.5,5l.5-.5.381.381a.354.354,0,0,0,.528-.472l-.025-.025L12.5,4l.5-.5.382.382a.354.354,0,0,0,.528-.472ZM4.39,7.916C3.893,7.419,3.641,7,3,7H1.5a.5.5,0,0,0-.5.5v3A2.19,2.19,0,0,0,1.5,12l.815.811A2.251,2.251,0,0,0,5.493,13h0L7.5,11ZM3.5,10,2.262,11.238A1.3,1.3,0,0,1,2,10.5V8H3a.545.545,0,0,1,.335.194.455.455,0,0,1,.165.418Z\"></path></svg>"

/***/ }),
/* 178 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"marker-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4133\" inkscape:connector-curvature=\"0\" d=\"M5.5-0.0176c-1.7866,0-3.8711,1.0918-3.8711,3.8711 C1.6289,5.7393,4.6067,9.9082,5.5,11c0.7941-1.0918,3.871-5.1614,3.871-7.1466C9.371,1.0742,7.2866-0.0176,5.5-0.0176z\"></path></svg>"

/***/ }),
/* 179 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"marker-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4133\" inkscape:connector-curvature=\"0\" d=\"M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z\"></path></svg>"

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>marker-stroked-11</title><path id=\"Layer_7\" data-name=\"Layer 7\" d=\"M5.486,11l-.365-.446c-.7-.858-3.544-4.739-3.544-6.638A3.726,3.726,0,0,1,5.132.026q.167-.008.333,0A3.726,3.726,0,0,1,9.353,3.583q.007.166,0,.331c0,1.6-1.806,4.268-3.38,6.415ZM5.465.916a2.817,2.817,0,0,0-3,3c0,1.268,1.883,4.161,2.987,5.62.935-1.282,3.011-4.217,3.011-5.62a2.817,2.817,0,0,0-3-3Z\"></path></svg>"

/***/ }),
/* 181 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>marker-stroked-15</title><path id=\"Layer_7\" data-name=\"Layer 7\" d=\"M7.5,14.941l-.4-.495c-.973-1.189-4.9-6.556-4.9-9.16A5.066,5.066,0,0,1,7.036,0q.222-.01.445,0a5.066,5.066,0,0,1,5.286,4.836q.01.225,0,.45c0,2.213-2.669,6.111-4.678,8.851ZM7.481.986a4.077,4.077,0,0,0-4.3,4.3c0,1.832,2.759,6.038,4.286,8.034,1.25-1.71,4.315-5.989,4.315-8.034a4.077,4.077,0,0,0-4.3-4.3Z\"></path></svg>"

/***/ }),
/* 182 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>mobile-phone-11</title><path d=\"M7,2V1.5a.5.5,0,0,0-1,0V2H4A1,1,0,0,0,3,3V9a1,1,0,0,0,1,1H7A1,1,0,0,0,8,9V3A1,1,0,0,0,7,2ZM5,9H4V8H5ZM5,7H4V6H5ZM7,9H6V8H7ZM7,7H6V6H7ZM7,5H4V3H7Z\"></path></svg>"

/***/ }),
/* 183 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>mobile-phone-15</title><path d=\"M10,2h0V1.5a.5.5,0,0,0-1,0V2H5A1,1,0,0,0,4,3V13a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V3A1,1,0,0,0,10,2ZM6,13H5V12H6Zm0-2H5V10H6ZM6,9H5V8H6Zm2,4H7V12H8Zm0-2H7V10H8ZM8,9H7V8H8Zm2,4H9V12h1Zm0-2H9V10h1Zm0-2H9V8h1Zm0-2.5a.5.5,0,0,1-.5.5h-4A.5.5,0,0,1,5,6.5v-3A.5.5,0,0,1,5.5,3h4a.5.5,0,0,1,.5.5Z\"></path></svg>"

/***/ }),
/* 184 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"monument-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path11719-7\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccc\" d=\"M5.5,0L4,2v4.5h3V2L5.5,0z M3,7L2,8 v3h7V8L8,7H3z\"></path></svg>"

/***/ }),
/* 185 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"monument-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path11719-7\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccc\" d=\"M7.5,0L6,2.5v7h3v-7L7.5,0z M3,11.5 L3,15h9v-3.5L10.5,10h-6L3,11.5z\"></path></svg>"

/***/ }),
/* 186 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"mountain-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3338\" inkscape:connector-curvature=\"0\" d=\"M5.5176,1.2324C5.3165,1.2262,5.1271,1.328,5.0234,1.5l-4,6.6602 C0.8007,8.5296,1.0679,8.9999,1.5,9h8c0.4321-0.0001,0.6993-0.4704,0.4766-0.8398l-4-6.6602 C5.8793,1.3386,5.7062,1.2384,5.5176,1.2324z M5.5195,2.1543L8.4316,7H7.7598L6.416,5.7734L5.5195,7L4.625,5.7734L3.2812,7H2.6094 C2.6094,7,5.5195,2.1543,5.5195,2.1543z\"></path></svg>"

/***/ }),
/* 187 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"mountain-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5571\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sccssssccsccccccccc\" d=\"M7.5,2C7.2,2,7.1,2.2,6.9,2.4 l-5.8,9.5C1,12,1,12.2,1,12.3C1,12.8,1.4,13,1.7,13h11.6c0.4,0,0.7-0.2,0.7-0.7c0-0.2,0-0.2-0.1-0.4L8.2,2.4C8,2.2,7.8,2,7.5,2z M7.5,3.5L10.8,9H10L8.5,7.5L7.5,9l-1-1.5L5,9H4.1L7.5,3.5z\"></path></svg>"

/***/ }),
/* 188 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,0L1,2v1h9V2L5.5,0z M2,4v4L1,9v1h9V9L9,8V4H2z M3.49,5c0.1354-0.0008,0.2653,0.0533,0.36,0.15L5.5,6.79l1.65-1.64 c0.1972-0.1933,0.5137-0.1902,0.7071,0.007C7.947,5.2487,7.9982,5.3715,8,5.5v3C8,8.7761,7.7761,9,7.5,9S7,8.7761,7,8.5l0,0V6.71 L5.85,7.85C5.6555,8.0461,5.339,8.0474,5.1429,7.8529C5.1419,7.8519,5.141,7.851,5.14,7.85L4,6.71V8.5C4,8.7761,3.7761,9,3.5,9 S3,8.7761,3,8.5l0,0v-3C2.9999,5.2277,3.2178,5.0054,3.49,5z\"></path></svg>"

/***/ }),
/* 189 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"museum-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path7509\" inkscape:connector-curvature=\"0\" d=\"M7.5,0L1,3.4453V4h13V3.4453L7.5,0z M2,5v5l-1,1.5547V13h13v-1.4453L13,10 V5H2z M4.6152,6c0.169-0.0023,0.3318,0.0639,0.4512,0.1836L7.5,8.6172l2.4336-2.4336c0.2445-0.2437,0.6402-0.2432,0.884,0.0013 C10.9341,6.3017,10.9997,6.46,11,6.625v4.2422c0.0049,0.3452-0.271,0.629-0.6162,0.6338c-0.3452,0.0049-0.629-0.271-0.6338-0.6162 c-0.0001-0.0059-0.0001-0.0118,0-0.0177V8.1328L7.9414,9.9414c-0.244,0.2433-0.6388,0.2433-0.8828,0L5.25,8.1328v2.7344 c0.0049,0.3452-0.271,0.629-0.6162,0.6338C4.2887,11.5059,4.0049,11.2301,4,10.8849c-0.0001-0.0059-0.0001-0.0118,0-0.0177V6.625 C4,6.2836,4.2739,6.0054,4.6152,6z\"></path></svg>"

/***/ }),
/* 190 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9.5,0.5C9.4238,0.4993,9.3484,0.5164,9.28,0.55L3.5,2C3.2239,2,3,2.2239,3,2.5v4.59 C2.219,6.8139,1.3619,7.2232,1.0858,8.0042S1.219,9.6423,2,9.9184s1.6381-0.1332,1.9142-0.9142C3.9715,8.8423,4.0005,8.6717,4,8.5 V5.38l5-1.25v1.46C8.219,5.3139,7.3619,5.7232,7.0858,6.5042C6.8097,7.2853,7.219,8.1423,8,8.4184s1.6381-0.1332,1.9142-0.9142 C9.9715,7.3423,10.0005,7.1717,10,7V1C10,0.7239,9.7761,0.5,9.5,0.5z M4,4.38v-1.5l5-1.25v1.5L4,4.38z\"></path></svg>"

/***/ }),
/* 191 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.5,1c-0.0804,0.0008-0.1594,0.0214-0.23,0.06L4.5,3.5C4.2239,3.5,4,3.7239,4,4v6.28C3.6971,10.1002,3.3522,10.0037,3,10 c-1.1046,0-2,0.8954-2,2s0.8954,2,2,2s2-0.8954,2-2V7.36l8-2.22v3.64c-0.3029-0.1798-0.6478-0.2763-1-0.28c-1.1046,0-2,0.8954-2,2 s0.8954,2,2,2s2-0.8954,2-2v-9C14,1.2239,13.7761,1,13.5,1z M13,4.14L5,6.36v-2l8-2.22C13,2.14,13,4.14,13,4.14z\"></path></svg>"

/***/ }),
/* 192 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>natural-11</title><path d=\"M4.579,9.579h0L3,8H4.4a.25.25,0,0,0,.25-.25.246.246,0,0,0-.079-.179L3,6h.736a.25.25,0,0,0,.25-.25.246.246,0,0,0-.078-.179h0l-1.2-1.253a.253.253,0,0,0-.4-.015c-.02.023-1.21,1.266-1.21,1.266a.245.245,0,0,0-.082.18.25.25,0,0,0,.25.25H2L.425,7.575h0A.249.249,0,0,0,.6,8H2L.434,9.566h0a.244.244,0,0,0-.082.18A.25.25,0,0,0,.6,10H2v1H3V10H4.4a.247.247,0,0,0,.179-.421Zm6.242-.938-2.1-4.2a.248.248,0,0,0-.443,0l-2.1,4.2A.248.248,0,0,0,6.4,9h4.2a.248.248,0,0,0,.221-.359ZM7.5,7l1-2,1,2Zm.279-5.921a.266.266,0,0,1-.049.148A3.513,3.513,0,0,0,7,3,2.141,2.141,0,0,1,5.709,4.911a.475.475,0,0,1-.419,0A2.141,2.141,0,0,1,4,3a3.5,3.5,0,0,0-.726-1.769.271.271,0,0,1-.046-.148.25.25,0,0,1,.25-.25.27.27,0,0,1,.067.009A2.939,2.939,0,0,1,5,2L5.25.224A.25.25,0,0,1,5.744.2L6,2A2.957,2.957,0,0,1,7.453.841.272.272,0,0,1,7.529.829.25.25,0,0,1,7.779,1.079Z\"></path></svg>"

/***/ }),
/* 193 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>natural-15</title><path d=\"M8.753,6.278a.5.5,0,0,1-.51,0A4.109,4.109,0,0,1,6.5,3.5a2.779,2.779,0,0,0-.59-1.506l-.019-.027a.257.257,0,0,1-.056-.144.237.237,0,0,1,.25-.25.264.264,0,0,1,.057.011A3.523,3.523,0,0,1,7.5,2.5L8.28.94a.246.246,0,0,1,.44,0L9.5,2.5a3.4,3.4,0,0,1,1.339-.907.283.283,0,0,1,.1-.021c.175.009.212.119.221.249a.35.35,0,0,1-.043.141A5.2,5.2,0,0,0,10.5,3.5,4.113,4.113,0,0,1,8.753,6.278ZM5,8H6.289a.25.25,0,0,0,.25-.25.241.241,0,0,0-.061-.15L4.7,5.235a.255.255,0,0,0-.391,0L2.518,7.589a.274.274,0,0,0-.062.161.25.25,0,0,0,.25.25H4L1.335,10.6a.273.273,0,0,0-.058.152A.25.25,0,0,0,1.529,11H3L1.435,12.565a.255.255,0,0,0,.18.435H4v1H5V13H7.385a.255.255,0,0,0,.18-.435L6,11H7.471a.25.25,0,0,0,.25-.25.233.233,0,0,0-.058-.149Zm9.345,3.748a.252.252,0,0,1-.252.252H8.908a.252.252,0,0,1-.226-.365L11.27,6.451a.252.252,0,0,1,.451,0l2.6,5.184h0A.251.251,0,0,1,14.345,11.748ZM12.75,10,11.5,7.5,10.25,10Z\"></path></svg>"

/***/ }),
/* 194 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M11,3.75C11,2.7835,10.2165,2,9.25,2c-0.2789,0.0012-0.5534,0.0698-0.8,0.2C8.4284,1.5308,7.8795,0.9997,7.21,1 C7.1386,1.0103,7.0683,1.027,7,1.05C6.9091,0.4341,6.3724-0.0168,5.75,0C5.2633,0.0026,4.8224,0.2874,4.62,0.73 C4.4366,0.6044,4.222,0.5317,4,0.52C3.5966,0.5282,3.223,0.7338,3,1.07C2.8417,1.0195,2.6761,0.9959,2.51,1 C1.6761,0.9991,0.9992,1.6743,0.9983,2.5083C0.9981,2.7043,1.036,2.8985,1.11,3.08C0.302,3.2358-0.2268,4.0171-0.071,4.8251 C0.0422,5.4122,0.4954,5.8748,1.08,6c0.2492,0.7843,1.087,1.218,1.8713,0.9688C3.2148,6.8851,3.4498,6.7297,3.63,6.52h0.12 c0.3212-0.0009,0.6295-0.1264,0.86-0.35V10L3,11h5l-1.6-1V9c0.6623-0.8086,1.4694-1.4868,2.38-2 c0.2593-0.0493,0.5009-0.1667,0.7-0.34l0,0l0,0C9.8179,6.3704,10.0086,5.9449,10,5.5c0.0033-0.0566,0.0033-0.1134,0-0.17 C10.6103,5.0405,10.9996,4.4255,11,3.75z M6.36,8.25V6h0.18c0.1812-0.0015,0.3607-0.0353,0.53-0.1 c0.1232,0.4546,0.4528,0.8249,0.89,1C7.375,7.2849,6.8378,7.7381,6.36,8.25z\"></path></svg>"

/***/ }),
/* 195 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,5.75c0.0113-0.6863-0.3798-1.3159-1-1.61C12.9475,3.4906,12.4014,2.9926,11.75,3 c-0.0988,0.0079-0.1962,0.0281-0.29,0.06c-0.0607-0.66-0.6449-1.1458-1.3048-1.0851C9.8965,1.9987,9.6526,2.1058,9.46,2.28l0,0 c0-0.6904-0.5596-1.25-1.25-1.25S6.96,1.5896,6.96,2.28C6.96,2.28,7,2.3,7,2.33C6.4886,1.8913,5.7184,1.9503,5.2797,2.4618 C5.1316,2.6345,5.0347,2.8451,5,3.07C4.8417,3.0195,4.6761,2.9959,4.51,3C3.6816,2.9931,3.0044,3.659,2.9975,4.4874 C2.9958,4.6872,3.0341,4.8852,3.11,5.07C2.3175,5.2915,1.8546,6.1136,2.0761,6.9061C2.2163,7.4078,2.6083,7.7998,3.11,7.94 c0.2533,0.7829,1.0934,1.2123,1.8763,0.959C5.5216,8.7258,5.9137,8.2659,6,7.71C6.183,7.8691,6.4093,7.9701,6.65,8v5L5,14h5l-1.6-1 v-2c0.7381-0.8915,1.6915-1.5799,2.77-2c0.8012,0.1879,1.603-0.3092,1.7909-1.1103C12.9893,7.7686,13.0025,7.6444,13,7.52 c0.0029-0.0533,0.0029-0.1067,0-0.16C13.6202,7.0659,14.0113,6.4363,14,5.75z M8.4,10.26V6.82C8.6703,7.3007,9.1785,7.5987,9.73,7.6 h0.28c0.0156,0.4391,0.2242,0.849,0.57,1.12C9.7643,9.094,9.0251,9.6162,8.4,10.26z\"></path></svg>"

/***/ }),
/* 196 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>park-alt1-11</title><path d=\"M9.571,8.563,7.425,6.424a.255.255,0,0,1-.069-.174A.25.25,0,0,1,7.6,6h.8a.25.25,0,0,0,.25-.25.246.246,0,0,0-.068-.165l-.008-.008L6.4,3.4a.27.27,0,0,1-.051-.149A.25.25,0,0,1,6.6,3H7.48a.257.257,0,0,0,.25-.258A.234.234,0,0,0,7.68,2.6L5.694.224A.223.223,0,0,0,5.343.186h0C5.327.2,3.352,2.578,3.352,2.578a.246.246,0,0,0-.068.164A.257.257,0,0,0,3.534,3H4.4a.25.25,0,0,1,.25.25.262.262,0,0,1-.066.17L2.431,5.571a.247.247,0,0,0-.077.178A.251.251,0,0,0,2.6,6h.789a.249.249,0,0,1,.25.249.3.3,0,0,1-.063.17L1.43,8.563A.253.253,0,0,0,1.6,9H5v1H6V9H9.4a.255.255,0,0,0,.249-.255A.248.248,0,0,0,9.571,8.563Z\"></path></svg>"

/***/ }),
/* 197 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>park-alt1-15</title><path d=\"M9.428,10.429a.269.269,0,0,1-.074-.18A.25.25,0,0,1,9.6,10h1.447a.25.25,0,0,0,.25-.25.258.258,0,0,0-.079-.179L9.07,7.419a.3.3,0,0,1-.063-.17A.249.249,0,0,1,9.257,7H10.4a.251.251,0,0,0,.25-.251.247.247,0,0,0-.077-.178L8.432,4.434,8.418,4.42a.262.262,0,0,1-.066-.17A.25.25,0,0,1,8.6,4h.866a.25.25,0,0,0,.25-.25.246.246,0,0,0-.068-.164h.006L7.7,1.238a.253.253,0,0,0-.042-.044A.249.249,0,0,0,7.5,1.139h0a.249.249,0,0,0-.158.055.253.253,0,0,0-.042.044L5.352,3.586a.246.246,0,0,0-.068.164.25.25,0,0,0,.25.25H6.4a.241.241,0,0,1,.184.42l-.014.014L4.431,6.571a.247.247,0,0,0-.077.178A.251.251,0,0,0,4.6,7H5.745a.249.249,0,0,1,.25.249.3.3,0,0,1-.063.17L3.782,9.571A.258.258,0,0,0,3.7,9.75a.25.25,0,0,0,.25.25H5.4a.25.25,0,0,1,.248.249.269.269,0,0,1-.074.18l-2.14,2.132-.009.009a.248.248,0,0,0,0,.351A.256.256,0,0,0,3.605,13H7v1l1-.008V13h3.391a.263.263,0,0,0,.26-.254.248.248,0,0,0-.071-.177Z\"></path></svg>"

/***/ }),
/* 198 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"parking\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M8.1,6.1C7.4363,6.5788,6.6268,6.8121,5.81,6.76H3.9V10H2V1h3.93c0.7801-0.0414,1.5484,0.2041,2.16,0.69 C8.6707,2.2518,8.9681,3.0449,8.9,3.85C8.9884,4.6825,8.6941,5.5101,8.1,6.1z M6.64,2.86c-0.289-0.2119-0.6421-0.3178-1-0.3H3.9 v2.65h1.72c0.3612,0.0191,0.717-0.0947,1-0.32c0.2559-0.2675,0.3867-0.6308,0.36-1C7.0323,3.5125,6.9068,3.1321,6.64,2.86z\"></path></svg>"

/***/ }),
/* 199 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11.85,8.37c-0.9532,0.7086-2.1239,1.0623-3.31,1H5.79V14H3V1h5.72c1.1305-0.0605,2.244,0.2952,3.13,1 c0.8321,0.8147,1.2543,1.9601,1.15,3.12C13.1271,6.3214,12.7045,7.5159,11.85,8.37z M9.75,3.7C9.3254,3.3892,8.8052,3.237,8.28,3.27 H5.79v3.82h2.49c0.5315,0.0326,1.056-0.1351,1.47-0.47c0.3795-0.3947,0.5693-0.9346,0.52-1.48C10.324,4.606,10.1327,4.0763,9.75,3.7 z\"></path></svg>"

/***/ }),
/* 200 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M7.25,7.44C6.8067,7.7602,6.2657,7.9158,5.72,7.88H4.45V10H3.19V4H5.8c0.5201-0.0279,1.0324,0.1358,1.44,0.46 c0.3847,0.372,0.5828,0.8966,0.54,1.43C7.8557,6.4611,7.6596,7.0348,7.25,7.44z M6.25,5.28c-0.1946-0.1475-0.4365-0.2186-0.68-0.2 H4.45v1.76H5.6c0.246,0.0129,0.4882-0.0654,0.68-0.22c0.1746-0.1813,0.2621-0.4293,0.24-0.68c0.023-0.2449-0.0651-0.4871-0.24-0.66 L6.25,5.28z M10.41,3.28c0.1349-0.2403,0.0499-0.5444-0.19-0.68l-4.5-2.5c-0.1521-0.0855-0.3379-0.0855-0.49,0l-4.5,2.5 C0.4972,2.7485,0.4288,3.0576,0.5773,3.2904C0.7144,3.5054,0.9913,3.5828,1.22,3.47l4.28-2.4l4.26,2.37 c0.2421,0.1328,0.546,0.0442,0.6789-0.1979C10.4392,3.2414,10.4396,3.2407,10.44,3.24L10.41,3.28z\"></path></svg>"

/***/ }),
/* 201 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path style=\"fill:#231F20;\" d=\"M10.5,10.14c-0.6637,0.4788-1.4732,0.7121-2.29,0.66h-1.9V14h-1.9V5h3.92 c0.7801-0.0414,1.5484,0.2041,2.16,0.69c0.5779,0.5595,0.875,1.3483,0.81,2.15C11.4042,8.6892,11.1088,9.5388,10.5,10.14z M9,6.9 C8.711,6.6881,8.3579,6.5822,8,6.6H6.31v2.65H8c0.3612,0.0191,0.717-0.0947,1-0.32c0.2559-0.2675,0.3867-0.6308,0.36-1 C9.4072,7.5493,9.274,7.1684,9,6.9z M14.41,4.21c0.114-0.2486,0.007-0.5427-0.24-0.66L7.5,0.45l-6.71,3.1 C0.5387,3.666,0.429,3.9637,0.545,4.215C0.661,4.4663,0.9587,4.576,1.21,4.46l0,0L7.5,1.55l6.29,2.9 c0.2486,0.114,0.5427,0.007,0.66-0.24H14.41z\"></path></svg>"

/***/ }),
/* 202 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M6,4l2-2C7.9899,1.9304,7.9899,1.8596,8,1.79c0-0.4142,0.3358-0.75,0.75-0.75S9.5,1.3758,9.5,1.79S9.1642,2.54,8.75,2.54 H8.64L7.5,4H6z M9.48,5.83L8.65,7.5l0.83,1.67V10h-8V9.17L2.32,7.5L1.48,5.83V5h8V5.83z M7.5,7H6V5.5H5V7H3.5v1H5v1.5h1V8h1.5V7z\"></path></svg>"

/***/ }),
/* 203 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M9.5,4l1.07-1.54c0.0599,0.0046,0.1201,0.0046,0.18,0c0.6904-0.0004,1.2497-0.5603,1.2494-1.2506 C11.999,0.519,11.4391-0.0404,10.7487-0.04C10.0584-0.0396,9.499,0.5203,9.4994,1.2106c0,0.0131,0.0002,0.0262,0.0006,0.0394 c0,0,0,0.07,0,0.1L7,4H9.5z M12,6V5H3v1l1.5,3.5L3,13v1h9v-1l-1-3.5L12,6z M10,10H8v2H7v-2H5V9h2V7h1v2h2V10z\"></path></svg>"

/***/ }),
/* 204 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"picnic-site-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect4760\" d=\"M2.75,2C2.3345,2,2,2.3345,2,2.75S2.3345,3.5,2.75,3.5H4L3.5391,5H1.75C1.3345,5,1,5.3345,1,5.75 S1.3345,6.5,1.75,6.5h1.3262L2,10h1l1.0762-3.5h2.8477L8,10h1L7.9238,6.5H9.25C9.6655,6.5,10,6.1655,10,5.75S9.6655,5,9.25,5H7.4609 L7,3.5h1.25C8.6655,3.5,9,3.1655,9,2.75S8.6655,2,8.25,2H2.75z M5,3.5h1L6.4609,5H4.5391L5,3.5z\"></path></svg>"

/***/ }),
/* 205 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"picnic-site-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect4760\" inkscape:connector-curvature=\"0\" style=\"fill:#010101;\" d=\"M4,3C3.446,3,3,3.446,3,4s0.446,1,1,1h1.2969 L4.6523,7H2.5c-0.554,0-1,0.446-1,1s0.446,1,1,1h1.5098L3.041,12.0098c-0.1284,0.3939,0.0868,0.8173,0.4807,0.9457 s0.8173-0.0868,0.9457-0.4807c0.0005-0.0013,0.0009-0.0027,0.0013-0.004L5.5859,9h3.8281l1.1172,3.4707 c0.1273,0.3943,0.5501,0.6107,0.9443,0.4834s0.6107-0.5501,0.4834-0.9443l0,0L10.9902,9H12.5c0.554,0,1-0.446,1-1s-0.446-1-1-1 h-2.1523L9.7031,5H11c0.554,0,1-0.446,1-1s-0.446-1-1-1H4z M6.873,5H8.127l0.6445,2h-2.543L6.873,5z\"></path></svg>"

/***/ }),
/* 206 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M4,2C3.4477,2,3,1.5523,3,1s0.4477-1,1-1s1,0.4477,1,1S4.5523,2,4,2z M10.5,8H9L8,5L7,3.25L8,3l2.3,1l0,0 c0.2761,0.0994,0.5806-0.0439,0.68-0.32c0.0994-0.2761-0.0439-0.5806-0.32-0.68l0,0L8,2H6L4,3L3,4H1.47 c-0.2761,0-0.5,0.2239-0.5,0.5S1.1939,5,1.47,5H4l1-1l1,2L4,7v3.5C4,10.7761,4.2239,11,4.5,11S5,10.7761,5,10.5V7.39L7,7l1,2h2.5 C10.7761,9,11,8.7761,11,8.5S10.7761,8,10.5,8z\"></path></svg>"

/***/ }),
/* 207 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M5,3C4.4477,3,4,2.5523,4,2s0.4477-1,1-1s1,0.4477,1,1S5.5523,3,5,3z M12.5,10H10L9,7L8,5.25L9,5l2.3,1l0,0 c0.2761,0.1105,0.5895-0.0239,0.7-0.3S11.9761,5.1105,11.7,5l0,0L9,4H7L5,5L4,6H2.5C2.2239,6,2,6.2239,2,6.5S2.2239,7,2.5,7H5l1-1 l1,2l-2,2v3.5C5,13.7761,5.2239,14,5.5,14S6,13.7761,6,13.5v-3.11L8,9l1,2h3.5c0.2761,0,0.5-0.2239,0.5-0.5S12.7761,10,12.5,10z\"></path></svg>"

/***/ }),
/* 208 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.52,0L4,2v1h3V2L5.52,0z M4,4L2,5v5h7V5L7,4H4z M11,5.5V10h-1V5.5C10,5.2239,10.2239,5,10.5,5S11,5.2239,11,5.5z M1,5.5 V10H0V5.5C0,5.2239,0.2239,5,0.5,5S1,5.2239,1,5.5z\"></path></svg>"

/***/ }),
/* 209 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"place-of-worship-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path9064\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccssccsscccccssccss\" d=\"M7.5,0l-2,2v2h4V2 L7.5,0z M5.5,4.5L4,6h7L9.5,4.5H5.5z M2,6.5c-0.5523,0-1,0.4477-1,1V13h2V7.5C3,6.9477,2.5523,6.5,2,6.5z M4,6.5V13h7V6.5H4z M13,6.5c-0.5523,0-1,0.4477-1,1V13h2V7.5C14,6.9477,13.5523,6.5,13,6.5z\"></path></svg>"

/***/ }),
/* 210 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M1,0.79c0.1286-0.5371,0.6683-0.8683,1.2054-0.7397S3.0736,0.7186,2.945,1.2557C2.8183,1.7849,2.2917,2.1156,1.76,2 C1.2203,1.8826,0.878,1.35,0.9954,0.8103C0.9968,0.8035,0.9984,0.7968,1,0.79z M10.85,8.16L10.85,8.16l-2-2l0,0 C8.76,6.0612,8.6336,6.0034,8.5,6H8.37l0,0L6.5,6.55V4l0,0C6.746,4.0083,6.96,3.8328,7,3.59C7.0558,3.3225,6.8866,3.0598,6.62,3H6.5 V0H6.28v3L1.82,3.55l0,0C1.4201,3.6111,1.0965,3.9072,1,4.3C0.9688,4.4416,0.9688,4.5884,1,4.73l0,0l0.81,3.13l0,0 c0.1012,0.3354,0.3706,0.5933,0.71,0.68c0.1513,0.0357,0.3087,0.0357,0.46,0H3l3.29-0.89v1.62l-3,0.74l0,0 c-0.2761,0.0856-0.4306,0.3789-0.345,0.655c0.0856,0.2761,0.3789,0.4306,0.655,0.345c0.0566,0.0051,0.1134,0.0051,0.17,0l4-1 c0.2761-0.0828,0.4328-0.3739,0.35-0.65C8.0372,9.0839,7.7461,8.9272,7.47,9.01L7.27,9L6.5,9.22V7.58l1.83-0.51l1.81,1.78l0,0 c0.1758,0.213,0.4909,0.2432,0.7039,0.0674c0.213-0.1758,0.2432-0.4909,0.0674-0.7039C10.8956,8.1945,10.8784,8.1766,10.86,8.16 H10.85z M6.28,6.61L4.21,7.07L3.5,4.33L6.28,4V6.61z\"></path></svg>"

/***/ }),
/* 211 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M2,1.15c0.2091-0.8016,1.0284-1.2819,1.83-1.0729s1.2819,1.0284,1.0729,1.83C4.7026,2.6752,3.9386,3.1542,3.16,3 C2.3474,2.839,1.8191,2.0498,1.98,1.2371C1.9858,1.2079,1.9925,1.1788,2,1.15z M13,12.32c0.1032,0.5426-0.2531,1.066-0.7956,1.1692 c-0.0015,0.0003-0.0029,0.0006-0.0044,0.0008c-0.4252,0.086-0.8574-0.1119-1.07-0.49l0,0L9.45,9.63L8,9.92L7.78,10H7.72v2.15 L8.34,12h0.14c0.2871,0.0054,0.5155,0.2425,0.5101,0.5297C8.9862,12.7361,8.8606,12.9207,8.67,13l-5,1l0,0 c-0.0563,0.0095-0.1137,0.0095-0.17,0c-0.2872,0-0.52-0.2328-0.52-0.52c0-0.2099,0.1262-0.3993,0.32-0.48l0,0l4.15-0.83V10 l-3.22,0.58l0,0c-0.164,0.0423-0.336,0.0423-0.5,0c-0.3394-0.0867-0.6088-0.3446-0.71-0.68H3L2,5.83l0,0 C1.9688,5.6884,1.9688,5.5416,2,5.4c0.0936-0.387,0.4078-0.6815,0.8-0.75l0,0l4.7-0.52V0h0.22v4.1h0.06L8,4.08L8.4,4h0.21 c0.2673,0.0643,0.4326,0.3323,0.37,0.6C8.9361,4.835,8.729,5.0041,8.49,5L8,5.08H7.78H7.72v2.86h0.06L8,7.88l1.81-0.36l0,0l0,0 c0.4275-0.0352,0.8299,0.2062,1,0.6l0,0l2,3.94l0,0C12.887,12.1358,12.9511,12.2236,13,12.32z M7.5,5.13L5,5.4l0.74,2.94L7.5,8V5.13 z\"></path></svg>"

/***/ }),
/* 212 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"police-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"circle4929\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccsssccscccccccsccscccsc\" d=\"M4.5,0.5l0.5,1h3 l0.5-1H4.5z M5,2v1c0,0.8284,0.6716,1.5,1.5,1.5S8,3.8284,8,3V2H5z M1.75,3C1,3,1,3.75,1,3.75v3 c0.0006,0.506,0.4918,0.8663,0.9746,0.7148L4,6.8262V10l4-5H5c0,0-0.1945,0-0.4238,0.0723L2.5,5.7266V3.75C2.5,3.75,2.5,3,1.75,3z M8.7715,5.3887L5,10h4V6C9,5.7648,8.9064,5.5591,8.7715,5.3887z\"></path></svg>"

/***/ }),
/* 213 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"police-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect4718\" d=\"M5.5,1L6,2h5l0.5-1H5.5z M6,2.5v1.25c0,0,0,2.75,2.5,2.75S11,3.75,11,3.75V2.5H6z M1.9844,3.9863 C1.4329,3.9949,0.9924,4.4485,1,5v4c-0.0001,0.6398,0.5922,1.1152,1.2168,0.9766L5,9.3574V14l5.8789-6.9297 C10.7391,7.0294,10.5947,7,10.4414,7H6.5L3,7.7539V5C3.0077,4.4362,2.5481,3.9775,1.9844,3.9863z M11.748,7.7109L6.4121,14H12 V8.5586C12,8.2451,11.9061,7.9548,11.748,7.7109z\"></path></svg>"

/***/ }),
/* 214 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M10,5.5V9c0,0.5523-0.4477,1-1,1H2c-0.5523,0-1-0.4477-1-1V5.5C1,5.2239,1.2239,5,1.5,5c0.0692-0.0152,0.1408-0.0152,0.21,0 l0,0L5.5,7l3.8-2l0,0c0.066-0.0138,0.134-0.0138,0.2,0C9.7761,5,10,5.2239,10,5.5z M1.25,2.92L1.25,2.92L1.33,3L5.5,5l4.19-2l0,0 h0.06l0,0C9.9296,2.9019,10.0292,2.7025,10,2.5C10,2.2239,9.7761,2,9.5,2h-8C1.2239,2,1,2.2239,1,2.5 C1.0026,2.6745,1.0978,2.8345,1.25,2.92z\"></path></svg>"

/***/ }),
/* 215 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M14,6.5V12c0,0.5523-0.4477,1-1,1H2c-0.5523,0-1-0.4477-1-1V6.5C1,6.2239,1.2239,6,1.5,6 c0.0692-0.0152,0.1408-0.0152,0.21,0l0,0l5.79,4l5.8-4l0,0c0.066-0.0138,0.134-0.0138,0.2,0C13.7761,6,14,6.2239,14,6.5z M1.25,3.92 L1.25,3.92L1.33,4L7.5,8l6.19-4l0,0h0.06l0,0c0.1796-0.0981,0.2792-0.2975,0.25-0.5C14,3.2239,13.7761,3,13.5,3h-12 C1.2239,3,1,3.2239,1,3.5C1.0026,3.6745,1.0978,3.8345,1.25,3.92z\"></path></svg>"

/***/ }),
/* 216 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"prison-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3607\" d=\"M2,1v9h7V1H2z M3,2h1v3H3V2z M5,2h1v3H5V2z M7,2h1v2H7V2z M7.5,5C7.7761,5,8,5.2239,8,5.5S7.7761,6,7.5,6 S7,5.7761,7,5.5S7.2239,5,7.5,5z M3,6h1v3H3V6z M5,6h1v3H5V6z M7,7h1v2H7V7z\"></path></svg>"

/***/ }),
/* 217 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"prison-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect3607\" d=\"M3.5,1v13H12V1H3.5z M9.5,2H11v3.5H9.5V2z M4.5,2.0547H6V7H4.5V2.0547z M7,2.0547h1.5V7H7V2.0547z M10.25,6.5 C10.6642,6.5,11,6.8358,11,7.25S10.6642,8,10.25,8l0,0C9.8358,8,9.5,7.6642,9.5,7.25l0,0C9.5,6.8358,9.8358,6.5,10.25,6.5z M7,8 h1.4727L8.5,13H7.0273L7,8z M4.5,8.166H6V13H4.5V8.166z M9.5,9H11v4H9.5V9z\"></path></svg>"

/***/ }),
/* 218 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,10.5C9,10.7761,8.7761,11,8.5,11c-0.1824-0.0029-0.3481-0.107-0.43-0.27l0,0L7.69,10H3.31l-0.37,0.74l0,0 C2.8537,10.9023,2.6838,11.0027,2.5,11C2.2239,11,2,10.7761,2,10.5c0.0022-0.0847,0.0263-0.1674,0.07-0.24l0,0l1-2l0,0 C3.1546,8.1008,3.3198,8.001,3.5,8c0.2751-0.0235,0.5172,0.1805,0.5407,0.4556C4.0479,8.5392,4.0339,8.6233,4,8.7L3.81,9h3.38L7,8.7 C6.8991,8.443,7.0256,8.1528,7.2826,8.0518C7.514,7.9609,7.7771,8.0539,7.9,8.27l0,0l1,2l0,0C8.9527,10.3367,8.9872,10.416,9,10.5z M8,0H3C2.4477,0,2,0.4477,2,1v5c0,0.5523,0.4477,1,1,1h5c0.5523,0,1-0.4477,1-1V1C9,0.4477,8.5523,0,8,0z M3.5,6 C3.2239,6,3,5.7761,3,5.5S3.2239,5,3.5,5S4,5.2239,4,5.5S3.7761,6,3.5,6z M3.5,4C3.2239,4,3,3.7761,3,3.5v-2 C3,1.2239,3.2239,1,3.5,1h1.79v3H3.5z M7.5,6C7.2239,6,7,5.7761,7,5.5S7.2239,5,7.5,5S8,5.2239,8,5.5S7.7761,6,7.5,6z M8,3.5 C8,3.7761,7.7761,4,7.5,4H5.69V1H7.5C7.7761,1,8,1.2239,8,1.5V3.5z\"></path></svg>"

/***/ }),
/* 219 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" version=\"1.1\" id=\"Layer_1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"rail-15.svg\"><metadata id=\"metadata11\"><rdf:RDF><cc:Work rdf:about><dc:format>image/svg+xml</dc:format><dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\"></dc><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id=\"defs9\"></defs><sodipodi:namedview pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1\" objecttolerance=\"10\" gridtolerance=\"10\" guidetolerance=\"10\" inkscape:pageopacity=\"0\" inkscape:pageshadow=\"2\" inkscape:window-width=\"1735\" inkscape:window-height=\"697\" id=\"namedview7\" showgrid=\"true\" inkscape:zoom=\"22.250293\" inkscape:cx=\"-0.89448384\" inkscape:cy=\"7.3284519\" inkscape:window-x=\"20\" inkscape:window-y=\"43\" inkscape:window-maximized=\"0\" inkscape:current-layer=\"Layer_1\"><inkscape:grid type=\"xygrid\" id=\"grid3339\"></inkscape></sodipodi:namedview><path d=\"M 3 1 C 2.4477 1 2 1.4477 2 2 L 2 10 C 2 10.5523 2.4477 11 3 11 L 12 11 C 12.5523 11 13 10.5523 13 10 L 13 2 C 13 1.4477 12.5523 1 12 1 L 3 1 z M 5.75 1.5 L 5.7597656 1.5 L 9.2597656 1.5 C 9.3978656 1.5 9.5097656 1.6119 9.5097656 1.75 C 9.5097656 1.8881 9.3978656 2 9.2597656 2 L 5.75 2 C 5.6119 2 5.5 1.8881 5.5 1.75 C 5.5 1.6119 5.6119 1.5 5.75 1.5 z M 3.5 3 L 7 3 L 7 7 L 3.5 7 C 3.2239 7 3 6.7761 3 6.5 L 3 3.5 C 3 3.2239 3.2239 3 3.5 3 z M 8 3 L 11.5 3 C 11.7761 3 12 3.2239 12 3.5 L 12 6.5 C 12 6.7761 11.7761 7 11.5 7 L 8 7 L 8 3 z M 5 8 C 5.5523 8 6 8.4477 6 9 C 6 9.5523 5.5523 10 5 10 C 4.4477 10 4 9.5523 4 9 C 4 8.4477 4.4477 8 5 8 z M 10 8 C 10.5523 8 11 8.4477 11 9 C 11 9.5523 10.5523 10 10 10 C 9.4477 10 9 9.5523 9 9 C 9 8.4477 9.4477 8 10 8 z M 10.445312 11.994141 C 10.380597 11.999652 10.314981 12.018581 10.253906 12.050781 C 10.030606 12.168381 9.9302313 12.433922 10.019531 12.669922 L 10.189453 13 L 4.8105469 13 L 4.9394531 12.730469 C 5.0371531 12.472169 4.9067375 12.183637 4.6484375 12.085938 C 4.4124375 11.996738 4.1468969 12.097113 4.0292969 12.320312 L 3.0292969 14.320312 C 3.0080969 14.377912 2.9986 14.4387 3 14.5 C 3 14.7761 3.2239 15 3.5 15 C 3.6802 14.999 3.8450875 14.899434 3.9296875 14.740234 L 3.9296875 14.689453 L 4 14.689453 L 4.3105469 14 L 10.689453 14 L 11 14.689453 L 11 14.740234 C 11.0846 14.899434 11.249488 14.999 11.429688 15 C 11.705787 15 11.929688 14.7761 11.929688 14.5 C 11.949587 14.4212 11.949587 14.338566 11.929688 14.259766 L 10.929688 12.259766 C 10.833163 12.076541 10.639459 11.977608 10.445312 11.994141 z \" id=\"path3\"></path></svg>"

/***/ }),
/* 220 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"rail-light-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path14245\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccccccccccccccccccccccccccccccccccc\" d=\"M4,0 C3.5,0,3.5,0.5,3.5,0.5S3.5,1,4,1h1v0.9707L4,2c0,0-1,0-1,1v3c0,2,2,2,2,2h1c0,0,2,0,2-2V3c0-1-1-1-1-1H6V1h1c0.5,0,0.5-0.5,0.5-0.5 S7.5,0,7,0H4z M5.5,3L7,3.5V5H5.5H4V3.5L5.5,3z M5.5,6C5.777,6,6,6.223,6,6.5S5.777,7,5.5,7S5,6.777,5,6.5S5.223,6,5.5,6z M2.834,8.5L2,11h1.5l0.334-1h3.332L7.5,11H9L8.166,8.5H6.668L6.834,9H4.166l0.166-0.5H2.834z\"></path></svg>"

/***/ }),
/* 221 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"rail-light-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path14245\" d=\"M5.5,0C5,0,5,0.5,5,0.5v1C5,1.777,5.223,2,5.5,2S6,1.777,6,1.5V1h1v2H6c0,0-2,0-2,2v3c0,3,3,3,3,3h1 c0,0,3,0,3-3V5c0-2-2-2-2-2H8V1h1v0.5C9,1.777,9.223,2,9.5,2S10,1.777,10,1.5v-1C10,0,9.5,0,9.5,0H5.5z M7.5,4l2.0449,0.7734L10,6.5 C10.1316,7,9.5,7,9.5,7h-4c0,0-0.6316,0-0.5-0.5l0.4551-1.7266L7.5,4z M7.5,8C7.7761,8,8,8.2239,8,8.5S7.7761,9,7.5,9 S7,8.7761,7,8.5S7.2239,8,7.5,8z M4.125,12L3,15h1.5l0.375-1h5.25l0.375,1H12l-1.125-3h-1.5l0.375,1h-4.5l0.375-1H4.125z\"></path></svg>"

/***/ }),
/* 222 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"rail-metro-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path14200\" d=\"M3.5,0C3,0,3,0.5,3,0.5L2,5v1c0,1.0244,1,1,1,1h5c0,0,1,0,1-1V5L8,0.5C8,0.5,8,0,7.5,0H3.5z M4,1h3l0.5,3h-4 L4,1z M3.5,5C3.7761,5,4,5.2239,4,5.5S3.7761,6,3.5,6S3,5.7761,3,5.5S3.2239,5,3.5,5z M5.25,5h0.5C5.8885,5,6,5.1115,6,5.25 S5.8885,5.5,5.75,5.5h-0.5C5.1115,5.5,5,5.3885,5,5.25S5.1115,5,5.25,5z M7.5,5C7.7761,5,8,5.2239,8,5.5S7.7761,6,7.5,6 S7,5.7761,7,5.5S7.2239,5,7.5,5z M3,8l-1,3h1.5l0.334-1h3.332L7.5,11H9L8,8H6.5l0.334,1H4.166L4.5,8H3z\"></path></svg>"

/***/ }),
/* 223 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"rail-metro-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path5258\" d=\"M5.5,0c0,0-0.75,0-1,1L3,6.5V10c0,1,1,1,1,1h7c0,0,1,0,1-1V6.5L10.5,1c-0.2727-1-1-1-1-1H5.5z M6.5,1.5h2 c0,0,0.5357,0,0.75,1L10,6c0.2146,1.0017-1,1-1,1H6c0,0-1.2146,0.0017-1-1l0.75-3.5C5.9643,1.5,6.5,1.5,6.5,1.5z M5,8 c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1S4,9.5523,4,9S4.4477,8,5,8z M6.75,8h1.5C8.3885,8,8.5,8.1115,8.5,8.25S8.3885,8.5,8.25,8.5 h-1.5C6.6115,8.5,6.5,8.3885,6.5,8.25S6.6115,8,6.75,8z M10,8c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1S9,9.5523,9,9S9.4477,8,10,8z M4.125,12L3,15h1.5l0.375-1h5.25l0.375,1H12l-1.125-3h-1.5l0.375,1h-4.5l0.375-1H4.125z\"></path></svg>"

/***/ }),
/* 224 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"ranger-station-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect4911\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccccccccc\" d=\"M6.334,0L5,1v3L1,6.0547V10h3V7 h3v3h3V6.0547L6,4V2.25L6.334,2l1.332,1L9,2V0L7.666,1L6.334,0z\"></path></svg>"

/***/ }),
/* 225 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"ranger-station-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect4911\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccccccccccc\" d=\"M9,0.5l-2,1v3.7734L2,8v6h4v-4h3 v4h4V8L8,5.2734V4l1-0.5l2,1l2-1v-3l-2,1L9,0.5z\"></path></svg>"

/***/ }),
/* 226 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>recycling-11</title><path d=\"M9.5,8.5C8.953,9.019,7.84,8.935,7,9v1L4.5,8.5L7,7v1h1c0.634,0,0.83,0,1.054-0.127 c0.3524-0.1763,0.5267-0.5807,0.413-0.958C9.3824,6.5569,9.8667,6.4902,9.952,6.8C10.1235,7.4067,9.9502,8.0586,9.5,8.5z M1.9482,5.0922C1.9479,5.0928,1.9473,5.0934,1.947,5.094c-0.4,0.743-1.065,1.637-0.921,2.377 c0.1311,0.6165,0.5882,1.1123,1.192,1.293c0.3722,0.1203,0.4663-0.3954,0.161-0.472C2.0002,8.1852,1.753,7.8215,1.793,7.43 c0.012-0.258,0.122-0.42,0.461-0.956c0.134-0.211,0.309-0.485,0.537-0.843c0.0003-0.0004,0.0005-0.0008,0.0008-0.0012L3.635,6.167 l0.078-2.914L1.105,4.555L1.9482,5.0922z M4.884,1.914c0.2504-0.3036,0.6828-0.3834,1.025-0.189C6.14,1.84,6.245,2.006,6.598,2.532 c0.14,0.208,0.32,0.479,0.555,0.832l0.0001,0.0001L6.322,3.919l2.636,1.246L8.817,2.253L7.9843,2.8091 C7.4644,2.1472,6.9173,1.1786,6.188,1.014C5.5701,0.8809,4.9288,1.0965,4.517,1.576C4.2529,1.9137,4.7157,2.1216,4.884,1.914z\"></path></svg>"

/***/ }),
/* 227 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>recycling-15</title><path d=\"M2.4556,8.6134C2.118,9.2112,1.501,10.3021,2.593,11.0312c0.3432,0.2268,0.7275,0.3836,1.131,0.4614 C4.0314,11.5382,4.0466,12.0111,3.6855,12c-0.3849-0.0193-2.2596-0.1934-2.5606-1.5995c-0.1556-0.8213,0.0204-1.5571,0.504-2.3556 L2.3263,6.812L1.0196,6.0688L4.5,4v4L3.1941,7.3057L2.4556,8.6134z M6.7,2.034c1.155-0.628,1.823,0.43,2.191,1.007l0.8059,1.2631 L8.431,5.112L12,6.986L11.803,2.96l-1.2639,0.8066L9.779,2.578C9.2572,1.8321,8.875,1.2812,7.944,1.033 C6.307,0.7203,5.3007,2.6194,5.311,2.607c-0.1639,0.2871,0.2156,0.5399,0.451,0.21C6.0202,2.4969,6.339,2.2309,6.7,2.034z M13.294,8.221c-0.0877-0.1897-0.5487-0.1413-0.419,0.267c0.1312,0.3892,0.1845,0.8003,0.157,1.21C12.939,11.01,11.684,11,11,11H9.5 V9.5l-3.5,2l3.488,2.025L9.4926,12H11c0.8906,0.0153,1.5999-0.1759,2.2-0.713C14.4,10.226,13.294,8.221,13.294,8.221z\"></path></svg>"

/***/ }),
/* 228 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"religious-christian-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3338\" d=\"M4.5,0v3H2v2h2.5v6h2V5H9V3H6.5V0H4.5z\"></path></svg>"

/***/ }),
/* 229 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"religious-christian-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect3338\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccczccc\" d=\"M6,0.9552V4H3v3h3v8h3V7h3V4H9V1 c0-1-0.9776-1-0.9776-1H6.9887C6.9887,0,6,0,6,0.9552z\"></path></svg>"

/***/ }),
/* 230 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M11,8H7.1l-1.6,3L3.9,8H0l1.95-2.5L0,3h3.9l1.6-3l1.6,3H11L9.05,5.5L11,8z\"></path></svg>"

/***/ }),
/* 231 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M15,12H9.78L7.5,15l-2.26-3H0l2.7-4L0,4h5.3l2.2-4l2.34,4H15l-2.56,4L15,12z\"></path></svg>"

/***/ }),
/* 232 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"religious-muslim-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path16908\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssscssscsccccccccccc\" d=\"M4.9,0C2.2,0,0,2.2,0,4.9 s2.2,4.9,4.9,4.9c0.9,0,1.7-0.2,2.4-0.6H6.7c-2.4,0-4.3-1.9-4.3-4.3s1.9-4.3,4.3-4.3h0.6C6.5,0.2,5.8,0,4.9,0z M8.5,2L7.6845,3.7 L6,4l1,1.5L6.5,7l2-1l2,1L10,5.5L11,4L9.5,3.7L8.5,2z\"></path></svg>"

/***/ }),
/* 233 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"religious-muslim-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path7552-2-1\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ssscssscsccccccccccc\" d=\"M6.7941,0C3,0,0,3,0,6.7941 s3,6.7941,6.7941,6.7941c2.1176,0,4.4118-0.7059,5.6471-2.2941C11.6471,11.8235,10.1471,12.4412,9,12.4412 c-2.9118,0-5.1176-2.9118-5.1176-5.8235S6.0882,1.1471,9,1.1471c1.0588,0,2.5588,0.6176,3.4412,1.1471 C11.2059,0.7059,8.9118,0,6.7941,0z M11,3l-1,2.5H7L9.5,7l-1,3L11,8.5l2.5,1.5l-1-3L15,5.5h-3L11,3z\"></path></svg>"

/***/ }),
/* 234 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><title>buildings</title><path d=\"M8.8,8C9.5,7.9,10,7.2,10,6.5C10,5.7,9.3,5,8.5,5S7,5.7,7,6.5C7,7.2,7.5,7.9,8.2,8v1.5H6.4H6V1H2v8.5H1V10h1h4.4h1.9h0.5H10 V9.5H8.8V8z M3,2h2v1H3V2z M3,4h2v1H3V4z M3,6h2v1H3V6z\"></path></svg>"

/***/ }),
/* 235 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><title>buildings</title><path d=\"M11.8,13.5V11c0.7-0.1,1.2-0.7,1.2-1.5S12.3,8,11.5,8S10,8.7,10,9.5c0,0.7,0.5,1.4,1.2,1.5v2.5H7V2H2v11.5H1V14h13v-0.5 H11.8z M6,11H3v-1h3V11z M6,9H3V8h3V9z M6,7H3V6h3V7z M6,5H3V4h3V5z\"></path></svg>"

/***/ }),
/* 236 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r\" sodipodi:docname=\"restaurant-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path11193\" d=\"M2.25,0l-0.5,3.5C1.6793,3.995,2.9908,4.9001,3,5.5V11h1V5.5c0-0.6,1.3207-1.505,1.25-2L4.75,0h-0.5 L4.5,2.75l-0.75,0.5V0h-0.5v3.25L2.5,2.75L2.75,0H2.25z M9,0C7.5,0,7.0064,1.7242,7,3v3h1v5h1V0z\"></path></svg>"

/***/ }),
/* 237 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r\" sodipodi:docname=\"restaurant-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path11774\" d=\"M3.5,0l-1,5.5c-0.1464,0.805,1.7815,1.181,1.75,2L4,14c-0.0384,0.9993,1,1,1,1s1.0384-0.0007,1-1L5.75,7.5 c-0.0314-0.8176,1.7334-1.1808,1.75-2L6.5,0H6l0.25,4L5.5,4.5L5.25,0h-0.5L4.5,4.5L3.75,4L4,0H3.5z M12,0 c-0.7364,0-1.9642,0.6549-2.4551,1.6367C9.1358,2.3731,9,4.0182,9,5v2.5c0,0.8182,1.0909,1,1.5,1L10,14c-0.0905,0.9959,1,1,1,1 s1,0,1-1V0z\"></path></svg>"

/***/ }),
/* 238 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"g12530\" d=\"M5.5,0C2.4624,0,0,2.4624,0,5.5S2.4624,11,5.5,11S11,8.5376,11,5.5S8.5376,0,5.5,0z M2,4.5h7v2H2V4.5z\"></path></svg>"

/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"roadblock-24\" d=\"M7.5,0C3.3579,0,0,3.3579,0,7.5S3.3579,15,7.5,15S15,11.6421,15,7.5S11.6421,0,7.5,0z M3,6h9v3H3V6z\"></path></svg>"

/***/ }),
/* 240 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"rocket-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path7143\" d=\"M9,1C7.488,1,5.4077,2.1459,4.0488,4H3C2.1988,4,1.8162,4.3675,1.5,5L1,6h1h1l1,1l1,1v1v1l1-0.5 C6.6325,9.1838,7,8.8012,7,8V6.9512C8.8541,5.5923,10,3.512,10,2V1H9z M7.5,3C7.7761,3,8,3.2239,8,3.5S7.7761,4,7.5,4 S7,3.7761,7,3.5S7.2239,3,7.5,3z M2.75,7.25L2.5,7.5C2,8,2,9,2,9s0.9448,0.0552,1.5-0.5l0.25-0.25L2.75,7.25z\"></path></svg>"

/***/ }),
/* 241 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"rocket-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path7143\" inkscape:connector-curvature=\"0\" d=\"M12.5547,1c-2.1441,0-5.0211,1.471-6.9531,4H4 C2.8427,5,2.1794,5.8638,1.7227,6.7773L1.1113,8h1.4434H4l1.5,1.5L7,11v1.4453v1.4434l1.2227-0.6113 C9.1362,12.8206,10,12.1573,10,11V9.3984c2.529-1.932,4-4.809,4-6.9531V1H12.5547z M10,4c0.5523,0,1,0.4477,1,1l0,0 c0,0.5523-0.4477,1-1,1l0,0C9.4477,6,9,5.5523,9,5v0C9,4.4477,9.4477,4,10,4L10,4z M3.5,10L3,10.5C2.2778,11.2222,2,13,2,13 s1.698-0.198,2.5-1L5,11.5L3.5,10z\"></path></svg>"

/***/ }),
/* 242 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M8.5,9V8H10V6H7.5V5H10V3H8.5V2H10V1H6v9h4V9H8.5z M4,7H1V1h3V7z M4,8l-1.5,2L1,8H4z\"></path></svg>"

/***/ }),
/* 243 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11,13v-1h2v-1H9.5v-1H13V9h-2V8h2V7h-2V6h2V5H9.5V4H13V3h-2V2h2V1H8v13h5v-1H11z M6,11H2V1h4V11z M6,12l-2,2l-2-2H6z\"></path></svg>"

/***/ }),
/* 244 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>scooter-11</title><path d=\"M1,9H3a.979.979,0,0,1-1,1A.979.979,0,0,1,1,9ZM9.753,4H9V3h.351a.282.282,0,0,0,.223-.148l.268-.536a.333.333,0,0,0,.009-.066A.25.25,0,0,0,9.6,2H9V1.5H6.25a.25.25,0,0,0,0,.5H8V4.5L5,7H4V5.5A.5.5,0,0,0,3.5,5H3V4H4.75A.25.25,0,0,0,5,3.75a.245.245,0,0,0-.223-.239V3.5L1.25,3A.25.25,0,0,0,1,3.25v.5A.25.25,0,0,0,1.25,4H2V5H1.5a.5.5,0,0,0-.5.5V8H6.172a1,1,0,0,0,.709-.294L7.3,7.292A1,1,0,0,1,8,7H9.752A.248.248,0,0,0,10,6.752v-2.5A.247.247,0,0,0,9.753,4ZM9,8a1,1,0,1,0,1,1A1,1,0,0,0,9,8Z\"></path></svg>"

/***/ }),
/* 245 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>scooter-15</title><path d=\"M4.908,12a1.5,1.5,0,1,1-2.816,0Zm8.65-6C13.539,6,13,6,13,6V3h.351a.282.282,0,0,0,.223-.148l.268-.536a.334.334,0,0,0,.009-.066A.25.25,0,0,0,13.6,2H13V1.7a.215.215,0,0,0-.2-.2H9.25a.25.25,0,0,0,0,.5H12V6.6L7.6,10H6V7.5A.5.5,0,0,0,5.5,7H5V5H6.75a.25.25,0,0,0,0-.5L2.266,4.034c-.006,0-.01-.007-.016-.007a.25.25,0,0,0-.25.25V4.75A.25.25,0,0,0,2.25,5H3V7H2.5A1.538,1.538,0,0,0,1,8.5v2a.472.472,0,0,0,.442.5C1.461,11,7.5,11,7.5,11L10,10h3.5a.472.472,0,0,0,.5-.442C14,9.539,14,6.5,14,6.5A.472.472,0,0,0,13.558,6ZM12.5,11A1.5,1.5,0,1,0,14,12.5,1.538,1.538,0,0,0,12.5,11Z\"></path></svg>"

/***/ }),
/* 246 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M4,5v3h6v2H2l0,0l0,0V5.67L1,6V4l9-3v2L4,5z\"></path></svg>"

/***/ }),
/* 247 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M4,7v5h9.5v2H2l0,0l0,0V7.78L1,8.16V6l13-5v2.14L4,7z\"></path></svg>"

/***/ }),
/* 248 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9.6,4H8.49L8.2,2.27C8.0832,1.7303,7.6738,1.3015,7.14,1.16C6.8794,1.0669,6.6064,1.013,6.33,1H4.67 c-0.2721,0.0075-0.5416,0.0547-0.8,0.14C3.3269,1.2815,2.9117,1.7199,2.8,2.27L2.51,4H1.34 C1.1357,4.0055,0.9746,4.1755,0.9801,4.3798C0.9811,4.4173,0.9878,4.4545,1,4.49l1.21,4.7l0,0C2.3454,9.6605,2.7706,9.9885,3.26,10 h4.48C8.2331,9.9928,8.6635,9.6639,8.8,9.19l0,0l1.2-4.7c0.0682-0.1926-0.0326-0.4041-0.2252-0.4723 C9.7188,3.9978,9.6588,3.9918,9.6,4z M3.27,4l0.27-1.61c0.061-0.2688,0.2782-0.4741,0.55-0.52c0.1846-0.0591,0.3763-0.0928,0.57-0.1 h1.67c0.1937,0.0072,0.3854,0.0409,0.57,0.1c0.2718,0.0459,0.489,0.2512,0.55,0.52L7.73,4H3.27z\"></path></svg>"

/***/ }),
/* 249 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.33,6H11.5l-0.39-2.33c-0.1601-0.7182-0.7017-1.2905-1.41-1.49C9.3507,2.0676,8.9869,2.007,8.62,2H6.38 C6.0131,2.007,5.6493,2.0676,5.3,2.18C4.5917,2.3795,4.0501,2.9518,3.89,3.67L3.5,6H1.67C1.3939,5.9983,1.1687,6.2208,1.167,6.497 C1.1667,6.5489,1.1744,6.6005,1.19,6.65l1.88,6.3l0,0C3.2664,13.5746,3.8453,13.9996,4.5,14h6c0.651-0.0047,1.2247-0.4289,1.42-1.05 l0,0l1.88-6.3c0.0829-0.2634-0.0635-0.5441-0.3269-0.627C13.4268,6.0084,13.3786,6.0007,13.33,6z M4.52,6l0.36-2.17 c0.0807-0.3625,0.3736-0.6395,0.74-0.7C5.8663,3.0524,6.1219,3.0087,6.38,3h2.24c0.2614,0.0078,0.5205,0.0515,0.77,0.13 c0.3664,0.0605,0.6593,0.3375,0.74,0.7L10.48,6h-6H4.52z\"></path></svg>"

/***/ }),
/* 250 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M11,3.68c-0.0021,0.602-0.4917,1.0883-1.0937,1.0863C9.3043,4.7642,8.818,4.2745,8.82,3.6726 c0.0021-0.602,0.4917-1.0883,1.0937-1.0863C9.9425,2.5864,9.9713,2.5876,10,2.59C10.5666,2.6369,11.0019,3.1115,11,3.68z M10.17,9 c-0.0623-0.1197-0.2083-0.1684-0.33-0.11C9.3623,9.1811,8.7807,9.247,8.25,9.07L3.69,6.81l1.9-1V3.68l1.09,0.55v2.18L7.77,7 l1.09-0.55L7.77,5.86V2.59L5.59,1.5L4.5,2v3.32l-1.9,1l-2-1C0.4757,5.2592,0.3258,5.3107,0.265,5.435 C0.2042,5.5593,0.2557,5.7092,0.38,5.77l0,0L8,9.54c0.2402,0.1011,0.4995,0.1489,0.76,0.14c0.4466-0.0082,0.8851-0.1212,1.28-0.33 c0.1286-0.0502,0.1922-0.1951,0.142-0.3238C10.1785,9.0173,10.1745,9.0085,10.17,9z\"></path></svg>"

/***/ }),
/* 251 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M15,4.5C15,5.3284,14.3284,6,13.5,6S12,5.3284,12,4.5S12.6716,3,13.5,3S15,3.6716,15,4.5z M13.72,11.89 c-0.0623-0.1197-0.2083-0.1684-0.33-0.11c-0.6846,0.4194-1.5208,0.5111-2.28,0.25L4.78,8.86L7.5,7.5v-3L9,5.25v3L10.5,9L12,8.25 L10.5,7.5V3l-3-1.5L6,2.25v4.5L3.28,8.11L0.61,6.78C0.4857,6.7192,0.3358,6.7707,0.275,6.895C0.2142,7.0193,0.2657,7.1692,0.39,7.23 l10.5,5.25c0.3156,0.135,0.6568,0.1998,1,0.19c0.5998-0.0103,1.1889-0.161,1.72-0.44c0.1236-0.0615,0.174-0.2116,0.1125-0.3352 C13.7217,11.8932,13.7208,11.8916,13.72,11.89z\"></path></svg>"

/***/ }),
/* 252 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>slaughterhouse-11-01</title><path d=\"M11,5.75v.241C11,7,10,6.5,10,6.5H8A3.081,3.081,0,0,1,7,8a2.848,2.848,0,0,1-.416.9.26.26,0,0,0-.05.242l.458,1.55A.227.227,0,0,1,7,10.75a.25.25,0,0,1-.25.25.259.259,0,0,1-.244-.173L6,9V8.5H2.75l-.21.42a.25.25,0,0,0-.02.168L3,10.75a.25.25,0,0,1-.25.25.26.26,0,0,1-.237-.172L2,9V8.5a4.013,4.013,0,0,1-.843-.139,1.383,1.383,0,0,1-.5,1.045.242.242,0,0,0-.094.282l.414.99a.213.213,0,0,1,.011.072.25.25,0,0,1-.25.25.253.253,0,0,1-.228-.148L0,9.5a6.031,6.031,0,0,0,0-2v-2A1.486,1.486,0,0,1,2,4.1s.768.132,1.1.154A2.457,2.457,0,0,0,4,4.087,1.666,1.666,0,0,1,4.5,4a1.648,1.648,0,0,1,.844.257,3.166,3.166,0,0,0,.9.23L7,4.5s.966-.484,1-.5V3.5l.5.5A1.474,1.474,0,0,1,10,3.5.914.914,0,0,0,9,4l1,1,.68.529a.425.425,0,0,1,.07-.029A.238.238,0,0,1,11,5.75Z\"></path></svg>"

/***/ }),
/* 253 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>slaughterhouse-15-01</title><path d=\"M15,8.1c0,1.376-1.363.694-1.363.694L12.5,9H11a5.309,5.309,0,0,1-1.5,2,3.272,3.272,0,0,1-.523,1.125c-.077.091-.061.2-.068.33L9,14.755a.264.264,0,0,1-.266.25A.242.242,0,0,1,8.5,14.8L8,11.5H4v3.253A.247.247,0,0,1,3.753,15h0a.25.25,0,0,1-.241-.2L3,12v-.5a8.2,8.2,0,0,1-1.426-.1A1.886,1.886,0,0,1,.9,12.826c-.128.083-.148.211-.133.386,0,0,.19,1.532.19,1.538a.25.25,0,0,1-.25.25.238.238,0,0,1-.23-.174l-.427-1.7a.35.35,0,0,1,.055-.3c.437-.68-.049-2.55-.049-2.55A1.354,1.354,0,0,1,0,9.922V7.5A2.027,2.027,0,0,1,2.736,5.586s.1.03.142.049a15.15,15.15,0,0,0,3.814.038l.179-.062a1.842,1.842,0,0,1,1.26,0,.972.972,0,0,1,.227.089,1.994,1.994,0,0,1,.287.171A1.8,1.8,0,0,0,9.5,6h1V5l.5.5c.5-1.5,2.5-1,2.5-1a1.687,1.687,0,0,0-1.5,1l2.5,2a.613.613,0,0,1,.186-.069A.318.318,0,0,1,15,7.752V8.1Z\"></path></svg>"

/***/ }),
/* 254 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>snowmobile-11</title><path d=\"M4,8.5a.5.5,0,0,1-.5.5H.5a.5.5,0,0,1,0-1h3A.5.5,0,0,1,4,8.5Zm7-3a.5.5,0,0,0-.5-.5.9289.9289,0,0,0-.0969.0094L6,6H5.5A.5.5,0,0,1,5,5.5v-3a.5.5,0,0,0-.9314-.2528L3,4,.3118,5.038A.4989.4989,0,0,0,0,5.5a.5209.5209,0,0,0,.0864.2809L1,7l2.4113.0007a.4876.4876,0,0,1,.314.1149L5.7234,8.7709A.9964.9964,0,0,0,6.3591,9H9.4949a.5045.5045,0,0,0,.4512-.73L9,7l1.7792-1.0852A.5033.5033,0,0,0,11,5.5Z\"></path></svg>"

/***/ }),
/* 255 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>snowmobile-15</title><path d=\"M15,11a1,1,0,0,1-1,1l0,0v0H9.4142a1,1,0,0,1-.7071-.2929L7.146,10.146A.4984.4984,0,0,0,6.7935,10H3.3343a1.0023,1.0023,0,0,1-.6015-.2006L1.3857,8.7888A1.0134,1.0134,0,0,1,1,8a.9953.9953,0,0,1,.4719-.8444L5,5,6.0385,3.3076h0A.5.5,0,0,1,7,3.5V7L8,8H9l5.4115-.9922a.5.5,0,0,1,.3555.915L13,9l1.6313,1.2243A.99.99,0,0,1,15,11ZM5.5,11H3.2247a3.0035,3.0035,0,0,1-1.44-.3679L.74,10.0612a.5.5,0,0,0-.48.8775l1.2687.6934A3.0032,3.0032,0,0,0,2.969,12H5.5a.5.5,0,0,0,0-1Z\"></path></svg>"

/***/ }),
/* 256 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,1.25C8.9996,1.9404,8.4397,2.4997,7.7494,2.4994S6.4996,1.9391,6.5,1.2487C6.5004,0.5584,7.0603-0.001,7.7506-0.0006 C7.7638-0.0006,7.7769-0.0004,7.79,0C8.4647,0.0216,9.0003,0.575,9,1.25z M9,8.48c-0.5523,0-1,0.4477-1,1s0.4477,1,1,1s1-0.4477,1-1 S9.5523,8.48,9,8.48z M10.81,5.09L8.94,3.18l0,0C8.8477,3.0648,8.7076,2.9984,8.56,3H1.51c-0.2761,0-0.5,0.2239-0.5,0.5 S1.2339,4,1.51,4H5L2.07,8.3l0,0c-0.0138,0.066-0.0138,0.134,0,0.2C2.012,8.7761,2.1889,9.047,2.465,9.105 C2.7411,9.163,3.012,8.9861,3.07,8.71H3L4.16,7H6l-1.93,3.24l0,0C4.0228,10.3184,3.9986,10.4085,4,10.5 c-0.0552,0.2761,0.1239,0.5448,0.4,0.6c0.2761,0.0552,0.5448-0.1239,0.6-0.4l0,0l3.67-6.38l1.48,1.48 c0.1812,0.2084,0.497,0.2305,0.7054,0.0493c0.2084-0.1812,0.2305-0.497,0.0493-0.7054C10.8879,5.1246,10.8696,5.1065,10.85,5.09 L10.81,5.09z\"></path></svg>"

/***/ }),
/* 257 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11,1.5C11,2.3284,10.3284,3,9.5,3S8,2.3284,8,1.5S8.6716,0,9.5,0S11,0.6716,11,1.5z M11,11c-0.5523,0-1,0.4477-1,1 s0.4477,1,1,1s1-0.4477,1-1S11.5523,11,11,11z M12.84,6.09l-1.91-1.91l0,0C10.8399,4.0675,10.7041,4.0014,10.56,4H3.5 C3.2239,4,3,4.2239,3,4.5S3.2239,5,3.5,5h2.7L3,11.3l0,0c-0.0138,0.066-0.0138,0.134,0,0.2c-0.058,0.2761,0.1189,0.547,0.395,0.605 C3.6711,12.163,3.942,11.9861,4,11.71l0,0L5,10h2l-1.93,4.24l0,0C5.0228,14.3184,4.9986,14.4085,5,14.5 c-0.0552,0.2761,0.1239,0.5448,0.4,0.6c0.2761,0.0552,0.5448-0.1239,0.6-0.4l0,0l4.7-9.38l1.44,1.48 c0.211,0.1782,0.5264,0.1516,0.7046-0.0593C13.0037,6.5523,13.0018,6.2761,12.84,6.09z\"></path></svg>"

/***/ }),
/* 258 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,10H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h7c0.5523,0,1,0.4477,1,1v7C10,9.5523,9.5523,10,9,10z\"></path></svg>"

/***/ }),
/* 259 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z\"></path></svg>"

/***/ }),
/* 260 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9.19,1H1.81C1.3626,1,1,1.3626,1,1.81v7.38C1,9.6374,1.3626,10,1.81,10c0,0,0,0,0,0h7.38C9.6374,10,10,9.6374,10,9.19v0 V1.81C10,1.3626,9.6374,1,9.19,1L9.19,1L9.19,1z M2,2h7v7H2V2z\"></path></svg>"

/***/ }),
/* 261 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12.7,2.3v10.4H2.3V2.3H12.7 M13,1H2C1.4477,1,1,1.4477,1,2v11c0,0.5523,0.4477,1,1,1h11c0.5523,0,1-0.4477,1-1V2 C14,1.4477,13.5523,1,13,1L13,1z\"></path></svg>"

/***/ }),
/* 262 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"stadium-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4177\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccsccccccccccccccccccccccc\" d=\"M5,0v3v0.0117 C2.7922,3.1089,1.0876,3.8182,1,4.6816c0,0,0,2.4594,0,3.6816C0.9995,9.2672,3.0143,10,5.5,10s4.5005-0.7328,4.5-1.6367V4.6816 C9.9122,3.8177,8.2093,3.1082,6,3.0117V2.5723L8.5,1.5L5,0z M1.8184,5.752C2.1366,5.9302,2.5373,6.0838,3,6.2051v2.459 C2.2493,8.4283,1.8213,8.0972,1.8184,7.75V5.752z M9.1816,5.7559V7.75C9.1803,8.0979,8.7521,8.4298,8,8.666V6.2031 C8.4614,6.0836,8.862,5.932,9.1816,5.7559z M4,6.3984C4.4815,6.4652,4.9888,6.4995,5.5,6.5C6.0112,6.4995,6.5185,6.4652,7,6.3984 v2.4922C6.5282,8.9624,6.0171,8.9997,5.5,9C4.9829,8.9997,4.4718,8.9624,4,8.8906V6.3984z\"></path></svg>"

/***/ }),
/* 263 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"stadium-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4177\" d=\"M7,1v2v1.5v0.5098C4.1695,5.1037,2.0021,5.9665,2,7v4.5c0,1.1046,2.4624,2,5.5,2s5.5-0.8954,5.5-2V7 c-0.0021-1.0335-2.1695-1.8963-5-1.9902V4.0625L11,2.75L7,1z M3,8.1465c0.5148,0.2671,1.2014,0.4843,2,0.6328v2.9668 C3.7948,11.477,3,11.0199,3,10.5V8.1465z M12,8.1484V10.5c0,0.5199-0.7948,0.977-2,1.2461V8.7812 C10.7986,8.6328,11.4852,8.4155,12,8.1484z M6,8.9219C6.4877,8.973,6.9925,8.9992,7.5,9C8.0073,8.9999,8.5121,8.9743,9,8.9238 v2.9844C8.5287,11.964,8.0288,12,7.5,12S6.4713,11.964,6,11.9082V8.9219z\"></path></svg>"

/***/ }),
/* 264 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"star-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4749-2-8-2\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccc\" d=\"M5.4,0L4,3.5H0l3,3L1.5,11l3.9-2.6 L9.5,11L8,6.5l3-3H7L5.4,0z\"></path></svg>"

/***/ }),
/* 265 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"star-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4749-2-8-2\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"ccccccccccc\" d=\"M7.5,0l-2,5h-5l4,3.5l-2,6l5-3.5 l5,3.5l-2-6l4-3.5h-5L7.5,0z\"></path></svg>"

/***/ }),
/* 266 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4749-2-8-2\" d=\"M5.5,2.69l0.59,1.47l0.25,0.63h1.81l-1,0.9l-0.5,0.44l0.18,0.63l0.56,1.69L6.07,7.53L5.5,7.12 l-0.57,0.4L3.62,8.44l0.55-1.68l0.21-0.63L3.88,5.7l-1-0.9h1.78l0.25-0.63L5.5,2.69 M5.5,0L4,3.79H0.19l3,2.66L1.71,11L5.5,8.34 L9.29,11L7.78,6.45l3-2.66H7L5.5,0L5.5,0z\"></path></svg>"

/***/ }),
/* 267 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4749-2-8-2\" style=\"fill:#010101;\" d=\"M7.5,3.19l1.07,2.68L8.82,6.5h3l-2,1.75l-0.5,0.44l0.23,0.63l1,3.13l-2.48-1.77 l-0.57-0.4l-0.57,0.4l-2.52,1.77l1-3.13l0.21-0.63l-0.5-0.44l-2-1.75h3l0.25-0.63L7.5,3.19 M7.5,0.5l-2,5h-5l4,3.5l-2,6l5-3.5l5,3.5 l-2-6l4-3.5h-5L7.5,0.5L7.5,0.5z\"></path></svg>"

/***/ }),
/* 268 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"suitcase-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path17\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccccccccccc\" d=\"M8,3V1.578L7.3601,1H3.6399 L3,1.7477V3H1.5L1,3.5v6L1.5,10h8L10,9.5v-6L9.5,3H8z M4,2h3v1H4V2z\"></path></svg>"

/***/ }),
/* 269 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"suitcase-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path17\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"csccsccssccssccccccc\" d=\"M11,4V2c0-1-1-1-1-1H5.0497 c0,0-1.1039,0.0015-1.0497,1v2H2c0,0-1,0-1,1v7c0,1,1,1,1,1h11c0,0,1,0,1-1V5c0-1-1-1-1-1H11z M5.5,2.5h4V4h-4V2.5z\"></path></svg>"

/***/ }),
/* 270 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"sushi-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path4999\" style=\"fill:#010101;\" d=\"M3.5,2.5C3.2,2.5,3,2.6,3,2.9l0,0H2.1c-1.1,0-2,0.8-2,1.9c0,0.5,0.3,1,0.7,1.4 C0.3,6.5,0,6.9,0,7.5C0,8.3,0.7,9,1.6,9h1.9h2h1.9C8.3,9,9,8.3,9,7.5c0-0.2,0-0.4-0.1-0.6l1,0.5c0.4,0.2,0.8,0,1-0.3 c0.2-0.4-0.053-0.7941-0.3427-0.9442L9.8,5.8l0.5-0.1c0.4-0.1,0.7-0.4,0.6-0.8c-0.1-0.4-0.4-0.6-0.8-0.6l0,0H10L8.4,4.6 C8,3.9,7.3,3.1,6,3c0,0,0-0.5-0.5-0.5l0,0H3.5z M4,3.5h1v4.4l0,0l0,0H4l0,0l0,0V3.5z M7,5.9c0.2,0,0.3,0.1,0.4,0.3l0.1-0.1 C7.6,5.9,7.8,5.9,8,6s0.2,0.3,0.1,0.5L7.8,7C7.9,7.1,8,7.2,8,7.4c0,0.3-0.2,0.5-0.6,0.5H6v-1h0.7V6.3C6.7,6.1,6.8,5.9,7,5.9z M1.9,6 C2,6,2.2,6,2.3,6.2l0.1,0.2c0.1-0.1,0.2-0.1,0.3-0.1C2.9,6.3,3,6.5,3,6.6v0.8l0,0v0.5H1.6C1.2,7.9,1,7.7,1,7.4s0.2-0.5,0.6-0.5h0.3 L1.7,6.5c-0.1-0.2,0-0.4,0.1-0.5C1.8,6,1.8,6,1.9,6z\"></path></svg>"

/***/ }),
/* 271 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"sushi-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path4999\" d=\"M5.5,3C5.2239,3,5,3.2239,5,3.5H2.75C1.2265,3.5,0,4.7265,0,6.25c0,0.8274,0.3687,1.5592,0.9434,2.0625 C0.3803,8.6675,0,9.2893,0,10c0,1.0994,0.9006,2,2,2h3.5h2H10c1.0994,0,2-0.9006,2-2c0-0.4883-0.1863-0.9294-0.4805-1.2773 l2.1777,0.9629c0.3716,0.1831,0.8213,0.0303,1.0044-0.3413c0.1831-0.3716,0.0303-0.8213-0.3413-1.0044 c-0.0188-0.0093-0.038-0.0178-0.0576-0.0254l-1.8105-0.8027l1.6309-0.2715c0.4099-0.0599,0.6936-0.4408,0.6337-0.8507 c-0.0544-0.3724-0.3765-0.6469-0.7528-0.6415c-0.0426,0.0003-0.085,0.0042-0.127,0.0117l-2.1309,0.3555 C11.2595,4.9521,10.0387,3.7837,8,3.5488V3.5C8,3.2239,7.7761,3,7.5,3H5.5z M6,4h1v5v2H6V9V4z M9.5,8 c0.259,0,0.4638,0.1974,0.4902,0.4492l0.0762-0.1328c0.1385-0.2399,0.4437-0.3201,0.6836-0.1816s0.3201,0.4418,0.1816,0.6816 l-0.2578,0.4473C10.8727,9.445,11,9.7021,11,10c0,0.5626-0.4374,1-1,1H8V9h1V8.5C9,8.223,9.223,8,9.5,8z M2.4395,8.0703 c0.1934-0.0242,0.3903,0.0662,0.4941,0.2461l0.2012,0.3477C3.226,8.5647,3.3538,8.5,3.5,8.5C3.777,8.5,4,8.723,4,9h1v2H2 c-0.5626,0-1-0.4374-1-1s0.4374-1,1-1h0.1738L2.0684,8.8164C1.9299,8.5765,2.0101,8.2733,2.25,8.1348 C2.31,8.1001,2.375,8.0784,2.4395,8.0703z\"></path></svg>"

/***/ }),
/* 272 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"swimming-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path8421-9-1-0-7\" inkscape:connector-curvature=\"0\" d=\"M8.0039,0.4941l-0.6992,0.502L4.6035,2.5977 C4.3036,2.6967,4.2042,3.1962,4.4023,3.4961l0.5996,1.002l-2.5,2l1,1.002l2-1.002L7.5039,7.5l1-1.002l-3.002-3.502l3.002-1.5v-1.002 C8.5039,0.4941,8.0039,0.4941,8.0039,0.4941z M9.0059,2.9961c-0.553,0-1.002,0.4489-1.002,1.002s0.4489,1,1.002,1 c0.553,0,1-0.447,1-1S9.5589,2.9961,9.0059,2.9961z M2,7.998L0,9v1l2-1l1.5,1l2-1l2,1L9,9l2,1V9L9,7.998L7.5,9l-2-1.002L3.5,9 L2,7.998z\"></path></svg>"

/***/ }),
/* 273 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"swimming-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path16388\" inkscape:connector-curvature=\"0\" d=\"M10.1113,2C9.9989,2,9.6758,2.1465,9.6758,2.1465L6.3535,3.8262 C5.9111,4.0024,5.7358,4.7081,6.002,5.0605l0.9707,1.4082L3.002,8.498L5,9.998l2.502-1.5l2.5,1.5l1.002-1.002l-3-4l2.5566-1.5293 c0.5286-0.2662,0.4434-0.7045,0.4434-0.9707C10.9999,2.2861,10.6437,2,10.1113,2z M12.252,5C11.2847,5,10.5,5.7827,10.5,6.75 s0.7847,1.752,1.752,1.752s1.75-0.7847,1.75-1.752S13.2192,5,12.252,5z M2.5,10L0,11.5V13l2.5-1.5L5,13l2.502-1.5l2.5,1.5L12,11.5 l3,1.5v-1.5L12,10l-1.998,1.5l-2.5-1.5L5,11.5L2.5,10z\"></path></svg>"

/***/ }),
/* 274 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><title>teahouse</title><path d=\"M6.2,4C7.4,3.7,8,3.7,8,2.5c0-0.6-0.4-0.8-1.6-1.3C5.6,0.9,5.3,0.9,5.3,0.1C5,1,5.2,1.3,6.1,1.8C8.1,2.8,6.2,4,6.2,4z M3.9,4C4.6,3.8,5,3.8,5,3.1C5,2.7,4.7,2.6,4,2.2C3.5,2,3.3,1.5,3.3,1C3.1,1.6,3.2,2.3,3.8,2.6C5,3.2,3.9,4,3.9,4z M9,5H2l1,3 c0.3,0.4,0.6,0.7,1,1v2h3V9c0.4-0.3,0.7-0.6,1-1L9,5z\"></path></svg>"

/***/ }),
/* 275 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_2\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M11,7c-0.2,1.4-0.5,2.7-1,4c-0.3,0.4-0.6,0.7-1,1v2H6v-2c-0.4-0.3-0.7-0.6-1-1C4.5,9.7,4.2,8.4,4,7H11z M8.1,5.7 c1.2-0.3,1.7-0.3,1.8-1.5c0-0.6-0.4-0.8-1.5-1.4C7.5,2.4,7.1,1.8,7.2,1C6.8,1.9,7,3,8,3.5C10,4.5,8.1,5.7,8.1,5.7z M5.8,6 c0.7-0.2,1.1-0.2,1.1-0.9c0-0.4-0.3-0.5-0.9-0.9C5.4,4,5.1,3.5,5.2,3C4.9,3.6,5.1,4.3,5.7,4.6C6.9,5.2,5.8,6,5.8,6z\"></path></svg>"

/***/ }),
/* 276 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>telephone-11</title><path d=\"M3,9.4a0.73,0.73,0,0,0,1,0l0.74-.74a0.73,0.73,0,0,0,0-1ZM7.56,4.8a0.73,0.73,0,0,0,1,0l0.71-.71a0.73,0.73,0,0,0,0-1ZM5.88,3.57L3.57,5.88a0.37,0.37,0,0,0,0,.52L4,6.84,2.26,8.6a2.27,2.27,0,0,1-.73-1.34v-1a1.3452,1.3452,0,0,1,.52-1L5.26,2.05a1.3452,1.3452,0,0,1,1-.52h1a2.27,2.27,0,0,1,1.34.73L6.84,4,6.4,3.57a0.37,0.37,0,0,0-.52,0\"></path></svg>"

/***/ }),
/* 277 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>telephone-15</title><path d=\"M4.51,8.88a0.51,0.51,0,0,0,0,.72l0.72,0.72L3.07,12.5,2.7,12.13A2.24,2.24,0,0,1,2,10.69V9.24a2.24,2.24,0,0,1,.7-1.45L7.77,2.72A2.24,2.24,0,0,1,9.22,2h1.45a2.24,2.24,0,0,1,1.45.72l0.36,0.36L10.31,5.26,9.58,4.53a0.51,0.51,0,0,0-.72,0ZM4.13,13.6a1,1,0,0,0,1.4137.0363Q5.5623,13.6186,5.58,13.6l0.72-.72a1,1,0,0,0,.0363-1.4137Q6.3186,11.4477,6.3,11.43Zm7.25-7.28a1,1,0,0,0,1.4137.0363C12.8061,6.3445,13.55,5.6,13.55,5.6a1,1,0,0,0,.0363-1.4137Q13.5686,4.1677,13.55,4.15Z\"></path></svg>"

/***/ }),
/* 278 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M3,3c0,0.5523-0.4477,1-1,1S1,3.5523,1,3s0.4477-1,1-1S3,2.4477,3,3z M9.87,4.55L9.87,4.55L8.3,3 c0.3893-0.7896,0.182-1.7433-0.5-2.3C7.3973,0.2752,6.8448,0.0241,6.26,0C5.922-0.0102,5.5941,0.1159,5.35,0.35 C4.7924,1.1288,4.9466,2.2085,5.7,2.8c0.4027,0.4248,0.9552,0.6759,1.54,0.7c0.2452-0.0035,0.4844-0.0763,0.69-0.21l1.6,1.6l0,0 c0.0399,0.0733,0.1165,0.1193,0.2,0.12c0.1376,0.0112,0.2582-0.0913,0.2694-0.2289C10.0003,4.7707,10.0004,4.7604,10,4.75 C9.9952,4.665,9.9457,4.5889,9.87,4.55z M7.8,2.8C7.6476,2.939,7.4459,3.011,7.24,3C6.7873,2.9767,6.361,2.7797,6.05,2.45 C5.5012,2.0431,5.3499,1.2866,5.7,0.7c0.1529-0.138,0.3542-0.2099,0.56-0.2c0.4527,0.0233,0.879,0.2203,1.19,0.55 C7.9988,1.4569,8.1501,2.2134,7.8,2.8z M6.5,5h-5C1.2239,5,1,5.2239,1,5.5v5C1,10.7761,1.2239,11,1.5,11S2,10.7761,2,10.5V8h1v2.5 C3,10.7761,3.2239,11,3.5,11S4,10.7761,4,10.5V6h2.5C6.7761,6,7,5.7761,7,5.5S6.7761,5,6.5,5z\"></path></svg>"

/***/ }),
/* 279 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M8,4.5C8,5.3284,7.3284,6,6.5,6S5,5.3284,5,4.5S5.6716,3,6.5,3S8,3.6716,8,4.5z M14.38,5.05L14.38,5.05l-1.57-1.59 c0.3629-0.7766,0.1576-1.7002-0.5-2.25c-0.4027-0.4248-0.9552-0.6759-1.54-0.7c-0.338-0.0102-0.6659,0.1159-0.91,0.35 c-0.5576,0.7788-0.4034,1.8585,0.35,2.45c0.4027,0.4248,0.9552,0.6759,1.54,0.7c0.2452-0.0035,0.4844-0.0763,0.69-0.21L14,5.39l0,0 c0.0399,0.0733,0.1165,0.1193,0.2,0.12c0.1381,0,0.25-0.1119,0.25-0.25C14.4623,5.1828,14.4361,5.1044,14.38,5.05z M12.31,3.3 c-0.1524,0.139-0.3541,0.211-0.56,0.2c-0.4422-0.0125-0.8635-0.191-1.18-0.5c-0.5432-0.406-0.694-1.1556-0.35-1.74 c0.1406-0.1575,0.339-0.2513,0.55-0.26c0.4682,0.0155,0.9109,0.2171,1.23,0.56C12.5295,1.9775,12.6627,2.7253,12.31,3.3z M12.85,5.64c-0.1945-0.1961-0.511-0.1974-0.7071-0.0029C12.1419,5.6381,12.141,5.639,12.14,5.64L10.79,7h-4.9 C5.6621,7.0025,5.4647,7.1587,5.41,7.38l-0.79,3.11l0,0L3.9,13.36c-0.0863,0.2594,0.0518,0.5401,0.31,0.63h0.16 c0.2131-0.0016,0.4018-0.1381,0.47-0.34l0.8-3.19H7v3c0,0.2761,0.2239,0.5,0.5,0.5S8,13.7361,8,13.46v-3L9,8h2.21l1.65-1.65 c0.1878-0.1971,0.1834-0.5083-0.01-0.7V5.64z\"></path></svg>"

/***/ }),
/* 280 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"theatre-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"path6370\" d=\"M0.6055,0.6992C0.3027,0.6992,0,1.0019,0,1.3047v3.7344C0,6.4519,0.578,8,3,8h0.5V6.1836L1.2109,6.1758 c0,0,0.3026-1.1367,1.8164-1.1367c0.3028,0,0.4036,0.0006,0.6055,0.1016V3.7266c0-0.6055,0.2018-1.0078,0.6055-1.3105 C4.541,2.1133,4.789,2,5.3945,2H6V1.3945c0-0.3028-0.1972-0.6582-0.5-0.6582c-0.6055,0-1.1607,0.5684-2.4727,0.5684 C2.0182,1.3047,1.211,0.6992,0.6055,0.6992z M1.75,2.5c0.4142,0,0.75,0.3358,0.75,0.75S2.1642,4,1.75,4S1,3.6642,1,3.25 S1.3358,2.5,1.75,2.5z M5.5,3C5.1972,3,4.9453,3.4238,4.9453,3.7266v3.7344c0,1.4128,0.6053,3.0273,3.0273,3.0273 S11,8.7729,11,7.4609V3.7266C11,3.4238,10.8028,3,10.5,3C9.8945,3,8.9083,3.5,8,3.5S6.1055,3,5.5,3z M6.75,5 C7.1642,5,7.5,5.3358,7.5,5.75S7.1642,6.5,6.75,6.5S6,6.1642,6,5.75S6.3358,5,6.75,5z M9.25,5C9.6642,5,10,5.3358,10,5.75 S9.6642,6.5,9.25,6.5S8.5,6.1642,8.5,5.75S8.8358,5,9.25,5z M6.1562,8.0664h3.7344c0,0-0.3026,1.2109-1.8164,1.2109 S6.1562,8.0664,6.1562,8.0664z\"></path></svg>"

/***/ }),
/* 281 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"theatre-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path6342-3\" d=\"M2,1c0,0-1,0-1,1v5.1582C1,8.8885,1.354,11,4.5,11H5V8L2.5,9c0,0,0-2.5,2.5-2.5V5 c0-0.7078,0.0868-1.3209,0.5-1.7754C5.8815,2.805,6.5046,1.9674,8.1562,2.7539L9,3.3027V2c0,0,0-1-1-1C7.2922,1,6.0224,2,5,2 S2.7865,1,2,1z M3,3c0.5523,0,1,0.4477,1,1S3.5523,5,3,5S2,4.5523,2,4S2.4477,3,3,3z M7,4c0,0-1,0-1,1v5c0,2,1,4,4,4s4-2,4-4V5 c0-1-1-1-1-1c-0.7078,0-1.9776,1-3,1S7.7865,4,7,4z M8,6c0.5523,0,1,0.4477,1,1S8.5523,8,8,8S7,7.5523,7,7S7.4477,6,8,6z M12,6 c0.5523,0,1,0.4477,1,1s-0.4477,1-1,1s-1-0.4477-1-1S11.4477,6,12,6z M7.5,10H10h2.5c0,0,0,2.5-2.5,2.5S7.5,10,7.5,10z\"></path></svg>"

/***/ }),
/* 282 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M3.33,2.19c-0.6075,0-1.1-0.4925-1.1-1.1s0.4925-1.1,1.1-1.1s1.1,0.4925,1.1,1.1v0C4.43,1.6975,3.9375,2.19,3.33,2.19z M10.27,1.09c0-0.6075-0.4925-1.1-1.1-1.1c-0.6075,0-1.1,0.4925-1.1,1.1s0.4925,1.1,1.1,1.1c0.6036,0,1.0945-0.4864,1.1-1.09V1.09z M6.51,4.93L6.51,4.93L4.7,3.12l0,0C4.6306,3.0442,4.5328,3.0008,4.43,3H2.22C2.1271,3.0008,2.0378,3.0365,1.97,3.1H2L0.14,4.93 c-0.1709,0.1218-0.2107,0.3591-0.0889,0.53s0.3591,0.2107,0.53,0.0889C0.6155,5.5244,0.6455,5.4944,0.67,5.46l1.58-1.58L0.77,8h1.46 v2.51c-0.0055,0.0365-0.0055,0.0735,0,0.11c0.0339,0.2071,0.2293,0.3475,0.4364,0.3136C2.8274,10.9072,2.9536,10.781,2.98,10.62H3V8 h0.69v2.63l0,0c0.0339,0.2071,0.2293,0.3475,0.4364,0.3136C4.2874,10.9172,4.4136,10.791,4.44,10.63 c0.0055-0.0365,0.0055-0.0735,0-0.11V8h1.44L4.41,3.88L6,5.46l0,0c0.0718,0.0783,0.1738,0.1221,0.28,0.12 c0.2099,0,0.38-0.1701,0.38-0.38l0,0C6.6518,5.0924,6.597,4.9938,6.51,4.93z M8.62,7v3.63 c-0.0335,0.2016,0.1028,0.3921,0.3044,0.4256c0.2016,0.0335,0.3921-0.1028,0.4256-0.3044c0.0067-0.0401,0.0067-0.0811,0-0.1212V7H11 V3.37C11,3.1657,10.8343,3,10.63,3H7.71C7.5057,3,7.34,3.1657,7.34,3.37V7H8.62z\"></path></svg>"

/***/ }),
/* 283 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M4.5,3C3.6716,3,3,2.3284,3,1.5S3.6716,0,4.5,0S6,0.6716,6,1.5S5.3284,3,4.5,3z M14,1.5C14,0.6716,13.3284,0,12.5,0 S11,0.6716,11,1.5S11.6716,3,12.5,3S14,2.3284,14,1.5z M8.86,6.64L8.86,6.64L6.38,4.15l0,0C6.2798,4.0492,6.142,3.9949,6,4H3 C2.8697,4.0003,2.7445,4.0503,2.65,4.14l0,0L0.14,6.63c-0.2261,0.177-0.2659,0.5039-0.0889,0.73s0.5039,0.2659,0.73,0.0889 C0.8142,7.423,0.8441,7.3931,0.87,7.36L3,5.2L1,11h2v3.33c-0.0075,0.0497-0.0075,0.1003,0,0.15 c0.0555,0.2761,0.3244,0.455,0.6005,0.3995C3.802,14.839,3.9595,14.6815,4,14.48l0,0V11h1v3.5l0,0 c0.0555,0.2761,0.3244,0.455,0.6005,0.3995C5.802,14.859,5.9595,14.7015,6,14.5c0.0075-0.0497,0.0075-0.1003,0-0.15V11h2L6,5.2 l2.14,2.16l0,0c0.0967,0.1081,0.2349,0.17,0.38,0.17C8.7954,7.5088,9.0061,7.2761,9,7C9.0023,6.8663,8.9521,6.737,8.86,6.64z M14.5,4h-4C10.2239,4,10,4.2239,10,4.5v5c0,0.2761,0.2239,0.5,0.5,0.5S11,9.7761,11,9.5v5c0,0.2761,0.2239,0.5,0.5,0.5 s0.5-0.2239,0.5-0.5v-5h1v5c0,0.2761,0.2239,0.5,0.5,0.5s0.5-0.2239,0.5-0.5v-5c0,0.2761,0.2239,0.5,0.5,0.5S15,9.7761,15,9.5v-5 C15,4.2239,14.7761,4,14.5,4z\"></path></svg>"

/***/ }),
/* 284 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>town-11-01</title><path d=\"M3.695,1.1a.256.256,0,0,0-.4,0L1.055,3.931A.254.254,0,0,0,1,4.088V9.75a.25.25,0,0,0,.25.25h1.5A.25.25,0,0,0,3,9.75V8H4V9.75a.25.25,0,0,0,.25.25H5V5.5a.615.615,0,0,1,.147-.4L6,4ZM3,7H2V6H3ZM3,5H2V4H3ZM8.194,3.742a.248.248,0,0,0-.387,0L6.054,5.932A.249.249,0,0,0,6,6.087V9.752A.248.248,0,0,0,6.248,10h3.5A.248.248,0,0,0,10,9.756h0V6.087a.249.249,0,0,0-.054-.155ZM7,6H8V7H7ZM9,9H8V8H9Z\"></path></svg>"

/***/ }),
/* 285 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>town-15</title><path d=\"M10.651,7.121a.251.251,0,0,0-.314,0L8.092,8.929A.247.247,0,0,0,8,9.122v4.625A.253.253,0,0,0,8.253,14H9.747A.253.253,0,0,0,10,13.747h0V12h1v1.747a.253.253,0,0,0,.253.253h1.494A.253.253,0,0,0,13,13.747h0V9.12a.25.25,0,0,0-.094-.2ZM10,11H9V10h1Zm2,0H11V10h1ZM5.71,1.815a.252.252,0,0,0-.42,0L2.042,5.936A.252.252,0,0,0,2,6.076v7.671A.252.252,0,0,0,2.251,14h2.5A.252.252,0,0,0,5,13.748V12H6v1.748A.252.252,0,0,0,6.252,14H7V8a.5.5,0,0,1,.188-.391L9,6C9,5.95,5.71,1.815,5.71,1.815ZM4,10H3V9H4ZM4,7H3V6H4Zm2,3H5V9H6ZM6,7H5V6H6Z\"></path></svg>"

/***/ }),
/* 286 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,0L1,2v1h9V2L5.5,0z M2,4v4L1,9v1h9V9L9,8V4H2z M3,5h1v3H3V5z M5,5h1v3H5V5z M7,5h1v3H7V5z\"></path></svg>"

/***/ }),
/* 287 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"town-hall-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path7509\" d=\"M7.5,0L1,3.4453V4h13V3.4453L7.5,0z M2,5v5l-1,1.5547V13h13v-1.4453L13,10V5H2z M4,6h1v5.5H4V6z M7,6h1v5.5H7 V6z M10,6h1v5.5h-1V6z\"></path></svg>"

/***/ }),
/* 288 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"triangle-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3338\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccc\" d=\"M5.5174,1.2315 C5.3163,1.2253,5.1276,1.328,5.024,1.5l-4,6.6598C0.8013,8.5293,1.0679,8.9999,1.5,9h8c0.4321-0.0001,0.6987-0.4707,0.476-0.8402 l-4-6.6598C5.8787,1.3386,5.706,1.2375,5.5174,1.2315z\"></path></svg>"

/***/ }),
/* 289 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"triangle-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path21090-9\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sscsssscss\" d=\"M7.5385,2 C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154 C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z\"></path></svg>"

/***/ }),
/* 290 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"triangle-stroked-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3338\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccc\" d=\"M5.5174,1.2315 C5.3163,1.2253,5.1276,1.328,5.024,1.5l-4,6.6598C0.8013,8.5293,1.0679,8.9999,1.5,9h8c0.4321-0.0001,0.6987-0.4707,0.476-0.8402 l-4-6.6598C5.8787,1.3386,5.706,1.2375,5.5174,1.2315z M5.5,2.8627l3.0191,5.0286H2.4809L5.5,2.8627z\"></path></svg>"

/***/ }),
/* 291 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"triangle-stroked-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"rect3338\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"cccccccccccc\" d=\"M7.5243,1.5004 C7.2429,1.4913,6.9787,1.6423,6.8336,1.8952l-5.5,9.8692C1.0218,12.3078,1.395,12.9999,2,13h11 c0.605-0.0001,0.9782-0.6922,0.6664-1.2355l-5.5-9.8692C8.0302,1.6579,7.7884,1.5092,7.5243,1.5004z M7.5,3.8993l4.1267,7.4704 H3.3733L7.5,3.8993z\"></path></svg>"

/***/ }),
/* 292 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,4.32C4.2852,4.3446,3.3204,5.3493,3.345,6.5641C3.3464,6.6363,3.3515,6.7083,3.36,6.78l0,0 C2.9264,6.9258,2.5181,7.1384,2.15,7.41C1.5186,7.8752,1.384,8.7642,1.8492,9.3955C1.8528,9.4004,1.8564,9.4052,1.86,9.41 c0.4895,0.6043,1.3633,0.7267,2,0.28C4.3412,9.3542,4.9132,9.1728,5.5,9.17c0.5836-0.006,1.1554,0.1648,1.64,0.49 c0.6009,0.4953,1.4896,0.4096,1.9848-0.1913C9.1299,9.4625,9.135,9.4563,9.14,9.45c0.5003-0.5528,0.4578-1.4065-0.095-1.9068 C9.0084,7.51,8.97,7.4789,8.93,7.45L8.85,7.41C8.4703,7.1575,8.0646,6.9463,7.64,6.78l0,0c0.1438-1.2065-0.7176-2.3011-1.9241-2.445 C5.6442,4.3265,5.5722,4.3215,5.5,4.32z M1.63,3.12C1.0889,3.3737,0.8458,4.0102,1.08,4.56c0.0427,0.5931,0.5567,1.0401,1.15,1 c0.5411-0.2537,0.7842-0.8902,0.55-1.44C2.7373,3.5269,2.2233,3.0799,1.63,3.12z M9.37,3.12c0.5411,0.2537,0.7842,0.8902,0.55,1.44 c-0.0427,0.5931-0.5567,1.0401-1.15,1C8.2289,5.3063,7.9858,4.6698,8.22,4.12C8.2627,3.5269,8.7767,3.0799,9.37,3.12z M3.77,1 C3.257,1.2045,3.0069,1.7862,3.2115,2.2992C3.2142,2.3062,3.2171,2.3131,3.22,2.32c0.0792,0.5925,0.5637,1.0478,1.16,1.09 c0.513-0.2045,0.7631-0.7862,0.5585-1.2992C4.9358,2.1038,4.9329,2.0969,4.93,2.09C4.8508,1.4975,4.3663,1.0422,3.77,1z M7.23,1 c0.513,0.2045,0.7631,0.7862,0.5585,1.2992C7.7858,2.3062,7.7829,2.3131,7.78,2.32C7.7008,2.9125,7.2163,3.3678,6.62,3.41 C6.107,3.2055,5.8569,2.6238,6.0615,2.1108C6.0642,2.1038,6.0671,2.0969,6.07,2.09C6.1492,1.4975,6.6337,1.0422,7.23,1z\"></path></svg>"

/***/ }),
/* 293 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path3340\" d=\"M7.5,6c-2.5,0-3,2.28-3,3.47l0,0c-0.6097,0.2059-1.1834,0.5062-1.7,0.89 c-0.871,0.6614-1.0492,1.8998-0.4,2.78c0.6799,0.8542,1.9081,1.0297,2.8,0.4c0.6779-0.4601,1.4808-0.701,2.3-0.69 c0.8192-0.011,1.6221,0.2299,2.3,0.69c0.8575,0.6854,2.1072,0.5515,2.8-0.3c0.6888-0.8134,0.5878-2.0313-0.2256-2.7201 c-0.0243-0.0206-0.0491-0.0406-0.0744-0.0599l-0.1-0.1c-0.5333-0.3564-1.1032-0.6548-1.7-0.89l0,0C10.5,8.29,10,6,7.5,6z\"></path><path id=\"ellipse4153\" d=\"M2.08,4.3c-0.7348,0.3676-1.0652,1.2371-0.76,2c0.064,0.8282,0.7809,1.4517,1.61,1.4 c0.7348-0.3676,1.0652-1.2371,0.76-2C3.626,4.8718,2.9091,4.2483,2.08,4.3z\"></path><path id=\"ellipse4163\" d=\"M12.93,4.3c0.7348,0.3676,1.0653,1.2371,0.76,2c-0.064,0.8282-0.7809,1.4517-1.61,1.4 c-0.7348-0.3676-1.0653-1.2371-0.76-2C11.384,4.8718,12.1009,4.2483,12.93,4.3z\"></path><path id=\"ellipse4165\" d=\"M5.08,1.3c-0.68,0.09-1,0.94-0.76,1.87C4.4301,3.9951,5.1003,4.6321,5.93,4.7c0.68-0.09,1-0.94,0.76-1.87 C6.5799,2.0049,5.9097,1.3679,5.08,1.3z\"></path><path id=\"ellipse4167\" d=\"M9.93,1.3c0.68,0.09,1,0.94,0.76,1.87C10.5791,3.9986,9.9036,4.6365,9.07,4.7c-0.68-0.08-1-0.94-0.76-1.87 C8.4209,2.0014,9.0964,1.3634,9.93,1.3z\"></path></svg>"

/***/ }),
/* 294 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 11 11\"><title>village-11</title><path d=\"M2.777,2.3.3,5.6a.272.272,0,0,0-.05.15A.25.25,0,0,0,.5,6H1V9.745A.255.255,0,0,0,1.255,10h2.49A.255.255,0,0,0,4,9.745H4V5.467A.253.253,0,0,1,4.064,5.3L5,4.5,3.2,2.316A.255.255,0,0,0,2.777,2.3ZM3,7H2V6H3ZM9.75,3h-.5A.25.25,0,0,0,9,3.25V5.2L7.658,4.126a.253.253,0,0,0-.316,0L5.1,5.926a.253.253,0,0,0-.095.2V9.747A.253.253,0,0,0,5.253,10H6.747A.253.253,0,0,0,7,9.747H7V8H8V9.747A.253.253,0,0,0,8.253,10H9.747A.253.253,0,0,0,10,9.747h0V3.25A.25.25,0,0,0,9.75,3ZM7,7H6V6H7ZM9,7H8V6H9Z\"></path></svg>"

/***/ }),
/* 295 */
/***/ (function(module, exports) {

module.exports = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15 15\"><title>village-15</title><path d=\"M6.176,4.176a.249.249,0,0,0-.352,0l-4.4,4.4A.25.25,0,0,0,1.6,9H3v4.751A.249.249,0,0,0,3.249,14h3.5A.249.249,0,0,0,7,13.753H7V8.323a.249.249,0,0,1,.073-.176L8.5,6.5ZM6,12H5V11H6Zm0-2H5V9H6Zm6.75-4h-.5a.25.25,0,0,0-.25.25V8L10.676,6.176a.249.249,0,0,0-.352,0L8.056,8.932A.246.246,0,0,0,8,9.088v4.66A.249.249,0,0,0,8.246,14h1.5A.253.253,0,0,0,10,13.748h0V12h1v1.747a.253.253,0,0,0,.253.253h1.5A.25.25,0,0,0,13,13.751V6.25A.25.25,0,0,0,12.75,6ZM10,11H9V10h1Zm2,0H11V10h1Z\"></path></svg>"

/***/ }),
/* 296 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"volcano-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path id=\"rect3338\" d=\"M3,1l1.5,3h2L8,3V2L6,3V1H5.5L5,2.5L3.5,1H3z M3.5215,5l-2.498,4.1602C0.8007,9.5296,1.0679,9.9999,1.5,10h8 c0.4321-0.0001,0.6993-0.4704,0.4766-0.8398L7.4785,5H7v0.5C7,5.777,6.777,6,6.5,6S6,5.777,6,5.5C6,5.2239,5.7761,5,5.5,5 S5,5.2239,5,5.5v2C5,7.777,4.777,8,4.5,8S4,7.777,4,7.5V5H3.5215z\"></path></svg>"

/***/ }),
/* 297 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91 r13725\" sodipodi:docname=\"volcano-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path6447\" inkscape:connector-curvature=\"0\" style=\"fill:#010101;\" d=\"M8.4844,1.0002 c-0.1464,0.005-0.2835,0.0731-0.375,0.1875L6.4492,3.2619L4.8438,1.7385C4.4079,1.3374,3.7599,1.893,4.0899,2.385l1.666,2.4004 C5.9472,5.061,6.3503,5.0737,6.5586,4.8108C6.7249,4.6009,7,4.133,7.5,4.133s0.7929,0.4907,0.9414,0.6777 c0.175,0.2204,0.4973,0.2531,0.7129,0.0723l1.668-1.4004c0.4408-0.3741,0.0006-1.0735-0.5273-0.8379L9,3.2268V1.5002 C9.0002,1.2179,8.7666,0.9915,8.4844,1.0002L8.4844,1.0002z M5,6.0002L2.0762,11.924C1.9993,12.0009,2,12.155,2,12.3088 c0,0.5385,0.3837,0.6914,0.6914,0.6914h9.6172c0.3846,0,0.6914-0.153,0.6914-0.6914c0-0.1538,0.0008-0.2309-0.0762-0.3848L10,6.0002 c-0.5,0-1,0.5-1,1v0.5c0,0.277-0.223,0.5-0.5,0.5S8,7.7772,8,7.5002v-0.5c0-0.2761-0.2238-0.5-0.5-0.5S7,6.7241,7,7.0002v2 c0,0.277-0.223,0.5-0.5,0.5S6,9.2772,6,9.0002v-2C6,6.5002,5.5,6.0002,5,6.0002z\"></path></svg>"

/***/ }),
/* 298 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M3,11H0V8h3V11z M7,8H4v3h3V8z M11,8H8v3h3V8z M5,4H2v3h3V4z M9,4H6v3h3V4z M10.44,3.24 c0.1349-0.2403,0.0499-0.5444-0.19-0.68l-4.5-2.5c-0.1521-0.0855-0.3379-0.0855-0.49,0l-4.5,2.5 C0.5272,2.7085,0.4588,3.0176,0.6073,3.2504C0.7444,3.4654,1.0213,3.5428,1.25,3.43L5.5,1.07l4.26,2.37 c0.2421,0.1328,0.546,0.0442,0.6789-0.1979C10.4392,3.2414,10.4396,3.2407,10.44,3.24z\"></path></svg>"

/***/ }),
/* 299 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M13.5,5c-0.0762,0.0003-0.1514-0.0168-0.22-0.05L7.5,2L1.72,4.93C1.4632,5.0515,1.1565,4.9418,1.035,4.685 S1.0232,4.1215,1.28,4L7.5,0.92L13.72,4c0.2761,0.0608,0.4508,0.3339,0.39,0.61C14.0492,4.8861,13.7761,5.0608,13.5,5z M5,10H2v3h3 V10z M9,10H6v3h3V10z M13,10h-3v3h3V10z M11,6H8v3h3V6z M7,6H4v3h3V6z\"></path></svg>"

/***/ }),
/* 300 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,4l-1.17,7H3.17L2,4H9z M9.25,2.25C9.25,2.3881,9.1381,2.5,9,2.5H2c-0.1381,0-0.25-0.1119-0.25-0.25S1.8619,2,2,2h2V0h3 v0.5l0,0V2h2C9.1381,2,9.25,2.1119,9.25,2.25z M6.5,2V0.5h-2V2H6.5z\"></path></svg>"

/***/ }),
/* 301 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12.41,5.58l-1.34,8c-0.0433,0.2368-0.2493,0.4091-0.49,0.41H4.42c-0.2407-0.0009-0.4467-0.1732-0.49-0.41l-1.34-8 C2.5458,5.3074,2.731,5.0506,3.0035,5.0064C3.0288,5.0023,3.0544,5.0002,3.08,5h8.83c0.2761-0.0036,0.5028,0.2174,0.5064,0.4935 C12.4168,5.5225,12.4146,5.5514,12.41,5.58z M13,3.5C13,3.7761,12.7761,4,12.5,4h-10C2.2239,4,2,3.7761,2,3.5S2.2239,3,2.5,3H5V1.5 C5,1.2239,5.2239,1,5.5,1h4C9.7761,1,10,1.2239,10,1.5V3h2.5C12.7761,3,13,3.2239,13,3.5z M9,3V2H6v1H9z\"></path></svg>"

/***/ }),
/* 302 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M5.5,11C3.59,11,2,9,2,7s2.61-5.81,3.5-7C6.39,1.19,9,5,9,7S7.41,11,5.5,11z\"></path></svg>"

/***/ }),
/* 303 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M7.49,15C4.5288,14.827,2.1676,12.4615,2,9.5C2,6.6,6.25,1.66,7.49,0c1.24,1.66,5,6.59,5,9.49S10.17,15,7.49,15z\"></path></svg>"

/***/ }),
/* 304 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M1.11,3.33C1.4171,3.0907,1.8016,2.9732,2.19,3C3.0659,2.9354,3.8483,3.5449,4,4.41L4.57,7.8 c-0.455-0.219-0.985-0.219-1.44,0L2.56,4.41C2.3459,3.7852,1.7699,3.3562,1.11,3.33z M5.45,8.21 c0.276-0.2223,0.5966-0.3826,0.94-0.47l0.9-5.5c0.2141-0.6248,0.7901-1.0538,1.45-1.08C8.4346,0.9076,8.0456,0.7791,7.65,0.8 C6.7643,0.7373,5.978,1.3629,5.84,2.24L4.9,7.88C5.0968,7.9658,5.2817,8.0767,5.45,8.21z M8.58,7.85L8.58,7.85 C8.6925,7.7563,8.8129,7.6727,8.94,7.6l0.5-3.21c0.2108-0.6287,0.7875-1.0622,1.45-1.09c-0.3054-0.2524-0.6944-0.3809-1.09-0.36 C8.9147,2.8833,8.1331,3.5129,8,4.39l-0.48,3c0.3812,0.0689,0.7409,0.2264,1.05,0.46H8.58z M10.14,8.75L10.14,8.75 c-0.3136-0.0079-0.6193,0.0988-0.86,0.3l-0.34,0.3c-0.2017,0.1717-0.4983,0.1717-0.7,0L7.91,9.07 c-0.5123-0.4282-1.2577-0.4282-1.77,0L5.8,9.37c-0.2,0.1661-0.49,0.1661-0.69,0L4.77,9.05C4.2553,8.6247,3.5099,8.6289,3,9.06 C2.89,9.15,2.79,9.25,2.68,9.34C2.6141,9.3899,2.5395,9.4272,2.46,9.45C2.2484,9.4973,2.0276,9.4288,1.88,9.27 C1.7014,9.1151,1.5108,8.9747,1.31,8.85C1.1537,8.7667,0.9762,8.7318,0.8,8.75l0,0c-0.1988,0-0.36,0.1612-0.36,0.36 c0,0.1988,0.1612,0.36,0.36,0.36l0,0C0.9778,9.4824,1.1434,9.5652,1.26,9.7l0.22,0.2c0.4962,0.3888,1.1938,0.3888,1.69,0 c0.14-0.1,0.26-0.23,0.4-0.34c0.2034-0.1775,0.5066-0.1775,0.71,0l0.25,0.29c0.514,0.4338,1.266,0.4338,1.78,0 c0.11-0.08,0.2-0.18,0.3-0.27c0.2185-0.2174,0.5715-0.2174,0.79,0l0.29,0.3c0.3601,0.3115,0.8561,0.4138,1.31,0.27 c0.2642-0.0794,0.5024-0.2278,0.69-0.43c0.1208-0.1486,0.2987-0.2394,0.49-0.25l0,0c0.2016-0.0138,0.3538-0.1884,0.34-0.39 s-0.1884-0.3538-0.39-0.34L10.14,8.75z\"></path></svg>"

/***/ }),
/* 305 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M1.48,4.5C1.905,4.1467,2.4483,3.968,3,4c1.2273-0.0869,2.3154,0.7836,2.5,2l0.78,4.68c-0.6394-0.2893-1.3759-0.2709-2,0.05 L3.48,6C3.1874,5.1347,2.3926,4.5387,1.48,4.5z M7.48,11.24c0.3816-0.3076,0.825-0.5293,1.3-0.65L10,3 c0.2926-0.8653,1.0874-1.4613,2-1.5c-0.4198-0.3485-0.955-0.5269-1.5-0.5C9.2727,0.9131,8.1846,1.7836,8,3l-1.3,7.79 C6.9786,10.9052,7.2408,11.0565,7.48,11.24z M11.8,10.74L11.8,10.74c0.1565-0.1277,0.3238-0.2414,0.5-0.34L13,6 c0.2926-0.8653,1.0874-1.4613,2-1.5c-0.4198-0.3485-0.955-0.5269-1.5-0.5c-1.2273-0.0869-2.3154,0.7836-2.5,2l-0.67,4 C10.8731,10.123,11.3778,10.377,11.8,10.74z M14,12L14,12c-0.4346-0.01-0.8579,0.1394-1.19,0.42l-0.47,0.41 c-0.2847,0.2546-0.7153,0.2546-1,0c-0.15-0.12-0.29-0.26-0.44-0.39c-0.7076-0.5968-1.7424-0.5968-2.45,0 c-0.16,0.13-0.31,0.28-0.47,0.41c-0.2847,0.2546-0.7153,0.2546-1,0c-0.16-0.13-0.31-0.28-0.47-0.41 c-0.7059-0.5912-1.7341-0.5912-2.44,0c-0.15,0.13-0.29,0.27-0.44,0.39c-0.0892,0.0715-0.1909,0.1258-0.3,0.16 c-0.2922,0.0652-0.5969-0.0301-0.8-0.25c-0.2475-0.214-0.5117-0.4079-0.79-0.58C1.5336,12.0421,1.2974,11.9865,1.06,12H1 c-0.2761,0-0.5,0.2239-0.5,0.5S0.7239,13,1,13l0,0c0.246,0.0145,0.4762,0.126,0.64,0.31L2,13.57 c0.6717,0.55,1.6308,0.5747,2.33,0.06c0.19-0.14,0.36-0.32,0.55-0.47c0.2847-0.2546,0.7153-0.2546,1,0l0.39,0.35 c0.6937,0.6189,1.7322,0.6484,2.46,0.07c0.15-0.11,0.27-0.25,0.42-0.37c0.2976-0.3038,0.7851-0.3087,1.0889-0.0111 c0.0037,0.0037,0.0074,0.0074,0.0111,0.0111l0.39,0.35c0.4866,0.4124,1.1485,0.5516,1.76,0.37c0.3825-0.1036,0.7286-0.3113,1-0.6 c0.1549-0.1772,0.3674-0.294,0.6-0.33l0,0c0.2761,0,0.5-0.2239,0.5-0.5S14.2761,12,14,12z\"></path></svg>"

/***/ }),
/* 306 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path d=\"M9,2c0,0.5523-0.4477,1-1,1S7,2.5523,7,2s0.4477-1,1-1S9,1.4477,9,2z M2.5,4c0.0595,0.0109,0.1205,0.0109,0.18,0l0,0 l1.79-0.83l0.46,0.48L4.39,4.5c0.7851,0.1244,1.5102,0.4957,2.07,1.06l0.44-0.8c0.1914-0.2972,0.1057-0.6932-0.1915-0.8846 C6.7057,3.8736,6.7029,3.8718,6.7,3.87L4.85,2.15l0,0C4.7176,1.9875,4.4965,1.9272,4.3,2l0,0l-2,1l0,0 C2.0239,3.0552,1.8448,3.3239,1.9,3.6S2.2239,4.0552,2.5,4z M6.59,8.2C6.5854,8.7633,6.4074,9.3115,6.08,9.77 c-0.1844,0.2837-0.4263,0.5256-0.71,0.71C4.9099,10.8129,4.3578,10.9946,3.79,11C2.2475,10.9945,1,9.7425,1,8.2 c0.0054-0.5678,0.1871-1.1199,0.52-1.58c0.2059-0.2655,0.4445-0.5041,0.71-0.71C2.6857,5.5846,3.2301,5.4066,3.79,5.4 C5.3364,5.4,6.59,6.6536,6.59,8.2L6.59,8.2z M5.19,8.89C5.3032,8.6772,5.3648,8.4409,5.37,8.2C5.3645,7.3313,4.6587,6.63,3.79,6.63 C3.5491,6.6352,3.3127,6.6968,3.1,6.81c-0.2885,0.1742-0.5317,0.414-0.71,0.7c-0.1147,0.2158-0.1764,0.4557-0.18,0.7 c0.0055,0.8687,0.7113,1.57,1.58,1.57c0.2443-0.0036,0.4843-0.0653,0.7-0.18C4.7824,9.4299,5.024,9.1848,5.19,8.89z M9,6.4 C8.9544,6.149,8.7238,5.9751,8.47,6H6.82c0.223,0.3051,0.3983,0.6423,0.52,1H8l1,2.59c0.0475,0.2328,0.2524,0.4,0.49,0.4h0.1 c0.2725-0.0445,0.4574-0.3015,0.4129-0.5741C10.002,9.4106,10.001,9.4053,10,9.4L9,6.4z\"></path></svg>"

/***/ }),
/* 307 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path d=\"M12,1.5C12,2.3284,11.3284,3,10.5,3S9,2.3284,9,1.5S9.6716,0,10.5,0S12,0.6716,12,1.5z M2.82,4.87l1.74-1.71l1.85,1.29 L5.67,5.7c1.0747,0.3341,2.0207,0.9904,2.71,1.88l0.88-1.5c0.2295-0.4158,0.0785-0.939-0.3373-1.1685 C8.9218,4.911,8.9209,4.9105,8.92,4.91L8.3,4.54L4.79,2.1C4.5927,1.9594,4.3231,1.9805,4.15,2.15l-2,2 C1.9852,4.3716,2.0312,4.6848,2.2528,4.8496C2.4193,4.9735,2.645,4.9816,2.82,4.87z M8.13,10.94 c-0.0143,1.2308-0.5794,2.3904-1.54,3.16c-0.7118,0.5804-1.6016,0.8982-2.52,0.9C1.8261,15,0.0055,13.1839,0,10.94 c0.0023-0.9231,0.3238-1.8169,0.91-2.53c0.1868-0.232,0.398-0.4432,0.63-0.63c0.7131-0.5862,1.6069-0.9077,2.53-0.91 C6.3139,6.8755,8.13,8.6961,8.13,10.94z M6,12.21C6.7679,11.2051,6.5758,9.7679,5.5709,9C4.7501,8.3727,3.6109,8.3727,2.79,9 C2.5283,9.151,2.311,9.3683,2.16,9.63c-0.6923,1.0584-0.3956,2.4777,0.6628,3.17c0.7615,0.4981,1.7457,0.4981,2.5072,0 C5.5805,12.6365,5.8061,12.4378,6,12.21z M14.2,13.21l-2.49-5C11.5906,7.9251,11.3088,7.7425,11,7.75H8.51 c0.3293,0.4578,0.5856,0.9638,0.76,1.5h1.26l2.29,4.58c0.185,0.3728,0.6372,0.525,1.01,0.34c0.3728-0.185,0.525-0.6372,0.34-1.01 L14.2,13.21z\"></path></svg>"

/***/ }),
/* 308 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4764\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"zoo-11.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 11 11\" style=\"enable-background:new 0 0 11 11;\" xml:space=\"preserve\"><path style=\"fill:#010101;\" d=\"M8,2C7.1,2,6.5,2.5,6.2,3.1C6.2,3.1,5.5,4,5,4H3C2.5,4,2,4.5,2,4.5l-2,2V7h0.5l1.2-1.2L1.9,6 C1.9,6,1,7.7,1,9c0,0.5,0.5,0.5,0.5,0.5H2c0,0,0.2,0,0-0.2L1.8,9.1c0-0.5,0.8-1.4,1.2-1.9c0,0,0,0.8,0,1.4 c0,0.3,0.1111,0.9,0.4111,0.9h0.5c0,0,0.2,0,0-0.2l-0.2-0.2C3.5111,8.7,4.3,7.5,4.3,7.5h1.8L6.6,9c0.2,0.5,0.5,0.5,0.5,0.5h1 c0.2,0,0.7-0.2,0.2-0.5L8.1,8.8V7l0,0c1,0,1.1-1.3,1.5-1.7l0.7-0.1c0.2,0,0.8-0.2,0.8-0.8V4L9.9,3l0,0C9.4,2.4,8.7,2,8,2z\"></path></svg>"

/***/ }),
/* 309 */
/***/ (function(module, exports) {

module.exports = "<svg version=\"1.1\" id=\"svg4619\" inkscape:version=\"0.91+devel+osxmenu r12911\" sodipodi:docname=\"zoo-15.svg\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 15 15\" style=\"enable-background:new 0 0 15 15;\" xml:space=\"preserve\"><path id=\"path17499\" inkscape:connector-curvature=\"0\" sodipodi:nodetypes=\"sssssscsccccsccscccscscccscsscccsscsss\" d=\" M8.3879,3.8928C8.3879,3.8928,7.6818,5,7,5H4.5C3.8182,5,3.2016,5.4086,2.7273,5.8636L0.5,8C0.231,8.258,0.0072,8.7681,0,9 c-0.0156,0.5,0,1,0,1s1,0,1-1V8.5l1-1h0.5l0.158,0.2892c0,0-0.9535,1.8244-0.9535,3.5289C1.7046,12,2.3864,12,2.3864,12h0.6818 c0,0,0.3409,0,0-0.3409l-0.3409-0.3409C2.7273,10.6364,3.5002,9.6667,4,9c0,0,0.0168,1.1579,0,2c-0.008,0.4096,0.2721,1,0.6818,1 h0.6818c0,0,0.3409,0,0-0.3409l-0.3409-0.3409C4.7105,10.7495,5.5,8.5,5.5,8.5C6.7716,8.5,7,9,8.5,9l0.3636,2.3182 C8.975,12.0282,9.5,12,9.5,12H11c0.3409,0,0.9611-0.3115,0.3409-0.7736L11,11V9c1.2142-0.1722,2-1,2-2h1c0.3214,0,1,0,1-0.5v-1 l-1.7045-1.6818C12.5444,3.0772,12,2.5,11,2.5C9.5469,2.5,8.8636,3.0688,8.3879,3.8928z\"></path></svg>"

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {module.exports.dirname = __dirname;
module.exports.layouts = {
    all: __webpack_require__(311),
    streets: __webpack_require__(312)
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 311 */
/***/ (function(module, exports) {

module.exports = {"all":["aerialway","airfield","airport","alcohol-shop","america-football","amusement-park","aquarium","art-gallery","attraction","bakery","bank","bar","baseball","basketball","beer","bicycle","bicycle-share","blood-bank","buddhism","building","bus","cafe","campsite","car","castle","cemetery","central-building","cinema","circle","circle-stroked","clothing-store","college","commercial","cricket","cross","dam","danger","dentist","doctor","dog-park","drinking-water","embassy","entrance","farm","fast-food","ferry","fire-station","fuel","gaming","garden","garden-center","gift","golf","grocery","hairdresser","harbor","heart","heliport","hospital","ice-cream","industry","information","karaoke","landmark","laundry","library","lighthouse","lodging","marker","monument","mountain","museum","music","park","parking","parking-garage","pharmacy","picnic-site","pitch","place-of-worship","playground","police","post","prison","rail","rail-light","rail-metro","ranger-station","religious-christian","religious-jewish","religious-muslim","residential-community","restaurant","roadblock","rocket","school","shelter","shop","skiing","soccer","square","square-stroked","stadium","star","star-stroked","suitcase","sushi","swimming","teahouse","telephone","tennis","theatre","toilet","town-hall","triangle","triangle-stroked","veterinary","volcano","warehouse","waste-basket","water","wetland","wheelchair","zoo"]}

/***/ }),
/* 312 */
/***/ (function(module, exports) {

module.exports = {"Airport":["airfield","airport","heliport","rocket"],"Mountain peak":["mountain","volcano"],"Dining":["bakery","bar","beer","cafe","fast-food","ice-cream","restaurant"],"Education":["college","school"],"General":["alcohol-shop","amusement-park","aquarium","art-gallery","attraction","bank","bicycle","bicycle-share","car","castle","cinema","circle","circle-stroked","clothing-store","drinking-water","embassy","fire-station","fuel","grocery","harbor","information","laundry","library","lodging","marker","monument","museum","music","place-of-worship","police","post","prison","religious-christian","religious-jewish","religious-muslim","shop","stadium","star","suitcase","swimming","theatre","toilet","town-hall","triangle","triangle-stroked","veterinary"],"Health":["dentist","doctor","hospital","pharmacy"],"Outdoors":["campsite","cemetery","dog-park","garden","golf","park","picnic-site","playground","zoo"],"Transit":["bus","ferry"],"Rail station":["entrance","rail","rail-light","rail-metro"]}

/***/ }),
/* 313 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_icon_pair_vue__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9ccfa5c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_icon_pair_vue__ = __webpack_require__(317);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(314)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_icon_pair_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9ccfa5c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_icon_pair_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "icon-pair.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9ccfa5c6", Component.options)
  } else {
    hotAPI.reload("data-v-9ccfa5c6", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(315);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("15350da0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9ccfa5c6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./icon-pair.vue", function() {
     var newContent = require("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9ccfa5c6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./icon-pair.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv.icon-holder {\n  display: inline-block;\n  border: 1px solid rgba(200,200,200,.5);\n}\ndiv.icon-holder:hover{\n  border: 1px solid black;\n}\ndiv.icon-11{\n  display: inline-block;\n  margin:5px;\n  width:11px;\n  height: 11px;\n}\ndiv.icon-15 {\n  display: inline-block;\n  margin:5px;\n  width: 15px;\n  height: 15px;\n}\nspan:not(.active){\n  opacity:.3\n}\n/*span.active{\n  color:#000\n}*/\n", "", {"version":3,"sources":["/home/steven/programming/maki-choice/icon-pair.vue?394aea1d"],"names":[],"mappings":";AAuCA;EACA,sBAAA;EACA,uCAAA;CACA;AACA;EACA,wBAAA;CACA;AACA;EACA,sBAAA;EACA,WAAA;EACA,WAAA;EACA,aAAA;CACA;AACA;EACA,sBAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;CACA;AACA;EACA,UAAA;CACA;AACA;;GAEA","file":"icon-pair.vue","sourcesContent":["<template>\n  <div\n    class=\"icon-holder\"\n    :class=\"`$icon-${name}`\"\n    @hover=\"onHover\"\n    @click=\"onClick\"\n    :title=\"`${name} [${theme}]`\"\n  >\n    <div class=\"icon-11\">\n      <inline\n      :class=\"{active: active}\"\n      :name=\"`./${name}-11.svg`\"\n      ></inline>\n    </div>\n    <div class=\"icon-15\">\n      <inline\n      :class=\"{active: active}\"\n      :name=\"`./${name}-15.svg`\"\n      ></inline>\n    </div>\n  </div>\n</template>\n<script>\n  export default {\n    props:['name', 'theme', 'search'],\n    computed:{\n      active(){\n        var re = new RegExp(this.search, 'ig')\n        return this.name.match(re)\n          ||   this.theme.match(re)\n      }\n    },\n    methods:{\n      onHover(){this.$emit('hovered', {name:this.name, theme:this.theme})},\n      onClick(){this.$emit('clicked', {name:this.name, theme:this.theme})}\n    }\n  }\n</script>\n<style scope>\n  div.icon-holder {\n    display: inline-block;\n    border: 1px solid rgba(200,200,200,.5);\n  }\n  div.icon-holder:hover{\n    border: 1px solid black;\n  }\n  div.icon-11{\n    display: inline-block;\n    margin:5px;\n    width:11px;\n    height: 11px;\n  }\n  div.icon-15 {\n    display: inline-block;\n    margin:5px;\n    width: 15px;\n    height: 15px;\n  }\n  span:not(.active){\n    opacity:.3\n  }\n  /*span.active{\n    color:#000\n  }*/\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  props:['name', 'theme', 'search'],
  computed:{
    active(){
      var re = new RegExp(this.search, 'ig')
      return this.name.match(re)
        ||   this.theme.match(re)
    }
  },
  methods:{
    onHover(){this.$emit('hovered', {name:this.name, theme:this.theme})},
    onClick(){this.$emit('clicked', {name:this.name, theme:this.theme})}
  }
});


/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "icon-holder",
      class: "$icon-" + _vm.name,
      attrs: { title: _vm.name + " [" + _vm.theme + "]" },
      on: { hover: _vm.onHover, click: _vm.onClick }
    },
    [
      _c(
        "div",
        { staticClass: "icon-11" },
        [
          _c("inline", {
            class: { active: _vm.active },
            attrs: { name: "./" + _vm.name + "-11.svg" }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "icon-15" },
        [
          _c("inline", {
            class: { active: _vm.active },
            attrs: { name: "./" + _vm.name + "-15.svg" }
          })
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-9ccfa5c6", esExports)
  }
}

/***/ }),
/* 318 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_display_icon_pair_vue__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_90eb175c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_display_icon_pair_vue__ = __webpack_require__(322);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(319)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-90eb175c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_display_icon_pair_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_90eb175c_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_display_icon_pair_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "display-icon-pair.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-90eb175c", Component.options)
  } else {
    hotAPI.reload("data-v-90eb175c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(320);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("16795798", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-90eb175c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./display-icon-pair.vue", function() {
     var newContent = require("!!./node_modules/css-loader/index.js?sourceMap!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-90eb175c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./display-icon-pair.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\nh3[data-v-90eb175c]{\n  text-align: center;\n}\n.align[data-v-90eb175c] {\n  display: block;\n  margin: auto;\n}\n.display-icon-11[data-v-90eb175c] {\n  display: inline-block;\n  border:1px solid;\n  width:  110px;\n  height: 110px;\n  margin-left: calc(50% - 130px)\n}\n.display-icon-15[data-v-90eb175c]{\n  display: inline-block;\n  border:1px solid;\n  height:150px;\n  width:150px;\n}\n", "", {"version":3,"sources":["/home/steven/programming/maki-choice/display-icon-pair.vue?f9f80440"],"names":[],"mappings":";AAkCA;EACA,mBAAA;CACA;AACA;EACA,eAAA;EACA,aAAA;CACA;AACA;EACA,sBAAA;EACA,iBAAA;EACA,cAAA;EACA,cAAA;EACA,8BAAA;CACA;AACA;EACA,sBAAA;EACA,iBAAA;EACA,aAAA;EACA,YAAA;CACA","file":"display-icon-pair.vue","sourcesContent":["<template>\n  <div class=\"col-md-5 col-sm-12\">\n    <!-- title stuff -->\n    <div class=\"row icon-info\">\n      <div class=\"col-12\">\n        <h3>{{name || 'Icon'}} {{theme ? `  [${theme}]` : 'info'}}</h3>\n      </div>\n      <!-- <h3 class=\"col-3\">{{name || 'Icon'}}</h3>\n      <h4>{{theme ? `Theme: ${theme}`: 'Info'}}</h4> -->\n    </div>\n    <!-- icons -->\n    <div class=\"row display-icons\">\n      <div class=\"col-12\">\n          <div class=\"display-icon-11\">\n            <inline :name=\"`./${name}-11.svg`\"></inline>\n          </div>\n          <div class=\"display-icon-15\">\n            <inline :name=\"`./${name}-15.svg`\"></inline>\n          </div>\n      </div>\n    </div>\n  </div>\n</template>\n<script>\n  export default {\n    props:['name', 'theme'],\n    updated(){\n      Array.from(document.querySelectorAll('metadata'))\n        .map(el => el.parentElement)\n        .forEach(svg => svg.appendChild(svg.querySelector('path')))\n    }\n  }\n</script>\n<style scoped>\n  h3{\n    text-align: center;\n  }\n  .align {\n    display: block;\n    margin: auto;\n  }\n  .display-icon-11 {\n    display: inline-block;\n    border:1px solid;\n    width:  110px;\n    height: 110px;\n    margin-left: calc(50% - 130px)\n  }\n  .display-icon-15{\n    display: inline-block;\n    border:1px solid;\n    height:150px;\n    width:150px;\n  }\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  props:['name', 'theme'],
  updated(){
    Array.from(document.querySelectorAll('metadata'))
      .map(el => el.parentElement)
      .forEach(svg => svg.appendChild(svg.querySelector('path')))
  }
});


/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "col-md-5 col-sm-12" }, [
    _c("div", { staticClass: "row icon-info" }, [
      _c("div", { staticClass: "col-12" }, [
        _c("h3", [
          _vm._v(
            _vm._s(_vm.name || "Icon") +
              " " +
              _vm._s(_vm.theme ? "  [" + _vm.theme + "]" : "info")
          )
        ])
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "row display-icons" }, [
      _c("div", { staticClass: "col-12" }, [
        _c(
          "div",
          { staticClass: "display-icon-11" },
          [_c("inline", { attrs: { name: "./" + _vm.name + "-11.svg" } })],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "display-icon-15" },
          [_c("inline", { attrs: { name: "./" + _vm.name + "-15.svg" } })],
          1
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-90eb175c", esExports)
  }
}

/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container-fluid" }, [
    _c(
      "div",
      { staticClass: "row" },
      [
        _c("div", { staticClass: "col-md-6 col-sm-12" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.search,
                expression: "search"
              }
            ],
            staticClass: "col-xs-12",
            attrs: {
              type: "text",
              placeholder: "search icon names and themes"
            },
            domProps: { value: _vm.search },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.search = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "col-xs-12" },
            _vm._l(_vm.icons, function(icon) {
              return _c(
                "icon-pair",
                _vm._b(
                  {
                    key: icon.name,
                    attrs: { search: _vm.search },
                    on: { clicked: _vm.showIcon, hovered: _vm.showIcon }
                  },
                  "icon-pair",
                  icon,
                  false
                )
              )
            })
          )
        ]),
        _vm._v(" "),
        _c(
          "display-icon-pair",
          _vm._b({}, "display-icon-pair", _vm.shown, false)
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0223ae8b", esExports)
  }
}

/***/ })
/******/ ]);