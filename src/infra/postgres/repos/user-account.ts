import { PgUser } from "@/infra/postgres/entities";
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from "@/domain/contracts/repos";

import { getRepository } from "typeorm";

type LoadInput = LoadUserAccountRepository.Input;
type LoadOutput = LoadUserAccountRepository.Output;
type SaveInput = SaveFacebookAccountRepository.Input;
type SaveOutput = SaveFacebookAccountRepository.Output;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
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
