import { ExpressRouter } from '@/infra/http';
import { makeFacebookLoginController } from '@/main/factories/controllers';
import { Router } from 'express';

export default (router: Router): void => {
  const controller = makeFacebookLoginController();
  const adapter = new ExpressRouter(controller);
  router.post('/api/login/facebook', adapter.adapt);
};
