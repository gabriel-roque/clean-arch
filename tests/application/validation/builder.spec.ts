import {
  RequiredStringValidator,
  ValidatorBuilder,
} from '@/application/validation';

describe(ValidatorBuilder, () => {
  it('should return a required string', () => {
    const validators = ValidatorBuilder.of({
      value: 'any_value',
      fieldName: 'any_name',
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator('any_value', 'any_name'),
    ]);
  });
});
