import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe(FacebookApi, () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );
  });

  it('should return a facebook user if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token:
        'EAAEPyIn0ETkBAAuZBuoQlcqBZArhFKC5nFPY7P4VIUQ1Erfxp8Nq5wZBnslGLUYZBPAeKGrMeXq0pROQ31TDbfUHD8LXMvHixuQhRRa0MHfEZBIQeFshHdkUuBQ4lRdqiIIb9ZBcYM14wW143L24iR8TW2ELrZAOYX0sRT1KaJzV0wE2PuAON3kqDpw57qe6zZAvZCVpvHe7CuSQ8xyxjtJxu',
    });

    expect(fbUser).toEqual({
      facebookId: '101034475935950',
      email: 'user_rjlorax_test@tfbnw.net',
      name: 'User Clean Arch API Test',
    });
  });

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' });

    expect(fbUser).toBeUndefined();
  });
});
