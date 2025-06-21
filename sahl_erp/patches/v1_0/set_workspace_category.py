import frappe

def execute():
    from frappe.custom.doctype.custom_field.custom_field import create_custom_field

    create_custom_field("Workspace", {
        "fieldname": "category",
        "label": "Category",
        "fieldtype": "Link",
        "options": "Workspace Category",
        "insert_after": "is_hidden",
    })

    # set the category for the workspaces
    frappe.db.set_value("Workspace", "Home", "category", "Management")
    frappe.db.set_value("Workspace", "Settings", "category", "Management")
    frappe.db.set_value("Workspace", "Units Management", "category", "Management")
    frappe.db.set_value("Workspace", "Reports", "category", "Management")
    frappe.db.set_value("Workspace", "Raven", "category", "Management")
    frappe.db.set_value("Workspace", "Users", "category", "Management")
    frappe.db.set_value("Workspace", "Users", "app", "sahl_erp")
    frappe.db.set_value("Workspace", "Users", "type", "Workspace")

    frappe.db.set_value("Workspace", "Students Sales", "category", "Student Services")
    frappe.db.set_value("Workspace", "Student Affairs Coordinator", "category", "Student Services")
    frappe.db.set_value("Workspace", "Student Search", "category", "Student Services")


    frappe.db.set_value("Workspace", "Data Entry", "category", "Data")
    frappe.db.set_value("Workspace", "Data Search", "category", "Data")
    frappe.db.set_value("Workspace", "Data Check", "category", "Data")

    frappe.db.set_value("Workspace", "Accounting", "category", "Accounts")
    frappe.db.set_value("Workspace", "Receivables", "category", "Accounts")
    frappe.db.set_value("Workspace", "Payables", "category", "Accounts")
    frappe.db.set_value("Workspace", "Financial Reports", "category", "Accounts")
    frappe.db.set_value("Workspace", "Salary Payout", "category", "Accounts")
    frappe.db.set_value("Workspace", "Expense Claims", "category", "Accounts")
    frappe.db.set_value("Workspace", "Tax & Benefits", "category", "Accounts")
    frappe.db.set_value("Workspace", "Selling", "category", "Accounts")
    frappe.db.set_value("Workspace", "Buying", "category", "Accounts")

    frappe.db.set_value("Workspace", "CRM", "category", "Sales")
    frappe.db.set_value("Workspace", "CRM", "app", "sahl_erp")
    frappe.db.set_value("Workspace", "CRM", "type", "Workspace")

    frappe.db.set_value("Workspace", "HR Overview", "category", "HR")
    frappe.db.set_value("Workspace", "Employee Lifecycle", "category", "HR")
    frappe.db.set_value("Workspace", "Recruitment", "category", "HR")
    frappe.db.set_value("Workspace", "Shift & Attendance", "category", "HR")
    frappe.db.set_value("Workspace", "Leaves", "category", "HR")

	#hide unused workspaces
    frappe.db.set_value("Workspace", "Overview", "is_hidden", 1)
    frappe.db.set_value("Workspace", "Manufacturing", "is_hidden", 1)
    frappe.db.set_value("Workspace", "Quality", "is_hidden", 1)
    frappe.db.set_value("Workspace", "Stock", "is_hidden", 1)
    frappe.db.set_value("Workspace", "Assets", "is_hidden", 1)
    frappe.db.set_value("Workspace", "Performance", "is_hidden", 1)


