(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Promise'], factory);
    }
})(function (require, exports) {
    var Promise_1 = require('./Promise');
    var load = (function () {
        if (typeof module === 'object' && typeof module.exports === 'object') {
            return function (contextualRequire) {
                var moduleIds = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    moduleIds[_i - 1] = arguments[_i];
                }
                if (typeof contextualRequire === 'string') {
                    moduleIds.unshift(contextualRequire);
                    contextualRequire = require;
                }
                return new Promise_1.default(function (resolve, reject) {
                    try {
                        resolve(moduleIds.map(function (moduleId) {
                            return contextualRequire(moduleId);
                        }));
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            };
        }
        else if (typeof define === 'function' && define.amd) {
            return function (contextualRequire) {
                var moduleIds = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    moduleIds[_i - 1] = arguments[_i];
                }
                if (typeof contextualRequire === 'string') {
                    moduleIds.unshift(contextualRequire);
                    contextualRequire = require;
                }
                return new Promise_1.default(function (resolve) {
                    // TODO: Error path once https://github.com/dojo/loader/issues/14 is figured out
                    contextualRequire(moduleIds, function () {
                        var modules = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            modules[_i - 0] = arguments[_i];
                        }
                        resolve(modules);
                    });
                });
            };
        }
        else {
            return function () {
                return Promise_1.default.reject(new Error('Unknown loader'));
            };
        }
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = load;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQ0Esd0JBQW9CLFdBQVcsQ0FBQyxDQUFBO0lBbUJoQyxJQUFNLElBQUksR0FBUyxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RSxNQUFNLENBQUMsVUFBVSxpQkFBc0I7Z0JBQUUsbUJBQXNCO3FCQUF0QixXQUFzQixDQUF0QixzQkFBc0IsQ0FBdEIsSUFBc0I7b0JBQXRCLGtDQUFzQjs7Z0JBQzlELEVBQUUsQ0FBQyxDQUFDLE9BQU8saUJBQWlCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDM0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUNyQyxpQkFBaUIsR0FBRyxPQUFPLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksaUJBQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNO29CQUMzQyxJQUFJLENBQUM7d0JBQ0osT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxRQUFROzRCQUN2QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FDQTtvQkFBQSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDZixDQUFDO2dCQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLFVBQVUsaUJBQXNCO2dCQUFFLG1CQUFzQjtxQkFBdEIsV0FBc0IsQ0FBdEIsc0JBQXNCLENBQXRCLElBQXNCO29CQUF0QixrQ0FBc0I7O2dCQUM5RCxFQUFFLENBQUMsQ0FBQyxPQUFPLGlCQUFpQixLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDckMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDO2dCQUM3QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLGlCQUFPLENBQUMsVUFBVSxPQUFPO29CQUNuQyxnRkFBZ0Y7b0JBQ2hGLGlCQUFpQixDQUFDLFNBQVMsRUFBRTt3QkFBVSxpQkFBaUI7NkJBQWpCLFdBQWlCLENBQWpCLHNCQUFpQixDQUFqQixJQUFpQjs0QkFBakIsZ0NBQWlCOzt3QkFDdkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNsQixDQUFDLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQztnQkFDTixNQUFNLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQztRQUNILENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ0w7c0JBQWUsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWlyZSBhcyBBTURSZXF1aXJlIH0gZnJvbSAnZG9qby1sb2FkZXIvbG9hZGVyJztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4vUHJvbWlzZSc7XG5cbmRlY2xhcmUgdmFyIGRlZmluZToge1xuXHQoLi4uYXJnczogYW55W10pOiBhbnk7XG5cdGFtZDogYW55O1xufTtcblxuZXhwb3J0IHsgUmVxdWlyZSBhcyBBTURSZXF1aXJlIH0gZnJvbSAnZG9qby1sb2FkZXIvbG9hZGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlUmVxdWlyZSB7XG5cdChtb2R1bGVJZDogc3RyaW5nKTogYW55O1xufVxuZXhwb3J0IHR5cGUgUmVxdWlyZSA9IEFNRFJlcXVpcmUgfCBOb2RlUmVxdWlyZTtcblxuZXhwb3J0IGludGVyZmFjZSBMb2FkIHtcblx0KHJlcXVpcmU6IFJlcXVpcmUsIC4uLm1vZHVsZUlkczogc3RyaW5nW10pOiBQcm9taXNlPGFueVtdPjtcblx0KC4uLm1vZHVsZUlkczogc3RyaW5nW10pOiBQcm9taXNlPGFueVtdPjtcbn1cblxuY29uc3QgbG9hZDogTG9hZCA9IChmdW5jdGlvbiAoKTogTG9hZCB7XG5cdGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChjb250ZXh0dWFsUmVxdWlyZTogYW55LCAuLi5tb2R1bGVJZHM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnlbXT4ge1xuXHRcdFx0aWYgKHR5cGVvZiBjb250ZXh0dWFsUmVxdWlyZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0bW9kdWxlSWRzLnVuc2hpZnQoY29udGV4dHVhbFJlcXVpcmUpO1xuXHRcdFx0XHRjb250ZXh0dWFsUmVxdWlyZSA9IHJlcXVpcmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc29sdmUobW9kdWxlSWRzLm1hcChmdW5jdGlvbiAobW9kdWxlSWQpOiBhbnkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRleHR1YWxSZXF1aXJlKG1vZHVsZUlkKTtcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGNvbnRleHR1YWxSZXF1aXJlOiBhbnksIC4uLm1vZHVsZUlkczogc3RyaW5nW10pOiBQcm9taXNlPGFueVtdPiB7XG5cdFx0XHRpZiAodHlwZW9mIGNvbnRleHR1YWxSZXF1aXJlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRtb2R1bGVJZHMudW5zaGlmdChjb250ZXh0dWFsUmVxdWlyZSk7XG5cdFx0XHRcdGNvbnRleHR1YWxSZXF1aXJlID0gcmVxdWlyZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0XHQvLyBUT0RPOiBFcnJvciBwYXRoIG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2Rvam8vbG9hZGVyL2lzc3Vlcy8xNCBpcyBmaWd1cmVkIG91dFxuXHRcdFx0XHRjb250ZXh0dWFsUmVxdWlyZShtb2R1bGVJZHMsIGZ1bmN0aW9uICguLi5tb2R1bGVzOiBhbnlbXSkge1xuXHRcdFx0XHRcdHJlc29sdmUobW9kdWxlcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignVW5rbm93biBsb2FkZXInKSk7XG5cdFx0fTtcblx0fVxufSkoKTtcbmV4cG9ydCBkZWZhdWx0IGxvYWQ7XG4iXX0=