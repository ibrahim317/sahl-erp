# Copyright (c) 2025, Softa Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class AddUnitRequest(Document):
	@frappe.whitelist()
	def approve(self):
		self.create_unit()
		self.save(ignore_permissions=True)

	@frappe.whitelist()
	def reject(self, reason=None):
		if not reason or str(reason).strip() == "":
			frappe.throw(_("Reason is required"))
		self.rejection_reason = str(reason)
		self.save(ignore_permissions=True)
		frappe.msgprint(_("Unit request rejected successfully."))

	def create_unit(self):
		if frappe.db.exists("Unit", self.name):
			frappe.throw(_("Unit already exists"))
		owner = None
		if not frappe.db.exists("Unit Owner", self.owner1):
			owner = self.create_owner()
		else:
			owner = frappe.get_doc("Unit Owner", self.owner1)
		unit = frappe.new_doc("Unit")
		unit.owner1 = owner.name

		unit.type = self.type if self.type else "Rent"
		unit.subcity = self.subcity if self.subcity else ""
		unit.features = self.features
		unit.floor = self.floor if self.floor else 0
		unit.model_number = self.model_number
		unit.city = self.city if self.city else ""
		unit.category = self.category if self.category else frappe.db.get_value("Unit Category", filters={}, fieldname="name")
		unit.bathrooms = self.bathrooms if self.bathrooms else 0
		unit.rooms = self.rooms if self.rooms else 0
		unit.elevators = self.elevators if self.elevators else 0
		unit.area = self.area if self.area else 0
		unit.building_status = self.building_status if self.building_status else "New"
		unit.entrance_type = self.entrance_type if self.entrance_type else "Standard"
		unit.finishing = self.finishing if self.finishing else "Normal"
		unit.street_view = self.street_view if self.street_view else "Main Street"
		unit.furnishing = self.furnishing
		unit.price = self.price if self.price else 0
		unit.rent_end_date = self.rent_end_date
		unit.has_furnishing = self.has_furnishing
		unit.main_image = self.main_image
		unit.street_name = self.street_name if self.street_name else ""
		unit.building_name = self.building_name if self.building_name else ""
		unit.apartment_number = self.apartment_number if self.apartment_number else ""
		unit.nearest_landmark = self.nearest_landmark if self.nearest_landmark else ""
		unit.nearest_main_street = self.nearest_main_street if self.nearest_main_street else ""
		unit.geolocation_vwpv = self.geolocation_vwpv if self.geolocation_vwpv else ""
		unit.unit_status = self.unit_status if self.unit_status else "Available"
		unit.unit_name_prefix = "R" if unit.type == "Rent" else "O"
		unit.data_search_employee = self.owner

		unit.save(ignore_permissions=True)

	def create_owner(self):
		temp_owner = frappe.get_doc("Temp Owner", self.owner1)
		owner = frappe.new_doc("Unit Owner")
		owner.name1 = temp_owner.name1
		owner.type = temp_owner.type
		owner.nationality = temp_owner.nationality
		owner.phone = temp_owner.phone
		owner.whatsapp = temp_owner.whatsapp
		owner.note = temp_owner.note
		for row in temp_owner.additional_phone_numbers:
			owner.append("additional_phone_numbers", {
				"phone": row.phone,
				"label": row.label,
			})
		owner.save(ignore_permissions=True)
		return owner


