export const randomInRange = (
  min,
  max,
  excludeRangeMin = undefined,
  excludeRangeMax = undefined
) => {
  const num = Math.random() * (max - min) + min;
  return num > excludeRangeMin && num < excludeRangeMax
    ? randomInRange(min, max, excludeRangeMin, excludeRangeMax)
    : num;
};
