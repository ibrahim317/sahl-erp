function handleOwnerPhoneChange(frm) {
    const fullPhoneNumberLength = 14;

    if (frm.doc.owner_phone && frm.doc.owner_phone.length >= fullPhoneNumberLength) {
        frappe.call({
            method: 'sahl_erp.sahl_pms.utils.get_owner_by_phone',
            args: {
                phone_number: frm.doc.owner_phone
            },
            callback: function(r) {
                if (r.message) {
                    frm.set_query('owner1', function() {
                        return {
                            filters: {
                                'phone': frm.doc.owner_phone
                            }
                        };
                    });
                    frm.set_value('owner1', r.message);
                } else {
                    frm.set_value('owner1', '');
                    if (frm.doc.owner_phone) {
                        frappe.show_alert({ message: __('Owner not found for this phone number.'), indicator: 'orange' });
                    }
                }
            }
        });
    } else {
        frm.set_value('owner1', '');
        frm.set_query('owner1', function() {
            return {
                filters: {
                    'name': 'SET_PHONE_NUMBER_FIRST'
                }
            };
        });
    }
}

function initializeOwnerLinkField(frm) {
    if (!frm.doc.owner_phone || frm.doc.owner_phone.length < 15) {
        frm.set_query('owner1', function() {
            return {
                filters: {
                    'name': 'SET_PHONE_NUMBER_FIRST'
                }
            };
        });
    }
}
