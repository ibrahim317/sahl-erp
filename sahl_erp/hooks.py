import frappe

app_name = "sahl_erp"
app_title = "Sahl Erp"
app_publisher = "Softa Solutions"
app_description = "Integrated ERP system for Sahl, serve both real estate and students."
app_email = "support@softa-solutions.com"
app_license = "mit"

# Apps
# ------------------

required_apps = ["frappe/erpnext", "frappe/hrms"]

# Each item in the list will be shown as an app in the apps page
add_to_apps_screen = [
    {
        "name": "sahl_erp",
        "logo": "/assets/sahl_erp/images/sahl-logo.png",
        "title": "Sahl Erp",
        "route": "/app/erp-home",
        # "has_permission": "sahl_erp.api.permission.has_app_permission"
    }
]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_js = [
    "/assets/sahl_erp/js/map_defaults.js",
	"/assets/sahl_erp/js/utils/unit.js",
    "/assets/sahl_erp/js/desk_customizations/disable_listview_sidebar_by_defualt.js",
	"/assets/sahl_erp/js/desk_customizations/toggle_search_bar_by_role.js",
	"/assets/sahl_erp/js/patches/sidebar.js",
	"/assets/sahl_erp/js/patches/kanban.js",
]

app_include_css = [
    "/assets/sahl_erp/css/override_desk_components/sidebar.css",
    "/assets/sahl_erp/css/override_desk_components/workspace.css",
    "/assets/sahl_erp/css/override_desk_components/phone_field.css",
    "/assets/sahl_erp/css/arabic_font.css",
]

# include js, css files in header of web template
# web_include_css = "/assets/sahl_erp/css/sahl_erp.css"
# web_include_js = "/assets/sahl_erp/js/sahl_erp.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sahl_erp/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "sahl_erp/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
home_page = "/app/erp-home"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "sahl_erp.utils.jinja_methods",
# 	"filters": "sahl_erp.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "sahl_erp.install.before_install"
# after_install = "sahl_erp.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "sahl_erp.uninstall.before_uninstall"
# after_uninstall = "sahl_erp.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "sahl_erp.utils.before_app_install"
# after_app_install = "sahl_erp.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "sahl_erp.utils.before_app_uninstall"
# after_app_uninstall = "sahl_erp.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sahl_erp.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sahl_erp.tasks.all"
# 	],
# 	"daily": [
# 		"sahl_erp.tasks.daily"
# 	],
# 	"hourly": [
# 		"sahl_erp.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sahl_erp.tasks.weekly"
# 	],
# 	"monthly": [
# 		"sahl_erp.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "sahl_erp.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "sahl_erp.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "sahl_erp.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sahl_erp.utils.before_request"]
# after_request = ["sahl_erp.utils.after_request"]

# Job Events
# ----------
# before_job = ["sahl_erp.utils.before_job"]
# after_job = ["sahl_erp.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"sahl_erp.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
website_context = {
	"favicon": "/assets/sahl_erp/images/favicon.ico",
	"splash_image": "/assets/sahl_erp/images/sahl-logo.png",
}

fixtures = [
    # To export specific documents from a DocType, use a dictionary with filters.
    # This is the recommended approach.
    # Exporting specific Roles
    {"doctype": "Role", "filters": [["name", "in", ["Data Entry", "Data Search", "Data Check"]]]},
    # 2. Export the permissions for those roles from DocPerm
    # This is the crucial missing piece.
    {"doctype": "DocPerm", "filters": [["role", "in", ["Data Entry", "Data Search", "Data Check"]]]},
    # 3. (Recommended) Export any permissions for custom doctypes
    {
        "doctype": "Custom DocPerm",
        "filters": [["role", "in", ["Data Entry", "Data Search", "Data Check"]]],
    },
    # Exporting a specific Workflow
    {"doctype": "Workflow"},
    {"doctype": "Workflow State"},
    {"doctype": "Workflow Action Master"},
]
