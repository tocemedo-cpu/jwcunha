export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[] | DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
