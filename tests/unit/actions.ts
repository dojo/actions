import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import actionFactory, { isEnabled } from 'src/actions';

registerSuite({
	name: 'actions',
	basic: function() {
		let called = false;

		const actionFoo = actionFactory({
			type: 'foo',
			do(options?: { target: string }): string {
				called = true;
				if (options) {
					return options.target;
				}
			}
		});

		return actionFoo.do({ target: 'bar' }).then(function(result) {
			assert.isTrue(called, 'called has been set to true');
			assert.strictEqual(result, 'bar', 'the action is resolved correctly');
			return actionFoo.destroy();
		});
	},
	'.isEnabled()': function() {
		const actionFoo = actionFactory({
			type: 'foo',
			do() { }
		});

		assert(isEnabled(actionFoo), 'action is enabled');
		assert(isEnabled('foo'), 'action is enabled');
		return actionFoo.destroy();
	}
});
