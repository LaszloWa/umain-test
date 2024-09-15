import { DecoderReturnType, object, string } from "./utils/json-decoders";

const priceRangeDecoder = object("Open state decoder", {
	id: string,
	range: string,
});

const getPriceRange = async (
	priceRangeId: string,
): Promise<DecoderReturnType<typeof priceRangeDecoder>> => {
	const apiRoute = process.env.API_ROUTE;

	if (!apiRoute) throw new Error("API route not found");

	const response = await fetch(`${apiRoute}/price-range/${priceRangeId}`, {
		method: "GET",
	}).catch((err) => console.error(`Oh no, this error occurred: ${err}`));

	if (!response) throw new Error(`Something went wrong fetching data`);

	const decodedResponse = priceRangeDecoder.decode(await response.json());

	if (!decodedResponse.isOk())
		throw new Error(`Decoder error: ${decodedResponse.error}`);

	return decodedResponse.value;
};

export default getPriceRange;
