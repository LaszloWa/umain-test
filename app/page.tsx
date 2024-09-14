import React from "react";
import { isDefined, unique } from "list-fns";

import { Filters as FiltersType } from "./components/filters/filters.types";
import { RestaurantCard as RestaurantCardType } from "./components/restaurant-card/restaurant-card.types";
import RestaurantCard from "./components/restaurant-card/restaurant-card";
import { FilterCards as FilterCardsType } from "./components/filter-cards/filter-cards.types";
import { FilterNames } from "./components/helpers/filter-helpers";
import FilterCards from "./components/filter-cards/filter-cards";
import Filters from "./components/filters/filters";

import { Root as Props } from "./page.types";

import getFilters from "./services/filters";
import getOpenState from "./services/open";
import getRestaurants from "./services/restaurants";

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

	const filterCards: FilterCardsType["filters"] = filterResponse.filters.map(
		(filter) => ({
			name: filter.name,
			value: filter.id,
			imageUrl: filter.image_url,
			category: FilterNames["Food"],
			isSelected: query[FilterNames["Food"]]?.includes(filter.id) ?? false,
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
				name: filter.name,
				value: filter.id,
				isSelected: query[FilterNames["Food"]]?.includes(filter.id) ?? false,
			})),
		},
		{
			title: "DELIVERY TIME",
			category: FilterNames["Time"],
			filterOptions: [
				{
					name: "0-10 min",
					value: "0,10",
					isSelected: query[FilterNames["Time"]]?.includes("0,10") ?? false,
				},
				{
					name: "10-30 min",
					value: "10,30",
					isSelected: query[FilterNames["Time"]]?.includes("10,30") ?? false,
				},
				{
					name: "30-60 min",
					value: "30,60",
					isSelected: query[FilterNames["Time"]]?.includes("30,60") ?? false,
				},
				{
					name: "1 hour+",
					value: "60,1200",
					isSelected: query[FilterNames["Time"]]?.includes("60,1200")
						? true
						: false,
				},
			],
		},
		{
			title: "PRICE RANGE",
			category: FilterNames["Price"],
			filterOptions: priceRanges.map((priceRange, index) => ({
				name: String(index),
				value: priceRange,
				isSelected: query[FilterNames["Price"]]?.includes(priceRange)
					? true
					: false,
			})),
		},
	];

	const normalizeQuery = (
		queryValue: string | string[] | undefined,
	): string[] =>
		typeof queryValue === "string" ? [queryValue] : queryValue || [];

	const foodFilters = normalizeQuery(query["food"]);
	const priceFilters = normalizeQuery(query["price"]);
	const timeFilters = normalizeQuery(query["time"]);

	const filteredRestaurants = restaurants.filter((restaurant) => {
		const matchesFood = foodFilters.length
			? foodFilters.some((filter) => restaurant.filterIds.includes(filter))
			: true;

		const matchesPrice = priceFilters.length
			? priceFilters.includes(restaurant.priceRangeId)
			: true;

		const matchesTime = timeFilters.length
			? timeFilters.some((timeRange) => {
					const [minTime, maxTime] = timeRange.split(",").map(Number);
					return (
						Number(restaurant.deliveryTime) >= minTime &&
						Number(restaurant.deliveryTime) <= maxTime
					);
			  })
			: true;

		return matchesFood && matchesPrice && matchesTime;
	});

	return (
		<div className={styles.root}>
			<div className={styles.left}>
				<Filters filterCategories={filters} />
			</div>
			<div className={styles.right}>
				<FilterCards filters={filterCards} />
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
