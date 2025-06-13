// // This is a global module declaration

/**
 * TypeScript definitions for the Frappe Framework client-side API (v14).
 *
 * This file provides type information for the global `frappe` object,
 * enabling autocompletion and type checking in a TypeScript environment.
 *
 * Generated based on the official documentation at:
 * https://docs.frappe.io/framework/v14/user/en/api/js
 */

declare module "frappe" {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Core Types and Interfaces
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Represents a generic Frappe document. This is a base interface;
   * specific DocTypes will have additional properties.
   */
  interface BaseDoc {
    doctype: string;
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    /** 0 = Saved (Draft), 1 = Submitted, 2 = Cancelled */
    docstatus: 0 | 1 | 2;
    parent?: string;
    parentfield?: string;
    parenttype?: string;
    idx?: number;
  }

  type Doc<T = Record<string, any>> = BaseDoc & T;

  /**
   * Defines the structure for a field in a DocType or a Dialog.
   */
  interface FieldDefinition {
    fieldname: string;
    fieldtype:
      | "Data"
      | "Select"
      | "Text"
      | "Date"
      | "Time"
      | "Datetime"
      | "Int"
      | "Float"
      | "Currency"
      | "Percent"
      | "Check"
      | "Link"
      | "Dynamic Link"
      | "Table"
      | "HTML"
      | "Button"
      | "Image"
      | "Section Break"
      | "Column Break"
      | "Tab Break"
      | string;
    label: string;
    description?: string;
    options?: string | string[];
    default?: any;
    reqd?: 0 | 1;
    hidden?: 0 | 1;
    read_only?: 0 | 1;
    depends_on?: string;
    mandatory_depends_on?: string;
    [key: string]: any;
  }

  /**
   * Represents the metadata for a DocType.
   */
  interface DocTypeMeta {
    name: string;
    module: string;
    fields: FieldDefinition[];
    permissions: any[];
    issingle: 0 | 1;
    istable: 0 | 1;
    [key: string]: any;
  }

  /**
   * Represents arguments for `frappe.call`.
   */
  interface CallArgs {
    /** The server-side Python method to call (e.g., 'myapp.api.my_method'). */
    method: string;
    /** An object of arguments to pass to the method. */
    args?: Record<string, any>;
    /** Callback function on success. */
    callback?: (response: any) => void;
    /** Callback function on error. */
    error?: (error: any) => void;
    /** Callback function that always runs. */
    always?: () => void;
    /** If true, freezes the UI with a message until the request completes. */
    freeze?: boolean;
    /** The message to display while the UI is frozen. */
    freeze_message?: string;
    /** The HTTP method to use ('GET' or 'POST'). */
    type?: "GET" | "POST";
    /** If true, suppresses the global error handler. */
    quiet?: boolean;
  }

  /**
   * Represents a successful response from a `frappe.call`.
   * The actual data is usually in the `message` property.
   */
  interface CallResponse<T = any> {
    message: T;
    exc?: string;
    _server_messages?: string;
  }

  /**
   * Represents arguments for `frappe.db.get_list`.
   */
  interface GetListArgs {
    doctype: string;
    fields?: ("*" | keyof Doc)[];
    filters?: Record<string, any> | [string, string, any][];
    or_filters?: Record<string, any> | [string, string, any][];
    order_by?: string;
    limit_start?: number;
    limit_page_length?: number;
    parent?: string;
    group_by?: string;
    as_dict?: boolean;
  }

  interface ShowAlertOptions {
    message: string;
    indicator?: "red" | "green" | "orange" | "yellow" | "blue";
  }

  interface MsgPrintOptions {
    title?: string;
    message: string;
    indicator?: "red" | "green" | "orange" | "yellow" | "blue";
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Top-level Functions
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * The primary method for making synchronous-style server calls.
   * @param args - The arguments for the server call.
   * @returns A Promise resolving with the server response.
   */
  function call<T = any>(args: CallArgs): Promise<CallResponse<T>>;
  function call<T = any>(
    method: string,
    args?: Record<string, any>
  ): Promise<CallResponse<T>>;
  function show_alert(opts: ShowAlertOptions): void;
  function msgprint(opts: MsgPrintOptions): void;

  /**
   * Fetches a single document from the server.
   * @param doctype - The DocType of the document.
   * @param name - The name (ID) of the document.
   * @returns A Promise resolving with the document object.
   */
  function get_doc<T = Doc>(doctype: string, name: string): Promise<T>;

  /**
   * Fetches the metadata for a given DocType.
   * @param doctype - The DocType to get metadata for.
   * @returns A Promise resolving with the DocType metadata object.
   */
  function get_meta(doctype: string): Promise<DocTypeMeta>;

