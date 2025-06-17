def execute():
    from frappe.custom.doctype.custom_field.custom_field import create_custom_field

    create_custom_field("Workspace", {
        "fieldname": "category",
        "label": "Category",
        "fieldtype": "Link",
        "options": "Workspace Category",
        "insert_after": "is_hidden",
    })
