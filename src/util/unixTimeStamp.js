export const unixTimeStamp = () => {
  const timestamp = Date.now();
  return Math.floor(timestamp / 1000);
}
