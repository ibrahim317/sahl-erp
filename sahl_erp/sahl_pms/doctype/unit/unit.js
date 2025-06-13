frappe.sahl_erp.unit = {};

/** @param {import("frappe").Form} frm */
const toggle_owner_fields = (frm) => {
	if (frm.is_new()) {
		frm.set_df_property('owner1', 'hidden', 0); // Show field_name_1
		frm.set_df_property('owner_phone', 'hidden', 0); // Show field_name_2
	} else {
		frm.set_df_property('owner1', 'hidden', 1); // Hide field_name_1
		frm.set_df_property('owner_phone', 'hidden', 1); // Hide field_name_2
	}
}
frappe.sahl_erp.unit.DESCRIPTION_UPDATE_FIELDS = [
	'refresh', 'features', 'type', 'subcity', 'city', 'price', 'category', 'rooms', 'bathrooms', 'area', 'floor', 'elevators', 'street_view',
	'building_status', 'entrance_type', 'finishing', 'has_furnishing', 'furnishing', 'is_premium_unit'
];

frappe.sahl_erp.unit.MAP_UPDATE_FIELDS = ['city', 'subcity', 'street_name', 'building_name'];

frappe.sahl_erp.unit.unit_events = {
	/** @param {import("frappe").Form} frm */
	refresh: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
		toggle_owner_fields(frm);
		frappe.sahl_erp.unit_utils.initialize_owner_link_field(frm); // Call the common function
	},
	/** @param {import("frappe").Form} frm */
	owner_phone: function (frm) {
		frappe.sahl_erp.unit_utils.handle_owner_phone_change(frm); // Call the common function
	},
	/** @param {import("frappe").Form} frm */
	city: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
	},
	/** @param {import("frappe").Form} frm */
	type: function (frm) {
		frm.set_value('unit_name_prefix', frm.doc.type?.substring(0, 1) ?? '');
	},
};

frappe.sahl_erp.unit_utils.add_handlers_to_events(frappe.sahl_erp.unit.unit_events, frappe.sahl_erp.unit.DESCRIPTION_UPDATE_FIELDS, frappe.sahl_erp.unit_utils.update_description);
frappe.sahl_erp.unit_utils.add_handlers_to_events(frappe.sahl_erp.unit.unit_events,
	frappe.sahl_erp.unit.MAP_UPDATE_FIELDS, frappe.sahl_erp.unit_utils.update_map_from_address);

frappe.ui.form.on('Unit', frappe.sahl_erp.unit.unit_events);
