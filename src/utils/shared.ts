/*
 * Copyright 2023 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: Description
 * @Author: lspriv
 * @LastEditTime: 2024-11-25 22:04:10
 */
export type PartRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
export type Voidable<T> = T | undefined;
export type Nullable<T> = T | null;
export type Callable = (...args: any[]) => any;
export type PlainObject = NonNullable<unknown>;

const toTypeString = (val: unknown): string => Object.prototype.toString.call(val);

export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isNumber = (val: unknown): val is number => typeof val === 'number';
export const isFunction = (val: unknown): val is Callable => typeof val === 'function';
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';
export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch);
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  Object.prototype.hasOwnProperty.call(val, key);

export const nonNullable = <T>(val: T): val is NonNullable<T> => val != null;

export type Union<T> = T extends [infer R, ...infer P] ? R | Union<P> : never;

export type ArrItem<T> = T extends (infer R)[] ? R : never;

// /** 元组 join */
// export type Join<T extends ReadonlyArray<string>, S = ',', U = ''> = T extends readonly [
//   infer R,
//   ...infer P extends ReadonlyArray<string>
// ]
//   ? `${U & string}${R & string}${Join<P, S, S>}`
//   : '';

/** 下划线（snake_case）转小驼峰（lowerCamelCase） */
export type SnakeToLowerCamel<T extends string, K = Lowercase<T>> = K extends `${infer R}_${infer P}`
  ? `${R}${Capitalize<SnakeToLowerCamel<P, P>>}`
  : K;

/** 小驼峰（lowerCamelCase）转下划线（snake_case） */
export type LowerCamelToSnake<T extends string, S extends string = '_'> = T extends `${infer R}${infer P}`
  ? R extends Lowercase<R>
    ? `${R}${LowerCamelToSnake<P, S>}`
    : `${S}${Lowercase<R>}${LowerCamelToSnake<P, S>}`
  : T;

export const camelToSnake = <T extends string>(str: T, separator: string = '_') =>
  str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase() as LowerCamelToSnake<T>;

type AllAwaited<T> = T extends [infer R, ...infer P]
  ? [Awaited<R>, ...AllAwaited<P>]
  : T extends Array<infer Q>
    ? Array<Awaited<Q>>
    : Awaited<T>;

export const promises = <T extends any[]>(all: T) => Promise.all(all.filter(isPromise)) as Promise<AllAwaited<T>>;

export const values = <T>(obj: Record<string, T>): T[] => Object.keys(obj).map(key => obj[key]);

export const notEmptyObject = (val: Record<any, any>): boolean => !!Object.keys(val).length;

export const omit = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) =>
  Object.keys(obj).reduce(
    (acc, key) => {
      if (!keys.includes(key as K)) acc[key] = obj[key];
      return acc;
    },
    {} as Omit<T, K>
  );

export const strToStyle = (str: string) => {
  return str.split(';').reduce(
    (acc, item) => {
      const trim = item.trim();
      if (trim) {
        const [k, v] = trim.split(':').map(s => s.trim());
        if (k) acc[k] = v;
      }
      return acc;
    },
    {} as Record<string, string | number>
  );
};

export function compareArray(a: Array<any>, b: Array<any>): boolean {
  if (a.length !== b.length) return false;
  let i = a.length;
  while (i--) {
    // 顺序不一样也要返回 false
    if (!compareSame(a[i], b[i])) return false;
  }
  return true;
}

export function compareSame(a: any, b: any): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const typeA = typeof a;
  if (typeA !== typeof b) return false;
  if (typeA !== 'object') return a === b;
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);
  if (isArrayA && isArrayB) return compareArray(a, b);
  else if (isArrayA || isArrayB) return false;
  const aks = Object.keys(a);
  const bks = Object.keys(b);
  if (aks.length !== bks.length) return false;
  let j = aks.length;
  while (j--) {
    const k = aks[j];
    if (!compareSame(a[k], b[k])) return false;
  }
  return true;
}

export const includes = (arr: Array<string | RegExp>, search: string): boolean => {
  let i = arr.length;
  while (i--) {
    const item = arr[i];
    if (typeof item === 'string') {
      if (item === search) return true;
    } else {
      if (item.test(search)) return true;
    }
  }
  return false;
};

export const getStyle = (style: string, key: string) => {
  const value = style.match(new RegExp(`(?<=${key}\\s*:)([^;]+)`));
  if (!value?.[0]) return null;
  return value[0].replace(/[\r\n]+/g, '').trim();
};
