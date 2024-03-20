import localforage from "localforage"

const LOCAL_TAB_STORE_NAME = "tipis-tab"
const LOCAL_CHAT_HISTORY_STORE_NAME = "tipis-chat-history"
const LOCAL_UI_HISTORY_DATA_STORE_NAME = "tipis-ui-history-data"

export const tabStore = localforage.createInstance({
  name: LOCAL_TAB_STORE_NAME,
})

export const chatHistoryStore = localforage.createInstance({
  name: LOCAL_CHAT_HISTORY_STORE_NAME,
})

export const uiHistoryDataStore = localforage.createInstance({
  name: LOCAL_UI_HISTORY_DATA_STORE_NAME,
})
