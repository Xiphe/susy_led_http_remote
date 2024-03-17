import camelcase from "camelcase";

export function getConfigKeys<
  Config extends Record<string, number>,
  Prefix extends string
>(config: Config, prefix: Prefix) {
  return Object.fromEntries(
    Object.entries(config)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [
        camelcase(key.replace(new RegExp(`^${prefix}`), "")),
        value,
      ])
  ) as Record<SnakeToCamelCase<Prefixed<keyof Config, Prefix>>, number>;
}

type Prefixed<
  Source extends string | number | symbol,
  Search extends string
> = Source extends `${Search}${infer U}` ? U : never;

type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}_${infer V}_${infer W}_${infer X}_${infer Y}_${infer Z}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}${Capitalize<
        Lowercase<V>
      >}${Capitalize<Lowercase<W>>}${Capitalize<Lowercase<X>>}${Capitalize<
        Lowercase<Y>
      >}${Capitalize<Lowercase<Z>>}`
    : S extends `${infer T}_${infer U}_${infer V}_${infer W}_${infer X}_${infer Y}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}${Capitalize<
        Lowercase<V>
      >}${Capitalize<Lowercase<W>>}${Capitalize<Lowercase<X>>}${Capitalize<
        Lowercase<Y>
      >}`
    : S extends `${infer T}_${infer U}_${infer V}_${infer W}_${infer X}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}${Capitalize<
        Lowercase<V>
      >}${Capitalize<Lowercase<W>>}${Capitalize<Lowercase<X>>}`
    : S extends `${infer T}_${infer U}_${infer V}_${infer W}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}${Capitalize<
        Lowercase<V>
      >}${Capitalize<Lowercase<W>>}`
    : S extends `${infer T}_${infer U}_${infer V}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}${Capitalize<Lowercase<V>>}`
    : S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}${Capitalize<Lowercase<U>>}`
    : Lowercase<S>;
