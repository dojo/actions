import compose, { ComposeFactory } from 'dojo-compose/compose';
import createStateful, { Stateful, State } from 'dojo-compose/mixins/createStateful';
import { Thenable } from 'dojo-core/Promise';
import Task from 'dojo-core/async/Task';
import WeakMap from 'dojo-core/WeakMap';

export interface DoOptions<T> {
	[option: string]: any;
	target?: T;
}

export interface ActionState extends State {
	enabled?: boolean;
}

export interface Action<T, O extends DoOptions<T>, S extends ActionState> extends Stateful<S> {
	do(options?: O): Task<T>;
	enable(): void;
	disable(): void;
}

export type DoFunction<T> = (options?: DoOptions<T>) => T | Thenable<T>;

export interface ActionOptions<T> {
	do: DoFunction<T>;
	enabled?: boolean;
}

export interface ActionFactory extends ComposeFactory<Action<any, DoOptions<any>, ActionState>, ActionOptions<any>> {
	<T, O extends DoOptions<T>, S extends ActionState>(options?: ActionOptions<T>): Action<T, O, S>;
}

export function isAction<T, O extends DoOptions<T>, S extends ActionState>(value: any): value is Action<T, O, S> {
	return typeof value === 'object' && typeof value.do === 'function';
}

/* TODO: Remove when in dojo/core */
export function isTask<T>(value: any): value is Task<T> {
	return value && typeof value.cancel === 'function' && Array.isArray(value.children);
}

const doFunctions = new WeakMap<Action<any, DoOptions<any>, ActionState>, DoFunction<any>>();

const createAction: ActionFactory = compose({
		do(options?: DoOptions<any>): Task<any> {
			const action: Action<any, DoOptions<any>, ActionState> = this;
			const doFn = doFunctions.get(action);
			if (doFn && action.state.enabled) {
				const result = doFn.call(action, options);
				/* TODO - convert to Task.resolve() when dojo/core#153 is merged */
				return isTask(result) ? result : new Task((resolve) => resolve(result));
			}
			/* TODO - convert to Task.resolve() when dojo/core#153 is merged */
			return new Task((resolve) => resolve());
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
