import { env } from "@/main/config/env";
import { FacebookApi, AxiosHttpClient } from "@/infra/gateways";

describe("Facebook Api Integration Tests", () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
  });

  it("should return a Facebook User if token is valid", async () => {
    const fbUser = await sut.loadUser({ token: env.facebookApi.accessToken });

    expect(fbUser).toEqual({
      facebookId: "728079287908964",
      email: "email@test.net",
      name: "Name test",
    });
  });

  it("should return undefined if token is invalid", async () => {
    const fbUser = await sut.loadUser({ token: "invalid" });

    expect(fbUser).toBeUndefined();
  });
});
