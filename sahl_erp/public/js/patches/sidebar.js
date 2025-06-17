const original_Sidebar_class = frappe.ui.Sidebar;
frappe.ui.Sidebar = class Sidebar extends original_Sidebar_class {
	make_sidebar() {
		if (this.wrapper.find(".standard-sidebar-section")[0]) {
			this.wrapper.find(".standard-sidebar-section").remove();
		}

		let app_workspaces = frappe.boot.app_data_map[frappe.current_app || "frappe"].workspaces;

		let parent_pages = this.all_pages.filter((p) => !p.parent_page).uniqBy((p) => p.name);
		if (frappe.current_app === "private") {
			parent_pages = parent_pages.filter((p) => !p.public);
		} else {
			parent_pages = parent_pages.filter((p) => p.public && app_workspaces.includes(p.name));
		}

		const page_groups = {};
		parent_pages.forEach((p) => {
			const category = p.category || __("General");
			if (!page_groups[category]) {
				page_groups[category] = [];
			}
			page_groups[category].push(p);
		});

		const categories = Object.keys(page_groups).sort((a, b) => {
			if (a === __("General")) return -1;
			if (b === __("General")) return 1;
			return a.localeCompare(b);
		});

		categories.forEach((category) => {
			this.build_sidebar_section(category, page_groups[category]);
		});

		this.setup_collapsible_sections();

		// Scroll sidebar to selected page if it is not in viewport.
		this.wrapper.find(".selected").length &&
			!frappe.dom.is_element_in_viewport(this.wrapper.find(".selected")) &&
			this.wrapper.find(".selected")[0].scrollIntoView();

		this.setup_sorting();
		this.set_active_workspace_item();
		this.set_hover();
	}

			setup_collapsible_sections() {
		// Load saved states first
		this.load_sidebar_states();

		this.wrapper.find(".standard-sidebar-section > summary").off("click").on("click", (e) => {
			e.preventDefault();
			const details = e.currentTarget.parentElement;
			const sectionTitle = details.getAttribute("data-title");

			if (details.hasAttribute("open")) {
				// Closing animation
				details.classList.add("closing");
				this.save_sidebar_state(sectionTitle, false);

				// Wait for animation to complete before removing open attribute
				setTimeout(() => {
					details.removeAttribute("open");
					details.classList.remove("closing");
				}, 340); // Match the transition duration
			} else {
				// Opening animation
				details.setAttribute("open", "");
				this.save_sidebar_state(sectionTitle, true);
			}
		});
	}

	save_sidebar_state(sectionTitle, isOpen) {
		try {
			let savedStates = JSON.parse(localStorage.getItem("sidebar_section_states") || "{}");
			savedStates[sectionTitle] = isOpen;
			localStorage.setItem("sidebar_section_states", JSON.stringify(savedStates));
		} catch (error) {
			console.warn("Failed to save sidebar state:", error);
		}
	}

	load_sidebar_states() {
		try {
			const savedStates = JSON.parse(localStorage.getItem("sidebar_section_states") || "{}");

			this.wrapper.find(".standard-sidebar-section").each((index, section) => {
				const sectionTitle = section.getAttribute("data-title");
				if (savedStates.hasOwnProperty(sectionTitle)) {
					if (savedStates[sectionTitle]) {
						section.setAttribute("open", "");
					} else {
						section.removeAttribute("open");
					}
				}
			});
		} catch (error) {
			console.warn("Failed to load sidebar states:", error);
		}
	}

	build_sidebar_section(title, root_pages) {
		let sidebar_section;
		let items_container;

		if (title !== "All") {
			sidebar_section = $(
				`<details class="standard-sidebar-section" data-title="${title}" open>
					<summary class="sidebar-section-title">
						<span>${__(title)}</span>
						<span class="sidebar-arrow">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
						</span>
					</summary>
				</details>`
			);
			items_container = $(
				'<div class="items-container_d2asc"></div>'
			).appendTo(sidebar_section);
		} else {
			sidebar_section = $(
				`<div class="standard-sidebar-section nested-container" data-title="${title}"></div>`
			);
			items_container = sidebar_section;
		}

		this.prepare_sidebar(root_pages, items_container);

		if (Object.keys(root_pages).length === 0) {
			sidebar_section.addClass("hidden");
		}
		sidebar_section.appendTo(this.wrapper.find(".sidebar-items"));

		$(".item-anchor").on("click", () => {
			$(".list-sidebar.hidden-xs.hidden-sm").removeClass("opened");
			// $(".close-sidebar").css("display", "none");
			$("body").css("overflow", "auto");
			if (frappe.is_mobile()) {
				this.close_sidebar();
			}
		});

		if (sidebar_section.find(".sidebar-item-container").length) {
			let visible_items;
			if (title !== "All") {
				visible_items = items_container.find("> [item-is-hidden='0']");
			} else {
				visible_items = sidebar_section.find("> [item-is-hidden='0']");
			}

			if (visible_items.length == 0) {
				sidebar_section.addClass("hidden show-in-edit-mode");
			}
		}
	}

	prepare_sidebar(items, container) {
		let last_item = null;
		for (let item of items) {
			if (item.public && last_item && !last_item.public) {
				$(`<div class="divider"></div>`).appendTo(container);
			}

			// visibility not explicitly set to 0
			if (item.visibility !== 0) {
				this.append_item(item, container);
			}
			last_item = item;
		}
	}

	append_item(item, container) {
		let is_current_page = false;

		item.selected = is_current_page;

		if (is_current_page) {
			this.current_page = { name: item.name, public: item.public };
		}

		let $item_container = this.sidebar_item_container(item);
		let sidebar_control = $item_container.find(".sidebar-item-control");

		let child_items = this.all_pages.filter(
			(page) => page.parent_page == item.name || page.parent_page == item.title
		);
		if (child_items.length > 0) {
			let child_container = $item_container.find(".sidebar-child-item");
			child_container.addClass("hidden");
			this.prepare_sidebar(child_items, child_container);
			this.parent_items.push($item_container);
		}

		$item_container.appendTo(container);
		this.sidebar_items[item.public ? "public" : "private"][item.name] = $item_container;

		if ($item_container.parent().hasClass("hidden") && is_current_page) {
			$item_container.parent().toggleClass("hidden");
		}

		this.add_toggle_children(item, sidebar_control, $item_container);

		if (child_items.length > 0) {
			$item_container.find(".drop-icon").first().addClass("show-in-edit-mode");
		}
	}

	toggle_sidebar() {
		if (!this.sidebar_expanded) {
			$(".body-sidebar-container").find(".sidebar-section-title").show();
			this.open_sidebar();
		} else {
			$(".body-sidebar-container").find(".sidebar-section-title").hide();
			this.close_sidebar();
		}
	}
};
