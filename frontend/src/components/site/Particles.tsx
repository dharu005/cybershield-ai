import { useEffect, useMemo, useState } from "react";

export function Particles({ count = 30 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 200 + "px",
      dy: -(50 + Math.random() * 200) + "px",
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      color: Math.random() > 0.5 ? "var(--neon-cyan)" : "var(--neon-violet)",
    }));
  }, [count, mounted]);

  return (
    <div aria-hidden suppressHydrationWarning className="pointer-events-none absolute inset-0 overflow-hidden">
      {mounted &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute block rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              animation: `particle-drift ${p.duration}s ease-in ${p.delay}s infinite`,
              // @ts-expect-error css var
              "--dx": p.dx,
              "--dy": p.dy,
            }}
          />
        ))}
    </div>
  );
}
