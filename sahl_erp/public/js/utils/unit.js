frappe.sahl_erp = frappe.sahl_erp || {};

frappe.sahl_erp.unit_utils = {};

// --------------------- queries ---------------------
frappe.sahl_erp.unit_utils.get_owner_query = function () {
	return {
		query: "sahl_erp.sahl_pms.utils.get_owner_by_phone_query",
	};
};

frappe.sahl_erp.unit_utils.get_temp_owner_query = function () {
	return {
		query: "sahl_erp.sahl_pms.utils.get_temp_owner_by_phone_query",
	};
};

frappe.sahl_erp.unit_utils.get_sub_city_query = function (doc) {
	return {
		filters: {
			city: doc.city,
		},
	};
};

// --------------------- handlers ---------------------
frappe.sahl_erp.unit_utils.update_owner = function (frm) {
	frm.fields_dict.owner1.get_query = frappe.sahl_erp.unit_utils.get_owner_query;
	if (frm.is_new()) {
		frm.set_df_property("owner1", "hidden", 0);
		frm.set_df_property("owner1", "reqd", 1);
	}
};

frappe.sahl_erp.unit_utils.update_temp_owner = function (frm) {
	frm.fields_dict.owner1.get_query = frappe.sahl_erp.unit_utils.get_temp_owner_query;
};

frappe.sahl_erp.unit_utils.update_subcity = function (frm) {
	frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
};

frappe.sahl_erp.unit_utils.update_unit_name_prefix = function (frm) {
	frm.set_value("unit_name_prefix", frm.doc.type?.substring(0, 1) ?? "");
};
frappe.sahl_erp.unit_utils.update_description = function (frm) {
	const doc = frm.doc;
	let description_parts = [];

	if (doc.type) {
		description_parts.push(doc.type === "Rent" ? __("For Rent") : __("For Ownership"));
	}

	if (doc.city) {
		let location = doc.city;
		if (doc.subcity) {
			location += `, ${doc.subcity}`;
		}
		description_parts.push(location);
	}

	if (doc.price) {
		description_parts.push(__("Price") + `: ${doc.price.toLocaleString()}`);
	}

	if (doc.category) {
		description_parts.push(__("Category") + `: ${doc.category}`);
	}

	if (doc.rooms) {
		description_parts.push(__("Rooms") + `: ${doc.rooms}`);
	}

	if (doc.bathrooms) {
		description_parts.push(__("Bathrooms") + `: ${doc.bathrooms}`);
	}

	if (doc.area) {
		description_parts.push(__("Area") + `: ${doc.area} m²`);
	}

	if (doc.features && doc.features.length > 0) {
		const features = doc.features.map((featureLink) => __(featureLink.feature));
		description_parts.push(__("Features") + `: ${features.join(", ")}`);
	}

	if (doc.floor) {
		description_parts.push(__("Floor") + `: ${doc.floor}`);
	}

	if (doc.elevators) {
		description_parts.push(__("Elevators") + `: ${doc.elevators}`);
	}

	if (doc.street_view) {
		description_parts.push(__(doc.street_view));
	}

	if (doc.building_status) {
		description_parts.push(`${__(doc.building_status)}` + " " + __("building"));
	}

	if (doc.entrance_type) {
		description_parts.push(`${__(doc.entrance_type)}` + " " + __("entrance"));
	}

	if (doc.finishing) {
		description_parts.push(__("Finishing") + `: ${__(doc.finishing)}`);
	}

	if (doc.has_furnishing) {
		if (doc.furnishing) {
			description_parts.push(__("Furnished") + `: ${__(doc.furnishing)}`);
		} else {
			description_parts.push(__("Furnished"));
		}
	}

	if (doc.is_premium_unit) {
		description_parts.push(__("Premium Unit"));
	}

	frm.set_value("description", description_parts.join("\n"));
};

const update_map_variables = {
	is_map_updating: false,
	geocode_debounce: null,
};

frappe.sahl_erp.unit_utils.update_map_from_address = function (frm) {
	if (update_map_variables.is_map_updating) return;
	clearTimeout(update_map_variables.geocode_debounce);
	update_map_variables.geocode_debounce = setTimeout(() => {
		const { city, subcity, street_name, building_name } = frm.doc;

		if (!city || !subcity) return;

		// Construct the query parameters following Nominatim's structured format
		const params = new URLSearchParams({
			format: "json",
			limit: "1", // Convert to string to fix type error
			q: `${street_name} ${building_name} ${subcity} ${city}`,
		});

		// Make the API call with structured parameters
		fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
			.then((res) => res.json())
			.then((data) => {
				if (data && data.length > 0) {
					const { lat, lon } = data[0];
					const geojson = {
						type: "FeatureCollection",
						features: [
							{
								type: "Feature",
								properties: {},
								geometry: {
									type: "Point",
									coordinates: [parseFloat(lon), parseFloat(lat)],
								},
							},
						],
					};

					update_map_variables.is_map_updating = true;
					frm.set_value("geolocation_vwpv", JSON.stringify(geojson));

					// center map
					if (frm.fields_dict.geolocation_vwpv.map) {
						frm.fields_dict.geolocation_vwpv.map.setView([lat, lon], 15);
					}

					setTimeout(() => {
						update_map_variables.is_map_updating = false;
					}, 500);
				} else {
					frappe.show_alert({
						message: __(
							"No location found for the provided address. Please check the address details. Or try to use the map to select the location."
						),
						indicator: "orange",
					});
				}
			})
			.catch((error) => {
				console.error("Error fetching location:", error);
				frappe.msgprint({
					title: __("Error"),
					message: __(
						"An error occurred while fetching the location. Please try again."
					),
					indicator: "red",
				});
			});
	}, 2000);
};
