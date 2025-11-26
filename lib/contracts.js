export const CONTRACT_ADDRESSES = {
  factory: '***', 
  usdc: '0x3600000000000000000000000000000000000000'
};

export const ARC_NETWORK = {
  chainId: '0x4CEF52',
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app']
};

export const FACTORY_ABI = [
  "function createVault() external returns (address)",
  "function vaultOf(address user) external view returns (address)",
  "event VaultCreated(address indexed user, address vault)"
];

export const VAULT_ABI = [
  "function owner() external view returns (address)",
  "function usdc() external view returns (address)",
  "function passwordHash() external view returns (bytes32)",
  "function whitelistPasswordHash() external view returns (bytes32)",
  "function sessionExpiration() external view returns (uint256)",
  "function SESSION_DURATION() external view returns (uint256)",
  "function maxSingleSpend(address) external view returns (uint256)",
  "function dailyLimit(address) external view returns (uint256)",
  "function spentToday(address) external view returns (uint256)",
  "function lastSpentTimestamp(address) external view returns (uint256)",
  "function whitelist(address) external view returns (bool)",
  "function paused() external view returns (bool)",
  "function getWhitelistAddresses() external view returns (address[])",
  "function getWhitelistCount() external view returns (uint256)",
  
  "function balance() external view returns (uint256)",
  "function isSessionActive() external view returns (bool)",
  "function hashedPassword(string memory pass) external view returns (bytes32)",
  
  "function setPasswordHash(bytes32 _hash) external",
  "function setWhitelistPasswordHash(bytes32 _hash) external",
  "function changePasswordHash(bytes32 oldHash, bytes32 newHash) external",
  "function changeWhitelistPasswordHash(bytes32 oldHash, bytes32 newHash) external",
  
  "function unlockSession(bytes32 hashedPass) external",
  "function lock() external",
  
  "function setLimits(uint256 _maxSingle, uint256 _daily) external",
  
  "function deposit(uint256 amount) external",
  "function withdrawAll(address to, bytes32 hashedWhitelistPass) external",
  "function transferUSDC(address to, uint256 amount) external",
  
  "function addWhitelist(address account, bytes32 hashedPass) external",
  "function removeWhitelist(address account, bytes32 hashedPass) external",
  
  "function pause() external",
  "function unpause() external",
  "function transferOwnership(address newOwner, bytes32 hashedWhitelistPass) external", 
  
  "event PasswordSet(bytes32 hash)",
  "event SessionUnlocked(uint256 until)",
  "event SessionLocked()",
  "event Deposited(uint256 amount)",
  "event Transferred(address to, uint256 amount)",
  "event WhitelistAdded(address indexed account)",
  "event WhitelistRemoved(address indexed account)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];
