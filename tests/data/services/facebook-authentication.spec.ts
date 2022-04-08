import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

describe(FacebookAuthenticationService.name, () => {
  let sut: FacebookAuthenticationService;
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    loadUserAccountRepo = mock<LoadUserAccountRepository>();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
    );
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it(`should return ${AuthenticationError.name} when LoadFacebookUserApi returns undefined`, async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});
