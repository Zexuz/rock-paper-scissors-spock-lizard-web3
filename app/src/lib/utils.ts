export const generateSecureRandomSalt = (): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0];
}
