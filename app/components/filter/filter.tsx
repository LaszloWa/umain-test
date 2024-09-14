"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import styles from "./filter.module.scss";
import { Filter as Props } from "./filter.types";

const Filter: React.FC<Props> = ({ category, filterOptions, title }) => {
	const immutableQuery = useSearchParams();

	return (
		<div>
			<h3 className={styles.title}>{title}</h3>
			<ul className={styles.list}>
				{filterOptions.map(({ value, isSelected, name }) => {
					const mutableQuery = new URLSearchParams(immutableQuery);
					isSelected
						? mutableQuery.delete(category, value)
						: mutableQuery.append(category, value);

					return (
						<button
							onClick={() =>
								(window.location.href = `?${mutableQuery.toString()}`)
							}
							className={`${styles.filter} ${
								isSelected ? styles.selectedFilter : undefined
							}`}
							key={value}
						>
							{name}
						</button>
					);
				})}
			</ul>
		</div>
	);
};

export default Filter;
