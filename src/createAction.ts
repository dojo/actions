import compose, { ComposeFactory } from 'dojo-compose/compose';
import createStateful, { Stateful, StatefulOptions, State } from 'dojo-compose/mixins/createStateful';
import { EventObject, Handle } from 'dojo-core/interfaces';
import { Thenable } from 'dojo-core/Promise';
import Task, { isTask } from 'dojo-core/async/Task';
import WeakMap from 'dojo-core/WeakMap';

// Helper to avoid repetition
type AnyAction = Action<any, DoOptions<any>, ActionState>;

export interface TargettedEventObject<T> extends EventObject {
	/**
	 * The target of the event
	 */
	target: T;
}

export interface DoOptions<T> {
	[option: string]: any;

	/**
	 * The target event (subject) of the action
	 */
	event?: TargettedEventObject<T>;
}

export interface ActionState extends State {
	/**
	 * Determines if the action is enabled or not
	 */
	enabled?: boolean;
}

export interface ActionMixin<T, O extends DoOptions<T>> {
	/**
	 * The main method that performs the action and returns a task which resolves when the action completes
	 * @param options The options to be passed to the `do` method
	 */
	do(options?: O): Task<T>;

	/**
	 * Enabled the task is disabled
	 */
	enable(): void;

	/**
	 * Disable the task if enabled
	 */
	disable(): void;

	/**
	 * A method which may be called after the action is registered with a registry
	 *
	 * Normally actions may be registered multiple times, with multiple registries. Destroying an action won't cause
	 * it to be deregistered.
	 *
	 * @param registry A registry. Implementations will need to cast to their expected registry object
	 * @return May return a handle that should be destroyed when the action is deregistered from its registry
	 */
	register(registry: Object): Handle | void;
}

export type Action<T, O extends DoOptions<T>, S extends ActionState> = Stateful<S> & ActionMixin<T, O>;

export type DoFunction<T> = (options?: DoOptions<T>) => T | Thenable<T>;

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
	 * The method that is invoked when `register()` is called
	 */
	register?: (registry: Object) => Handle | void;
}

export interface ActionFactory extends ComposeFactory<Action<any, DoOptions<any>, ActionState>, ActionOptions<any, ActionState>> {
	/**
	 * Create a new instance of an Action, using the supplied options
	 * @param options The options used to construct the Action
	 */
	<T, O extends DoOptions<T>, S extends ActionState>(options: ActionOptions<T, S>): Action<T, O, S>;
}

/**
 * A type guard that validates the object passed is an Action
 */
export function isAction<T, O extends DoOptions<T>, S extends ActionState>(value: any): value is Action<T, O, S> {
	return typeof value === 'object' && typeof value.do === 'function';
}

/**
 * A weak map of `do` methods
 */
const doFunctions = new WeakMap<AnyAction, DoFunction<any>>();

/**
 * A weak map of `register` methods
 */
const registerFunctions = new WeakMap<AnyAction, (registry: Object) => Handle | void>();

/**
 * A factory which creates instances of Action
 */
const createAction: ActionFactory = compose<ActionMixin<any, DoOptions<any>>, ActionOptions<any, ActionState>>({
		do(options?: DoOptions<any>): Task<any> {
			const action: AnyAction = this;
			const doFn = doFunctions.get(action);
			if (doFn && action.state.enabled) {
				const result = doFn.call(action, options);
				return isTask(result) ? result : Task.resolve(result);
			}
			return Task.resolve();
		},
		enable(): void {
			const action: AnyAction = this;
			if (!action.state.enabled) {
				action.setState({ enabled: true });
			}
		},
		disable(): void {
			const action: AnyAction = this;
			if (action.state.enabled) {
				action.setState({ enabled: false });
			}
		},
		register(registry: Object): Handle | void {
			const action: AnyAction = this;
			const registerFn = registerFunctions.get(action);
			if (registerFn) {
				return registerFn.call(action, registry);
			}
		}
	})
	.mixin({
		mixin: createStateful,
		initialize(instance: AnyAction, { do: doFn, enabled = true, register }: ActionOptions<any, ActionState>) {
			if (!doFn) {
				throw new TypeError(`'options.do' required during creation.`);
			}
			doFunctions.set(instance, doFn);
			instance.setState({ enabled });
			if (register) {
				registerFunctions.set(instance, register);
			}
			instance.own({
				destroy() {
					doFunctions.delete(instance);
					registerFunctions.delete(instance);
				}
			});
		}
	});

export default createAction;
