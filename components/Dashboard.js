  "use client";
  
  import { useState, useEffect } from 'react';
  import { 
    DollarSign, Lock, Unlock, Shield, Send, Settings, Plus, 
    Trash2, Copy, Loader, AlertCircle, RefreshCw, CheckCircle,
    Eye, EyeOff
  } from 'lucide-react';
  import { BrowserProvider, Contract, formatUnits, parseUnits, isAddress, getAddress } from "ethers";
  import { CONTRACT_ADDRESSES, VAULT_ABI, ERC20_ABI } from '@/lib/contracts';
  import { formatAddress, hashPassword, validatePassword, copyToClipboard } from '@/lib/utils';
  
  export default function Dashboard({ 
    account, 
    vaultAddress, 
    provider, 
    signer, 
    onNotification,
    onRefresh 
  }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    
    const [vaultData, setVaultData] = useState({
      balance: '0',
      maxSingleSpend: '0',
      dailyLimit: '0',
      spentToday: '0',
      sessionExpiration: 0,
      passwordSet: false,
      whitelistPasswordSet: false,
      paused: false
    });
  
    const [password, setPassword] = useState('');
    const [whitelistPassword, setWhitelistPassword] = useState('');
    const [withdrawPassword, setWithdrawPassword] = useState('');
    const [ownershipPassword, setOwnershipPassword] = useState('');
    
    const [vaultOldPassword, setVaultOldPassword] = useState('');
    const [vaultNewPassword, setVaultNewPassword] = useState('');
    
    const [whitelistOldPassword, setWhitelistOldPassword] = useState('');
    const [whitelistNewPassword, setWhitelistNewPassword] = useState('');
    
    const [whitelistAddress, setWhitelistAddress] = useState('');
    const [whitelistList, setWhitelistList] = useState([]);
    const [transferTo, setTransferTo] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [maxSingle, setMaxSingle] = useState('');
    const [dailyLimit, setDailyLimit] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [newOwnerAddress, setNewOwnerAddress] = useState('');
  
    useEffect(() => {
      if (vaultAddress && provider && account) {
        loadVaultData();
        loadWhitelist();
      }
    }, [vaultAddress, provider, account]);
  
    useEffect(() => {
      const checkSession = async () => {
        if (!vaultAddress || !provider) return;
  
        try {
          const vaultContract = new Contract(vaultAddress, VAULT_ABI, provider);
          
          const expiration = await vaultContract.sessionExpiration();
          const expirationNum = Number(expiration);
          
          const now = Math.floor(Date.now() / 1000);
          const isActive = expirationNum !== 0 && now <= expirationNum;
          const remaining = isActive ? expirationNum - now : 0;
          
          console.log('Session Debug:', {
            expiration: expirationNum,
            now: now,
            diff: expirationNum - now,
            isActive: isActive
          });
          
          setSessionActive(isActive);
          setRemainingTime(remaining);
          
        } catch (error) {
          console.error('Session check failed:', error);
          setSessionActive(false);
          setRemainingTime(0);
        }
      };
  
      checkSession();
      const interval = setInterval(checkSession, 1000); 
  
      return () => clearInterval(interval);
    }, [vaultAddress, provider]);
  
    useEffect(() => {
      if (activeTab === 'whitelist' && vaultAddress && provider) {
        loadWhitelist();
      }
    }, [activeTab, vaultAddress, provider]);
  
    const loadVaultData = async () => {
      try {
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, provider);
        
        console.log('Loading vault data for:', vaultAddress);
        
        let balance, passwordHash, whitelistPasswordHash, isActive, sessionExp, maxSpend, daily, spent, isPaused;
        
        try {
          balance = await vaultContract.balance();
          console.log('balance OK:', balance.toString());
        } catch (e) {
          console.error('balance() failed:', e.message);
          balance = 0n;
        }
        
        try {
          passwordHash = await vaultContract.passwordHash();
          console.log('passwordHash OK');
        } catch (e) {
          console.error('passwordHash() failed:', e.message);
          passwordHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
        }
        
        try {
          whitelistPasswordHash = await vaultContract.whitelistPasswordHash();
          console.log('whitelistPasswordHash OK');
        } catch (e) {
          console.error('whitelistPasswordHash() failed:', e.message);
          whitelistPasswordHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
        }
        
        try {
          isActive = await vaultContract.isSessionActive();
          console.log('isSessionActive OK:', isActive);
        } catch (e) {
          console.error('isSessionActive() failed:', e.message);
          isActive = false;
        }
        
        try {
          sessionExp = await vaultContract.sessionExpiration();
          console.log('sessionExpiration OK:', sessionExp.toString());
        } catch (e) {
          console.error('sessionExpiration() failed:', e.message);
          sessionExp = 0n;
        }
        
        try {
          maxSpend = await vaultContract.maxSingleSpend(account);
          console.log('maxSingleSpend OK:', maxSpend.toString());
        } catch (e) {
          console.error('maxSingleSpend() failed:', e.message);
          maxSpend = 0n;
        }
        
        try {
          daily = await vaultContract.dailyLimit(account);
          console.log('dailyLimit OK:', daily.toString());
        } catch (e) {
          console.error('dailyLimit() failed:', e.message);
          daily = 0n;
        }
        
        try {
          spent = await vaultContract.spentToday(account);
          console.log('spentToday OK:', spent.toString());
        } catch (e) {
          console.error('spentToday() failed:', e.message);
          spent = 0n;
        }
        
        try {
          isPaused = await vaultContract.paused();
          console.log('paused OK:', isPaused);
        } catch (e) {
          console.error('paused() failed:', e.message);
          isPaused = false;
        }
  
        setVaultData({
          balance: formatUnits(balance, 6),
          maxSingleSpend: formatUnits(maxSpend, 6),
          dailyLimit: formatUnits(daily, 6),
          spentToday: formatUnits(spent, 6),
          sessionExpiration: Number(sessionExp),
          passwordSet: passwordHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
          whitelistPasswordSet: whitelistPasswordHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
          paused: isPaused
        });
        
        setSessionActive(isActive);
        
      } catch (error) {
        console.error('Error loading vault data:', error);
        onNotification('Error loading vault data', 'error');
      }
    };
  
    const loadWhitelist = async () => {
      try {
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, provider);
        const addresses = await vaultContract.getWhitelistAddresses();
        
        const addressArray = addresses.map(addr => addr.toString());
        setWhitelistList(addressArray);
        
        console.log('Loaded whitelist:', addressArray);
        return addressArray;
      } catch (error) {
        console.error('Failed to load whitelist:', error);
        setWhitelistList([]);
        return [];
      }
    };
  
    const checkSessionStatus = async () => {
      try {
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, provider);
        const isActive = await vaultContract.isSessionActive();
        setSessionActive(isActive);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
  
    const setInitialPassword = async () => {
      const validation = validatePassword(password);
      if (!validation.valid) {
        onNotification(validation.message, 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(password, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.setPasswordHash(hashedPass);
        await tx.wait();
  
        onNotification('Password set successfully!', 'success');
        setPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to set password: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const setInitialWhitelistPassword = async () => {
      const validation = validatePassword(whitelistPassword);
      if (!validation.valid) {
        onNotification(validation.message, 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(whitelistPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.setWhitelistPasswordHash(hashedPass);
        await tx.wait();
  
        onNotification('Whitelist password set successfully!', 'success');
        setWhitelistPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to set whitelist password: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const unlockSession = async () => {
      if (!password) {
        onNotification('Please enter your password', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(password, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.unlockSession(hashedPass);
        await tx.wait();
  
        setSessionActive(true);
        onNotification('Session unlocked for 10 minutes!', 'success');
        setPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Wrong password or failed to unlock: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const lockSession = async () => {
      try {
        setIsLoading(true);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.lock();
        await tx.wait();
  
        setSessionActive(false);
        onNotification('Session locked!', 'success');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to lock session: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const changePassword = async () => {
      if (!vaultOldPassword || !vaultNewPassword) {
        onNotification('Please fill all fields', 'error');
        return;
      }
  
      const validation = validatePassword(vaultNewPassword);
      if (!validation.valid) {
        onNotification(validation.message, 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const oldHash = hashPassword(vaultOldPassword, account);
        const newHash = hashPassword(vaultNewPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.changePasswordHash(oldHash, newHash);
        await tx.wait();
  
        onNotification('Password changed successfully!', 'success');
        setVaultOldPassword('');
        setVaultNewPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to change password: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const changeWhitelistPassword = async () => {
      if (!whitelistOldPassword || !whitelistNewPassword) {
        onNotification('Please fill all fields', 'error');
        return;
      }
  
      const validation = validatePassword(whitelistNewPassword);
      if (!validation.valid) {
        onNotification(validation.message, 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const oldHash = hashPassword(whitelistOldPassword, account);
        const newHash = hashPassword(whitelistNewPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.changeWhitelistPasswordHash(oldHash, newHash);
        await tx.wait();
  
        onNotification('Whitelist password changed successfully!', 'success');
        setWhitelistOldPassword('');
        setWhitelistNewPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to change whitelist password: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const addToWhitelist = async () => {
      if (!whitelistAddress || !whitelistPassword) {
        onNotification('Please fill all fields', 'error');
        return;
      }
  
      if (!isAddress(whitelistAddress)) {
        onNotification('Invalid address', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(whitelistPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.addWhitelist(whitelistAddress, hashedPass);
        
        onNotification('Adding to whitelist...', 'info');
        await tx.wait();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedList = await loadWhitelist();
        
        onNotification('Address added to whitelist!', 'success');
        setWhitelistAddress('');
        setWhitelistPassword('');
        
        console.log('Whitelist updated:', updatedList);
      } catch (error) {
        console.error('Add to whitelist error:', error);
        onNotification('Failed to add to whitelist: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const removeFromWhitelist = async (address) => {
      if (!whitelistPassword) {
        onNotification('Please enter whitelist password', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(whitelistPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.removeWhitelist(address, hashedPass);
        
        onNotification('Removing from whitelist...', 'info');
        await tx.wait();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadWhitelist();
        
        onNotification('Address removed from whitelist!', 'success');
        setWhitelistPassword('');
      } catch (error) {
        console.error('Remove from whitelist error:', error);
        onNotification('Failed to remove from whitelist: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const approveUSDC = async (amount) => {
      try {
        const usdcAddress = getAddress(CONTRACT_ADDRESSES.usdc);
        const usdcContract = new Contract(usdcAddress, ERC20_ABI, signer);
        const tx = await usdcContract.approve(vaultAddress, parseUnits(amount, 6));
        await tx.wait();
        return true;
      } catch (error) {
        console.error('Approve error:', error);
        return false;
      }
    };
  
    const depositUSDC = async () => {
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        onNotification('Please enter a valid amount', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        
        onNotification('Approving USDC...', 'info');
        const approved = await approveUSDC(depositAmount);
        
        if (!approved) {
          onNotification('Failed to approve USDC', 'error');
          return;
        }
        
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.deposit(parseUnits(depositAmount, 6));
        await tx.wait();
  
        onNotification(`Successfully deposited ${depositAmount} USDC!`, 'success');
        setDepositAmount('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to deposit: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const transferUSDC = async () => {
      if (!transferTo || !transferAmount) {
        onNotification('Please fill all fields', 'error');
        return;
      }
  
      if (!isAddress(transferTo)) {
        onNotification('Invalid address', 'error');
        return;
      }
  
      if (parseFloat(transferAmount) <= 0) {
        onNotification('Invalid amount', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.transferUSDC(
          transferTo,
          parseUnits(transferAmount, 6)
        );
        await tx.wait();
  
        onNotification(`Successfully transferred ${transferAmount} USDC!`, 'success');
        setTransferTo('');
        setTransferAmount('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to transfer: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const updateLimits = async () => {
      if (!maxSingle || !dailyLimit) {
        onNotification('Please fill all fields', 'error');
        return;
      }
  
      if (parseFloat(maxSingle) <= 0 || parseFloat(dailyLimit) <= 0) {
        onNotification('Amounts must be greater than 0', 'error');
        return;
      }
  
      if (parseFloat(maxSingle) > parseFloat(dailyLimit)) {
        onNotification('Single spend limit cannot exceed daily limit', 'error');
        return;
      }
  
      try {
        setIsLoading(true);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.setLimits(
          parseUnits(maxSingle, 6),
          parseUnits(dailyLimit, 6)
        );
        await tx.wait();
  
        onNotification('Limits updated successfully!', 'success');
        setMaxSingle('');
        setDailyLimit('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to set limits: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const withdrawAll = async () => {
      if (!withdrawPassword) {
        onNotification('Please enter your whitelist password', 'error');
        return;
      }
  
      if (!sessionActive) {
        onNotification('Please unlock your session first', 'error');
        return;
      }
  
      const isInWhitelist = whitelistList.some(
        addr => addr.toLowerCase() === account.toLowerCase()
      );
      
      if (!isInWhitelist) {
        onNotification('Your address must be in whitelist to withdraw', 'error');
        return;
      }
  
      if (!window.confirm('Are you sure you want to withdraw all USDC to your wallet?')) {
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(withdrawPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.withdrawAll(account, hashedPass);
        await tx.wait();
  
        onNotification('Successfully withdrawn all USDC!', 'success');
        setWithdrawPassword('');
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to withdraw: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const togglePause = async () => {
      try {
        setIsLoading(true);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = vaultData.paused 
          ? await vaultContract.unpause() 
          : await vaultContract.pause();
        await tx.wait();
  
        onNotification(
          vaultData.paused ? 'Vault unpaused!' : 'Vault paused!',
          'success'
        );
        await loadVaultData();
      } catch (error) {
        onNotification('Failed to change vault status: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const changeOwner = async () => {
      if (!newOwnerAddress) {
        onNotification('Please enter new owner address', 'error');
        return;
      }
  
      if (!isAddress(newOwnerAddress)) {
        onNotification('Invalid address', 'error');
        return;
      }
  
      if (!ownershipPassword) {
        onNotification('Please enter your whitelist password', 'error');
        return;
      }
  
      if (!sessionActive) {
        onNotification('Please unlock your session first', 'error');
        return;
      }
  
      if (!window.confirm(`Are you sure you want to transfer ownership to ${newOwnerAddress}? This action is IRREVERSIBLE!`)) {
        return;
      }
  
      try {
        setIsLoading(true);
        const hashedPass = hashPassword(ownershipPassword, account);
        const vaultContract = new Contract(vaultAddress, VAULT_ABI, signer);
        const tx = await vaultContract.transferOwnership(newOwnerAddress, hashedPass);
        await tx.wait();
  
        onNotification('Ownership transferred successfully!', 'success');
        setNewOwnerAddress('');
        setOwnershipPassword('');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        onNotification('Failed to change owner: ' + (error.reason || error.message), 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <nav className="relative z-10 px-6 py-6 flex justify-between items-center border-b border-gray-800/50">
          <div className="flex items-center space-x-3">
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent block">
                Lokr
              </span>
              <span className="text-xs text-gray-400">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                loadVaultData();
                onNotification('Data refreshed', 'success');
              }}
              className="p-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl hover:border-red-500/50 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-gray-400 hover:text-red-400" />
            </button>
  
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Vault Address</div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">{formatAddress(vaultAddress)}</span>
                <button 
                  onClick={() => {
                    copyToClipboard(vaultAddress);
                    onNotification('Copied to clipboard!', 'success');
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Connected</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-mono">{formatAddress(account)}</span>
              </div>
            </div>
          </div>
        </nav>
  
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Balance</span>
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white">{parseFloat(vaultData.balance).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">USDC</div>
            </div>
  
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Session Status</span>
                {sessionActive ? <Unlock className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-red-400" />}
              </div>
              <div className={`text-lg font-bold ${sessionActive ? 'text-green-400' : 'text-red-400'}`}>
                {sessionActive ? 'Unlocked' : 'Locked'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sessionActive 
                  ? `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')} remaining` 
                  : 'Unlock to access'}
              </div>
            </div>
      
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Daily Limit</span>
                <Settings className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{parseFloat(vaultData.dailyLimit).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Spent: {parseFloat(vaultData.spentToday).toFixed(2)} USDC
              </div>
            </div>
  
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Single Limit</span>
                <Shield className="w-5 h-5 text-red-300" />
              </div>
              <div className="text-2xl font-bold text-white">{parseFloat(vaultData.maxSingleSpend).toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">USDC per transfer</div>
            </div>
          </div>
  
          <div className="flex space-x-2 mb-6 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2">
            {['overview', 'transfer', 'whitelist', 'limits', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
  
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Vault Overview</h2>
                
                {!vaultData.passwordSet && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">Setup Required</h3>
                        <p className="text-gray-300 mb-4">Your vault password is not set. Set it up in the Settings tab to unlock your vault.</p>
                      </div>
                    </div>
                  </div>
                )}
  
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-red-400" />
                      <span>Session Management</span>
                    </h3>
                    
                    {vaultData.passwordSet ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={unlockSession}
                            disabled={isLoading || sessionActive}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                            <span>Unlock</span>
                          </button>
                          
                          <button
                            onClick={lockSession}
                            disabled={isLoading || !sessionActive}
                            className="px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            <Lock className="w-5 h-5" />
                            <span>Lock</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-6">
                        Set up your password in Settings first
                      </div>
                    )}
                  </div>
  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span>Deposit USDC</span>
                    </h3>
                    
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount to deposit"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                    />
                    
                    <button
                      onClick={depositUSDC}
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      <span>Deposit</span>
                    </button>
                  </div>
                </div>
  
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="text-xl font-bold flex items-center space-x-2 mb-4">
                    <Send className="w-5 h-5 text-orange-400" />
                    <span>Withdraw All USDC</span>
                  </h3>
                  
                  {!sessionActive && (
                    <div className="text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-4">
                      ⚠️ Unlock your session first to withdraw
                    </div>
                  )}
  
                  {!whitelistList.some(addr => addr.toLowerCase() === account.toLowerCase()) && (
                    <div className="text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-4">
                      ⚠️ Add your address to whitelist first
                    </div>
                  )}
                  
                  <input
                    type="password"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder="Enter whitelist password"
                    disabled={!sessionActive}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 mb-4"
                  />
  
                  <button
                    onClick={withdrawAll}
                    disabled={isLoading || !sessionActive}
                    className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span>Withdraw All</span>
                  </button>
                </div>
  
                <div className="mt-8 pt-8 border-t border-gray-700/50">
                  <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Password Status</div>
                      <div className={`font-bold flex items-center space-x-2 ${vaultData.passwordSet ? 'text-green-400' : 'text-red-400'}`}>
                        {vaultData.passwordSet ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{vaultData.passwordSet ? 'Configured' : 'Not Set'}</span>
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Whitelist Password</div>
                      <div className={`font-bold flex items-center space-x-2 ${vaultData.whitelistPasswordSet ? 'text-green-400' : 'text-red-400'}`}>
                        {vaultData.whitelistPasswordSet ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{vaultData.whitelistPasswordSet ? 'Configured' : 'Not Set'}</span>
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Vault Status</div>
                      <div className={`font-bold flex items-center space-x-2 ${vaultData.paused ? 'text-red-400' : 'text-green-400'}`}>
                        {vaultData.paused ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        <span>{vaultData.paused ? 'Paused' : 'Active'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'transfer' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Transfer USDC</h2>
                
                {!sessionActive && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-red-400 mb-2">Session Locked</h3>
                        <p className="text-gray-300">Unlock your session in the Overview tab to make transfers.</p>
                      </div>
                    </div>
                  </div>
                )}
  
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                      disabled={!sessionActive}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="text-xs text-gray-500 mt-2">Address must be in your whitelist</div>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USDC)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={!sessionActive}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Max single: {vaultData.maxSingleSpend} USDC</span>
                      <span>Available today: {(parseFloat(vaultData.dailyLimit) - parseFloat(vaultData.spentToday)).toFixed(2)} USDC</span>
                    </div>
                  </div>
  
                  <button
                    onClick={transferUSDC}
                    disabled={isLoading || !sessionActive}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    <span>Send USDC</span>
                  </button>
                </div>
  
                <div className="mt-8 pt-8 border-t border-gray-700/50">
                  <h3 className="text-lg font-bold mb-4">Transfer Limits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Single Transaction</div>
                      <div className="text-2xl font-bold text-red-400">{vaultData.maxSingleSpend} USDC</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Daily Remaining</div>
                      <div className="text-2xl font-bold text-red-300">
                        {(parseFloat(vaultData.dailyLimit) - parseFloat(vaultData.spentToday)).toFixed(2)} USDC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'whitelist' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Whitelist Management</h2>
                
                {!vaultData.whitelistPasswordSet && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">Setup Required</h3>
                        <p className="text-gray-300">Set up your whitelist password in Settings to manage addresses.</p>
                      </div>
                    </div>
                  </div>
                )}
  
                {!sessionActive && vaultData.whitelistPasswordSet && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-red-400 mb-2">Session Locked</h3>
                        <p className="text-gray-300">Unlock your session to manage whitelist addresses.</p>
                      </div>
                    </div>
                  </div>
                )}
  
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Add Address to Whitelist</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <input
                      type="text"
                      value={whitelistAddress}
                      onChange={(e) => setWhitelistAddress(e.target.value)}
                      placeholder="0x..."
                      disabled={!sessionActive || !vaultData.whitelistPasswordSet}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Whitelist Password</label>
                    <input
                      type="password"
                      value={whitelistPassword}
                      onChange={(e) => setWhitelistPassword(e.target.value)}
                      placeholder="Enter whitelist password"
                      disabled={!sessionActive || !vaultData.whitelistPasswordSet}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
  
                  <button
                    onClick={addToWhitelist}
                    disabled={isLoading || !sessionActive || !vaultData.whitelistPasswordSet}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    <span>Add to Whitelist</span>
                  </button>
                </div>
  
                <div className="mt-8 pt-8 border-t border-gray-700/50">
                  <h3 className="text-xl font-bold mb-4">Whitelisted Addresses</h3>
                  
                  {whitelistList.length === 0 ? (
                    <div className="text-gray-400 bg-gray-900/50 rounded-xl p-6 text-center">
                      No addresses in whitelist yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {whitelistList.map((addr, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-900/50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-mono text-gray-300">{addr}</span>
                          </div>
  
                          <button
                            onClick={() => removeFromWhitelist(addr)}
                            disabled={!sessionActive || isLoading}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {activeTab === 'limits' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Spending Limits</h2>
  
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-blue-400 mb-2">About Limits</h3>
                      <p className="text-gray-300">Set maximum spending limits to protect your vault. Single transaction limit cannot exceed daily limit.</p>
                    </div>
                  </div>
                </div>
  
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Current Limits</h3>
                    
                    <div className="bg-gray-900/50 rounded-xl p-6 space-y-4">
                      <div>
                        <div className="text-gray-400 text-sm mb-2">Maximum Single Transaction</div>
                        <div className="text-3xl font-bold text-red-400">{vaultData.maxSingleSpend} USDC</div>
                      </div>
                      
                      <div className="border-t border-gray-700/50 pt-4">
                        <div className="text-gray-400 text-sm mb-2">Daily Limit</div>
                        <div className="text-3xl font-bold text-red-300">{vaultData.dailyLimit} USDC</div>
                      </div>
  
                      <div className="border-t border-gray-700/50 pt-4">
                        <div className="text-gray-400 text-sm mb-2">Spent Today</div>
                        <div className="text-2xl font-bold text-gray-300">{vaultData.spentToday} USDC</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Remaining: {(parseFloat(vaultData.dailyLimit) - parseFloat(vaultData.spentToday)).toFixed(2)} USDC
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Update Limits</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Maximum Single Transaction (USDC)</label>
                      <input
                        type="number"
                        value={maxSingle}
                        onChange={(e) => setMaxSingle(e.target.value)}
                        placeholder="e.g. 100"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Daily Limit (USDC)</label>
                      <input
                        type="number"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                        placeholder="e.g. 1000"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
  
                    <button
                      onClick={updateLimits}
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
                      <span>Update Limits</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-2">Vault Settings</h2>
  
                <div className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    <span>Vault Password</span>
                  </h3>
  
                  {!vaultData.passwordSet ? (
                    <>
                      <div className="text-sm text-gray-400 mb-4">
                        Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create vault password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
  
                      <button
                        onClick={setInitialPassword}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                        <span>Set Password</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-green-400 mb-4 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Password is configured</span>
                      </div>
                      
                      <input
                        type="password"
                        value={vaultOldPassword}
                        onChange={(e) => setVaultOldPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        value={vaultNewPassword}
                        onChange={(e) => setVaultNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
  
                      <button
                        onClick={changePassword}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                          <span>Change Password</span>
                      </button>
                    </>
                  )}
                </div>
  
                <div className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-300" />
                    <span>Whitelist Password</span>
                  </h3>
  
                  {!vaultData.whitelistPasswordSet ? (
                    <>
                      <div className="text-sm text-gray-400 mb-4">
                        Separate password for managing whitelist addresses. Must meet same requirements as vault password.
                      </div>
                      <input
                        type="password"
                        value={whitelistPassword}
                        onChange={(e) => setWhitelistPassword(e.target.value)}
                        placeholder="Create whitelist password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
  
                      <button
                        onClick={setInitialWhitelistPassword}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-400 rounded-xl font-semibold hover:from-red-600 hover:to-red-500 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                        <span>Set Whitelist Password</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-green-400 mb-4 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Whitelist password is configured</span>
                      </div>
  
                      <input
                        type="password"
                        value={whitelistOldPassword}
                        onChange={(e) => setWhitelistOldPassword(e.target.value)}
                        placeholder="Current whitelist password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        value={whitelistNewPassword}
                        onChange={(e) => setWhitelistNewPassword(e.target.value)}
                        placeholder="New whitelist password"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
                      />
  
                      <button
                        onClick={changeWhitelistPassword}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        <span>Change Whitelist Password</span>
                      </button>
                    </>
                  )}
                </div>
  
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2 text-orange-400">
                    <RefreshCw className="w-5 h-5" />
                    <span>Transfer Ownership</span>
                  </h3>
  
                  <div className="text-sm text-gray-400">
                    Transfer vault ownership to another address. This action is irreversible.
                    Requires active session and whitelist password.
                  </div>
  
                  {!sessionActive && (
                    <div className="text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
                      ⚠️ Unlock your session first
                    </div>
                  )}
  
                  <input
                    type="text"
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    placeholder="New owner address (0x...)"
                    disabled={!sessionActive}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-orange-700 rounded-xl focus:border-orange-500 focus:outline-none disabled:opacity-50"
                  />
  
                  <input
                    type="password"
                    value={ownershipPassword}
                    onChange={(e) => setOwnershipPassword(e.target.value)}
                    placeholder="Enter whitelist password"
                    disabled={!sessionActive}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-orange-700 rounded-xl focus:border-orange-500 focus:outline-none disabled:opacity-50"
                  />
  
                  <button
                    onClick={changeOwner}
                    disabled={isLoading || !sessionActive}
                    className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    <span>Transfer Ownership</span>
                  </button>
                </div>
  
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Emergency Controls</span>
                  </h3>
  
                  <div className="text-sm text-gray-400">
                    {vaultData.paused 
                      ? 'Your vault is currently paused. No transfers can be made.' 
                      : 'Pause your vault to prevent all transfers temporarily.'
                    }
                  </div>
  
                  <button
                    onClick={togglePause}
                    disabled={isLoading}
                    className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 ${
                      vaultData.paused
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    } disabled:opacity-50`}
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 
                     vaultData.paused ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />
                    }
                    <span>{vaultData.paused ? 'Unpause Vault' : 'Pause Vault'}</span>
                  </button>
                </div>
              </div>
            )}
  
          </div>
        </div>
      </div>
    );
  }
