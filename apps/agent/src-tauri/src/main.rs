// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
mod cmd;
mod menu;
mod tray;

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .system_tray(tray::create())
        .on_system_tray_event(tray::handler)
        .menu(menu::create_menu(&context))
        .on_menu_event(menu::menu_handler)
        .invoke_handler(tauri::generate_handler![
            cmd::open_link,
            cmd::set_enabled_new_chat,
            cmd::set_enabled_explore_tipi,
        ])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                #[cfg(not(target_os = "macos"))]
                {
                    event.window().hide().unwrap();
                }

                #[cfg(target_os = "macos")]
                {
                    tauri::AppHandle::hide(&event.window().app_handle()).unwrap();
                }
                api.prevent_close();
            }

            _ => {}
        })
        .run(context)
        .expect("error while running tauri application");
}
