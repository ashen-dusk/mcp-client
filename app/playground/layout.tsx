import { PlaygroundProvider } from "@/components/providers/PlaygroundProvider";
import type { PropsWithChildren } from "react";

export default function PlaygroundLayout({ children }: PropsWithChildren) {
  return <PlaygroundProvider>{children}</PlaygroundProvider>;
}
