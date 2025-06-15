def execute():
    from frappe.custom.doctype.custom_field.custom_field import create_custom_field

    create_custom_field("Role", {
        "fieldname": "enable_search",
        "label": "Enable Search",
        "fieldtype": "Check",
        "insert_after": "desk_access",
        "default": 1,
    })
