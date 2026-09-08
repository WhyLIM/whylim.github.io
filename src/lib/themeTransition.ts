export function revealTheme(origin: { x: number; y: number }, update: () => void) {
  if (
    !document.startViewTransition
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    update();
    return;
  }

  const transition = document.startViewTransition(update);
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${origin.x}px ${origin.y}px)`,
          `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 650,
        easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }).catch(() => undefined);
}
