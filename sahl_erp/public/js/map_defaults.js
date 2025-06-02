const map_settings = frappe.provide("frappe.utils.map_defaults");

// Center and zoomlevel can be copied from the URL of
// the map view at openstreetmap.org.

map_settings.center = [31.028580, 29.880260];
// new zoomlevel: see the whole country, not just a single city
map_settings.zoom = 9;