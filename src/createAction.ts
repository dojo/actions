import compose, { ComposeFactory } from 'dojo-compose/compose';
import createStateful, { Stateful, State } from 'dojo-compose/mixins/createStateful';
import { EventObject } from 'dojo-core/interfaces';
import { Thenable } from 'dojo-core/Promise';
import Task, { isTask } from 'dojo-core/async/Task';
import WeakMap from 'dojo-core/WeakMap';

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

export interface Action<T, O extends DoOptions<T>, S extends ActionState> extends Stateful<S> {
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
}

export type DoFunction<T> = (options?: DoOptions<T>) => T | Thenable<T>;

export interface ActionOptions<T> {
	/**
	 * The method that is invoked when `do()` is called and the action is enabled
	 */
	do: DoFunction<T>;

	/**
	 * Set the enabled state during construction
	 */
	enabled?: boolean;
}

export interface ActionFactory extends ComposeFactory<Action<any, DoOptions<any>, ActionState>, ActionOptions<any>> {
	/**
	 * Create a new instance of an Action, using the supplied options
	 * @param options The options used to construct the Action
	 */
	<T, O extends DoOptions<T>, S extends ActionState>(options: ActionOptions<T>): Action<T, O, S>;
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
const doFunctions = new WeakMap<Action<any, DoOptions<any>, ActionState>, DoFunction<any>>();

/**
 * A factory which creates instances of Action
 */
const createAction: ActionFactory = compose({
		do(options?: DoOptions<any>): Task<any> {
			const action: Action<any, DoOptions<any>, ActionState> = this;
			const doFn = doFunctions.get(action);
			if (doFn && action.state.enabled) {
				const result = doFn.call(action, options);
				return isTask(result) ? result : Task.resolve(result);
			}
			return Task.resolve();
		},
		enable(): void {
			const action: Action<any, DoOptions<any>, ActionState> = this;
			if (!action.state.enabled) {
				action.setState({ enabled: true });
			}
		},
		disable(): void {
			const action: Action<any, DoOptions<any>, ActionState> = this;
			if (action.state.enabled) {
				action.setState({ enabled: false });
			}
		}
	})
	.mixin({
		mixin: createStateful,
		initialize(instance: Action<any, DoOptions<any>, ActionState>, options: ActionOptions<any>) {
			if (!options || !options.do) {
				throw new TypeError(`'options.do' required during creation.`);
			}
			doFunctions.set(instance, options.do);
			instance.setState({ enabled: 'enabled' in options ? options.enabled : true });
			instance.own({
				destroy() {
					doFunctions.delete(instance);
				}
			});
		}
	});

export default createAction;