  /**
   * Translates a string.
   * @param txt - The text to translate.
   * @param vars - Optional variables for interpolation.
   * @param context - The translation context.
   * @returns The translated string.
   */
  function __(txt: string, vars?: any[], context?: string): string;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UI Module (`frappe.ui`)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  namespace ui {
    /**
     * Options for creating a `frappe.ui.Dialog`.
     */
    interface DialogOptions {
      /** The title of the dialog. */
      title: string;
      /** An array of field definitions to be displayed in the dialog. */
      fields?: FieldDefinition[];
      /** The label for the primary action button. */
      primary_action_label?: string;
      /** The function to call when the primary action is taken. Receives an object of field values. */
      primary_action?: (values: Record<string, any>) => void;
      /** The label for the secondary action button. */
      secondary_action_label?: string;
      /** The function to call when the secondary action is taken. */
      secondary_action?: () => void;
      /** If true, the dialog cannot be closed by clicking outside or pressing Esc. */
      static?: boolean;
      /** A function that is called when the dialog is shown. */
      on_page_show?: () => void;
      [key: string]: any;
    }

    class Dialog {
      constructor(options: DialogOptions);
      /** Shows the dialog. */
      show(): void;
      /** Hides the dialog. */
      hide(): void;
      /** Gets the jQuery input element for a field. */
      get_input(fieldname: string): JQuery;
      /** Gets the value of a single field. */
      get_value(fieldname: string): any;
      /** Gets an object with all field values. */
      get_values(): Record<string, any>;
      /** Sets the value of a single field. */
      set_value(fieldname: string, value: any): void;
      /** Sets multiple field values from an object. */
      set_values(values: Record<string, any>): void;
    }

    namespace form {
      class Control {
        df: FieldDefinition;
        disp_status: "Read" | "Write" | "None";
        set_value(value: any): Promise<void>;
        get_value(): any;
        set_input(value: any): void;
        get_input_value(): any;
        refresh(): void;
        set_description(description: string): void;
        toggle_label(show: boolean): void;
        toggle_display(show: boolean): void;
        set_new_description(description: string): void;
        set_focus(): void;
        get_query(): any;
        set_query(
          query: string | Record<string, any> | (() => Record<string, any>)
        ): void;
        get_options(): any;
        set_options(options: string[] | string): void;
      }

      /**
       * Shows a toast message.
       * @param message - The message to display.
       * @param indicator - Color of the indicator ('green', 'red', 'blue', etc.).
       * @param duration - Duration in milliseconds.
       */
      function Grap(
        message: string,
        indicator?: string,
        duration?: number
      ): void;
      function on(event: string, handlers: Record<string, (frm: Form) => void>): void;
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Database Module (`frappe.db`)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  namespace db {
    /**
     * Fetches a single value from a document.
     * @returns A Promise resolving with an object containing the value.
     */
    function get_value<T = any>(
      doctype: string,
      filters: string | Record<string, any>,
      fieldname: string | string[],
      callback?: (value: T) => void
    ): Promise<{ message: T }>;

    /**
     * Fetches a list of documents.
     * @returns A Promise resolving with an array of documents or dictionaries.
     */
    function get_list<T = any>(args: GetListArgs): Promise<T[]>;

    /**
     * Fetches a single document.
     * @returns A Promise resolving with the document object.
     */
    function get_doc<T = Doc>(
      doctype: string,
      name: string,
      callback?: (doc: T) => void
    ): Promise<T>;

    /**
     * Gets the count of documents matching filters.
     * @returns A Promise resolving with the count.
     */
    function count(
      doctype: string,
      filters?: Record<string, any>
    ): Promise<number>;

    /**
     * Sets a value in a document and saves it.
     * @returns A Promise resolving with the updated document.
     */
    function set_value<T = Doc>(
      doctype: string,
      name: string,
      fieldname: string | Record<string, any>,
      value?: any,
      callback?: (doc: T) => void
    ): Promise<T>;

    /**
     * Deletes a document.
     * @returns A Promise resolving on completion.
     */
    function delete_doc(
      doctype: string,
      name: string,
      callback?: () => void
    ): Promise<any>;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Datetime Module (`frappe.datetime`)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  namespace datetime {
    /** Returns the current datetime string in system format ('YYYY-MM-DD HH:mm:ss'). */
    function now_datetime(): string;
    /** Returns the current date string in system format ('YYYY-MM-DD'). */
    function now_date(): string;
    /** Returns the current time string ('HH:mm:ss'). */
    function now_time(): string;
    /** Returns today's date string ('YYYY-MM-DD'). */
    function get_today(): string;
    /** Adds days to a date string. */
    function add_days(date: string, days: number): string;
    /** Adds months to a date string. */
    function add_months(date: string, months: number): string;
    /** Adds years to a date string. */
    function add_years(date: string, years: number): string;
    /** Calculates the difference in days between two date strings. */
    function date_diff(end: string, start: string): number;
    /** Converts a date string to a Date object. */
    function str_to_obj(datestr: string): Date;
    /** Converts a Date object to a date string. */
    function obj_to_str(dateobj: Date): string;
    /** Formats a date string or object to a given format. */
    function format_date(date: string | Date, format: string): string;
    /** Converts a date to the user's display format. */
    function convert_to_user_format(date: string): string;
    /** Gets the user's date format preference (e.g., 'dd-mm-yyyy'). */
    function get_user_format(): string;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Utils Module (`frappe.utils`)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  namespace utils {
    function get_random_string(len: number): string;
    function get_file_name(filepath: string): string;
    function get_extension(filename: string): string;
    function is_image_file(filename: string): boolean;
    function is_url(text: string): boolean;
    function validate_email(email: string): boolean;
    function get_url_arg(key: string): string;
    function get_url_args(): Record<string, string>;
    function get_base_url(): string;
    function get_gravatar(email: string, size?: number): string;
    function get_abbr(name: string, max_len?: number): string;
    function copy_to_clipboard(text: string): void;
    function cint(v: any, def?: number): number;
    function flt(v: any, precision?: number, def?: number): number;
    function fmt_money(
      value: number,
      currency?: string,
      precision?: number
    ): string;
    function slug(str: string): string;
    function to_title_case(str: string): string;
    function comma_or(list: string[]): string;
    function comma_and(list: string[]): string;
    function strip_html(str: string): string;
    function build_url(
      path: string,
      query_params?: Record<string, any>,
      absolute?: boolean
    ): string;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Route Module (`frappe.route`)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  namespace route {
    var route_options: Record<string, any>;
    /** Sets the current route in the URL hash. */
    function set_route(...parts: (string | number)[]): void;
    function set_route(route: string): void;
    /** Gets the current route as an array of parts. */
    function get_route(): string[];
    /** Gets the current route as a string. */
    function get_hash(): string;
    /** Navigates to a given route hash. */
    function go(hash: string): void;
    /** Reloads the current route. */
    function reload(): void;
    /** Attaches a handler to a route change event. */
    function on(route: string, handler: () => void): void;
    /** Detaches a handler from a route change event. */
    function off(route: string, handler: () => void): void;
    /** Triggers a route change event. */
    function trigger(route: string): void;
  }

  namespace dom {
    function unfreeze(): void;
    function freeze(): void;
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Other Globals (e.g., from Form context)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /** The current form object, available in form scripts. */
  var cur_frm: Form;

  /**
   * Represents the main form object (`cur_frm`).
   */
  interface Form {
    doctype: string;
    doc: Doc;
    docname: string;
    meta: DocTypeMeta;
    perm: any[];
    is_new(): boolean;
    is_dirty(): boolean;
    /** Saves the form. */
    save(
      save_action?: string,
      callback?: () => void,
      btn?: JQuery
    ): Promise<any>;
    /** Reloads the form with the latest document data. */
    reload_doc(): void;
    /** Refreshes the form display, re-rendering fields. */
    refresh(): void;
    /** Refreshes a specific field by its fieldname. */
    refresh_field(fieldname: string): void;
    /** Sets a value in the form's document. */
    set_value(fieldname: string, value: any, fieldtype?: string): Promise<void>;
    /** Gets a value from the form's document. */
    get_value(fieldname: string): any;
    /** Toggles the requirement status of a field. */
    set_df_property(
      fieldname: string,
      prop: "reqd" | "hidden" | "read_only" | string,
      value: any
    ): void;
    /** Gets a field control object. */
    get_field(fieldname: string): ui.form.Control;
    /** Adds a custom button to the page header. */
    add_custom_button(label: string, fn: () => void, group?: string): JQuery;

    set_query: (
      field: string,
      query: () => { filters: Record<string, any> }
    ) => void;

    fields_dict: Record<string, any>;
    selected_workflow_action: any;
  }

  namespace sahl_erp {
    namespace add_unit_request {
      let DESCRIPTION_UPDATE_FIELDS: string[];
      let MAP_UPDATE_FIELDS: string[];
      let add_unit_request_events: Record<string, (frm: Form) => void>;
    }
    namespace unit {
      let DESCRIPTION_UPDATE_FIELDS: string[];
      let MAP_UPDATE_FIELDS: string[];
      let unit_events: Record<string, (frm: Form) => void>;
    }
    namespace unit_utils {
      function get_sub_city_query(doc: UnitDocument): {
        filters: {
          city: string;
        };
      };
      function add_handlers_to_events(
        events: Record<string, (frm: Form) => void>,
        fields: string[] | Record<string, string>,
        update_function: (frm: Form) => void
      ): void;
      function update_description(frm: Form): void;
      function update_map_from_address(frm: Form): void;
      function handle_owner_phone_change(frm: Form): void;
      function initialize_owner_link_field(frm: Form): void;
    }
  }
}

// Augment the global scope
declare global {
  const frappe: typeof import("frappe");
  function __(str: string): string;
}

export {};
