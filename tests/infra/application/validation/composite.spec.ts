import { ValidationComposite, Validator } from '@/application/validation';
import { mock, MockProxy } from 'jest-mock-extended';

describe(ValidationComposite, () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeAll(() => {
    validator1 = mock<Validator>();
    validator2 = mock<Validator>();
    validators = [validator1, validator2];

    validator1.validate.mockReturnValue(undefined);
    validator2.validate.mockReturnValue(undefined);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new ValidationComposite(validators);
  });

  it('should return undefined if all validators return undefined', () => {
    const error = sut.validate();
    expect(error).toBeUndefined();
  });

  it('should return first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'));
    validator2.validate.mockReturnValueOnce(new Error('error_2'));

    const error = sut.validate();

    expect(error).toEqual(new Error('error_1'));
  });

  it('should return error', () => {
    validator2.validate.mockReturnValueOnce(new Error('error_2'));

    const error = sut.validate();

    expect(error).toEqual(new Error('error_2'));
  });
});
