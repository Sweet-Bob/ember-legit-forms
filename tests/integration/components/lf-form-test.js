import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';

moduleForComponent('lf-form', 'Integration | Component | lf-form', {
  integration: true
});

test('it calls the on-submit action', function(assert){
  assert.expect(1);
  this.set('rules', {});
  this.set('onSubmit', () => {
    assert.ok(true, 'action is called on submit');
  });
  this.render(hbs`
  {{#lf-form rules=rules onSubmit=(action onSubmit) as |v|}}
    {{lf-input
      name='name'
      validate=v
    }}
    <button class="js-submit">Submit</button>
  {{/lf-form}}`);

  this.$('.js-submit').trigger('click');
});

test('it displays errors on submit when preventSubmit=true', function(assert){
  assert.expect(3);

  this.set('rules', {
    input: 'required',
    textarea: 'requiredUnlessData(field)',
    select: 'required',
  });

  this.set('onSubmit', () => {
    assert.ok(false, 'it shouldn\'t be called at all');
  });

  this.set('selectOptions', [
    { id: 'val1', name: 'Value 1' },
    { id: 'val2', name: 'Value 2' },
  ]);

  this.render(hbs`
  {{#lf-form rules=rules onSubmit=(action onSubmit) preventSubmit=true as |v|}}
    {{lf-input
      class='js-input'
      name='input'
      validate=v
    }}
    {{lf-textarea
      class='js-textarea'
      name='textarea'
      validate=v
    }}
    {{lf-select
      content=selectOptions
      name='select'
      class='js-select'
      valuePath='id'
      labelPath='name'
      validate=v
    }}
    <button class="js-submit">Submit</button>
  {{/lf-form}}`);

  this.$('.js-submit').trigger('click');

  assert.ok(this.$('.js-input').hasClass('has-error'), 'it should display error on submit');
  assert.ok(this.$('.js-textarea').hasClass('has-error'), 'it should display error on submit');
  assert.ok(this.$('.js-select').hasClass('has-error'), 'it should display error on submit');
});

test('it changes validation state of already edited field when new rules are set', function(assert){
  assert.expect(4);

  this.set('rules', {});

  this.render(hbs`
  {{#lf-form rules=rules as |v|}}
    {{lf-input
      class='js-input-1'
      name='input1'
      validate=v
    }}
    {{lf-input
      class='js-input-2'
      name='input2'
      validate=v
    }}
  {{/lf-form}}`);

  this.$('.js-input-1 input').val('123').change().blur();

  assert.ok(this.$('.js-input-1').hasClass('has-success'), 'it should add success class to modified input');
  assert.notOk(this.$('.js-input-2').hasClass('has-success'), 'it should not add success class to unmodified input');

  this.set('rules', {
    input1: 'required',
    input2: 'required',
  });

  return wait().then(() => {
    assert.ok(this.$('.js-input-1').hasClass('has-error'), 'it should add error class to modified input');
    assert.notOk(this.$('.js-input-2').hasClass('has-error'), 'it should not add error class to unmodified input');
  });
});

test('it allows to submit form when it\'s valid and preventSubmit=true', function(assert){
  assert.expect(1);

  this.set('rules', {
    input: 'required',
  });

  this.set('onSubmit', () => {
    assert.ok(true, 'action is called on submit');
  });

  this.render(hbs`
  {{#lf-form rules=rules onSubmit=(action onSubmit) preventSubmit=true as |v|}}
    {{lf-input
      class='js-input'
      name='input'
      validate=v
    }}
    <button class="js-submit">Submit</button>
  {{/lf-form}}`);

  this.$('.js-input input').val('example value').trigger('change');
  this.$('.js-submit').trigger('click');
});
