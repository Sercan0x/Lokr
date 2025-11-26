import { Shield, Plus, Wallet, Lock, Send, CheckCircle } from 'lucide-react';
import { formatAddress } from '@/lib/utils';

export default function VaultCreation({ account, onCreateVault, isLoading }) {
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-700/50">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">{formatAddress(account)}</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Create Your
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Personal Vault
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Deploy your own secure vault contract on Arc Network. One vault per wallet address.
          </p>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Your Vault Will Include</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'Password Protection',
                description: 'Secure your vault with a custom password'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Spending Limits',
                description: 'Set daily and per-transaction limits'
              },
              {
                icon: <Send className="w-8 h-8" />,
                title: 'Whitelist System',
                description: 'Control who can receive your funds'
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="text-purple-400 mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">One-Time Deployment</h3>
              <p className="text-sm text-gray-400">
                Your vault contract will be deployed to Arc Network. This is a one-time transaction.
              </p>
            </div>
          </div>
          
          <button
            onClick={onCreateVault}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Vault...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Vault</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
