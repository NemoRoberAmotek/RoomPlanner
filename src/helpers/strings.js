export function capitalizeString(string) {
  const arr = string.split(" ");

  const capArr = arr.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return capArr.join(" ");
}

export function tryToInteger(string) {
  const parsed = parseInt(string);
  if (isNaN(parsed)) {
    return string;
  }
  return parsed;
}

export function tryToFloat(string) {
  const parsed = parseFloat(string);
  if (isNaN(parsed)) {
    return string;
  }
  return parsed;
}
