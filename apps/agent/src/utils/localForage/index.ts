import localforage from "localforage"

const LOCAL_TAB_STORE_NAME = "tipis-tab"
const LOCAL_CHAT_HISTORY_STORE_NAME = "tipis-chat-history"

export const tabStore = localforage.createInstance({
  name: LOCAL_TAB_STORE_NAME,
})

export const chatHistoryStore = localforage.createInstance({
  name: LOCAL_CHAT_HISTORY_STORE_NAME,
})
