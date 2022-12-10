import { PgUser } from "@/infra/postgres/entities";
import { LoadUserAccount, SaveFacebookAccount } from "@/domain/contracts/repos";

import { getRepository } from "typeorm";

type LoadInput = LoadUserAccount.Input;
type LoadOutput = LoadUserAccount.Output;
type SaveInput = SaveFacebookAccount.Input;
type SaveOutput = SaveFacebookAccount.Output;

export class PgUserAccountRepository
  implements LoadUserAccount, SaveFacebookAccount
{
  async load({ email }: LoadInput): Promise<LoadOutput> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email });
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook({
    id,
    name,
    email,
    facebookId,
  }: SaveInput): Promise<SaveOutput> {
    const pgUserRepo = getRepository(PgUser);
    let resultId: string;
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId });
    }
    return { id: resultId };
  }
}
