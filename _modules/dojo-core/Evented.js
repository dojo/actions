(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './aspect'], factory);
    }
})(function (require, exports) {
    var aspect_1 = require('./aspect');
    var Evented = (function () {
        function Evented() {
        }
        /**
         * Emits an event, firing listeners registered for it.
         * @param event The event object to emit
         */
        Evented.prototype.emit = function (data) {
            var type = '__on' + data.type;
            var method = this[type];
            if (method) {
                return method.call(this, data);
            }
        };
        /**
         * Listens for an event, calling the listener whenever the event fires.
         * @param type Event type to listen for
         * @param listener Callback to handle the event when it fires
         * @return A handle which will remove the listener when destroy is called
         */
        Evented.prototype.on = function (type, listener) {
            var name = '__on' + type;
            if (!this[name]) {
                // define a non-enumerable property (see #77)
                Object.defineProperty(this, name, {
                    configurable: true,
                    value: undefined,
                    writable: true
                });
            }
            return aspect_1.on(this, name, listener);
        };
        return Evented;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Evented;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9FdmVudGVkLnRzIl0sIm5hbWVzIjpbIkV2ZW50ZWQiLCJFdmVudGVkLmNvbnN0cnVjdG9yIiwiRXZlbnRlZC5lbWl0IiwiRXZlbnRlZC5vbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFDQSx1QkFBbUIsVUFBVSxDQUFDLENBQUE7SUFFOUI7UUFBQUE7UUErQkFDLENBQUNBO1FBOUJBRDs7O1dBR0dBO1FBQ0hBLHNCQUFJQSxHQUFKQSxVQUE0QkEsSUFBT0E7WUFDbENFLElBQU1BLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1lBQ2hDQSxJQUFNQSxNQUFNQSxHQUFvQkEsSUFBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDNUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREY7Ozs7O1dBS0dBO1FBQ0hBLG9CQUFFQSxHQUFGQSxVQUFHQSxJQUFZQSxFQUFFQSxRQUFzQ0E7WUFDdERHLElBQU1BLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO1lBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFRQSxJQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekJBLDZDQUE2Q0E7Z0JBQzdDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQTtvQkFDakNBLFlBQVlBLEVBQUVBLElBQUlBO29CQUNsQkEsS0FBS0EsRUFBRUEsU0FBU0E7b0JBQ2hCQSxRQUFRQSxFQUFFQSxJQUFJQTtpQkFDZEEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsV0FBRUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDakNBLENBQUNBO1FBQ0ZILGNBQUNBO0lBQURBLENBQUNBLEFBL0JELElBK0JDO0lBL0JEOzZCQStCQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSGFuZGxlLCBFdmVudE9iamVjdCB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBvbiB9IGZyb20gJy4vYXNwZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRlZCB7XG5cdC8qKlxuXHQgKiBFbWl0cyBhbiBldmVudCwgZmlyaW5nIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBpdC5cblx0ICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBvYmplY3QgdG8gZW1pdFxuXHQgKi9cblx0ZW1pdDxUIGV4dGVuZHMgRXZlbnRPYmplY3Q+KGRhdGE6IFQpOiB2b2lkIHtcblx0XHRjb25zdCB0eXBlID0gJ19fb24nICsgZGF0YS50eXBlO1xuXHRcdGNvbnN0IG1ldGhvZDogRnVuY3Rpb24gPSAoPGFueT4gdGhpcylbdHlwZV07XG5cdFx0aWYgKG1ldGhvZCkge1xuXHRcdFx0cmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGRhdGEpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMaXN0ZW5zIGZvciBhbiBldmVudCwgY2FsbGluZyB0aGUgbGlzdGVuZXIgd2hlbmV2ZXIgdGhlIGV2ZW50IGZpcmVzLlxuXHQgKiBAcGFyYW0gdHlwZSBFdmVudCB0eXBlIHRvIGxpc3RlbiBmb3Jcblx0ICogQHBhcmFtIGxpc3RlbmVyIENhbGxiYWNrIHRvIGhhbmRsZSB0aGUgZXZlbnQgd2hlbiBpdCBmaXJlc1xuXHQgKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBsaXN0ZW5lciB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG5cdCAqL1xuXHRvbih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiAoZXZlbnQ6IEV2ZW50T2JqZWN0KSA9PiB2b2lkKTogSGFuZGxlIHtcblx0XHRjb25zdCBuYW1lID0gJ19fb24nICsgdHlwZTtcblx0XHRpZiAoISg8YW55PiB0aGlzKVtuYW1lXSkge1xuXHRcdFx0Ly8gZGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgKHNlZSAjNzcpXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdHZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9uKHRoaXMsIG5hbWUsIGxpc3RlbmVyKTtcblx0fVxufVxuIl19