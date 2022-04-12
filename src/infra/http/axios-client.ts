import { HttpClient } from '@/infra/http';
import axios from 'axios';

export class AxiosHttpClient {
  async get(args: HttpClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params });
    return result.data;
  }
}
