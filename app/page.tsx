import React, { useState } from "react";

import { Root as Props } from "./page.types";
import RestaurantCard from "./components/restaurant-card/restaurant-card";
import getRestaurants, { restaurant } from "./services/restaurants";
import { RestaurantCard as RestaurantCardType } from "./components/restaurant-card/restaurant-card.types";
import getOpenState from "./services/open";
import { isDefined } from "list-fns";
import FilterCards from "./components/filter-cards/filter-cards";
import getFilters from "./services/filters";
import Filters from "./components/filters/filters";
import { Filters as FiltersType } from "./components/filters/filters.types";

import styles from "./page.module.scss";

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

	const filters: FiltersType["filterCategories"] = [
		{
			title: "FOOD CATEGORY",
			filterOptions: filterResponse.filters.map((filter) => ({
				...filter,
				isSelected: query["filters"]?.includes(filter.id) ? true : false,
			})),
		},
	];

	// NOTE: this isn't ideal, but the key 'filters' will either contain a single string, if only one filter is present, or a string array if multiple filters are set. TS doesn't know this, but we do
	const specificQuery =
		typeof query["filters"] === "string"
			? [query["filters"]]
			: (query["filters"] as string[] | undefined);

	const filteredRestaurants = specificQuery
		? restaurants.filter((restaurant) => {
				let isIncluded = false;

				console.log("the price ranges", restaurant.priceRangeId);

				specificQuery.forEach((filter) => {
					if (restaurant.filterIds.includes(filter)) isIncluded = true;
				});

				return isIncluded;
		  })
		: restaurants;

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
