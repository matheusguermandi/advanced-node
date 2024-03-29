import { FacebookLoginController } from "@/application/controllers";
import { makeFacebookAuthentication } from "../../domain/use-cases";

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication());
};
