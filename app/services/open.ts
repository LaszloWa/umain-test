import {
	boolean,
	DecoderReturnType,
	object,
	string,
} from "./utils/json-decoders";

const openStateDecoder = object("Open state decoder", {
	restaurant_id: string,
	is_open: boolean,
});

const getOpenState = async (
	restaurantId: string,
): Promise<DecoderReturnType<typeof openStateDecoder>> => {
	const apiRoute = process.env.API_ROUTE;

	if (!apiRoute) throw new Error("API route not found");

	const response = await fetch(`${apiRoute}/open/${restaurantId}`, {
		headers: {
			"Content-Type": "application/json",
		},
	}).catch((err) => console.error(`Oh no, this error occurred: ${err}`));

	if (!response) throw new Error(`Something went wrong fetching data`);

	const decodedResponse = openStateDecoder.decode(await response.json());

	if (!decodedResponse.isOk())
		throw new Error(`Decoder error: ${decodedResponse.error}`);

	return decodedResponse.value;
};

export default getOpenState;
