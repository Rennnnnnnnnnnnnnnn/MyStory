import { useRef, useState, useEffect } from "react";

export default function RevealStory({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setVisible(entry.isIntersecting);
    },
    { threshold: 0.15 }
  );

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children(visible)}
        </div>
    );
}
