import { FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { mock, MockProxy } from 'jest-mock-extended';

describe(FacebookLoginController.name, () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock<FacebookAuthentication>();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should build validators correctly', async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token'),
    ]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_value' },
    });
  });
});
