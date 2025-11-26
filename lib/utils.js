import { keccak256, toUtf8Bytes, solidityPackedKeccak256 } from 'ethers';

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function hashPassword(password, ownerAddress) {
  return solidityPackedKeccak256(
    ['string', 'address', 'string'],
    [password, ownerAddress, 'ARC_USER_VAULT']
  );
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 12 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain special character' };
  }
  return { valid: true };
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
