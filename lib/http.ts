import ky, { type Options } from "ky";

export const http = {
  get: <T>(url: string, opts?: Options) => ky.get(url, opts).json<T>(),
  post: <T>(url: string, opts?: Options) => ky.post(url, opts).json<T>(),
};
