// Matching Whisper.events.trigger API
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function trigger(name: string, param1?: any, param2?: any): void {
  window.Whisper.events.trigger(name, param1, param2);
}
