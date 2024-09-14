import { FilterNames } from "../helpers/filter-helpers";

export type FilterCards = {
	filters: {
		category: FilterNames;
		imageUrl: string;
		isSelected?: boolean;
		name: string;
		value: string;
	}[];
};
