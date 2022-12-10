import { LoadFacebookUser, TokenGenerator } from "@/domain/contracts/gateways";
import { LoadUserAccount, SaveFacebookAccount } from "@/domain/contracts/repos";
import {
  AccessToken,
  FacebookAccount,
  AuthenticationError,
} from "@/domain/entities";

type Setup = (
  facebookApi: LoadFacebookUser,
  userAccountRepo: LoadUserAccount & SaveFacebookAccount,
  crypto: TokenGenerator
) => FacebookAuthentication;
type Input = { token: string };
type Output = { accessToken: string };
export type FacebookAuthentication = (input: Input) => Promise<Output>;

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepo, crypto) => async (input) => {
    const fbData = await facebookApi.loadUser(input);
    if (fbData === undefined) throw new AuthenticationError();

    const accountData = await userAccountRepo.load({ email: fbData.email });
    const fbAccount = new FacebookAccount(fbData, accountData);

    const { id } = await userAccountRepo.saveWithFacebook(fbAccount);

    const accessToken = await crypto.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return { accessToken };
  };
