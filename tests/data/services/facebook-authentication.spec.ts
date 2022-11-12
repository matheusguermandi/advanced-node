import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { TokenGenerator } from "@/data/contracts/crypto";
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken, FacebookAccount } from "@/domain/models";

import { mocked } from "ts-jest/utils";
import { mock, MockProxy } from "jest-mock-extended";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: "any_account_id",
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest
      .fn()
      .mockImplementation(() => ({ any: "any" }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });
});
