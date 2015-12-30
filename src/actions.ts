/**
 * The actions module for Dojo 2
 * @module dojo-actions/actions
 */
import compose, { ComposeFactory } from 'dojo-compose/compose';
import Promise, { Thenable, isThenable } from 'dojo-core/Promise';
import WeakMap from 'dojo-core/WeakMap';
import { assign } from 'dojo-core/lang';

/**
 * Enumberable action types
 */
export enum ActionTypes {
}

export type ActionLabel = ActionTypes | string | symbol;

const actionMap: any = {};

interface ActionMethods<T, O> {
	do: (options?: O) => T | Promise<T>;
	undo: () => T | Promise<T>;
	redo: (options?: O) => T | Promise<T>;
	enabler: (enabled: boolean) => boolean | Promise<boolean>;
}

const actionMethods = new WeakMap<Action<any, ActionOptions<any>>, ActionMethods<any, any>>();

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
 * An action encapsulates do, undo and redo functionality
 * @template T The type that the action's promise will resolve to
 * @template O (extends ActionOptions) the type of the options to be passed the do or redo function
 */
export interface Action<T, O extends ActionOptions<any>> {
	/**
	 * The action type
	 */
	type: ActionLabel;

	/**
	 * Invoke the action
	 * @param {O} options Optional argument providing any options to the action
	 * @returns {ActionPromise} a Promise which is also decorated with redo and undo methods
	 */
	do(options?: O): ActionPromise<T, O>;

	/**
	 * Determine if the action is currently enabled.
	 */
	enabled: boolean;

	/**
	 * A hash that contains any state for the action to facilitate items like "undo"
	 */
	state?: { [name: string]: any; };

	/**
	 * Disable the action
	 * @returns {Promise<boolean>} A promise the resolves when the action is disabled
	 */
	disable(): Promise<boolean>;
	/**
	 * Enable the promise
	 * @returns {Promise<boolean>} A promise that resolves when the action is enabled
	 */
	enable(): Promise<boolean>;

	/**
	 * Destory the action
	 * @returns {Promise<boolean>} A promise that resolves when the action is destoryed
	 */
	destroy(): Promise<boolean>;
}

/**
 * Options that are passed when creating a new action
 * @template T The type that the action's promise will resolve to
 * @template O (extends ActionOptions) the type of the options to be passed the do or redo function
 */
export interface ActionFactoryOptions<T, O extends ActionOptions<any>> {
	type: ActionLabel;
	do: (options?: O) => T | Promise<T>;
	state?: { [name: string]: any; };
	undo?: () => T | Promise<T>;
	redo?: (options?: O) => T | Promise<T>;
	enabler?: (enabled: boolean) => boolean | Promise<boolean>;
}

/**
 * A factory that creates a new action
 */
export interface ActionFactory extends ComposeFactory<Action<any, any>, any> {
	/**
	 * A factory that creates a new action
	 * @param {ActionFactoryOptions<T, O>} options The options to specify the action.
	 */
	<T, O extends ActionOptions<any>>(options: ActionFactoryOptions<T, O>): Action<T, O>;

	disable<T, O extends ActionOptions<any>>(action: ActionLabel | Action<T, O>): Promise<boolean>;
	enable<T, O extends ActionOptions<any>>(action: ActionLabel | Action<T, O>): Promise<boolean>;

	destroy<T, O extends ActionOptions<any>>(action: ActionLabel | Action<T, O>): Promise<boolean>;
}

/**
 * Decorate a Thenable/Promise to be an ActionPromise
 * @param {Thenable<T> | Promise<T>} p The target to decorate
 * @returns {ActionPromise<T, O>} The decorated ActionPromise
 * @template {any} T The return type of the action
 * @tempalte {ActionOptions} O The options for the action
 */
function decoratePromise<T, O>(p: Thenable<T> | Promise<T>): ActionPromise<T, O> {
	let result = p as ActionPromise<T, O>;
	result.undo = undoFn.bind(this);
	result.redo = redoFn.bind(this);
	return result;
}

function undoFn<T, O extends ActionOptions<any>>(): ActionPromise<T, O> {
	const _undo = actionMethods.get(this).undo;
	/* if undo is not defined, we will resolve with undefined */
	if (!_undo) {
		return decoratePromise(new Promise((resolve) => { resolve(); }));
	}
	if (!this.enabled) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(new Error(`Action "${this.type}" not enabled`));
		}));
	}
	try {
		const result: T | Thenable<T> = _undo.call(this);
		return decoratePromise(isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		}));
	}
	catch (e) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(e);
		}));
	}
}

function redoFn<T, O extends ActionOptions<any>>(options?: O): ActionPromise<T, O> {
	/* If redo is undefined, we will automatically substitute do */
	const _redo = actionMethods.get(this).redo || actionMethods.get(this).do;
	if (!this.enabled) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(new Error(`Action "${this.type}" not enabled`));
		}));
	}
	try {
		const result: T | Thenable<T> = _redo.call(this, options);
		return decoratePromise(isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		}));
	}
	catch (e) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(e);
		}));
	}
}

function doFn<T, O extends ActionOptions<any>>(options: O): ActionPromise<T, O> {
	if (!this.enabled) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(new Error(`Action "${this.type}" not enabled`));
		}));
	}
	try {
		const _do = actionMethods.get(this).do;
		const result: T | Thenable<T> = _do.call(this, options);
		return decoratePromise(isThenable(result) ? result : new Promise((resolve) => {
			resolve(result);
		}));
	}
	catch (e) {
		return decoratePromise(new Promise((resolve, reject) => {
			reject(e);
		}));
	}
}

/**
 * A factory that creates a new action
 */
const factory = compose({
	do: doFn,
	state: undefined,
	enabled: false,
	disable() { },
	enable() { },
	destroy() {
		return new Promise((resolve) => {
			actionMap[this.type] = undefined;
			Object.defineProperty(this, 'type', {
				value: undefined
			});
			actionMethods.delete(this);
			this.state = undefined;
			this.enabled = false;
			resolve(false);
		});
	}
}, function(options: ActionFactoryOptions<any, any>) {
	actionMethods.set(this, {
		do: options.do,
		undo: options.undo,
		redo: options.redo,
		enabler: options.enabler
	});

	/* Makes the property read only, because we don't want
	   accidental reassignment */
	Object.defineProperty(this, 'type', {
		value: options.type,
		writable: false,
		enumerable: true,
		configurable: true
	});

	this.state = {};
	if (options.state) {
		assign(this.state, options.state);
	}

	this.enabled = true;

	actionMap[this.type] = this;
}) as ActionFactory;

/**
 * Type guard to determine if the value is an Action
 * @param {any} value The value to be checked
 * @returns {boolean} Returns `true` if is an action, otherwise `false`
 */
export function isAction(value: any): value is Action<any, any> {
	return typeof value === 'object' && 'type' in value;
}

/**
 * Returns if the current action is enabled or not
 * @param {ActionLabel|Action<T, O>} action The action label or an action instance
 * @returns {boolean} Returns true if enabled or false if disabled
 */
export function isEnabled<T, O extends ActionOptions<any>>(action: ActionLabel | Action<T, O>): boolean {
	return isAction(action) ? action.enabled : actionMap[action] && actionMap[action].enabled;
};

export default factory;
