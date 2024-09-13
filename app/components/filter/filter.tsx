"use client";

import React from "react";

import styles from "./filter.module.scss";

import { Filter as Props } from "./filter.types";
import { useSearchParams } from "next/navigation";

const Filter: React.FC<Props> = ({ filterOptions, title }) => {
	const immutableQuery = useSearchParams();

	return (
		<div>
			<h3 className={styles.title}>{title}</h3>
			<ul className={styles.list}>
				{filterOptions.map(({ id, isSelected, name }) => {
					const mutableQuery = new URLSearchParams(immutableQuery);
					isSelected
						? mutableQuery.delete("filters", id)
						: mutableQuery.append("filters", id);
					return (
						<a
							href={`?${mutableQuery.toString()}`}
							className={`${styles.filter} ${
								isSelected ? styles.selectedFilter : undefined
							}`}
							key={id}
						>
							{name}
						</a>
					);
				})}
			</ul>
		</div>
	);
};

export default Filter;
