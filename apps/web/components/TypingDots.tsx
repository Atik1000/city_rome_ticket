import React, { useEffect, useRef, useState } from "react";

type TypingDotsProps = {
  text?: string;
  charSpeed?: number;     // ms per character
  dotSpeed?: number;      // ms between dot steps
  restartDelay?: number;  // ms to wait after "..."
  className?: string;
};

const TypingDots: React.FC<TypingDotsProps> = ({
  text = "Iconic Rome Tickets",
  charSpeed = 80,
  dotSpeed = 350,
  restartDelay = 2000,
  className,
}) => {
  const [typed, setTyped] = useState<string>("");
  const [dots, setDots] = useState<string>("");

  // Keep refs so we can cancel everything safely
  const timeoutsRef = useRef<number[]>([]);
  const clearAll = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    let mounted = true;

    const start = () => {
      if (!mounted) return;

      clearAll();
      setTyped("");
      setDots("");

      let i = 0;

      const typeNext = () => {
        if (!mounted) return;

        if (i < text.length) {
          setTyped(text.slice(0, i + 1));
          i += 1;
          addTimeout(typeNext, charSpeed);
        } else {
          // Dots: . .. ...
          addTimeout(() => mounted && setDots("."), dotSpeed);
          addTimeout(() => mounted && setDots(".."), dotSpeed * 2);
          addTimeout(() => mounted && setDots("..."), dotSpeed * 3);

          // Restart after "...", wait restartDelay
          addTimeout(() => mounted && start(), dotSpeed * 3 + restartDelay);
        }
      };

      typeNext();
    };

    start();

    return () => {
      mounted = false;
      clearAll();
    };
  }, [text, charSpeed, dotSpeed, restartDelay]);

  return (
    <span className={["inline-flex items-baseline", className].filter(Boolean).join(" ")}>
      <span>{typed}</span>
      {/* fixed width so layout doesn't shift */}
      <span className="w-[1.2em]">{dots}</span>
    </span>
  );
};

export default TypingDots;
