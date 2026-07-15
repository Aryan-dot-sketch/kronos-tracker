import confetti from 'canvas-confetti';

export const fireConfetti = (intensity: 'mild' | 'strong' | 'epic' = 'strong') => {
  const count = intensity === 'epic' ? 180 : intensity === 'strong' ? 120 : 60;
  const colors = ['#B8860B', '#D4A017', '#4ade80', '#f0d18a'];

  confetti({
    particleCount: count,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });

  if (intensity !== 'mild') {
    setTimeout(() => {
      confetti({
        particleCount: count * 0.6,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.6 },
        colors,
      });
    }, 150);

    setTimeout(() => {
      confetti({
        particleCount: count * 0.6,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.6 },
        colors,
      });
    }, 280);
  }
};

export const fireStreakConfetti = () => {
  fireConfetti('epic');
  setTimeout(() => fireConfetti('strong'), 400);
};