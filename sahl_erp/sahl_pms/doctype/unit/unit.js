// Copyright (c) 2025, Softa Solutions and contributors
// For license information, please see license.txt

// Note: `handleOwnerPhoneChange` and `initializeOwnerLinkField` are imported from `common_unit_scripts.js`.
// Make sure that file is included in the build.

const get_sub_city_query = (doc) => {
    return {
        filters: {
            city: doc.city
        }
    };
};

const toggle_owner_fields = (frm) => {
        if (frm.is_new()) {
            frm.set_df_property('owner1', 'hidden', 0); // Show field_name_1
            frm.set_df_property('owner_phone', 'hidden', 0); // Show field_name_2
        } else {
            frm.set_df_property('owner1', 'hidden', 1); // Hide field_name_1
            frm.set_df_property('owner_phone', 'hidden', 1); // Hide field_name_2
        }
}

function update_description(frm) {
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
		const features = doc.features.map(featureLink => __(featureLink.feature));
		description_parts.push(__("Features") + `: ${features.join(', ')}`);
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
            description_parts.push(__('Furnished'));
        }
    }

    if (doc.is_premium_unit) {
        description_parts.push(__('Premium Unit'));
    }

    frm.set_value('description', description_parts.join('\n'));
}

const DESCRIPTION_UPDATE_FIELDS = [
    'features', 'price', 'category', 'rooms', 'bathrooms', 'area', 'floor', 'elevators', 'street_view',
    'building_status', 'entrance_type', 'finishing', 'has_furnishing', 'furnishing', 'is_premium_unit'
];

const MAP_UPDATE_FIELDS = ['street_name', 'building_name'];

let unit_events = {
	refresh: function (frm) {
		frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
		toggle_owner_fields(frm);
		initializeOwnerLinkField(frm); // Call the common function
		update_description(frm);
	},
	owner_phone: function (frm) {
		handleOwnerPhoneChange(frm); // Call the common function
	},
	city: function (frm) {
		frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
		if (is_map_updating) return;
		update_map_from_address(frm);
		update_description(frm);
	},
	subcity: function (frm) {
		if (is_map_updating) return;
		update_map_from_address(frm);
		update_description(frm);
	},
	type: function (frm) {
		frm.set_value('unit_name_prefix', frm.doc.type.substring(0, 1));
		update_description(frm);
	},
};

MAP_UPDATE_FIELDS.forEach(field => {
    unit_events[field] = function(frm) {
        if (is_map_updating) return;
        update_map_from_address(frm);
    };
});

DESCRIPTION_UPDATE_FIELDS.forEach(field => {
    unit_events[field] = (frm) => update_description(frm);
});

frappe.ui.form.on('Unit', unit_events);

// A flag to prevent recursive updates
let is_map_updating = false;
let geocode_debounce = null;

function update_map_from_address(frm) {
    clearTimeout(geocode_debounce);
    geocode_debounce = setTimeout(() => {
        const { city, subcity, street_name, building_name } = frm.doc;

        if (!city || !subcity) return;

        // Construct the query parameters following Nominatim's structured format
        const params = new URLSearchParams({
            format: 'json',
			limit: 1,
			q: `${street_name} ${building_name} ${subcity} ${city}`
        });

        // Make the API call with structured parameters
        fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const geojson = {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "properties": {},
                            "geometry": { "type": "Point", "coordinates": [parseFloat(lon), parseFloat(lat)] }
                        }]
                    };

                    is_map_updating = true;
                    frm.set_value('geolocation_vwpv', JSON.stringify(geojson));

                    // center map
                    if (frm.fields_dict.geolocation_vwpv.map) {
                        frm.fields_dict.geolocation_vwpv.map.setView([lat, lon], 15);
                    }

                    setTimeout(() => { is_map_updating = false; }, 500);
                } else {
                    frappe.msgprint({
                        title: __('Location Not Found'),
                        message: __('No location found for the provided address. Please check the address details.'),
                        indicator: 'orange'
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching location:', error);
                frappe.msgprint({
                    title: __('Error'),
                    message: __('An error occurred while fetching the location. Please try again.'),
                    indicator: 'red'
                });
            });
    }, 2000);
}
