import { FilterNames } from "../helpers/filter-helpers";

export type Filter = {
	title: string;
	category: FilterNames;
	filterOptions: {
		id: string;
		name: string;
		isSelected?: boolean;
	}[];
};
