frappe.sahl_erp.unit = {};

// --------------------- events ---------------------
frappe.sahl_erp.unit.MAP_UPDATE_FIELDS = ["city", "subcity", "street_name", "building_name"];
frappe.sahl_erp.unit.SUBCITY_UPDATE_FIELDS = ["refresh", "subcity"];
frappe.sahl_erp.unit.TYPE_FIELD_UPDATED = ["type"];
frappe.sahl_erp.unit.PAGE_REFRESHED = ["refresh"];
frappe.sahl_erp.unit.DESCRIPTION_FIELDS_UPDATED = [
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

// --------------------- handlers ---------------------
const unit_handler_definitions = [
	{
		handler: frappe.sahl_erp.unit_utils.update_unit_name_prefix,
		events: frappe.sahl_erp.unit.TYPE_FIELD_UPDATED,
	},
	{
		handler: frappe.sahl_erp.unit_utils.update_description,
		events: frappe.sahl_erp.unit.DESCRIPTION_FIELDS_UPDATED,
	},
	{
		handler: frappe.sahl_erp.unit_utils.update_owner,
		events: frappe.sahl_erp.unit.PAGE_REFRESHED,
	},
	{
		handler: frappe.sahl_erp.unit_utils.update_subcity,
		events: frappe.sahl_erp.unit.SUBCITY_UPDATE_FIELDS,
	},
	{
		handler: frappe.sahl_erp.unit_utils.update_map_from_address,
		events: frappe.sahl_erp.unit.MAP_UPDATE_FIELDS,
	},
];

const unit_events = frappe.sahl_erp.events_utils.build_event_handlers(unit_handler_definitions);

frappe.ui.form.on("Unit", unit_events);
