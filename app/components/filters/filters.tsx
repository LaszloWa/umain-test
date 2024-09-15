"use client";

import React, { useState } from "react";

import Filter from "../filter/filter";

import { Filters as Props } from "./filters.types";

import styles from "./filters.module.scss";
import TinyCollapse from "react-tiny-collapse";

const Filters: React.FC<Props> = ({ filterCategories }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles.filters}>
			<h2>Filters</h2>
			<TinyCollapse isOpen={isOpen} className={styles.collapse}>
				<ul className={styles.list}>
					{filterCategories.map((filterCategory) => (
						<Filter {...filterCategory} key={filterCategory.title} />
					))}
				</ul>
			</TinyCollapse>
			<button onClick={() => setIsOpen(!isOpen)} className={styles.toggle}>
				{isOpen ? "Hide filters" : "Show filters"}
			</button>
		</div>
	);
};

export default Filters;
