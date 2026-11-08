import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface AssistantScreen {
  /** What the traveler is looking at, e.g. "Kyoto · Day 03". */
  label: string;
  suggestions: string[];
}

interface AssistantContextValue {
  screen: AssistantScreen;
  setScreen: (screen: AssistantScreen) => void;
  isOpen: boolean;
  /** Open the assistant, optionally with a prefilled (unsent) request. */
  open: (draft?: string) => void;
  close: () => void;
  draft: string;
  setDraft: (draft: string) => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<AssistantScreen>({ label: 'Explore', suggestions: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const open = useCallback((prefill?: string) => {
    if (prefill !== undefined) setDraft(prefill);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ screen, setScreen, isOpen, open, close, draft, setDraft }),
    [screen, isOpen, open, close, draft],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return ctx;
}

/** Tell the assistant which screen is in view, so it can use it as context. */
export function useAssistantScreen(label: string, suggestions: string[]) {
  const { setScreen } = useAssistant();
  const key = suggestions.join('|');
  useEffect(() => {
    setScreen({ label, suggestions: key ? key.split('|') : [] });
  }, [label, key, setScreen]);
}
