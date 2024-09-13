"use client";

import React from "react";

import { Chip as Props } from "./chip.types";

import styles from "./chip.module.scss";

const Chip: React.FC<Props> = ({ isOpen, showOpenState, text }) => {
	return (
		<div className={styles.chip}>
			{showOpenState ? (
				<div className={isOpen ? styles.openState : styles.closedState}></div>
			) : null}
			<span>{text}</span>
		</div>
	);
};

export default Chip;
