import { LoadUserAccountRepository } from '@/data/contracts/repos';
import { newDb } from 'pg-mem';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } });
    if (pgUser !== undefined)
      return {
        id: pgUser?.id.toString(),
        name: pgUser?.name ?? undefined,
      };
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string;
}

describe(PgUserAccountRepository.name, () => {
  describe('Method load()', () => {
    it('should return an account if email exists', async () => {
      const db = newDb();
      db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database',
      });
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      // // // create schema
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({ email: 'existing_email' });
      const sut = new PgUserAccountRepository();
      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
    });
  });
});