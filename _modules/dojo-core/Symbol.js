(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './has', './global'], factory);
    }
})(function (require, exports) {
    var has_1 = require('./has');
    var global_1 = require('./global');
    var Shim;
    (function (Shim) {
        var InternalSymbol;
        var defineProperties = Object.defineProperties;
        var defineProperty = Object.defineProperty;
        var create = Object.create;
        var objPrototype = Object.prototype;
        var globalSymbols = {};
        /**
         * Helper function to generate a value property descriptor
         * @param value        The value the property descriptor should be set to
         * @param enumerable   If the property should be enumberable, defaults to false
         * @param writable     If the property should be writable, defaults to true
         * @param configurable If the property should be configurable, defaults to true
         * @returns            The property descriptor object
         */
        function getValueDescriptor(value, enumerable, writable, configurable) {
            if (enumerable === void 0) { enumerable = false; }
            if (writable === void 0) { writable = true; }
            if (configurable === void 0) { configurable = true; }
            return {
                value: value,
                enumerable: enumerable,
                writable: writable,
                configurable: configurable
            };
        }
        var getSymbolName = (function () {
            var created = create(null);
            return function (desc) {
                var postfix = 0;
                var name;
                while (created[String(desc) + (postfix || '')]) {
                    ++postfix;
                }
                desc += String(postfix || '');
                created[desc] = true;
                name = '@@' + desc;
                defineProperty(objPrototype, name, {
                    set: function (value) {
                        defineProperty(this, name, getValueDescriptor(value));
                    }
                });
                return name;
            };
        }());
        InternalSymbol = function Symbol(description) {
            if (this instanceof InternalSymbol) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            return Symbol(description);
        };
        Shim.Symbol = function Symbol(description) {
            if (this instanceof Symbol) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            var sym = Object.create(InternalSymbol.prototype);
            description = (description === undefined ? '' : String(description));
            return defineProperties(sym, {
                __description__: getValueDescriptor(description),
                __name__: getValueDescriptor(getSymbolName(description))
            });
        };
        /**
         * A custom guard function that determines if an object is a symbol or not
         * @param  {any}       value The value to check to see if it is a symbol or not
         * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
         */
        function isSymbol(value) {
            return (value && ((typeof value === 'symbol') || (value['@@toStringTag'] === 'Symbol'))) || false;
        }
        Shim.isSymbol = isSymbol;
        /**
         * Throws if the value is not a symbol, used internally within the Shim
         * @param  {any}    value The value to check
         * @return {symbol}       Returns the symbol or throws
         */
        function validateSymbol(value) {
            if (!isSymbol(value)) {
                throw new TypeError(value + ' is not a symbol');
            }
            return value;
        }
        /* Decorate the Symbol function with the appropriate properties */
        defineProperties(Shim.Symbol, {
            for: getValueDescriptor(function (key) {
                if (globalSymbols[key]) {
                    return globalSymbols[key];
                }
                return (globalSymbols[key] = Shim.Symbol(String(key)));
            }),
            keyFor: getValueDescriptor(function (sym) {
                var key;
                validateSymbol(sym);
                for (key in globalSymbols) {
                    if (globalSymbols[key] === sym) {
                        return key;
                    }
                }
            }),
            hasInstance: getValueDescriptor(Shim.Symbol('hasInstance'), false, false),
            isConcatSpreadable: getValueDescriptor(Shim.Symbol('isConcatSpreadable'), false, false),
            iterator: getValueDescriptor(Shim.Symbol('iterator'), false, false),
            match: getValueDescriptor(Shim.Symbol('match'), false, false),
            replace: getValueDescriptor(Shim.Symbol('replace'), false, false),
            search: getValueDescriptor(Shim.Symbol('search'), false, false),
            species: getValueDescriptor(Shim.Symbol('species'), false, false),
            split: getValueDescriptor(Shim.Symbol('split'), false, false),
            toPrimitive: getValueDescriptor(Shim.Symbol('toPrimitive'), false, false),
            toStringTag: getValueDescriptor(Shim.Symbol('toStringTag'), false, false),
            unscopables: getValueDescriptor(Shim.Symbol('unscopables'), false, false)
        });
        /* Decorate the InternalSymbol object */
        defineProperties(InternalSymbol.prototype, {
            constructor: getValueDescriptor(Shim.Symbol),
            toString: getValueDescriptor(function () { return this.__name__; }, false, false)
        });
        /* Decorate the Symbol.prototype */
        defineProperties(Shim.Symbol.prototype, {
            toString: getValueDescriptor(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
            valueOf: getValueDescriptor(function () { return validateSymbol(this); })
        });
        defineProperty(Shim.Symbol.prototype, Shim.Symbol.toPrimitive, getValueDescriptor(function () { return validateSymbol(this); }));
        defineProperty(Shim.Symbol.prototype, Shim.Symbol.toStringTag, getValueDescriptor('Symbol', false, false, true));
        defineProperty(InternalSymbol.prototype, Shim.Symbol.toPrimitive, getValueDescriptor(Shim.Symbol.prototype[Shim.Symbol.toPrimitive], false, false, true));
        defineProperty(InternalSymbol.prototype, Shim.Symbol.toStringTag, getValueDescriptor(Shim.Symbol.prototype[Shim.Symbol.toStringTag], false, false, true));
    })(Shim = exports.Shim || (exports.Shim = {}));
    var Symbol = has_1.default('es6-symbol') ? global_1.default.Symbol : Shim.Symbol;
    exports.isSymbol = Shim.isSymbol;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Symbol;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ltYm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N5bWJvbC50cyJdLCJuYW1lcyI6WyJTaGltIiwiU2hpbS5nZXRWYWx1ZURlc2NyaXB0b3IiLCJTaGltLlN5bWJvbCIsIlNoaW0uaXNTeW1ib2wiLCJTaGltLnZhbGlkYXRlU3ltYm9sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFBLG9CQUFnQixPQUFPLENBQUMsQ0FBQTtJQUN4Qix1QkFBbUIsVUFBVSxDQUFDLENBQUE7SUFFOUIsSUFBaUIsSUFBSSxDQTRLcEI7SUE1S0QsV0FBaUIsSUFBSSxFQUFDLENBQUM7UUFFdEJBLElBQUlBLGNBQWlDQSxDQUFDQTtRQTRCdENBLElBQU1BLGdCQUFnQkEsR0FBR0EsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUNqREEsSUFBTUEsY0FBY0EsR0FBR0EsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDN0NBLElBQU1BLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBRTdCQSxJQUFNQSxZQUFZQSxHQUFHQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtRQU10Q0EsSUFBTUEsYUFBYUEsR0FBa0JBLEVBQUVBLENBQUNBO1FBUXhDQTs7Ozs7OztXQU9HQTtRQUNIQSw0QkFBK0JBLEtBQVFBLEVBQUVBLFVBQTJCQSxFQUFFQSxRQUF3QkEsRUFBRUEsWUFBNEJBO1lBQW5GQywwQkFBMkJBLEdBQTNCQSxrQkFBMkJBO1lBQUVBLHdCQUF3QkEsR0FBeEJBLGVBQXdCQTtZQUFFQSw0QkFBNEJBLEdBQTVCQSxtQkFBNEJBO1lBQzNIQSxNQUFNQSxDQUFDQTtnQkFDTkEsS0FBS0EsRUFBRUEsS0FBS0E7Z0JBQ1pBLFVBQVVBLEVBQUVBLFVBQVVBO2dCQUN0QkEsUUFBUUEsRUFBRUEsUUFBUUE7Z0JBQ2xCQSxZQUFZQSxFQUFFQSxZQUFZQTthQUMxQkEsQ0FBQ0E7UUFDSEEsQ0FBQ0E7UUFFREQsSUFBTUEsYUFBYUEsR0FBR0Es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QSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLE9BQU9BLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQ3hEQSxPQUFPQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQzVEQSxNQUFNQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQzFEQSxPQUFPQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQzVEQSxLQUFLQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLE9BQU9BLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQ3hEQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQ3BFQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1lBQ3BFQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1NBQ3BFQSxDQUFDQSxDQUFDQTtRQUVIQSx3Q0FBd0NBO1FBQ3hDQSxnQkFBZ0JBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLEVBQUVBO1lBQzFDQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBO1lBQ3ZDQSxRQUFRQSxFQUFFQSxrQkFBa0JBLENBQUNBLGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBO1NBQ2pGQSxDQUFDQSxDQUFDQTtRQUVIQSxtQ0FBbUNBO1FBQ25DQSxnQkFBZ0JBLENBQUNBLFdBQU1BLENBQUNBLFNBQVNBLEVBQUVBO1lBQ2xDQSxRQUFRQSxFQUFFQSxrQkFBa0JBLENBQUNBLGNBQWMsTUFBTSxDQUFDLFVBQVUsR0FBVSxjQUFjLENBQUMsSUFBSSxDQUFFLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ0E7WUFDckhBLE9BQU9BLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsY0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQTtTQUN6RUEsQ0FBQ0EsQ0FBQ0E7UUFFSEEsY0FBY0EsQ0FBQ0EsV0FBTUEsQ0FBQ0EsU0FBU0EsRUFBUUEsV0FBTUEsQ0FBQ0EsV0FBV0EsRUFBRUEsa0JBQWtCQSxDQUFDQSxjQUFjLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLENBQUNBLENBQUNBO1FBQzdIQSxjQUFjQSxDQUFDQSxXQUFNQSxDQUFDQSxTQUFTQSxFQUFRQSxXQUFNQSxDQUFDQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFFBQVFBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBRTdHQSxjQUFjQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFRQSxXQUFNQSxDQUFDQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLFNBQVNBLENBQUNBLFdBQU1BLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ2pKQSxjQUFjQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFRQSxXQUFNQSxDQUFDQSxXQUFXQSxFQUFFQSxrQkFBa0JBLENBQUNBLFdBQU1BLENBQUNBLFNBQVNBLENBQUNBLFdBQU1BLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO0lBQ2xKQSxDQUFDQSxFQTVLZ0IsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBNEtwQjtJQUVELElBQU0sTUFBTSxHQUEyQixhQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsZ0JBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUUxRSxnQkFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFFdEM7c0JBQWUsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGhhcyBmcm9tICcuL2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcblxuZXhwb3J0IG5hbWVzcGFjZSBTaGltIHtcblx0ZXhwb3J0IGxldCBTeW1ib2w6IFN5bWJvbENvbnN0cnVjdG9yO1xuXHRsZXQgSW50ZXJuYWxTeW1ib2w6IFN5bWJvbENvbnN0cnVjdG9yO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgU3ltYm9sIHtcblx0XHR0b1N0cmluZygpOiBzdHJpbmc7XG5cdFx0dmFsdWVPZigpOiBPYmplY3Q7XG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106IHN0cmluZztcblx0XHRbU3ltYm9sLnRvUHJpbWl0aXZlXTogc3ltYm9sO1xuXHRcdFtzOiBzdHJpbmddOiBhbnk7XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIFN5bWJvbENvbnN0cnVjdG9yIHtcblx0ICAgIHByb3RvdHlwZTogU3ltYm9sO1xuXHQgICAgKGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbDtcblx0ICAgIGZvcihrZXk6IHN0cmluZyk6IHN5bWJvbDtcblx0ICAgIGtleUZvcihzeW06IHN5bWJvbCk6IHN0cmluZztcblx0ICAgIGhhc0luc3RhbmNlOiBzeW1ib2w7XG5cdCAgICBpc0NvbmNhdFNwcmVhZGFibGU6IHN5bWJvbDtcblx0ICAgIGl0ZXJhdG9yOiBzeW1ib2w7XG5cdCAgICBtYXRjaDogc3ltYm9sO1xuXHQgICAgcmVwbGFjZTogc3ltYm9sO1xuXHQgICAgc2VhcmNoOiBzeW1ib2w7XG5cdCAgICBzcGVjaWVzOiBzeW1ib2w7XG5cdCAgICBzcGxpdDogc3ltYm9sO1xuXHQgICAgdG9QcmltaXRpdmU6IHN5bWJvbDtcblx0ICAgIHRvU3RyaW5nVGFnOiBzeW1ib2w7XG5cdCAgICB1bnNjb3BhYmxlczogc3ltYm9sO1xuXHR9XG5cblx0Y29uc3QgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuXHRjb25zdCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0Y29uc3QgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuXHRjb25zdCBvYmpQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cdGludGVyZmFjZSBHbG9iYWxTeW1ib2xzIHtcblx0XHRba2V5OiBzdHJpbmddOiBzeW1ib2w7XG5cdH1cblxuXHRjb25zdCBnbG9iYWxTeW1ib2xzOiBHbG9iYWxTeW1ib2xzID0ge307XG5cblx0aW50ZXJmYWNlIFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPFQ+IGV4dGVuZHMgUHJvcGVydHlEZXNjcmlwdG9yIHtcblx0ICAgIHZhbHVlPzogVDtcblx0ICAgIGdldD8gKCk6IFQ7XG5cdCAgICBzZXQ/ICh2OiBUKTogdm9pZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSB2YWx1ZSBwcm9wZXJ0eSBkZXNjcmlwdG9yXG5cdCAqIEBwYXJhbSB2YWx1ZSAgICAgICAgVGhlIHZhbHVlIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBzZXQgdG9cblx0ICogQHBhcmFtIGVudW1lcmFibGUgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGVudW1iZXJhYmxlLCBkZWZhdWx0cyB0byBmYWxzZVxuXHQgKiBAcGFyYW0gd3JpdGFibGUgICAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgd3JpdGFibGUsIGRlZmF1bHRzIHRvIHRydWVcblx0ICogQHBhcmFtIGNvbmZpZ3VyYWJsZSBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuXHQgKiBAcmV0dXJucyAgICAgICAgICAgIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0VmFsdWVEZXNjcmlwdG9yPFQ+KHZhbHVlOiBULCBlbnVtZXJhYmxlOiBib29sZWFuID0gZmFsc2UsIHdyaXRhYmxlOiBib29sZWFuID0gdHJ1ZSwgY29uZmlndXJhYmxlOiBib29sZWFuID0gdHJ1ZSk6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPFQ+IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHZhbHVlLFxuXHRcdFx0ZW51bWVyYWJsZTogZW51bWVyYWJsZSxcblx0XHRcdHdyaXRhYmxlOiB3cml0YWJsZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXG5cdFx0fTtcblx0fVxuXG5cdGNvbnN0IGdldFN5bWJvbE5hbWUgPSAoZnVuY3Rpb24gKCkge1xuXHRcdGNvbnN0IGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChkZXNjOiBzdHJpbmd8bnVtYmVyKTogc3RyaW5nIHtcblx0XHRcdGxldCBwb3N0Zml4ID0gMDtcblx0XHRcdGxldCBuYW1lOiBzdHJpbmc7XG5cdFx0XHR3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XG5cdFx0XHRcdCsrcG9zdGZpeDtcblx0XHRcdH1cblx0XHRcdGRlc2MgKz0gU3RyaW5nKHBvc3RmaXggfHwgJycpO1xuXHRcdFx0Y3JlYXRlZFtkZXNjXSA9IHRydWU7XG5cdFx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cdFx0XHRkZWZpbmVQcm9wZXJ0eShvYmpQcm90b3R5cGUsIG5hbWUsIHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbiAodmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdGRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH07XG5cdH0gKCkpO1xuXG5cdEludGVybmFsU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBJbnRlcm5hbFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0cmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XG5cdH0gYXMgU3ltYm9sQ29uc3RydWN0b3I7XG5cblx0U3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlKTtcblx0XHRkZXNjcmlwdGlvbiA9IChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pKTtcblx0XHRyZXR1cm4gZGVmaW5lUHJvcGVydGllcyhzeW0sIHtcblx0XHRcdF9fZGVzY3JpcHRpb25fXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcblx0XHRcdF9fbmFtZV9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZShkZXNjcmlwdGlvbikpXG5cdFx0fSk7XG5cdH0gYXMgU3ltYm9sQ29uc3RydWN0b3I7XG5cblx0LyoqXG5cdCAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XG5cdCAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3Rcblx0ICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcblx0ICovXG5cdGV4cG9ydCBmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3ltYm9sIHtcblx0XHRyZXR1cm4gKHZhbHVlICYmICgodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJykgfHwgKHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkpIHx8IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXG5cdCAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4ge3N5bWJvbH0gICAgICAgUmV0dXJucyB0aGUgc3ltYm9sIG9yIHRocm93c1xuXHQgKi9cblx0ZnVuY3Rpb24gdmFsaWRhdGVTeW1ib2wodmFsdWU6IGFueSk6IHN5bWJvbCB7XG5cdFx0aWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhTeW1ib2wsIHtcblx0XHRmb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoa2V5OiBzdHJpbmcpOiBzeW1ib2wge1xuXHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkge1xuXHRcdFx0XHRyZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcblx0XHR9KSxcblx0XHRrZXlGb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoc3ltOiBzeW1ib2wpOiBzdHJpbmcge1xuXHRcdFx0bGV0IGtleTogc3RyaW5nO1xuXHRcdFx0dmFsaWRhdGVTeW1ib2woc3ltKTtcblx0XHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcblx0XHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLFxuXHRcdGhhc0luc3RhbmNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdGlzQ29uY2F0U3ByZWFkYWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2woJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0bWF0Y2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2woJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0cmVwbGFjZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgncmVwbGFjZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNlYXJjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c3BlY2llczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwbGl0OiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCdzcGxpdCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvUHJpbWl0aXZlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvU3RyaW5nVGFnOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHVuc2NvcGFibGVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd1bnNjb3BhYmxlcycpLCBmYWxzZSwgZmFsc2UpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBJbnRlcm5hbFN5bWJvbCBvYmplY3QgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHRjb25zdHJ1Y3RvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCksXG5cdFx0dG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9fbmFtZV9fOyB9LCBmYWxzZSwgZmFsc2UpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLnByb3RvdHlwZSwge1xuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1N5bWJvbCAoJyArICg8YW55PiB2YWxpZGF0ZVN5bWJvbCh0aGlzKSkuX19kZXNjcmlwdGlvbl9fICsgJyknOyB9KSxcblx0XHR2YWx1ZU9mOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7IH0pXG5cdH0pO1xuXG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpOyB9KSk7XG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcblxuXHRkZWZpbmVQcm9wZXJ0eShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XG5cdGRlZmluZVByb3BlcnR5KEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwgPGFueT4gU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcbn1cblxuY29uc3QgU3ltYm9sOiBTaGltLlN5bWJvbENvbnN0cnVjdG9yID0gaGFzKCdlczYtc3ltYm9sJykgPyBnbG9iYWwuU3ltYm9sIDogU2hpbS5TeW1ib2w7XG5cbmV4cG9ydCBjb25zdCBpc1N5bWJvbCA9IFNoaW0uaXNTeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiJdfQ==