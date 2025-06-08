// Copyright (c) 2025, Softa Solutions and contributors
// For license information, please see license.txt

const get_sub_city_query = (doc) => {
    return {
        filters: {
            city: doc.city
        }
    };
};

frappe.ui.form.on('Investment Unit', {
    owner_phone: function(frm) {
        handleOwnerPhoneChange(frm); // Call the common function
    },
    city: function(frm) {
        frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
    },
    refresh: function(frm) {
        frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
        initializeOwnerLinkField(frm); // Call the common function
        frm.fields_dict.subcity.get_query = get_sub_city_query; // Filter sub-cities by city
    }
});
