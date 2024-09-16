"use client";

import Image from "next/image";
import React from "react";
import { useSearchParams } from "next/navigation";

import { FilterCards as Props } from "./filter-cards.types";

import styles from "./filter-cards.module.scss";

const FilterCards: React.FC<Props> = ({ filters }) => {
	const immutableQuery = useSearchParams();

	return (
		<ul className={styles.filterCards}>
			{filters.map(({ imageUrl, name, value, isSelected, category }) => {
				const mutableQuery = new URLSearchParams(immutableQuery);
				isSelected
					? mutableQuery.delete(category, value)
					: mutableQuery.append(category, value);

				return (
					<button
						onClick={() => (window.location.href = `?${mutableQuery}`)}
						className={`${styles.filterCard} ${
							isSelected ? styles.isSelected : undefined
						}`}
						key={value}
					>
						<div>{name}</div>
						<div className={styles.image}>
							<Image
								src={imageUrl}
								alt={`An image of ${name}`}
								width={80}
								height={80}
							/>
						</div>
					</button>
				);
			})}
		</ul>
	);
};

export default FilterCards;
