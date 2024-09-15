import { JsonDecoder } from "ts.data.json";

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

export type Decoder<T> = JsonDecoder.Decoder<T>;

// NOTE: Duplicate of the internal `DecoderObject` type of `ts.data.json` needed in order to type the `decoder` argument to `JsonDecoder.object`
export type DecoderObject<a> = { [p in keyof Required<a>]: Decoder<a[p]> };

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

/** Decodes a boolean from a string. Any case insensitive string equal to "true" return true. Other string return false.
```ts
decode(boolString, "true") // Returns true
decode(boolString, "True") // Returns true
decode(boolString, "TRUE") // Returns true
decode(boolString, "false") // Returns false
decode(boolString, "") // Returns false
decode(boolString, "something else") // Returns false
``` */
export const boolString = string.map((input) => input.toLowerCase() === "true");

export const stringArray = array("string[]", string);

/** This function can be used in place of `Decoder.decode`. Instead of returning the result inside of a `Result` class, this function returns the actual value or throws an error. */
export const decode = <T, E extends Error>(
	decoder: JsonDecoder.Decoder<T>,
	// eslint-disable-next-line
	data: any,
	CustomError?: new (message: string) => E,
): T => {
	const result = decoder.decode(data);
	if (result.isOk()) {
		return result.value;
	} else {
		// NOTE: JsonDecoder.Decoder errors can contain many levels of error messages without any whitespace. This is not a nice experience, so we apply some formatting:
		const formattedError = result.error
			.split(":")
			.map((line, index) => `${" ".repeat(index * 2)}${line}:`)
			.join("\n");
		throw CustomError
			? new CustomError(formattedError)
			: new Error(formattedError);
	}
};

// eslint-disable-next-line
export type DecoderReturnType<C extends JsonDecoder.Decoder<any>> =
	C extends JsonDecoder.Decoder<infer T> ? T : unknown;
