import { JsonDecoder, err, ok } from 'ts.data.json';

export const boolean = JsonDecoder.boolean;
export const combine = JsonDecoder.combine;
export const failover = JsonDecoder.failover;
export const number = JsonDecoder.number;
export const isExactly = JsonDecoder.isExactly;
export const optional = JsonDecoder.optional;
export const string = JsonDecoder.string;

// NOTE: We flip th<e arguments of these because having the name first is nicer for reading
export const array = <T>(name: string, decoder: Decoder<T>) =>
  JsonDecoder.array(decoder, name);
export const dictionary = <T>(name: string, decoder: Decoder<T>) =>
  JsonDecoder.dictionary(decoder, name);
export const object = <T>(name: string, decoder: DecoderObject<T>) =>
  JsonDecoder.object(decoder, name);
export const oneOf = <T>(name: string, decoders: Decoder<T>[]) =>
  JsonDecoder.oneOf(decoders, name);

export const unknown = new JsonDecoder.Decoder<unknown>((data: any) =>
  ok(data)
);

export type Decoder<T> = JsonDecoder.Decoder<T>;

// NOTE: Duplicate of the internal `DecoderObject` type of `ts.data.json` needed in order to type the `decoder` argument to `JsonDecoder.object`
export type DecoderObject<a> = { [p in keyof Required<a>]: Decoder<a[p]> };

/** If `decoderA` was successful, `decoderB` is called with the output of `decoderA`. */
export const compose = <A, B>(
  decoderA: Decoder<A>,
  decoderB: Decoder<B>
): Decoder<B> =>
  new JsonDecoder.Decoder((data: any) => {
    const resultA = decoderA.decode(data);
    return resultA.isOk() ? decoderB.decode(resultA.value) : err(resultA.error);
  });

/**
 * The opposite of `optional`.
 * OK if data is anything but null or undefined.
 * */
export const required = new JsonDecoder.Decoder<unknown>((data: unknown) =>
  oneOf('Required', [isExactly(null), isExactly(undefined)]).fold(
    () => err('Data is null or undefined'),
    () => ok(data),
    data
  )
);

/** Validates the decoded string using the supplied `regExp`. The error message can be overriden */
export const regExp = (
  regExp: RegExp,
  error = (input: string) => `'${input}' does not match ${regExp}`
): Decoder<string> =>
  JsonDecoder.string.chain(value =>
    regExp.test(value) ? JsonDecoder.succeed : JsonDecoder.fail(error(value))
  );

export const oneOfNumber = (name: string, min: number, max: number) =>
  oneOf(
    name,
    Array.from({ length: max - min }).map((_, index) => isExactly(index))
  );

/** Decodes a string to one of the passed strings. Note that for type inference to work optimally, pass the list of strings as `const`:
```ts
const strDecoder = oneOfStrings(["a", "b", "c"]); // Decoder<string>
const abcDecoder = oneOfStrings(["a", "b", "c"] as const); // Decoder<"a" | "b" | "c">
```
 */
export const oneOfStrings = <T>(name: string, strings: readonly T[]) =>
  oneOf(
    name,
    strings.map(string => isExactly(string))
  );

/** Decodes an array of objects */
export const objectArray = <T>(name: string, decoder: DecoderObject<T>) =>
  array(`${name}[]`, object(name, decoder));

/**
 * Decodes an array of strings, with default/failover of Unknown
```ts
const errorCodesDecoder = multipleOfStrings('ErrorCodes', ['Unknown'], [
  'a',
  'b',
  'Unknown',
] as const);
````
*/
export const multipleOfStrings = <T extends readonly string[]>(
  name: string,
  entryFailover: T[number],
  strings: T
) =>
  array(
    name,
    failover(entryFailover, oneOfStrings(`${name}Entry`, strings))
  ).map(values => Array.from(new Set(values)));

