"use client";

import Image from "next/image";
import React from "react";

import { FilterCards as Props } from "./filter-cards.types";

import styles from "./filter-cards.module.scss";

const FilterCards: React.FC<Props> = ({ filters }) => {
	return (
		<ul className={styles.filterCards}>
			{filters.map((filter) => {
				const FilterImage = require(`../../assets${filter.image_url}`);

				return (
					<div className={styles.filterCard} key={filter.id}>
						<div>{filter.name}</div>
						<div>
							<Image
								src={FilterImage}
								alt={`An image of ${filter.name}`}
								width={80}
								height={80}
							/>
						</div>
					</div>
				);
			})}
		</ul>
	);
};

export default FilterCards;
