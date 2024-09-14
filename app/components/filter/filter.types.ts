import { FilterNames } from "../helpers/filter-helpers";

export type Filter = {
	title: string;
	category: FilterNames;
	filterOptions: {
		value: string;
		name: string;
		isSelected?: boolean;
	}[];
};
