import frappe
from json import loads, JSONDecodeError
from frappe import _
from frappe.desk.desktop import Workspace

@frappe.whitelist()
def get_workspace_sidebar_items():
	"""Get list of sidebar items for desk"""

	from frappe.modules.utils import get_module_app

	has_access = "Workspace Manager" in frappe.get_roles()

	# don't get domain restricted pages
	blocked_modules = frappe.get_cached_doc("User", frappe.session.user).get_blocked_modules()
	blocked_modules.append("Dummy Module")

	# adding None to allowed_domains to include pages without domain restriction
	allowed_domains = [None, *frappe.get_active_domains()]

	filters = {
		"restrict_to_domain": ["in", allowed_domains],
		"module": ["not in", blocked_modules],
	}

	if has_access:
		filters = []

	# pages sorted based on sequence id
	order_by = "sequence_id asc"
	fields = [
		"name",
		"title",
		"for_user",
		"parent_page",
		"content",
		"public",
		"module",
		"icon",
		"indicator_color",
		"is_hidden",
		"app",
		"type",
		"link_type",
		"link_to",
		"external_link",
		"category"
	]
	all_pages = frappe.get_all(
		"Workspace", fields=fields, filters=filters, order_by=order_by, ignore_permissions=True
	)
	pages = []
	private_pages = []

	# get additional settings from Work Settings
	try:
		workspace_visibilty = loads(
			frappe.db.get_single_value("Workspace Settings", "workspace_visibility_json") or "{}"
		)
	except JSONDecodeError:
		workspace_visibilty = {}

	# Filter Page based on Permission
	for page in all_pages:
		try:
			workspace = Workspace(page, True)
			if has_access or workspace.is_permitted():
				if page.public and (has_access or not page.is_hidden) and page.title != "Welcome Workspace":
					pages.append(page)
				elif page.for_user == frappe.session.user:
					private_pages.append(page)
				page["label"] = _(page.get("name"))

			if page["name"] in workspace_visibilty:
				page["visibility"] = workspace_visibilty[page["name"]]

			if not page["app"] and page["module"]:
				page["app"] = frappe.db.get_value("Module Def", page["module"], "app_name") or get_module_app(
					page["module"]
				)
			if page["link_type"] == "Report":
				report_type, ref_doctype = frappe.db.get_value(
					"Report", page["link_to"], ["report_type", "ref_doctype"]
				)
				page["report"] = {
					"report_type": report_type,
					"ref_doctype": ref_doctype,
				}

		except frappe.PermissionError:
			pass
	if private_pages:
		pages.extend(private_pages)

	if len(pages) == 0:
		pages.append(next((x for x in all_pages if x["title"] == "Welcome Workspace"), None))

	return {
		"workspace_setup_completed": frappe.db.get_single_value(
			"Workspace Settings", "workspace_setup_completed"
		),
		"pages": pages,
		"has_access": has_access,
		"has_create_access": frappe.has_permission(doctype="Workspace", ptype="create"),
	}


frappe.desk.desktop.get_workspace_sidebar_items = get_workspace_sidebar_items
