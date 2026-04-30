import { createContext, useCallback, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { nanoid } from "nanoid";
import styles from "./EmojiExplosion.module.css";

const DEFAULT_EMOJIS = ["🎉", "🥳", "👊", "🥹", "🤘", "🤩", "🥰"];

const DEFAULT_MESSAGES = [
  "Nice one!",
  "Five down.",
  "You did it!",
  "Goal smashed!",
  "Crushing it!",
  "Sent it!",
  "Take a bow.",
  "Locked in!",
  "Big energy.",
  "You earned this.",
  "YAAAAAY!",
  "WOHOOOO!!!",
  "Keep it up!",
  "Slow down buddy!....",
];

const MESSAGE_DURATION_MS = 2400;

export type ExplodeOptions = {
  /** Total number of emojis released. Default 36. */
  count?: number;
  /** Override the default emoji set. */
  emojis?: string[];
  /**
   * Centered burst text. Pass a string to override; pass `null` to
   * suppress the message entirely (emojis only). Omit to pick a
   * random phrase from `messages`.
   */
  message?: string | null;
  /** Override the pool of celebratory messages. */
  messages?: string[];
};

type EmojiItem = {
  id: string;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  rotation: number;
};

type BurstMessage = {
  id: string;
  text: string;
};

type Explode = (opts?: ExplodeOptions) => void;

const EmojiContext = createContext<Explode | null>(null);

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function EmojiExplosionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EmojiItem[]>([]);
  const [message, setMessage] = useState<BurstMessage | null>(null);

  const explode = useCallback<Explode>((opts) => {
    const count = opts?.count ?? 36;
    const emojiSet = opts?.emojis ?? DEFAULT_EMOJIS;

    const batch: EmojiItem[] = Array.from({ length: count }, () => ({
      id: nanoid(8),
      emoji: pick(emojiSet),
      left: Math.random() * 100,
      delay: Math.random() * 1400,
      duration: 2400 + Math.random() * 2400,
      drift: (Math.random() - 0.5) * 280,
      size: 1.5 + Math.random() * 3.2,
      rotation: (Math.random() - 0.5) * 720,
    }));

    setItems((prev) => [...prev, ...batch]);

    const cleanupAfter =
      batch.reduce((max, i) => Math.max(max, i.delay + i.duration), 0) + 200;
    const ids = new Set(batch.map((i) => i.id));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((i) => !ids.has(i.id)));
    }, cleanupAfter);

    // Burst message: explicit string > pool pick > suppressed via null.
    let text: string | null;
    if (opts?.message === null) {
      text = null;
    } else if (typeof opts?.message === "string") {
      text = opts.message;
    } else {
      text = pick(opts?.messages ?? DEFAULT_MESSAGES);
    }

    if (text !== null) {
      const burst: BurstMessage = { id: nanoid(8), text };
      setMessage(burst);
      window.setTimeout(() => {
        setMessage((cur) => (cur?.id === burst.id ? null : cur));
      }, MESSAGE_DURATION_MS + 100);
    }
  }, []);

  return (
    <EmojiContext.Provider value={explode}>
      {children}
      <div className={styles.layer} aria-hidden="true">
        {items.map((item) => (
          <span
            key={item.id}
            className={styles.emojiY}
            style={
              {
                "--left": `${item.left}%`,
                "--delay": `${item.delay}ms`,
                "--duration": `${item.duration}ms`,
                "--drift": `${item.drift}px`,
                "--size": `${item.size}rem`,
                "--rotation": `${item.rotation}deg`,
              } as CSSProperties
            }
          >
            <span className={styles.emojiX}>
              <span className={styles.emojiSpin}>{item.emoji}</span>
            </span>
          </span>
        ))}
        {message ? (
          <div key={message.id} className={styles.message}>
            <span className={styles.messageInner}>{message.text}</span>
          </div>
        ) : null}
      </div>
    </EmojiContext.Provider>
  );
}

export function useEmojiExplosion(): Explode {
  const ctx = useContext(EmojiContext);
  if (!ctx) {
    throw new Error(
      "useEmojiExplosion must be used inside <EmojiExplosionProvider>",
    );
  }
  return ctx;
}
