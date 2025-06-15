import frappe

@frappe.whitelist()
def get_owner_by_phone(phone_number):
	owner = frappe.db.get_value("Unit Owner", {"phone": phone_number})
	print(owner)
	return owner

@frappe.whitelist()
def get_owner_by_phone_query(doctype, txt, searchfield, start, page_len, filters):
	# I want to search by the given phone or remove the first digit and add +20- to the start
   possiable_phones = [txt, f"+20-{txt[1:]}"]
   return frappe.db.sql("""
        SELECT name, phone
        FROM `tabUnit Owner`
        WHERE phone IN %(possiable_phones)s
        ORDER BY name LIMIT 1
    """, {
        'possiable_phones': possiable_phones
    })


@frappe.whitelist()
def get_temp_owner_by_phone_query(doctype, txt, searchfield, start, page_len, filters):
   possiable_phones = [txt, f"+20-{txt[1:]}"]
   return frappe.db.sql("""
        SELECT name, phone
        FROM `tabTemp Owner`
        WHERE phone IN %(possiable_phones)s
        ORDER BY name LIMIT 1
    """, {
        'possiable_phones': possiable_phones
    })

