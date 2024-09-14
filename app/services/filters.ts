import {
	DecoderReturnType,
	object,
	objectArray,
	string,
} from "./utils/json-decoders";

const filter = {
	id: string,
	name: string,
	image_url: string,
};

const filtersDecoder = object("Filters decoder", {
	filters: objectArray("Filter", filter),
});

const getFilters = async (): Promise<
	DecoderReturnType<typeof filtersDecoder>
> => {
	const apiRoute = process.env.API_ROUTE;

	if (!apiRoute) throw new Error("API route not found");

	const response = await fetch(`${apiRoute}/filter`).catch((err) =>
		console.error(`Oh no, this error occurred: ${err}`),
	);

	if (!response) throw new Error(`Something went wrong fetching filters`);

	const test = await response.json();

	const decodedResponse = filtersDecoder.decode(test);

	if (!decodedResponse.isOk())
		throw new Error(`Decoder error: ${decodedResponse.error}`);

	return decodedResponse.value;
};

export default getFilters;
