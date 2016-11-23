import compose, { ComposeFactory } from 'dojo-compose/compose';
import createStateful, { Stateful, StatefulOptions, State } from 'dojo-compose/mixins/createStateful';
import Task, { isTask } from 'dojo-core/async/Task';
import { EventObject } from 'dojo-interfaces/core';
import { Thenable } from 'dojo-interfaces/shim';
import Promise from 'dojo-shim/Promise';
import WeakMap from 'dojo-shim/WeakMap';

/**
 * A type alias to a "generic" action
 */
export type AnyAction = Action<any, DoOptions<any, TargettedEventObject<any>>, ActionState>;

export interface TargettedEventObject<T> extends EventObject {
	/**
	 * The target of the event
	 */
	target: T;
}

export interface DoOptions<T, E extends TargettedEventObject<T>> {
	[option: string]: any;

	/**
	 * The target event (subject) of the action
	 */
	event?: E;
}

export interface ActionState extends State {
	/**
	 * Determines if the action is enabled or not
	 */
	enabled?: boolean;
}

export interface ActionMixin<T, O extends DoOptions<T, TargettedEventObject<T>>> {
	/**
	 * The main method that performs the action and returns a task which resolves when the action completes
	 * @param options The options to be passed to the `do` method
	 */
	do(options?: O): Task<T>;

	/**
	 * Enable the task if disabled
	 */
	enable(): void;

	/**
	 * Disable the task if enabled
	 */
	disable(): void;

	/**
	 * A method which may be called to configure the action after it's been created.
	 *
	 * It's up to the implementation to decide what happens if this method is called multiple times. Implementations
	 * may throw or return a rejected promise.
	 *
	 * @param configuration The configuration. Implementations will need to cast to their expected configuration object
	 * @return May return a promise in case configuration is asynchronous
	 */
	configure(options: { [option: string]: any }): Promise<void> | void;
}

export type Action<T, O extends DoOptions<T, TargettedEventObject<T>>, S extends ActionState> = Stateful<S> & ActionMixin<T, O>;

export type DoFunction<T> = (options?: DoOptions<T, TargettedEventObject<T>>) => T | Thenable<T>;

export interface ActionOptions<T, S extends ActionState> extends StatefulOptions<S> {
	/**
	 * The method that is invoked when `do()` is called and the action is enabled
	 */
	do: DoFunction<T>;

	/**
	 * Set the enabled state during construction
	 */
	enabled?: boolean;

	/**
	 * The method that is invoked when `configure()` is called
	 */
	configure?(options: { [option: string]: any }): Promise<void> | void;
}

export interface ActionFactory extends ComposeFactory<Action<any, DoOptions<any, any>, ActionState>, ActionOptions<any, ActionState>> {
	/**
	 * Create a new instance of an Action, using the supplied options
	 * @param options The options used to construct the Action
	 */
	<T, O extends DoOptions<T, TargettedEventObject<T>>, S extends ActionState>(options: ActionOptions<T, S>): Action<T, O, S>;
}

/**
 * A type guard that validates the object passed is an Action
 */
export function isAction<T, O extends DoOptions<T, TargettedEventObject<T>>, S extends ActionState>(value: any): value is Action<T, O, S> {
	return typeof value === 'object' && typeof value.do === 'function';
}

/**
 * A weak map of `do` methods
 */
const doFunctions = new WeakMap<AnyAction, DoFunction<any>>();

/**
 * A weak map of `configure` methods
 */
const configureFunctions = new WeakMap<AnyAction, (configuration: Object) => Promise<void> | void>();

/**
 * A factory which creates instances of Action
 */
const createAction: ActionFactory = compose<ActionMixin<any, DoOptions<any, TargettedEventObject<any>>>, ActionOptions<any, ActionState>>({
		do(this: AnyAction, options?: DoOptions<any, TargettedEventObject<any>>): Task<any> {
			const doFn = doFunctions.get(this);
			if (doFn && this.state.enabled) {
				const result = doFn.call(this, options);
				return isTask(result) ? result : Task.resolve(result);
			}
			return Task.resolve();
		},
		enable(this: AnyAction): void {
			if (!this.state.enabled) {
				this.setState({ enabled: true });
			}
		},
		disable(this: AnyAction): void {
			if (this.state.enabled) {
				this.setState({ enabled: false });
			}
		},
		configure(this: AnyAction, configuration: Object): Promise<void> | void {
			const configureFn = configureFunctions.get(this);
			if (configureFn) {
				return configureFn.call(this, configuration);
			}
		}
	})
	.mixin({
		mixin: createStateful,
		initialize(instance: AnyAction, { do: doFn, enabled = true, configure }: ActionOptions<any, ActionState>) {
			if (!doFn) {
				throw new TypeError(`'options.do' required during creation.`);
			}
			doFunctions.set(instance, doFn);
			instance.setState({ enabled });
			if (configure) {
				configureFunctions.set(instance, configure);
			}
			instance.own({
				destroy() {
					doFunctions.delete(instance);
					configureFunctions.delete(instance);
				}
			});
		}
	});

export default createAction;
