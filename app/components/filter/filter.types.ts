export type Filter = {
	title: string;
	filterOptions: {
		id: string;
		name: string;
		isSelected?: boolean;
	}[];
};
