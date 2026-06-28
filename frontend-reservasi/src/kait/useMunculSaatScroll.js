import { useEffect } from 'react';

export function useMunculSaatScroll() {
  useEffect(() => {
    const elemen = document.querySelectorAll('.reveal');
    const pengamat = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });

    elemen.forEach((node) => pengamat.observe(node));
    return () => pengamat.disconnect();
  }, []);
}
