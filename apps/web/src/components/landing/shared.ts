import { type RefObject, useEffect, useRef, useState } from "react";
import type { Route } from "next";

export const NAV_LINKS: [string, Route][] = [
  ["ปัญหา", "#problem" as Route],
  ["เสียงจากใจ", "#voices" as Route],
  ["ข้อมูล", "#data" as Route],
  ["กำแพงนิรนาม", "/wall"],
];

/**
 * Animates a numeric value from 0 to `target` using cubic ease-out once the
 * referenced element enters the viewport. Fires only once per mount.
 */
export function useCountUp(
  target: number,
  { duration = 1200, threshold = 0.4, delay = 0 }: { duration?: number; threshold?: number; delay?: number } = {}
): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now() + delay;
        const animate = (now: number) => {
          const p = Math.min(Math.max((now - start) / duration, 0), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(animate);
        };
        if (delay > 0) {
          setTimeout(() => requestAnimationFrame(animate), delay);
        } else {
          requestAnimationFrame(animate);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, value];
}
