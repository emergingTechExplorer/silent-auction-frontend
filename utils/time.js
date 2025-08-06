export const getCountdown = (deadline) => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${mins}m ${secs}s`;
};

export const getDigitalCountdown = (deadline) => {
  const now = new Date().getTime();
  const target = new Date(deadline).getTime();
  const diff = target - now;

  if (diff <= 0) return 'Ended';

  const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
  const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  return `${h}:${m}:${s}`;
};

export const getLiveCountdowns = (items) => {
  const now = Date.now();
  const countdownMap = {};

  items.forEach(({ id, deadline }) => {
    const end = new Date(deadline).getTime();
    const diff = end - now;

    if (diff <= 0) {
      countdownMap[id] = 'Ended';
    } else {
      const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      countdownMap[id] = `${h}:${m}:${s}`;
    }
  });

  return countdownMap;
};