import { FacebookLoginController } from '@/application/controllers';
import { ServerError, UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { mocked } from 'jest-mock';
import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('@/application/validation/required-string');

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

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    mocked(RequiredStringValidator).mockImplementationOnce(
      RequiredStringValidatorSpy,
    );

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
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

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
