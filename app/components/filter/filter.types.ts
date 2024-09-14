import { FilterNames } from "../helpers/filter-helpers";

export type Filter = {
	category: FilterNames;
	filterOptions: {
		isSelected?: boolean;
		name: string;
		value: string;
	}[];
	title: string;
};
