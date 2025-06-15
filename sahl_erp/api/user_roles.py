import frappe

@frappe.whitelist()
def has_search_enabled():
    """Returns True if current user has any role with enable_search = 1"""
    user = frappe.session.user
    roles = frappe.get_roles(user)

    if not roles:
        return False

    count = frappe.db.count("Role", {
        "name": ["in", roles],
        "enable_search": 1
    })

    return bool(count)
