"use client";

import React from "react";

import { RestaurantCard as Props } from "./restaurant-card.types";
import Arrow from "@/app/assets/arrow.svg";

import styles from "./restaurant-card.module.scss";
import PlaceholderImage from "../../assets/images/taco.png";
import Image from "next/image";
import Chip from "../chips/chip";

const RestaurantCard: React.FC<Props> = ({
	deliveryTime,
	imageUrl,
	isOpen,
	title,
}) => {
	const Logo = require(`../../assets${imageUrl}`);

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
				<Image src={Logo} alt={`${title}'s logo`} width={140} height={140} />
			</div>
		</a>
	);
};

export default RestaurantCard;
