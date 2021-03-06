import validator from 'ember-legit-forms/validators/max-validator';
import { module, test } from 'qunit';
import generateString from '../../helpers/generate-string';
import argumentsObj from '../../helpers/arguments-obj';

module('Unit | Validators | max');

let subject = validator.create();

test('it validates properly', function(assert) {
  assert.equal(
    subject.validate(generateString(3), argumentsObj(3)),
    undefined
  );

  assert.equal(
    subject.validate(generateString(2), argumentsObj(3)),
    undefined
  );

  assert.equal(
    subject.validate(generateString(4), argumentsObj(3)).message,
    'tooLong'
  );

  assert.equal(
    subject.validate(generateString(5), argumentsObj(3)).message,
    'tooLong'
  );
});

test('it allows empty values for chaining', function(assert) {
  assert.equal(
    subject.validate('', argumentsObj(3)),
    undefined
  );

  assert.equal(
    subject.validate(null, argumentsObj(3)),
    undefined
  );
});
