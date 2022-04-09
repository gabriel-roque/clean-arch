import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models';

// This service used only orchestrations calls abstractions
export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);

    if (fbData !== undefined) {
      const accountData = await this.userAccount.load({ email: fbData.email });
      const fbAccount = new FacebookAccount(fbData, accountData);
      await this.userAccount.saveWithFacebook(fbAccount);
    }

    return new AuthenticationError();
  }
}
