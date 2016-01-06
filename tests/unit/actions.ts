import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import actionFactory, { isEnabled, byType } from 'src/actions';
import Promise from 'dojo-core/Promise';

interface FooOptions {
	target: string;
}

registerSuite({
	name: 'actions',
	basic() {
		let called = false;

		const actionFoo = actionFactory({
			type: 'foo',
			state: { foo: 'bar' },
			do(options?: FooOptions): [ string, string ] {
				called = true;
				if (options) {
					return [ options.target, this.state.foo ];
				}
			}
		});

		return actionFoo.do({ target: 'bar' }).then(function(result) {
			assert.isTrue(called, 'called has been set to true');
			assert.deepEqual(result, [ 'bar', 'bar' ], 'the action is resolved correctly');
			return actionFoo.destroy();
		});
	},
	'.isEnabled()'() {
		const actionFoo = actionFactory({
			type: 'foo',
			do() { }
		});

		assert(isEnabled(actionFoo), 'action is enabled');
		assert(isEnabled('foo'), 'action is enabled');
		return actionFoo.destroy();
	},
	'creation/destruction'() {
		assert.notOk(byType('foo'), 'There should be no action typed as "foo"');

		const actionFoo = actionFactory({
			type: 'foo',
			do() {}
		});

		assert.strictEqual(byType('foo'), actionFoo,
			'The action by type and return from factory should match');

		actionFoo.destroy();

		assert.notOk(byType('foo'), 'The action should be removed');
	},
	'creation of duplicate type throws'() {
		let called = 'no';

		const actionFoo1 = actionFactory({
			type: 'foo',
			do() {
				called = 'actionFoo1';
			}
		});

		assert.throws(function() {
			actionFactory({
				type: 'foo',
				do() {
					called = 'actionFoo2';
				}
			});
		});

		assert.strictEqual(called, 'no');
		return byType('foo').do().then(function() {
			assert.strictEqual(called, 'actionFoo1');
			actionFoo1.destroy();
		});
	},
	'undo': {
		'no method'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do() { }
			});

			return actionFoo.do().undo().then((result) => {
				assert.isUndefined(result);
				return actionFoo.destroy();
			});
		},
		'preserves state'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do(options: FooOptions) {
					this.state = options.target;
				},
				undo() {
					assert.strictEqual(this.state, 'bar');
				}
			});

			const memo = actionFoo.do({ target: 'bar' });
			return memo.undo().then(function() {
				return actionFoo.destroy();
			});
		},
		'disabled'() {
			const dfd = this.async();

			let called = false;

			const actionFoo = actionFactory({
				type: 'foo',
				do() { },
				undo() {
					called = true;
				}
			});

			const memo = actionFoo.do();
			actionFoo.disable().then(() => {
				memo.undo().then(dfd.reject, (e) => {
					assert.instanceOf(e, Error);
					assert.isFalse(called);
					actionFoo.destroy().then(dfd.resolve);
				});
			});
		},
		'returns value'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					return 'foo';
				},
				undo() {
					return 'bar';
				}
			});

			return actionFoo.
				do().
				undo().
				then((result) => {
					assert.strictEqual(result, 'bar');
					return actionFoo.destroy();
				});
		},
		'returns promise'() {
			let called = 'zero';
			const actionFoo = actionFactory({
				type: 'foo',
				do() { return false; },
				undo() {
					called = 'one';
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							try {
								assert.strictEqual(called, 'two');
								called = 'three';
								resolve(true);
							}
							catch (e) {
								reject(e);
							}
						}, 100);
					});
				}
			});

			const memo = actionFoo.do();
			assert.strictEqual(called, 'zero');
			const result = memo.undo().then((value) => {
				assert.isTrue(value);
				assert.strictEqual(called, 'three');
				return actionFoo.destroy();
			});

			/* undo is always called out of turn */
			setTimeout(() => {
				assert.strictEqual(called, 'one');
				called = 'two';
			}, 1);

			return result;
		},
		'does not fire until do() resolved'() {
			let called = 0;
			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(true);
						}, 100);
					});
				},
				undo() {
					called = 1;
					return 'bar';
				}
			});

			const memo = actionFoo.do().undo();
			assert.strictEqual(called, 0);

			return memo.then(() => {
				assert.strictEqual(called, 1);
				return actionFoo.destroy();
			});
		},
		'throws in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() { },
				undo() {
					throw new Error('BOOM!');
				}
			});

			actionFoo.
				do().
				undo().
				then(dfd.reject, (error: any) => {
					assert.instanceOf(error, Error);
					actionFoo.destroy().then(dfd.resolve);
				});
		},
		'rejects in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() { return false; },
				undo() {
					return new Promise((resolve, reject) => {
						reject(new Error('BOOM!'));
					});
				}
			});

			actionFoo.
				do().
				undo().
				then(dfd.reject, (error: any) => {
					assert.instanceOf(error, Error);
					actionFoo.destroy().then(dfd.resolve);
				});
		}
	}
});
