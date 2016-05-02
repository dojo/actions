import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { add, byType, getType } from 'src/actions';
import createAction from 'src/createAction';
import Symbol from 'dojo-core/Symbol';

registerSuite({
	name: 'actions',
	'add()': {
		'string type'() {
			const action = createAction({ do() {} });
			assert.isUndefined(action.type);
			const handle = add(action, 'foo');
			assert.strictEqual(action.type, 'foo');
			handle.destroy();
			assert.isUndefined(action.type);
			handle.destroy();
		},
		'symbol type'() {
			const fooSymbol = Symbol('foo');
			const action = createAction({ do() {} });
			assert.isUndefined(action.type);
			const handle = add(action, fooSymbol);
			assert.strictEqual(action.type, fooSymbol);
			handle.destroy();
			assert.isUndefined(action.type);
		},
		'add same type again'() {
			const action = createAction({ do() {} });
			const handle = add(action, 'foo');
			add(action, 'foo');
			handle.destroy();
			assert.isUndefined(action.type);
		},
		'change type'() {
			const action = createAction({ do() {} });
			add(action, 'foo');
			assert.strictEqual(action.type, 'foo');
			const handle = add(action, 'bar');
			assert.strictEqual(action.type, 'bar');
			handle.destroy();
			assert.isUndefined(action.type);
		},
		'without type'() {
			const action = createAction({ do() {} });
			const handle = add(action);
			assert.isDefined(action.type);
			handle.destroy();
			assert.isUndefined(action.type);
		},
		'duplicate type'() {
			const action1 = createAction({ do() {} });
			const action2 = createAction({ do() {} });
			const handle = add(action1, 'foo');
			assert.throws(() => {
				add(action2, 'foo');
			});
			assert.strictEqual(action1.type, 'foo');
			assert.isUndefined(action2.type);
			handle.destroy();
		}
	},
	'byType()': {
		'string type'() {
			assert.isUndefined(byType('foo'));
			const action = createAction({
				do() {},
				type: 'foo'
			});
			assert.strictEqual(byType('foo'), action);
			action.destroy();
			assert.isUndefined(byType('foo'));
		},
		'symbol type'() {
			const fooSymbol = Symbol('foo');
			assert.isUndefined(byType(fooSymbol));
			const action = createAction({
				do () {},
				type: fooSymbol
			});
			assert.strictEqual(byType(fooSymbol), action);
			action.destroy();
			assert.isUndefined(byType(fooSymbol));
		}
	},
	'getType()': {
		'string type'() {
			const action = createAction({
				do() {},
				type: 'foo'
			});

			assert.strictEqual(getType(action), 'foo');
			action.destroy();
			assert.isUndefined(getType(action));
		},
		'symbol type'() {
			const fooSymbol = Symbol('foo');
			const action = createAction({
				do() {},
				type: fooSymbol
			});

			assert.strictEqual(getType(action), fooSymbol);
			action.destroy();
			assert.isUndefined(getType(action));
		}
	}
});
