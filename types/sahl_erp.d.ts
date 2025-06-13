declare module "sahl_erp" {
    interface Unit {
        type: "Rent" | "Ownership";
        subcity: string;
        features: string[];
        floor: number;
        model_number: number;
        owner1: string;
        city: string;
        category: string;
        bathrooms: string;
        rooms: number;
        elevators: number;
        area: number;
        building_status: "New" | "Old";
        entrance_type: "Hotel" | "Standard";
        finishing: "Ultar Luxury" | "Super Luxury" | "Luxury" | "Normal" | "Not Finished";
        street_view: "Main Street" | "Side Street";
        furnishing?: "Modern" | "Normal";
        price: number;
        status: "Available" | "Rented" | "Not Available";
        description?: string;
        street_name: string;
        building_name: string;
        apartment_number?: string;
        nearest_landmark?: string;
        geolocation_vwpv: string;
        need_initial_inspection: boolean;
        is_premium_unit: boolean;
        rent_end_date?: string;
        has_furnishing: boolean;
        owner_phone?: string;
        location_employee?: string;
        main_image?: string;
        nearest_main_street?: string;
        unit_name_prefix?: string;
    }
}
