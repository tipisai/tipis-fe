export interface EmailCodeProps {
  showCountDown: boolean
  usage: "signup" | "forgetpwd"
  onCountDownChange: (showCountDown: boolean) => void
}
