export function avatarFallback(firstWord: string, lastWord: string) {
  if (firstWord && lastWord) {
    return firstWord[0] + lastWord[0];
  }
  if (firstWord) return firstWord[0];
  if (lastWord) return lastWord[0];
  return 'JD';
}