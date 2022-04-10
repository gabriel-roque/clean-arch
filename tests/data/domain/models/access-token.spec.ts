import { AccessToken } from '@/domain/models';

describe(AccessToken.name, () => {
  it('should be create with a value', () => {
    const sut = new AccessToken('any_value');

    expect(sut).toEqual({ value: 'any_value' });
  });
});
