# Copyright (c) 2025, Softa Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _


class Unit(Document):
    def track_view_log(self, unit_owner):
        view_log = frappe.new_doc("View Log")
        view_log.reference_doctype = "Unit Owner"
        view_log.reference_name = unit_owner.name
        view_log.viewed_by = frappe.session.user
        view_log.save()

    @frappe.whitelist()
    def open_unit_owners_data(self):
        if not self.has_owner_access():
            frappe.throw(
                _(
                    "You don't have access to this unit, please request for access first"
                )
            )
        unit_owner = frappe.get_doc("Unit Owner", self.owner1)
        self.track_view_log(unit_owner)
        return unit_owner

    @frappe.whitelist()
    def owner_access_still_pending(self):
        return frappe.db.exists(
            "Unit Owner Access Permission",
            {
                "unit": self.name,
                "requested_by": frappe.session.user,
                "workflow_state": "Pending",
            },
        )

    @frappe.whitelist()
    def request_unit_owner_access_permission(self):
        if self.has_owner_access():
            frappe.throw(
                _( "You already have access to this unit, please wait for the approval" )
            )
        unit_owner_access_permission = frappe.new_doc("Unit Owner Access Permission")
        unit_owner_access_permission.unit = self.name
        unit_owner_access_permission.requested_by = frappe.session.user
        unit_owner_access_permission.owner1 = self.owner1
        unit_owner_access_permission.save()
        frappe.msgprint(
            _(
                "Unit owner access permission requested successfully, once approved you will be able to view the unit owners data"
            ),
            indicator="green",
        )

    @frappe.whitelist()
    def has_owner_access(self):
        return frappe.db.exists(
            "Unit Owner Access Permission",
            {
                "unit": self.name,
                "requested_by": frappe.session.user,
                "owner1": self.owner1,
                "workflow_state": "Approved",
            },
        ) or self.workflow_state == "Draft"
