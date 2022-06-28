import { PayloadData, PopupWindowOptions } from '../interfaces';

const toParams = (query: string): PayloadData => {
  const q = query.replace(/^([?#])/, '');

  return q.split('&').reduce<PayloadData>((params, param) => {
    const [key, value] = param.split('=');
    return { ...params, [key]: decodeURIComponent(value) };
  }, {});
};

const toQuery = (
  params: PopupWindowOptions | PayloadData,
  delimiter: string = '&'
): string => {
  const keys: string[] = Object.keys(params);

  return keys.reduce<string>((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) query += delimiter;

    return query;
  }, '');
};

export { toParams, toQuery };
