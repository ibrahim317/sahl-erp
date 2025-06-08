// Copyright (c) 2025, Softa Solutions and contributors
// For license information, please see license.txt
const get_sub_city_query = (doc) => {
    return {
        filters: {
            city: doc.city
        }
    };
};

frappe.ui.form.on('Unit', {
    owner_phone: function(frm) {
        handleOwnerPhoneChange(frm); // Call the common function
    },
    refresh: function(frm) {
        initializeOwnerLinkField(frm); // Call the common function
        frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
    },
    city: function(frm) {
		frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
        if (is_map_updating) return;
        update_map_from_address(frm);
    },
    subcity: function(frm) {
        if (is_map_updating) return;
        update_map_from_address(frm);
    },
    street_name: function(frm) {
        if (is_map_updating) return;
        update_map_from_address(frm);
    },
    building_name: function(frm) {
        if (is_map_updating) return;
        update_map_from_address(frm);
    }
});

// A flag to prevent recursive updates
let is_map_updating = false;
let geocode_debounce = null;

function update_map_from_address(frm) {
    clearTimeout(geocode_debounce);
    geocode_debounce = setTimeout(() => {
        const { city, subcity, street_name, building_name } = frm.doc;

        if (!city && !subcity) return;

        // Construct the query parameters following Nominatim's structured format
        const params = new URLSearchParams({
            format: 'json',
            limit: '1',
            country: 'مصر', // Adding country to improve accuracy
            state: city || '', // city field represents state in your case
            city: subcity || '', // subcity field represents city in your case
        });

        // Only add street if both street_name and building_name are present
        if (street_name) {
            let street = street_name;
            if (building_name) {
                street += ` ${building_name}`;
            }
            params.append('street', street);
        }

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
                        frm.fields_dict.geolocation_vwpv.map.setView([lat, lon], 8);
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
    }, 1000);
}
