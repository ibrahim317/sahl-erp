import frappe

@frappe.whitelist()
def get_owner_by_phone(phone_number):
	owner = frappe.db.get_value("Unit Owner", {"phone": phone_number})
	print(owner)
	return owner
