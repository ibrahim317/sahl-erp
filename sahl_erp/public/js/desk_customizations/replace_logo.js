function addCustomLogo() {
	// Check if our custom logo has already been added
	if (document.getElementById("custom-sahl-logo")) {
		return;
	}

	// Find the container where the logo should be added.
	const logoContainer = document.querySelector("a.app-switcher-dropdown");

	// Proceed only if we found the container
	if (logoContainer) {
		// Create our new logo block element
		const newLogoBlock = document.createElement("div");
		newLogoBlock.id = "custom-sahl-logo";
		newLogoBlock.className = "standard-sidebar-item";

		newLogoBlock.innerHTML = `
        <a class="d-flex custom-logo-block" href="/app/erp-home">
            <div class="sahl-logo-container">
                <img class="sahl-logo" src="/assets/sahl_erp/images/sahl-logo.png" alt="Sahl ERP Logo" style="width: 34px; height: 34px;">
            </div>
            <div class="sahl-app-title" style="margin-left: 10px; margin-top: 1px;">Sahl ERP</div>
        </a>
        <div class="sidebar-item-control">
            <button class="btn-reset drop-icon show-in-edit-mode">
                <svg class="es-icon es-line icon-sm" style="display: block;margin:auto;" aria-hidden="true">
                    <use class="" href="#es-line-down"></use>
                </svg>
            </button>
        </div>
    `;

		// Prepend our new logo to the container, so it appears at the top.
		logoContainer.prepend(newLogoBlock);
	}
}

// Wait for Frappe's "app_ready" event to ensure the framework is loaded.
$(document).on("app_ready", () => {
	// Run the function once on initial load.
	addCustomLogo();

	// Create a MutationObserver to watch for changes to the DOM.
	const observer = new MutationObserver((mutations) => {
		addCustomLogo();
	});

	// Start observing the entire document body.
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
});
