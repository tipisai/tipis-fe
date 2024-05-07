use tauri::{api, command, AppHandle, Manager};

#[command]
pub fn open_link(app: AppHandle, url: String) {
    api::shell::open(&app.shell_scope(), url, None).unwrap();
}

#[command]
pub fn set_enabled_new_chat(app: AppHandle, enabled: bool) {
    let main_window = app.get_window("main").unwrap();

    let menu_handle = main_window.menu_handle();
    let tray_menu_handle = app.tray_handle();

    let item = menu_handle.get_item("new_chat");
    item.set_enabled(enabled).unwrap();

    let tray_item = tray_menu_handle.get_item("new_chat");
    tray_item.set_enabled(enabled).unwrap()
}

#[command]
pub fn set_enabled_explore_tipi(app: AppHandle, enabled: bool) {
    let tray_menu_handle = app.tray_handle();

    let tray_item = tray_menu_handle.get_item("explore_tipi");
    tray_item.set_enabled(enabled).unwrap()
}

// #[command]
// pub fn
