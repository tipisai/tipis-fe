use tauri::utils::assets::EmbeddedAssets;
use tauri::{AboutMetadata, Context, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

pub fn create_menu(context: &Context<EmbeddedAssets>) -> Menu {
    let app_name: &String = &context.package_info().name;

    let app_menu = Submenu::new(
        "",
        Menu::new()
            .add_native_item(MenuItem::About(app_name.into(), AboutMetadata::new()))
            .add_item(CustomMenuItem::new("settings", "Settings"))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::Quit),
    );

    let mut new_chat = CustomMenuItem::new("new_chat".to_string(), "Start new chat");

    new_chat.enabled = false;

    let file_menu = Submenu::new("Chat", Menu::new().add_item(new_chat));

    let edit_menu = Submenu::new(
        "Edit",
        Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste),
    );

    Menu::new()
        .add_submenu(app_menu)
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
}

pub fn menu_handler(event: WindowMenuEvent) {
    let win = Some(event.window());

    match event.menu_item_id() {
        "new_chat" => {
            win.unwrap().emit("open_new_chat", "").unwrap();
        }

        _ => {}
    }
}
