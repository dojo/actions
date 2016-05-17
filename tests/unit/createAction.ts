import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import createAction, { isAction, ActionState, DoOptions } from 'src/createAction';
import Promise from 'dojo-core/Promise';
import Task, { isTask } from 'dojo-core/async/Task';

registerSuite({
	name: 'createAction',
	'isAction()'() {
		const action = createAction({
			do() { return; }
		});

		assert.isTrue(isAction(action));
		assert.isFalse(isAction({}));
		assert.isFalse(isAction({ do: 'foo' }));
	},

	'creation': {
		'basic'() {
			let count = 0;
			const action = createAction({
				do() {
					count++;
				}
			});

			assert(action);
			assert.isFunction(action.do);
			assert.isFunction(action.enable);
			assert.isFunction(action.disable);
			return action.do().then(() => {
				assert.strictEqual(count, 1, 'do should have been called once');
			});
		},
		'startup disabled'() {
			let count = 0;
			const action = createAction({
				do() {
					count++;
				},
				enabled: false
			});

			return action.do().then((result) => {
				assert.strictEqual(count, 0, 'do should not have been called');
				assert.isUndefined(result, 'result should be undefined');
			});
		},
		'throws'() {
			assert.throws(() => {
				createAction();
			}, TypeError);

			assert.throws(() => {
				createAction(<any> {});
			}, TypeError);
		}
	},
	'do()': {
		'returns value'() {
			const action = createAction({
				do() {
					return { foo: 'bar' };
				}
			});

			return action.do().then((result) => {
				assert.deepEqual(result, { foo: 'bar' });
			});
		},
		'returns thenable'() {
			const action = createAction({
				do() {
					return Promise.resolve('foo');
				}
			});

			const result = action.do();
			assert.isTrue(isTask(result));
			return result.then((result) => {
				assert.strictEqual(result, 'foo');
			});
		},
		'returns task'() {
			const dfd = this.async();
			let task: Task<string>;
			let count = 0;
			let executorCount = 0;
			let finallyCount = 0;
			let resolvedCount = 0;
			const action = createAction({
				do() {
					task = new Task((resolve) => {
						setTimeout(() => {
							executorCount++;
							resolve('foo');
						}, 10);
					}, () => {
						count++;
					});
					return task;
				}
			});

			const result = action.do();
			assert.strictEqual(task, result, 'do should return provided task');
			result.finally(() => {
				finallyCount++;
			});
			result.then(() => {
				resolvedCount++;
			});

			result.cancel();

			setTimeout(dfd.callback(() => {
				assert.strictEqual(count, 1, 'cancel should have been called');
				assert.strictEqual(executorCount, 1, 'executor should have been called');
				assert.strictEqual(resolvedCount, 0, 'then should not have been called');
				assert.strictEqual(finallyCount, 1, 'finally should have been called');
			}), 20);
		},
		'with options'() {
			const action = createAction<string, DoOptions<string>, ActionState>({
				do(options) {
					return options.event.target;
				}
			});

			return action.do({ event: { type: 'do', target: 'foo' } }).then((result) => {
				assert.strictEqual(result, 'foo');
			});
		},
		'scope'() {
			const action = createAction({
				do() {
					return this;
				}
			});

			return action.do().then((result) => {
				assert.strictEqual(result, action);
			});
		}
	},
	'enable()/disable()'() {
		let called = 0;
		let statechanged = 0;
		const action = createAction({
			do() {
				return ++called;
			}
		});

		action.on('statechange', () => {
			statechanged++;
		});

		return action.do().then((result) => {
			assert.strictEqual(result, 1, 'do should have been called');
			action.disable();
			assert.strictEqual(statechanged, 1, 'state should have changed');
			action.disable();
			assert.strictEqual(statechanged, 1, 'state should not have changed');
			return action.do().then((result) => {
				assert.isUndefined(result, 'result shoudl be undefined');
				assert.strictEqual(called, 1, `do shouldn't have been called`);
				action.enable();
				assert.strictEqual(statechanged, 2, 'state should have changed');
				action.enable();
				assert.strictEqual(statechanged, 2, 'state should not have changed');
				return action.do().then((result) => {
					assert.strictEqual(result, 2, 'do should have been called');
				});
			});
		});
	},
	'destroy()'() {
		let called = 0;
		const action = createAction({
			do() {
				return ++called;
			}
		});
		action.destroy();
		return action.do().then((result) => {
			assert.isUndefined(result);
			assert.strictEqual(called, 0);
		});
	}
});
