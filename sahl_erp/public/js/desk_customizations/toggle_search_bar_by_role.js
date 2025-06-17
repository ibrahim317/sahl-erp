
// disable search for special roles
frappe.call({
    method: "sahl_erp.api.user_roles.has_search_enabled",
    callback: function (r) {
        if (r.message === false) {
            $('form[role="search"]').hide(); // or .remove()
        }
    },
    error: function (error) {
        console.error('Error checking search enabled:', error);
    }
});
