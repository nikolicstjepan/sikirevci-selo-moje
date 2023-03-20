export default function getDecadeOptions() {
  const currentYear = new Date().getFullYear();

  const startYear = 1540;

  const decades = new Array(Math.floor((currentYear - startYear) / 10) + 1)
    .fill(0)
    .map((_, i) => `${i * 10 + startYear}-${i * 10 + startYear + 9}`)
    .reverse();

  return decades;
}
