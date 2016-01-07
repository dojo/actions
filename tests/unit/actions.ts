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
			do(options?: FooOptions): [string, string] {
				called = true;
				if (options) {
					return [options.target, this.state.foo];
				}
			}
		});

		return actionFoo.do({ target: 'bar' }).then(function(result) {
			assert.isTrue(called, 'called has been set to true');
			assert.deepEqual(result, ['bar', 'bar'], 'the action is resolved correctly');
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
			do() { }
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
	'create of missing type throws'() {
		assert.throws(() => {
			actionFactory(<any> {});
		});
	},
	'do': {
		'persists state'() {
			const actionFoo = actionFactory({
				type: 'foo',
				state: { foo: 'bar' },
				do(options: FooOptions) {
					assert.strictEqual(options.target, 'foo');
					assert.strictEqual(this.state.foo, 'bar');
				}
			});

			return actionFoo.do({ target: 'foo' }).then(() => {
				actionFoo.destroy();
			});
		},
		'disabled'() {
			const dfd = this.async();
			let called = false;

			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					called = true;
				}
			});

			actionFoo.disable().then(() => {
				actionFoo.do().then(dfd.reject.bind(this), function(e) {
					assert.isFalse(called);
					assert.instanceOf(e, Error);
					actionFoo.enable().then(() => {
						actionFoo.do().then(() => {
							assert.isTrue(called);
							actionFoo.destroy().then(dfd.resolve);
						});
					});
				});
			});
		},
		'returns value'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do(options: FooOptions) {
					return options.target + 'bar';
				}
			});

			return actionFoo
				.do({ target: 'foo' })
				.then((result) => {
					assert.strictEqual(result, 'foobar');
					return actionFoo.destroy();
				});
		},
		'returns promise'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do(options: FooOptions) {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(options.target + 'bar');
						}, 100);
					});
				}
			});

			return actionFoo
				.do({ target: 'foo' })
				.then((result) => {
					assert.strictEqual(result, 'foobar');
					return actionFoo.destroy();
				});
		},
		'throws in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					throw new Error('BOOM!');
				}
			});

			actionFoo
				.do()
				.then(dfd.reject.bind(this), (error) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
					actionFoo.destroy().then(dfd.resolve.bind(this));
				});
		},
		'rejects in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					return new Promise((resolve, reject) => {
						reject(new Error('BOOM!'));
					});
				}
			});

			actionFoo
				.do()
				.then(dfd.reject.bind(this), (error) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
					actionFoo.destroy().then(dfd.resolve.bind(this));
				});
		},
		'throws missing do'() {
			assert.throws(() => {
				actionFactory(<any> {
					type: 'foo'
				});
			}, TypeError, 'Missing action method "do", cannot create action.');
		}
	},
	'undo': {
		'no method'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do() { }
			});

			return actionFoo
				.do()
				.undo()
				.then((result) => {
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

			return actionFoo
				.do({ target: 'bar' })
				.undo()
				.then(function() {
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
			actionFoo
				.disable()
				.then(() => {
					memo
						.undo()
						.then(dfd.reject.bind(this), (error) => {
							assert.instanceOf(error, Error);
							assert.include(error.message, 'not enabled');
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

			return actionFoo
				.do()
				.undo()
				.then((result) => {
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
			const result = memo
				.undo()
				.then((value) => {
					assert.isTrue(value);
					assert.strictEqual(called, 'three');
					return actionFoo.destroy();
				});

			/* undo is always called out of turn */
			setTimeout(() => {
				assert.strictEqual(called, 'one');
				called = 'two';
			}, 50);

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

			const memo = actionFoo
				.do()
				.undo();

			assert.strictEqual(called, 0);

			return memo
				.then(() => {
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

			actionFoo
				.do()
				.undo()
				.then(dfd.reject.bind(this), (error: any) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
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

			actionFoo
				.do()
				.undo()
				.then(dfd.reject.bind(this), (error: any) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
					actionFoo.destroy().then(dfd.resolve);
				});
		}
	},
	'redo': {
		'persists state'() {
			const actionFoo = actionFactory({
				type: 'foo',
				do(options: FooOptions) {
					this.state = options.target;
				},
				redo() {
					assert.strictEqual(this.state, 'foo');
				}
			});

			return actionFoo
				.do({ target: 'foo' })
				.redo()
				.then(() => {
					return actionFoo.destroy();
				});
		},
		'calls do when no redo'() {
			let called = 0;

			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					called++;
				}
			});

			return actionFoo
				.do()
				.redo()
				.then(() => {
					assert.strictEqual(called, 2);
					return actionFoo.destroy();
				});
		},
		'undo/redo'() {
			let called = 0;

			const actionFoo = actionFactory({
				type: 'foo',
				do() {
					called++;
				},
				undo() {
					called--;
				},
				redo() {
					called++;
				}
			});

			return actionFoo
				.do()
				.redo()
				.undo()
				.redo()
				.redo()
				.undo()
				.then(() => {
					assert.strictEqual(called, 2);
					return actionFoo.destroy();
				});
		},
		'disabled'() {
			const dfd = this.async();

			let called = false;

			const actionFoo = actionFactory({
				type: 'foo',
				do() { },
				redo() {
					called = true;
				}
			});

			const memo = actionFoo.do();
			actionFoo
				.disable()
				.then(() => {
					memo
						.redo()
						.then(dfd.reject.bind(this), (error) => {
							assert.instanceOf(error, Error);
							assert.include(error.message, 'not enabled');
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
				redo() {
					return 'bar';
				}
			});

			return actionFoo
				.do()
				.redo()
				.then((result) => {
					assert.strictEqual(result, 'bar');
					return actionFoo.destroy();
				});
		},
		'returns promise'() {
			let called = 'zero';
			const actionFoo = actionFactory({
				type: 'foo',
				do() { return false; },
				redo() {
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
			const result = memo
				.redo()
				.then((value) => {
					assert.isTrue(value);
					assert.strictEqual(called, 'three');
					return actionFoo.destroy();
				});

			/* redo is always called out of turn */
			setTimeout(() => {
				assert.strictEqual(called, 'one');
				called = 'two';
			}, 50);

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
				redo() {
					called = 1;
					return 'bar';
				}
			});

			const memo = actionFoo
				.do()
				.redo();

			assert.strictEqual(called, 0);

			return memo
				.then(() => {
					assert.strictEqual(called, 1);
					return actionFoo.destroy();
				});
		},
		'throws in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() { },
				redo() {
					throw new Error('BOOM!');
				}
			});

			actionFoo
				.do()
				.redo()
				.then(dfd.reject.bind(this), (error: any) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
					actionFoo.destroy().then(dfd.resolve);
				});
		},
		'rejects in method'() {
			const dfd = this.async();

			const actionFoo = actionFactory({
				type: 'foo',
				do() { return false; },
				redo() {
					return new Promise((resolve, reject) => {
						reject(new Error('BOOM!'));
					});
				}
			});

			actionFoo
				.do()
				.redo()
				.then(dfd.reject.bind(this), (error: any) => {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'BOOM!');
					actionFoo.destroy().then(dfd.resolve);
				});
		}
	}
});
