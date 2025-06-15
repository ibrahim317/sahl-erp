frappe.sahl_erp.unit = {};

frappe.sahl_erp.unit.has_owner_access = async (frm) => {
	return frappe.call({
		doc: frm.doc,
		method: "has_owner_access",
	});
};

frappe.sahl_erp.unit.owner_access_still_pending = async (frm) => {
	return frappe.call({
		doc: frm.doc,
		method: "owner_access_still_pending",
	});
};


const toggle_owner_fields = async (frm) => {
	const showField = (field) => {
		frm.set_df_property(field, "hidden", 0);
	};
	if (frm.is_new()) {
		frm.set_df_property("owner1", "hidden", 0);
		frm.set_df_property("owner1", "reqd", 1);
	} else {
		const hasAccess = await frappe.sahl_erp.unit.has_owner_access(frm);
		const isAccessPending = await frappe.sahl_erp.unit.owner_access_still_pending(frm);
		const state = frm.doc.workflow_state;

		const showOwnersData = state === "Draft" || (state === "Completed" && hasAccess.message);

		if (showOwnersData) {
			showField("open_unit_owners_data");
		} else if (isAccessPending) {
			showField("approval_for_owner_access_permission_is_still_pending");
			// diable clicking on button with this attribute 	data-fieldname="owner_access_permission_is_still_pending_for_approval" using pure js
			setTimeout(() => {
				const $button = $('[data-fieldname="approval_for_owner_access_permission_is_still_pending"]');
				if ($button.length) {
					$button.prop('disabled', true);
					$button.attr('title', 'Approval is still pending');
				}
			}, 0);
		} else {
			showField("request_unit_owner_access_permission");
		}
	}
};

const open_unit_owners_data = async (frm) => {
	return frappe
		.call({
			doc: frm.doc,
			method: "open_unit_owners_data",
		})
		.then((r) => {
			const dialog = new frappe.ui.Dialog({
				title: "Unit Owner Details",
				fields: [
					{ fieldname: "name1", fieldtype: "Data", label: "Name", read_only: 1 },
					{ fieldname: "phone", fieldtype: "Data", label: "Phone", read_only: 1 },
					{ fieldname: "type", fieldtype: "Data", label: "Type", read_only: 1 },
					{ fieldname: "whatsapp", fieldtype: "Data", label: "Whatsapp", read_only: 1 },
					{ fieldname: "note", fieldtype: "Data", label: "Note", read_only: 1 },
				],
				primary_action_label: "Close",
				primary_action() {
					dialog.hide();
				},
			});

			dialog.set_values({
				name1: r.message.name1,
				phone: r.message.phone,
				type: r.message.type,
				whatsapp: r.message.whatsapp,
				note: r.message.note,
			});

			dialog.show();
		});
};

const request_unit_owner_access_permission = async (frm) => {
	return frappe.call({
		doc: frm.doc,
		method: "request_unit_owner_access_permission",
	});
};

frappe.sahl_erp.unit.DESCRIPTION_UPDATE_FIELDS = [
	"refresh",
	"features",
	"type",
	"subcity",
	"city",
	"price",
	"category",
	"rooms",
	"bathrooms",
	"area",
	"floor",
	"elevators",
	"street_view",
	"building_status",
	"entrance_type",
	"finishing",
	"has_furnishing",
	"furnishing",
	"is_premium_unit",
];

frappe.sahl_erp.unit.MAP_UPDATE_FIELDS = ["city", "subcity", "street_name", "building_name"];

frappe.sahl_erp.unit.unit_events = {
	refresh: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
		frm.fields_dict.owner1.get_query = frappe.sahl_erp.unit_utils.get_owner_query;
		toggle_owner_fields(frm);
	},
	city: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
	},
	type: function (frm) {
		frm.set_value("unit_name_prefix", frm.doc.type?.substring(0, 1) ?? "");
	},
	request_unit_owner_access_permission,
	open_unit_owners_data,
};

frappe.sahl_erp.unit_utils.add_handlers_to_events(
	frappe.sahl_erp.unit.unit_events,
	frappe.sahl_erp.unit.DESCRIPTION_UPDATE_FIELDS,
	frappe.sahl_erp.unit_utils.update_description
);
frappe.sahl_erp.unit_utils.add_handlers_to_events(
	frappe.sahl_erp.unit.unit_events,
	frappe.sahl_erp.unit.MAP_UPDATE_FIELDS,
	frappe.sahl_erp.unit_utils.update_map_from_address
);

frappe.ui.form.on("Unit", frappe.sahl_erp.unit.unit_events);