/** Decodes a boolean from a string. Any case insensitive string equal to "true" return true. Other string return false.
```ts
decode(boolString, "true") // Returns true
decode(boolString, "True") // Returns true
decode(boolString, "TRUE") // Returns true
decode(boolString, "false") // Returns false
decode(boolString, "") // Returns false
decode(boolString, "something else") // Returns false
``` */
export const boolString = string.map(input => input.toLowerCase() === 'true');

/** Decodes a date string (YYYY-MM-DD) from a string. Strips everything past the initial date.
```ts
decode(dateString, "2020-01-01") // Returns "2020-01-01"
decode(dateString, "2021-11-05T09:20:14.691Z") // Returns "2021-11-05"
decode(dateString, "a") // Throws error
decode(dateString, "") // Throws error
decode(dateString, "2020-x-x") // Throws error
``` */
export const dateString = regExp(
  /^\d{4}-\d{2}-\d{2}/,
  input => `'${input}' is not a valid date string "YYYY-MM-DD"`
).map(value => value.slice(0, 10));

/** Decodes a time string HH:MM) from a string. Validates that the string is a time string.
```ts
decode(input, "04:05") // Returns "04:05"
decode(input, "a") // Throws error
decode(input, "") // Throws error
decode(input, "2020-x-x") // Throws error
``` */
export const timeString = regExp(
  /^\d{2}:\d{2}/,
  input => `'${input}' is not a valid time string "HH:MM"`
); // NOTE: Watch for Regex types to land (https://github.com/microsoft/TypeScript/issues/41160)

/** Decodes an integer from a string.
```ts
decode(intString, "1") // Returns 1
decode(intString, "a") // Throws error
``` */
export const parseIntString = regExp(
  /^\d+$/,
  input => `'${input}' is not an integer`
).map(Number);

/** Decodes a string integer from a string.
```ts
decode(intString, "1") // Returns "1"
decode(intString, "a") // Throws error
``` */
export const intString = regExp(
  /^\d+$/,
  input => `'${input}' is not an integer`
).map(String);

/** Decodes a number from a string.
```ts
decode(numberString, "1.5") // Returns 1.5
decode(numberString, "a") // Throws error
``` */
export const numberString = string
  .chain(str =>
    str.length && !isNaN(Number(str))
      ? (JsonDecoder.succeed as Decoder<string>)
      : JsonDecoder.fail<string>(`'${str}' is not a number`)
  )
  .map(Number);

/** Decodes a list of strings from a string of comma-separated values. */
export const commaSeparatedString = JsonDecoder.string.map(string =>
  string.split(',').filter(string => string)
);

export const stringArray = array('string[]', string);

/** This function can be used in place of `Decoder.decode`. Instead of returning the result inside of a `Result` class, this function returns the actual value or throws an error. */
export const decode = <T, E extends Error>(
  decoder: JsonDecoder.Decoder<T>,
  data: any,
  CustomError?: new (message: string) => E
): T => {
  const result = decoder.decode(data);
  if (result.isOk()) {
    return result.value;
  } else {
    // NOTE: JsonDecoder.Decoder errors can contain many levels of error messages without any whitespace. This is not a nice experience, so we apply some formatting:
    const formattedError = result.error
      .split(':')
      .map((line, index) => `${' '.repeat(index * 2)}${line}:`)
      .join('\n');
    throw CustomError
      ? new CustomError(formattedError)
      : new Error(formattedError);
  }
};

/** [Curried](https://en.wikipedia.org/wiki/Currying) proxy for `Decoder.decodeToPromise`.
```ts
http.get("some-url").then(decodeToPromise(myDecoder))
```
 */
export const decodeToPromise =
  <T>(decoder: JsonDecoder.Decoder<T>) =>
  (data: any) =>
    decoder.decodeToPromise(data);

export type DecoderReturnType<C extends JsonDecoder.Decoder<any>> =
  C extends JsonDecoder.Decoder<infer T> ? T : unknown;
