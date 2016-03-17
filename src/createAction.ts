/**
 * The actions module for Dojo 2
 * @module dojo-actions/actions
 */
import compose, { ComposeFactory } from 'dojo-compose/compose';
import Promise, { Thenable, isThenable } from 'dojo-core/Promise';
import WeakMap from 'dojo-core/WeakMap';
import { assign } from 'dojo-core/lang';

export type ActionLabel = string | symbol;

/* Cannot use an indexer, because indexers can only be string | number */
const actionMap: any = {};

interface ActionMethods<T, O> {
	do: (options?: O) => T | Promise<T>;
	undo: () => T | Promise<T>;
	redo: (options?: O) => T | Promise<T>;
	enabler: (enabled: boolean) => boolean | Promise<boolean>;
}

const actionMethods = new WeakMap<Action<any, ActionOptions<any>, any>, ActionMethods<any, any>>();

export interface ActionPromise<T, O extends ActionOptions<any>> extends Promise<T> {
	/**
	 * Performs an undo of the action. Returns another ActionPromise.  If the action
	 * does not handle //
	 */
	undo(): ActionPromise<T, O>;
	redo(options?: O): ActionPromise<T, O>;
}

/**
 * Options that are passed to an action.do or action.redo method
 * @template T The type of the target for the action
 */
export interface ActionOptions<T> {
	/**
	 * The target of the action
	 */
	target?: T;
}

/**
 * Type base interface for the state of an action, intended to be extended
 */
export interface ActionState {
	[name: string]: any;
}

/* TODO: In typescript 1.8 <T, O extends ActionOptions<T>> will be valid */

/**
 * An action encapsulates do, undo and redo functionality
 * @template T The type that the action's promise will resolve to
 * @template O (extends ActionOptions) the type of the options to be passed the do or redo function
 * @template S (extends ActionState) the type of state for the action
 */
export interface Action<T, O extends ActionOptions<T>, S extends ActionState> {
	/**
	 * The action type
	 */
	type: ActionLabel;

	/**
	 * Invoke the action
	 * @param   options Optional argument providing any options to the action
	 * @returns         a Promise which is also decorated with redo and undo methods
	 */
	do(options?: O): ActionPromise<T, O>;

	/**
	 * Determine if the action is currently enabled.
	 */
	enabled: boolean;

	/**
	 * A hash that contains any state for the action to facilitate items like "undo"
	 */
	state?: S;

	/**
	 * Disable the action
	 * @returns A promise the resolves when the action is disabled
	 */
	disable(): Promise<boolean>;

	/**
	 * Enable the promise
	 * @returns A promise that resolves when the action is enabled
	 */
	enable(): Promise<boolean>;

	/**
	 * Destory the action
	 * @returns A promise that resolves when the action is destoryed
	 */
	destroy(): Promise<boolean>;
}

/**
 * Options that are passed when creating a new action
 * @template T The type that the action's promise will resolve to
 * @template O (extends ActionOptions) the type of the options to be passed the do or redo function
 * @template S (extends ActionState) the type of state for the action
 */
export interface ActionFactoryOptions<T, O extends ActionOptions<any>, S extends ActionState> {
	type: ActionLabel;
	do: (options?: O) => T | Promise<T>;
	state?: S;
	undo?: () => T | Promise<T>;
	redo?: (options?: O) => T | Promise<T>;
	enabler?: (enabled: boolean) => boolean | Promise<boolean>;
}

/**
 * A factory that creates a new action
 */
export interface ActionFactory extends ComposeFactory<Action<any, any, any>, ActionFactoryOptions<any, any, any>> {
	/**
	 * A factory that creates a new action
	 * @param   options The options to specify the action.
	 * @returns         The action instance
	 * @template T The type that the action's promise will resolve to
	 * @template O (extends ActionOptions) the type of the options to be passed the do or redo function
	 * @template S (extends ActionState) the type of state for the action
	 */
	<T, O extends ActionOptions<T>, S extends ActionState>(options: ActionFactoryOptions<T, O, S>): Action<T, O, S>;

	disable<T, O extends ActionOptions<T>, S extends ActionState>(action: ActionLabel | Action<T, O, S>): Promise<boolean>;
	enable<T, O extends ActionOptions<T>, S extends ActionState>(action: ActionLabel | Action<T, O, S>): Promise<boolean>;

	destroy<T, O extends ActionOptions<T>, S extends ActionState>(action: ActionLabel | Action<T, O, S>): Promise<boolean>;
}

/**
 * Decorate a Thenable/Promise to be an ActionPromise
 * @param    p The target to decorate
 * @returns    The decorated ActionPromise
 * @template T The return type of the action
 * @template O (extends ActionOptions) The options for the action
 */
