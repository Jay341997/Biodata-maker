import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { PreviewFieldRef } from "@/types/previewEdit";

export type PreviewFieldActivateHandler = (ref: PreviewFieldRef) => void;

const PreviewEditDispatchContext = createContext<
  PreviewFieldActivateHandler | undefined
>(undefined);

export function PreviewEditDispatchProvider({
  onActivateField,
  children,
}: {
  onActivateField: PreviewFieldActivateHandler | undefined;
  children: ReactNode;
}) {
  return (
    <PreviewEditDispatchContext.Provider value={onActivateField}>
      {children}
    </PreviewEditDispatchContext.Provider>
  );
}

export function usePreviewFieldActivate(): PreviewFieldActivateHandler | undefined {
  return useContext(PreviewEditDispatchContext);
}
