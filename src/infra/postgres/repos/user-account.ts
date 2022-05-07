import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';
import { PgUser } from '@/infra/postgres/entities';
import { getRepository } from 'typeorm';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  async load(params: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({
      where: { email: params.email },
    });

    if (pgUser !== undefined) {
      return {
        id: pgUser?.id.toString(),
        name: pgUser?.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    let id: string;
    if (params.id === undefined) {
      const pgUserRepo = getRepository(PgUser);
      const pgUser = await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      id = pgUser.id.toString();
    } else {
      id = params.id;
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.update(
        { id: parseInt(params.id) },
        { name: params.name, facebookId: params.facebookId },
      );
    }
    return { id };
  }
}
