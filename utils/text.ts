export function truncate(str: string, n: number){
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

export default function uniqid() {
  if (typeof window !== 'undefined') {
    const _uniqid = require('uniqid');
    return _uniqid();
  }
  return '';
}

export const formatter = (currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
};