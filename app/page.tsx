import React, { useState } from "react";

import { Root as Props } from "./page.types";
import RestaurantCard from "./components/restaurant-card/restaurant-card";
import getRestaurants from "./services/restaurants";
import { RestaurantCard as RestaurantCardType } from "./components/restaurant-card/restaurant-card.types";
import getOpenState from "./services/open";
import { isDefined, unique } from "list-fns";
import FilterCards from "./components/filter-cards/filter-cards";
import getFilters from "./services/filters";
import Filters from "./components/filters/filters";
import { Filters as FiltersType } from "./components/filters/filters.types";

import styles from "./page.module.scss";
import { FilterNames } from "./components/helpers/filter-helpers";

const Root: React.FC<Props> = async ({ searchParams }) => {
	const query = searchParams;

	const filterResponse = await getFilters();

	const restaurantsResponse = await getRestaurants();
	const openingStateResponse = await Promise.all(
		restaurantsResponse.restaurants.map(async (restaurant) => {
			try {
				const response = await getOpenState(restaurant.id);

				return {
					...restaurant,
					openState: response.is_open,
				};
			} catch (error) {
				console.error(
					`Error fetching the open state of restaurant ${restaurant.id}`,
				);
			}
		}),
	).then((result) => result.filter(isDefined));

	const restaurants: RestaurantCardType[] = openingStateResponse.map(
		(restaurant) => ({
			title: restaurant.name,
			deliveryTime: String(restaurant.delivery_time_minutes),
			imageUrl: restaurant.image_url,
			isOpen: restaurant.openState,
			filterIds: restaurant.filter_ids,
			priceRangeId: restaurant.price_range_id,
		}),
	);

	const priceRanges = restaurants
		.map((restaurant) => restaurant.priceRangeId)
		.filter(unique);

	const filters: FiltersType["filterCategories"] = [
		{
			title: "FOOD CATEGORY",
			category: FilterNames["Food"],
			filterOptions: filterResponse.filters.map((filter) => ({
				...filter,
				isSelected: query[FilterNames["Food"]]?.includes(filter.id)
					? true
					: false,
			})),
		},
		{
			title: "PRICE RANGE",
			category: FilterNames["Price"],
			filterOptions: priceRanges.map((priceRange, index) => ({
				name: String(index),
				id: priceRange,
				isSelected: query[FilterNames["Price"]]?.includes(priceRange)
					? true
					: false,
			})),
		},
	];

	// NOTE: this isn't ideal, but the key 'filters' will either contain a single string, if only one filter is present, or a string array if multiple filters are set. TS doesn't know this, but we do
	const foodFilters =
		typeof query["food"] === "string"
			? [query["food"]]
			: (query["food"] as string[] | undefined);

	const priceFilters =
		typeof query["price"] === "string"
			? [query["price"]]
			: (query["price"] as string[] | undefined);

	const filteredRestaurants = restaurants.filter((restaurant) => {
		let isIncluded = false;

		if (foodFilters?.length && priceFilters?.length) {
			if (!priceFilters.includes(restaurant.priceRangeId)) {
				isIncluded = false;
			} else {
				foodFilters.forEach((filter) => {
					if (restaurant.filterIds.includes(filter)) isIncluded = true;
				});
			}
		} else if (foodFilters?.length) {
			foodFilters.forEach((filter) => {
				if (restaurant.filterIds.includes(filter)) isIncluded = true;
			});
		} else if (priceFilters?.length) {
			if (!priceFilters.includes(restaurant.priceRangeId)) {
				isIncluded = false;
			}
		} else {
			isIncluded = true;
		}

		return isIncluded;
	});

	return (
		<div className={styles.root}>
			<div className={styles.left}>
				<Filters filterCategories={filters} />
			</div>
			<div className={styles.right}>
				<FilterCards filters={filterResponse.filters} />
				<h1>Restaurants</h1>
				<ul className={styles.restaurantCards}>
					{filteredRestaurants.map((restaurant) => (
						<RestaurantCard key={restaurant.title} {...restaurant} />
					))}
				</ul>
			</div>
		</div>
	);
};

export default Root;
