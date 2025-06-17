frappe.sahl_erp.add_unit_request = {};

frappe.sahl_erp.add_unit_request.DESCRIPTION_UPDATE_FIELDS = [
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

frappe.sahl_erp.add_unit_request.MAP_UPDATE_FIELDS = [
	"city",
	"subcity",
	"street_name",
	"building_name",
];

async function before_workflow_action(frm) {
	frappe.dom.unfreeze();
	// there are 3 actions
	// 1. send for review (do nothing)
	if (frm.selected_workflow_action === "Send For Review") {
		const send_for_review_promise = new Promise((resolve, reject) => {
			frappe.show_alert({
				message: __("Unit request sent for review."),
				indicator: "blue",
			});
			resolve();
		});
		await send_for_review_promise.catch(() => frappe.throw());
		return;
	}
	// 2. approve (create owner from temp owner and create unit from "add unit request")
	if (frm.selected_workflow_action === "Approve") {
		const create_unit_promise = new Promise((resolve, reject) => {
			frappe
				.call({
					doc: frm.doc,
					method: "approve",
				})
				.then((r) => {
					frappe.show_alert({
						message: __(
							"Unit request approved successfully, a new unit has been created."
						),
						indicator: "green",
					});
					resolve();
					frappe.set_route(["Form", "Unit", r.message]);
				})
				.catch(reject);
		});
		await create_unit_promise.catch(() => frappe.throw());
	}
	// 3. reject (show a dialog with the reason input field and reject button)
	if (frm.selected_workflow_action === "Reject") {
		let clicked_reject = false;
		const reject_promise = new Promise((resolve, reject) => {
			let dialog = new frappe.ui.Dialog({
				title: __("Reject Unit Request"),
				fields: [
					{
						label: __("Reason"),
						fieldname: "rejection_reason",
						fieldtype: "Small Text",
					},
				],
				size: "small", // small, large, extra-large
				primary_action_label: __("Reject"),
				primary_action(values) {
					clicked_reject = true;
					frappe
						.call({
							doc: frm.doc,
							method: "reject",
							args: {
								reason: values.rejection_reason,
							},
						})
						.then(() => {
							dialog.hide();
							resolve();
						})
						.catch(reject);
				},
			});
			dialog.show();
		});
		await reject_promise
			.then(() => {
				if (!clicked_reject) {
					frappe.throw();
				}
			})
			.catch(() => frappe.throw());
	}
}

frappe.sahl_erp.add_unit_request.add_unit_request_events = {
	refresh: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
		frm.fields_dict.owner1.get_query = frappe.sahl_erp.unit_utils.get_temp_owner_query;
	},
	city: function (frm) {
		frm.fields_dict.subcity.get_query = frappe.sahl_erp.unit_utils.get_sub_city_query; // Filter sub-cities by city
	},
	before_workflow_action,
};
frappe.sahl_erp.unit_utils.add_handlers_to_events(
	frappe.sahl_erp.add_unit_request.add_unit_request_events,
	frappe.sahl_erp.add_unit_request.MAP_UPDATE_FIELDS,
	frappe.sahl_erp.unit_utils.update_map_from_address
);
frappe.sahl_erp.unit_utils.add_handlers_to_events(
	frappe.sahl_erp.add_unit_request.add_unit_request_events,
	frappe.sahl_erp.add_unit_request.DESCRIPTION_UPDATE_FIELDS,
	frappe.sahl_erp.unit_utils.update_description
);

frappe.ui.form.on("Unit Addition Request", frappe.sahl_erp.add_unit_request.add_unit_request_events);
