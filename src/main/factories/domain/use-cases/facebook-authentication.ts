import {
  setupFacebookAuthentication,
  FacebookAuthentication,
} from "@/domain/use-cases";
import { makePgUserAccountRepo } from "../../infra/repos";
import { makeFacebookApi, makeJwtTokenHandler } from "../../infra/gateways";

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler()
  );
};
