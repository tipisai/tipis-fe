import {
  CREATE_INTEGRATION_EVENT,
  FUNCTION_RUN_RESULT_EVENT,
} from "./constants"

export type TEventEmitterEventType =
  | (typeof FUNCTION_RUN_RESULT_EVENT)[keyof typeof FUNCTION_RUN_RESULT_EVENT]
  | (typeof CREATE_INTEGRATION_EVENT)[keyof typeof CREATE_INTEGRATION_EVENT]

class EventEmitter {
  private events = new Map<TEventEmitterEventType, Function[]>()

  on(event: TEventEmitterEventType, listener: Function) {
    let listeners = this.events.get(event)
    if (!listeners) {
      listeners = []
    }
    listeners.push(listener)
    this.events.set(event, listeners)
  }

  emit(event: TEventEmitterEventType, ...args: any[]) {
    const listeners = this.events.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(...args))
    }
  }

  off(event: TEventEmitterEventType, listener: Function) {
    let listeners = this.events.get(event)

    if (listeners) {
      listeners = listeners.filter((l) => l !== listener)
      this.events.set(event, listeners)
    }
  }
}

export default EventEmitter
