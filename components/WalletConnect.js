import { Wallet, Shield, ArrowRight, Lock, Send, Copy } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { formatAddress, copyToClipboard } from '@/lib/utils';

export default function WalletConnect({ onConnect, isLoading, onNotification }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="w-10 h-10 text-purple-400" />
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Arc Vault
            </span>
            <span className="text-xs text-gray-400">Secure Asset Management</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-300">Arc Testnet</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Secure Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mt-2">
              Digital Assets
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade vault system with password protection, spending limits, and whitelist management. Your security, your control.
          </p>
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center space-x-3">
              <Wallet className="w-6 h-6" />
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: <Shield className="w-12 h-12" />,
              title: 'Password Protected',
              description: 'Multi-layer password system for vault access and whitelist management'
            },
            {
              icon: <Lock className="w-12 h-12" />,
              title: 'Spending Limits',
              description: 'Set daily and per-transaction limits for enhanced security'
            },
            {
              icon: <Send className="w-12 h-12" />,
              title: 'Whitelist Control',
              description: 'Manage approved addresses for secure USDC transfers'
            }
          ].map((feature, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-12">Built on Arc Network</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="text-purple-400 mb-3 font-mono text-sm">Factory Contract</div>
              <div className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3">
                <span className="text-xs text-gray-400 font-mono">{formatAddress(CONTRACT_ADDRESSES.factory)}</span>
                <button 
                  onClick={() => {
                    copyToClipboard(CONTRACT_ADDRESSES.factory);
                    onNotification('Copied to clipboard!', 'success');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="text-pink-400 mb-3 font-mono text-sm">USDC Contract</div>
              <div className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3">
                <span className="text-xs text-gray-400 font-mono">{formatAddress(CONTRACT_ADDRESSES.usdc)}</span>
                <button 
                  onClick={() => {
                    copyToClipboard(CONTRACT_ADDRESSES.usdc);
                    onNotification('Copied to clipboard!', 'success');
                  }}
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
