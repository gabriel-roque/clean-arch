import { Router } from 'express';

export default (router: Router): void => {
  router.post('/api/login/facebook', (_req, res) => {
    return res.send({ data: 'any_data' });
  });
};
