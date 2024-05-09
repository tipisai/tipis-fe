use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

pub fn create() -> SystemTray {
    let mut new_chat = CustomMenuItem::new("new_chat".to_string(), "Start a new chat");
    new_chat.enabled = false;

    let mut explore_tipis = CustomMenuItem::new("explore_tipi".to_string(), "Explore Tipi");
    explore_tipis.enabled = false;

    let tray_menu: SystemTrayMenu = SystemTrayMenu::new()
        .add_item(new_chat)
        .add_item(explore_tipis)
        .add_item(CustomMenuItem::new("show".to_string(), "Open Tipis AI"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    SystemTray::new().with_menu(tray_menu)
}

pub fn handler(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            "new_chat" => {
                window.emit("open_new_chat", "").unwrap();
            }
            "explore_tipi" => {
                window.emit("open_explore_tipi", "").unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}
