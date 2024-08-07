import { useId } from "react";

export default function ChatItem({ message }: { message: string }) {
  const keyId = useId();
  return <li aria-label={keyId}>{message}</li>;
}
