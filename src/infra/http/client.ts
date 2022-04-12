export interface HttpClient {
  get: <T = any>(params: HttpClient.Params) => Promise<T>;
}

export namespace HttpClient {
  export type Params = {
    url: string;
    params: object;
  };
}
