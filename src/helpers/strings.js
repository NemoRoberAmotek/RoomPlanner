export function capitalizeString(string) {
  const arr = string.split(" ");

  const capArr = arr.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return capArr.join(" ");
}
