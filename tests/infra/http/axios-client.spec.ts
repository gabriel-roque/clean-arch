import { HttpClient } from '@/infra/http';
import axios from 'axios';

jest.mock('axios');

export class AxiosHttpClient {
  async get(args: HttpClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}

describe(AxiosHttpClient.name, () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeAll(() => {
    url = 'any_url';
    params = { any: 'any' };
    fakeAxios = axios as jest.Mocked<typeof axios>;

    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data',
    });
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe('Method GET', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return data on success', async () => {
      const result = await sut.get({ url, params });

      expect(result).toEqual('any_data');
    });
  });
});
