"use client";

import React from "react";
import Image from "next/image";

import Chip from "../chips/chip";

import Arrow from "@/app/assets/arrow.svg";

import { RestaurantCard as Props } from "./restaurant-card.types";

import styles from "./restaurant-card.module.scss";

const RestaurantCard: React.FC<Props> = ({
	deliveryTime,
	imageUrl,
	isOpen,
	title,
}) => {
	return (
		<a href="" aria-label="" className={styles.restaurantCard} key={title}>
			<div className={styles.top}>
				<Chip
					text={isOpen ? "Open" : "Closed"}
					showOpenState={true}
					isOpen={isOpen}
				/>
				<Chip text={`${deliveryTime} min`} />
			</div>
			<div className={styles.bottom}>
				<div className="restaurant-card__title">{title}</div>
				<div className={styles.arrowIcon}>
					<Arrow />
				</div>
			</div>
			<div className={styles.image}>
				<Image
					src={imageUrl}
					alt={`${title}'s logo`}
					width={140}
					height={140}
				/>
			</div>
		</a>
	);
};

export default RestaurantCard;
