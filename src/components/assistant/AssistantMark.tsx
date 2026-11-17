interface AssistantMarkProps {
  size?: number;
  className?: string;
}

/**
 * Ask NOMA's mark: a speech bubble holding a terracotta spark.
 * Reads as "ask the assistant" even when the label is hidden, where the
 * old ring-and-dot could be mistaken for a record button.
 */
export function AssistantMark({ size = 22, className }: AssistantMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M5.5 4.75h13a2.25 2.25 0 0 1 2.25 2.25v8.5a2.25 2.25 0 0 1-2.25 2.25h-8l-4.25 3.5v-3.5h-.75A2.25 2.25 0 0 1 3.25 15.5V7a2.25 2.25 0 0 1 2.25-2.25Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 7c.44 2.65 1.55 3.76 4.2 4.2-2.65.44-3.76 1.55-4.2 4.2-.44-2.65-1.55-3.76-4.2-4.2 2.65-.44 3.76-1.55 4.2-4.2Z"
        fill="var(--color-terracotta)"
      />
    </svg>
  );
}
