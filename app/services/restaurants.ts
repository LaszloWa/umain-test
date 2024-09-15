import {
	DecoderReturnType,
	number,
	object,
	objectArray,
	string,
	stringArray,
} from "./utils/json-decoders";

export const restaurant = {
	id: string,
	name: string,
	rating: number,
	filter_ids: stringArray,
	image_url: string,
	delivery_time_minutes: number,
	price_range_id: string,
};

const restaurantsDecoder = object("Restaurant decoder", {
	restaurants: objectArray("Restaurants", restaurant),
});

const getRestaurants = async (): Promise<
	DecoderReturnType<typeof restaurantsDecoder>
> => {
	const apiRoute = process.env.API_ROUTE;

	if (!apiRoute) throw new Error("API route not found");

	const response = await fetch(`${apiRoute}/restaurants`, {
		method: "GET",
	}).catch((err) => console.error(`Oh no, this error occurred: ${err}`));

	if (!response) throw new Error(`Something went wrong fetching data`);

	const decodedResponse = restaurantsDecoder.decode(await response.json());

	if (!decodedResponse.isOk())
		throw new Error(`Decoder error: ${decodedResponse.error}`);

	return decodedResponse.value;
};

export default getRestaurants;
