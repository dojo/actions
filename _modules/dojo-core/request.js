var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './async/Task', './has', './Registry', './load'], factory);
    }
})(function (require, exports) {
    var Task_1 = require('./async/Task');
    var has_1 = require('./has');
    var Registry_1 = require('./Registry');
    var load_1 = require('./load');
    var FilterRegistry = (function (_super) {
        __extends(FilterRegistry, _super);
        function FilterRegistry() {
            _super.apply(this, arguments);
        }
        FilterRegistry.prototype.register = function (test, value, first) {
            var entryTest;
            if (typeof test === 'string') {
                entryTest = function (response, url, options) {
                    return test === url;
                };
            }
            else if (test instanceof RegExp) {
                entryTest = function (response, url, options) {
                    return test.test(url);
                };
            }
            else {
                entryTest = test;
            }
            return _super.prototype.register.call(this, entryTest, value, first);
        };
        return FilterRegistry;
    })(Registry_1.default);
    exports.FilterRegistry = FilterRegistry;
    var defaultProvider = './request/xhr';
    if (has_1.default('host-node')) {
        defaultProvider = './request/node';
    }
    var ProviderRegistry = (function (_super) {
        __extends(ProviderRegistry, _super);
        function ProviderRegistry() {
            var _this = this;
            _super.call(this);
            var deferRequest = function (url, options) {
                var canceled = false;
                var actualResponse;
                return new Task_1.default(function (resolve, reject) {
                    _this._providerPromise.then(function (provider) {
                        if (canceled) {
                            return;
                        }
                        actualResponse = provider(url, options);
                        actualResponse.then(resolve, reject);
                    });
                }, function () {
                    if (!canceled) {
                        canceled = true;
                    }
                    if (actualResponse) {
                        actualResponse.cancel();
                    }
                });
            };
            // The first request to hit the default value will kick off the import of the default
            // provider. While that import is in-flight, subsequent requests will queue up while
            // waiting for the provider to be fulfilled.
            this._defaultValue = function (url, options) {
                _this._providerPromise = load_1.default(require, defaultProvider).then(function (_a) {
                    var providerModule = _a[0];
                    _this._defaultValue = providerModule.default;
                    return providerModule.default;
                });
                _this._defaultValue = deferRequest;
                return deferRequest(url, options);
            };
        }
        ProviderRegistry.prototype.register = function (test, value, first) {
            var entryTest;
            if (typeof test === 'string') {
                entryTest = function (url, options) {
                    return test === url;
                };
            }
            else if (test instanceof RegExp) {
                entryTest = function (url, options) {
                    return test.test(url);
                };
            }
            else {
                entryTest = test;
            }
            return _super.prototype.register.call(this, entryTest, value, first);
        };
        return ProviderRegistry;
    })(Registry_1.default);
    exports.ProviderRegistry = ProviderRegistry;
    /**
     * Request filters, which filter or modify responses. The default filter simply passes a response through unchanged.
     */
    exports.filterRegistry = new FilterRegistry(function (response) {
        return response;
    });
    /**
     * Request providers, which fulfill requests.
     */
    exports.providerRegistry = new ProviderRegistry();
    /**
     * Make a request, returning a Promise that will resolve or reject when the request completes.
     */
    var request = function request(url, options) {
        if (options === void 0) { options = {}; }
        var promise = exports.providerRegistry.match(url, options)(url, options)
            .then(function (response) {
            return Task_1.default.resolve(exports.filterRegistry.match(response, url, options)(response, url, options))
                .then(function (filterResponse) {
                response.data = filterResponse.data;
                return response;
            });
        });
        return promise;
    };
    ['DELETE', 'GET', 'POST', 'PUT'].forEach(function (method) {
        request[method.toLowerCase()] = function (url, options) {
            if (options === void 0) { options = {}; }
            options = Object.create(options);
            options.method = method;
            return request(url, options);
        };
    });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = request;
    /**
     * Add a filter that automatically parses incoming JSON responses.
     */
    exports.filterRegistry.register(function (response, url, options) {
        return typeof response.data === 'string' && options.responseType === 'json';
    }, function (response, url, options) {
        return {
            data: JSON.parse(response.data)
        };
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbIkZpbHRlclJlZ2lzdHJ5IiwiRmlsdGVyUmVnaXN0cnkuY29uc3RydWN0b3IiLCJGaWx0ZXJSZWdpc3RyeS5yZWdpc3RlciIsIlByb3ZpZGVyUmVnaXN0cnkiLCJQcm92aWRlclJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiUHJvdmlkZXJSZWdpc3RyeS5yZWdpc3RlciIsInJlcXVlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQSxxQkFBaUIsY0FBYyxDQUFDLENBQUE7SUFDaEMsb0JBQWdCLE9BQU8sQ0FBQyxDQUFBO0lBR3hCLHlCQUErQixZQUFZLENBQUMsQ0FBQTtJQUM1QyxxQkFBaUIsUUFBUSxDQUFDLENBQUE7SUFLMUI7UUFBb0NBLGtDQUF1QkE7UUFBM0RBO1lBQW9DQyw4QkFBdUJBO1FBb0IzREEsQ0FBQ0E7UUFuQkFELGlDQUFRQSxHQUFSQSxVQUFTQSxJQUF5Q0EsRUFBRUEsS0FBb0JBLEVBQUVBLEtBQWVBO1lBQ3hGRSxJQUFJQSxTQUFlQSxDQUFDQTtZQUVwQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxTQUFTQSxHQUFHQSxVQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxFQUFFQSxPQUFPQTtvQkFDbENBLE1BQU1BLENBQUNBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBO2dCQUNyQkEsQ0FBQ0EsQ0FBQ0E7WUFDSEEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxTQUFTQSxHQUFHQSxVQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxFQUFFQSxPQUFPQTtvQkFDbENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdB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Q0FBQztZQUNOLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDL0IsQ0FBQztJQUNILENBQUMsQ0FDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi9hc3luYy9UYXNrJztcbmltcG9ydCBoYXMgZnJvbSAnLi9oYXMnO1xuaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4vUHJvbWlzZSc7XG5pbXBvcnQgUmVnaXN0cnksIHsgVGVzdCB9IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IGxvYWQgZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IFBhcmFtTGlzdCB9IGZyb20gJy4vVXJsU2VhcmNoUGFyYW1zJztcblxuZGVjbGFyZSB2YXIgcmVxdWlyZTogYW55O1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyUmVnaXN0cnkgZXh0ZW5kcyBSZWdpc3RyeTxSZXF1ZXN0RmlsdGVyPiB7XG5cdHJlZ2lzdGVyKHRlc3Q6IHN0cmluZyB8IFJlZ0V4cCB8IFJlcXVlc3RGaWx0ZXJUZXN0LCB2YWx1ZTogUmVxdWVzdEZpbHRlciwgZmlyc3Q/OiBib29sZWFuKTogSGFuZGxlIHtcblx0XHRsZXQgZW50cnlUZXN0OiBUZXN0O1xuXG5cdFx0aWYgKHR5cGVvZiB0ZXN0ID09PSAnc3RyaW5nJykge1xuXHRcdFx0ZW50cnlUZXN0ID0gKHJlc3BvbnNlLCB1cmwsIG9wdGlvbnMpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRlc3QgPT09IHVybDtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRlc3QgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0XHRcdGVudHJ5VGVzdCA9IChyZXNwb25zZSwgdXJsLCBvcHRpb25zKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0ZXN0LnRlc3QodXJsKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZW50cnlUZXN0ID0gPFJlcXVlc3RGaWx0ZXJUZXN0PiB0ZXN0O1xuXHRcdH1cblxuXHRcdHJldHVybiBzdXBlci5yZWdpc3RlcihlbnRyeVRlc3QsIHZhbHVlLCBmaXJzdCk7XG5cdH1cbn1cblxubGV0IGRlZmF1bHRQcm92aWRlcjogc3RyaW5nID0gJy4vcmVxdWVzdC94aHInO1xuaWYgKGhhcygnaG9zdC1ub2RlJykpIHtcblx0ZGVmYXVsdFByb3ZpZGVyID0gJy4vcmVxdWVzdC9ub2RlJztcbn1cblxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyUmVnaXN0cnkgZXh0ZW5kcyBSZWdpc3RyeTxSZXF1ZXN0UHJvdmlkZXI+IHtcblx0cHJpdmF0ZSBfcHJvdmlkZXJQcm9taXNlOiBQcm9taXNlPFJlcXVlc3RQcm92aWRlcj47XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdGNvbnN0IGRlZmVyUmVxdWVzdCA9ICh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zKTogUmVzcG9uc2VQcm9taXNlPGFueT4gPT4ge1xuXHRcdFx0bGV0IGNhbmNlbGVkID0gZmFsc2U7XG5cdFx0XHRsZXQgYWN0dWFsUmVzcG9uc2U6IFJlc3BvbnNlUHJvbWlzZTxhbnk+O1xuXHRcdFx0cmV0dXJuIG5ldyBUYXNrPFJlc3BvbnNlPGFueT4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0dGhpcy5fcHJvdmlkZXJQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG5cdFx0XHRcdFx0aWYgKGNhbmNlbGVkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFjdHVhbFJlc3BvbnNlID0gcHJvdmlkZXIodXJsLCBvcHRpb25zKTtcblx0XHRcdFx0XHRhY3R1YWxSZXNwb25zZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIWNhbmNlbGVkKSB7XG5cdFx0XHRcdFx0Y2FuY2VsZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChhY3R1YWxSZXNwb25zZSkge1xuXHRcdFx0XHRcdGFjdHVhbFJlc3BvbnNlLmNhbmNlbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gVGhlIGZpcnN0IHJlcXVlc3QgdG8gaGl0IHRoZSBkZWZhdWx0IHZhbHVlIHdpbGwga2ljayBvZmYgdGhlIGltcG9ydCBvZiB0aGUgZGVmYXVsdFxuXHRcdC8vIHByb3ZpZGVyLiBXaGlsZSB0aGF0IGltcG9ydCBpcyBpbi1mbGlnaHQsIHN1YnNlcXVlbnQgcmVxdWVzdHMgd2lsbCBxdWV1ZSB1cCB3aGlsZVxuXHRcdC8vIHdhaXRpbmcgZm9yIHRoZSBwcm92aWRlciB0byBiZSBmdWxmaWxsZWQuXG5cdFx0dGhpcy5fZGVmYXVsdFZhbHVlID0gKHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMpOiBSZXNwb25zZVByb21pc2U8YW55PiA9PiB7XG5cdFx0XHR0aGlzLl9wcm92aWRlclByb21pc2UgPSBsb2FkKHJlcXVpcmUsIGRlZmF1bHRQcm92aWRlcikudGhlbigoWyBwcm92aWRlck1vZHVsZSBdOiBbIHsgZGVmYXVsdDogUmVxdWVzdFByb3ZpZGVyIH0gXSk6IFJlcXVlc3RQcm92aWRlciA9PiB7XG5cdFx0XHRcdHRoaXMuX2RlZmF1bHRWYWx1ZSA9IHByb3ZpZGVyTW9kdWxlLmRlZmF1bHQ7XG5cdFx0XHRcdHJldHVybiBwcm92aWRlck1vZHVsZS5kZWZhdWx0O1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9kZWZhdWx0VmFsdWUgPSBkZWZlclJlcXVlc3Q7XG5cdFx0XHRyZXR1cm4gZGVmZXJSZXF1ZXN0KHVybCwgb3B0aW9ucyk7XG5cdFx0fTtcblx0fVxuXG5cdHJlZ2lzdGVyKHRlc3Q6IHN0cmluZyB8IFJlZ0V4cCB8IFJlcXVlc3RQcm92aWRlclRlc3QsIHZhbHVlOiBSZXF1ZXN0UHJvdmlkZXIsIGZpcnN0PzogYm9vbGVhbik6IEhhbmRsZSB7XG5cdFx0bGV0IGVudHJ5VGVzdDogVGVzdDtcblxuXHRcdGlmICh0eXBlb2YgdGVzdCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGVudHJ5VGVzdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRlc3QgPT09IHVybDtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRlc3QgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0XHRcdGVudHJ5VGVzdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRlc3QudGVzdCh1cmwpO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRlbnRyeVRlc3QgPSA8UmVxdWVzdFByb3ZpZGVyVGVzdD4gdGVzdDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3VwZXIucmVnaXN0ZXIoZW50cnlUZXN0LCB2YWx1ZSwgZmlyc3QpO1xuXHR9XG59XG5cbi8qKlxuICogUmVxdWVzdCBmaWx0ZXJzLCB3aGljaCBmaWx0ZXIgb3IgbW9kaWZ5IHJlc3BvbnNlcy4gVGhlIGRlZmF1bHQgZmlsdGVyIHNpbXBseSBwYXNzZXMgYSByZXNwb25zZSB0aHJvdWdoIHVuY2hhbmdlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbHRlclJlZ2lzdHJ5ID0gbmV3IEZpbHRlclJlZ2lzdHJ5KGZ1bmN0aW9uIChyZXNwb25zZTogUmVzcG9uc2U8YW55Pik6IFJlc3BvbnNlPGFueT4ge1xuXHRyZXR1cm4gcmVzcG9uc2U7XG59KTtcblxuLyoqXG4gKiBSZXF1ZXN0IHByb3ZpZGVycywgd2hpY2ggZnVsZmlsbCByZXF1ZXN0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IHByb3ZpZGVyUmVnaXN0cnkgPSBuZXcgUHJvdmlkZXJSZWdpc3RyeSgpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RFcnJvcjxUPiBleHRlbmRzIEVycm9yIHtcblx0cmVzcG9uc2U6IFJlc3BvbnNlPFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RGaWx0ZXIge1xuXHQ8VD4ocmVzcG9uc2U6IFJlc3BvbnNlPFQ+LCB1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zKTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0RmlsdGVyVGVzdCBleHRlbmRzIFRlc3Qge1xuXHQ8VD4ocmVzcG9uc2U6IFJlc3BvbnNlPGFueT4sIHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMpOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RPcHRpb25zIHtcblx0YXV0aD86IHN0cmluZztcblx0Y2FjaGVCdXN0PzogYW55O1xuXHRkYXRhPzogYW55O1xuXHRoYW5kbGVBcz86IHN0cmluZztcblx0aGVhZGVycz86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZzsgfTtcblx0bWV0aG9kPzogc3RyaW5nO1xuXHRwYXNzd29yZD86IHN0cmluZztcblx0cXVlcnk/OiBzdHJpbmcgfCBQYXJhbUxpc3Q7XG5cdHJlc3BvbnNlVHlwZT86IHN0cmluZztcblx0dGltZW91dD86IG51bWJlcjtcblx0dXNlcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0UHJvdmlkZXIge1xuXHQ8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9ucyk6IFJlc3BvbnNlUHJvbWlzZTxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0UHJvdmlkZXJUZXN0IGV4dGVuZHMgVGVzdCB7XG5cdCh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zKTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXNwb25zZTxUPiB7XG5cdGRhdGE6IFQ7XG5cdG5hdGl2ZVJlc3BvbnNlPzogYW55O1xuXHRyZXF1ZXN0T3B0aW9uczogUmVxdWVzdE9wdGlvbnM7XG5cdHN0YXR1c0NvZGU6IG51bWJlcjtcblx0c3RhdHVzVGV4dD86IHN0cmluZztcblx0dXJsOiBzdHJpbmc7XG5cblx0Z2V0SGVhZGVyKG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgdGFzayByZXR1cm5lZCBieSBhIHJlcXVlc3QsIHdoaWNoIHdpbGwgcmVzb2x2ZSB0byBhIFJlc3BvbnNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VQcm9taXNlPFQ+IGV4dGVuZHMgVGFzazxSZXNwb25zZTxUPj4ge31cblxuLyoqXG4gKiBNYWtlIGEgcmVxdWVzdCwgcmV0dXJuaW5nIGEgUHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSBvciByZWplY3Qgd2hlbiB0aGUgcmVxdWVzdCBjb21wbGV0ZXMuXG4gKi9cbmNvbnN0IHJlcXVlc3Q6IHtcblx0PFQ+KHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMpOiBSZXNwb25zZVByb21pc2U8VD47XG5cdGRlbGV0ZTxUPih1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zKTogUmVzcG9uc2VQcm9taXNlPFQ+O1xuXHRnZXQ8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9ucyk6IFJlc3BvbnNlUHJvbWlzZTxUPjtcblx0cG9zdDxUPih1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zKTogUmVzcG9uc2VQcm9taXNlPFQ+O1xuXHRwdXQ8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9ucyk6IFJlc3BvbnNlUHJvbWlzZTxUPjtcbn0gPSA8YW55PiBmdW5jdGlvbiByZXF1ZXN0PFQ+KHVybDogc3RyaW5nLCBvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHt9KTogUmVzcG9uc2VQcm9taXNlPFQ+IHtcblx0Y29uc3QgcHJvbWlzZSA9IHByb3ZpZGVyUmVnaXN0cnkubWF0Y2godXJsLCBvcHRpb25zKSh1cmwsIG9wdGlvbnMpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlOiBSZXNwb25zZTxUPikge1xuXHRcdFx0cmV0dXJuIFRhc2sucmVzb2x2ZShmaWx0ZXJSZWdpc3RyeS5tYXRjaChyZXNwb25zZSwgdXJsLCBvcHRpb25zKShyZXNwb25zZSwgdXJsLCBvcHRpb25zKSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGZpbHRlclJlc3BvbnNlOiBhbnkpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhID0gZmlsdGVyUmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdHJldHVybiBwcm9taXNlO1xufTtcblxuWyAnREVMRVRFJywgJ0dFVCcsICdQT1NUJywgJ1BVVCcgXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcblx0KDxhbnk+IHJlcXVlc3QpW21ldGhvZC50b0xvd2VyQ2FzZSgpXSA9IGZ1bmN0aW9uIDxUPih1cmw6IHN0cmluZywgb3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7fSk6IFJlc3BvbnNlUHJvbWlzZTxUPiB7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5jcmVhdGUob3B0aW9ucyk7XG5cdFx0b3B0aW9ucy5tZXRob2QgPSBtZXRob2Q7XG5cdFx0cmV0dXJuIHJlcXVlc3QodXJsLCBvcHRpb25zKTtcblx0fTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0O1xuXG4vKipcbiAqIEFkZCBhIGZpbHRlciB0aGF0IGF1dG9tYXRpY2FsbHkgcGFyc2VzIGluY29taW5nIEpTT04gcmVzcG9uc2VzLlxuICovXG5maWx0ZXJSZWdpc3RyeS5yZWdpc3Rlcihcblx0ZnVuY3Rpb24gKHJlc3BvbnNlOiBSZXNwb25zZTxhbnk+LCB1cmw6IHN0cmluZywgb3B0aW9uczogUmVxdWVzdE9wdGlvbnMpIHtcblx0XHRyZXR1cm4gdHlwZW9mIHJlc3BvbnNlLmRhdGEgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cdH0sXG5cdGZ1bmN0aW9uIChyZXNwb25zZTogUmVzcG9uc2U8YW55PiwgdXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zKTogT2JqZWN0IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShyZXNwb25zZS5kYXRhKVxuXHRcdH07XG5cdH1cbik7XG4iXX0=