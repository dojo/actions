import { Handle } from 'dojo-core/interfaces';
import Map from 'dojo-core/Map';
import WeakMap from 'dojo-core/WeakMap';
import { Action, ActionOptions, ActionState } from './createAction';

const actionMap = new Map<string | symbol, Action<any, any, any>>();
const typeMap = new WeakMap<Action<any, any, any>, string | symbol>();

export function byType<T, O extends ActionOptions<T>, S extends ActionState>(type: string | symbol): Action<T, O, S> {
	return actionMap.get(type);
}

export function getType(action: Action<any, any, any>): string | symbol {
	return typeMap.get(action);
}

export function add(action: Action<any, any, any>, type?: string | symbol): Handle {
	const oldtype = typeMap.get(action);
	if (oldtype && oldtype !== type) {
		actionMap.delete(typeMap.get(action));
		typeMap.delete(action);
	}
	else if (type && actionMap.has(type) && actionMap.get(type) !== action) {
		throw new TypeError(`Cannot add duplicate action type: ${type}`);
	}
	if (!type) {
		type = Symbol();
	}
	if (oldtype !== type) {
		actionMap.set(type, action);
		typeMap.set(action, type);
	}
	return {
		destroy() {
			if (typeMap.has(action)) {
				actionMap.delete(typeMap.get(action));
				typeMap.delete(action);
			}
		}
	};
}
