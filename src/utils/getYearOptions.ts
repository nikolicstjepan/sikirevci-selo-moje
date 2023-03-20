import { notSureAboutYear } from "../const";

export default function getYearOptions() {
  const currentYear = new Date().getFullYear();

  const startYear = 1540;

  const years = new Array(currentYear - startYear + 1)
    .fill(0)
    .map((_, i) => `${i + startYear}`)
    .reverse();

  years.unshift(notSureAboutYear);

  return years;
}
