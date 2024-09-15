export type RestaurantCard = {
	deliveryTime: string;
	filterIds: string[];
	imageUrl: string;
	isOpen: boolean;
	priceRangeId: {
		name: string;
		value: string;
	};
	title: string;
};