function decoratePromise<T, O>(p: Thenable<T> | Promise<T>, action: Action<T, O, ActionState>): ActionPromise<T, O> {
	const result = p as ActionPromise<T, O>;
	result.undo = function undo() {
		return decoratePromise(p.then(() => undoFn.call(action)), action);
	};
	result.redo = function redo(options) {
		return decoratePromise(p.then(() => redoFn.call(action, options)), action);
	};
	return result;
}

function undoFn<T>(): Thenable<T> {
	const _undo = actionMethods.get(this).undo;
	/* if undo is not defined, we will resolve with undefined */
	if (!_undo) {
		return new Promise((resolve) => { resolve(); });
	}
	if (!this.enabled) {
		return new Promise((resolve, reject) => {
			reject(new Error(`Action "${this.type}" not enabled`));
		});
	}
	try {
		const result: T | Thenable<T> = _undo.call(this);
		return isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		});
	}
	catch (e) {
		return new Promise((resolve, reject) => {
			reject(e);
		});
	}
}

function redoFn<T, O extends ActionOptions<T>>(options?: O): Thenable<T> {
	/* If redo is undefined, we will automatically substitute do */
	const _redo = actionMethods.get(this).redo || actionMethods.get(this).do;
	if (!this.enabled) {
		return new Promise((resolve, reject) => {
			reject(new Error(`Action "${String(this.type)}" not enabled`));
		});
	}
	try {
		const result: T | Thenable<T> = _redo.call(this, options);
		return isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		});
	}
	catch (e) {
		return new Promise((resolve, reject) => {
			reject(e);
		});
	}
}

function doFn<T, O extends ActionOptions<T>>(options: O): ActionPromise<T, O> {
	if (!this.enabled) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(new Error(`Action "${String(this.type)}" not enabled`));
		}), this);
	}
	try {
		const _do = actionMethods.get(this).do;
		const result: T | Thenable<T> = _do.call(this, options);
		return decoratePromise(isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		}), this);
	}
	catch (e) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(e);
		}), this);
	}
}

/**
 * A factory that creates a new action
 */
const createAction = compose({
	do: doFn,
	enabled: false,
	disable() {
		return new Promise((resolve) => {
			resolve(this.enabled = false);
		});
	},
	enable() {
		return new Promise((resolve) => {
			resolve(this.enabled = true);
		});
	},
	destroy() {
		return new Promise((resolve) => {
			delete actionMap[this.type];
			Object.defineProperty(this, 'type', {
				value: undefined
			});
			actionMethods.delete(this);
			delete this.state;
			this.enabled = false;
			resolve(false);
		});
	}
}, function(instance: Action<any, any, any>, options: ActionFactoryOptions<any, any, any>) {

	if (!options.type) {
		throw new TypeError('Missing action type, cannot create action.');
	}

	if (!options.do) {
		throw new TypeError('Missing action method "do", cannot create action.');
	}

	if (options.type in actionMap) {
		throw new TypeError(`Duplicate action type of "${String(options.type)}"`);
	}

	actionMethods.set(instance, {
		do: options.do,
		undo: options.undo,
		redo: options.redo,
		enabler: options.enabler
	});

	/* Makes the property read only, because we don't want
	   accidental reassignment */
	Object.defineProperty(instance, 'type', {
		value: options.type,
		writable: false,
		enumerable: true,
		configurable: true
	});

	instance.state = {};
	if (options.state) {
		assign(instance.state, options.state);
	}

	instance.enabled = true;

	actionMap[instance.type] = instance;
}) as ActionFactory;

/**
 * Returns an action based on the supplied label
 * @param    type The type of action to be retrieved
 * @returns       The action (or undefined)
 * @template T    The type that the action's promise will resolve to
 * @template O    (extends ActionOptions) the type of the options to be passed the do or redo function
 * @template S    (extends ActionState) the type of state for the action
 */
export function byType<T, O extends ActionOptions<any>, S extends ActionState>(type: ActionLabel): Action<T, O, S> {
	if (type in actionMap) {
		return actionMap[type];
	}
};

/**
 * Type guard to determine if the value is an Action
 * @param    value The value to be checked
 * @returns        Returns `true` if is an action, otherwise `false`
 */
export function isAction(value: any): value is Action<any, any, any> {
	return typeof value === 'object' && 'type' in value && 'do' in value && typeof value.do === 'function';
}

/**
 * Returns if the current action is enabled or not
 * @param   action The action label or an action instance
 * @returns        Returns true if enabled or false if disabled
 * @template T     The type that the action's promise will resolve to
 * @template O     (extends ActionOptions) the type of the options to be passed the do or redo function
 * @template S     (extends ActionState) the type of state for the action
 */
export function isEnabled<T, O extends ActionOptions<any>, S extends ActionState>(action: ActionLabel | Action<T, O, S>): boolean {
	return isAction(action) ? action.enabled : actionMap[action] && actionMap[action].enabled;
};

export default createAction;
