"use client";

import React from "react";

import Filter from "../filter/filter";

import { Filters as Props } from "./filters.types";

import styles from "./filters.module.scss";

const Filters: React.FC<Props> = ({ filterCategories }) => {
	return (
		<div className={styles.filters}>
			<h2>Filter</h2>
			<ul className={styles.list}>
				{filterCategories.map((filterCategory) => (
					<Filter {...filterCategory} key={filterCategory.title} />
				))}
			</ul>
		</div>
	);
};

export default Filters;
