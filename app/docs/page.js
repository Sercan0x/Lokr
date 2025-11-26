"use client";

import { Shield, Lock, Wallet, Users, Clock, CheckCircle, ArrowLeft, Rocket, Code } from 'lucide-react';
import Link from 'next/link';

export default function Docs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Shield className="w-10 h-10 text-red-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            Lokr
          </span>
        </Link>
        
        <Link
          href="/"
          className="px-4 py-2 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Back to App</span>
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to know about Lokr Vault
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">What is Lokr?</h2>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <p className="text-gray-300 leading-relaxed mb-4">
              Lokr is a decentralized USDC vault protocol built on Arc Network. It provides users with a secure, 
              non-custodial way to store and manage their USDC tokens with advanced security features.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Unlike traditional wallets, Lokr adds multiple layers of protection including password verification, 
              spending limits, and whitelist controls. Your funds remain in your personal smart contract vault, 
              giving you complete ownership and control.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">Why Use Lokr?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="font-bold text-lg mb-2 text-red-400">Protection Against Hacks</h3>
              <p className="text-gray-400 text-sm">
                Even if your wallet is compromised, attackers cannot drain your vault without the password and must respect spending limits.
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="font-bold text-lg mb-2 text-red-400">Self-Custody</h3>
              <p className="text-gray-400 text-sm">
                Your vault is a smart contract you own. No third party can access or freeze your funds.
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="font-bold text-lg mb-2 text-red-400">Controlled Spending</h3>
              <p className="text-gray-400 text-sm">
                Set daily limits to prevent large unauthorized transfers, even if someone gains access.
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="font-bold text-lg mb-2 text-red-400">Whitelist Security</h3>
              <p className="text-gray-400 text-sm">
                Only send to pre-approved addresses. Prevents transfers to unknown or malicious wallets.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">Core Features</h2>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 space-y-6">
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Lock className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Password Protection</h3>
                <p className="text-gray-400 text-sm">
                  Set a secure password hash stored on-chain. Every withdrawal requires password verification. 
                  The password is hashed client-side and never exposed.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Spending Limits</h3>
                <p className="text-gray-400 text-sm">
                  Configure daily spending limits and per-transaction maximums. Limits reset every 24 hours. 
                  Perfect for limiting exposure in case of compromise.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Whitelist Management</h3>
                <p className="text-gray-400 text-sm">
                  Enable whitelist mode to restrict transfers only to approved addresses. 
                  Add or remove addresses anytime. Disable whitelist for unrestricted transfers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Wallet className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Easy Deposits</h3>
                <p className="text-gray-400 text-sm">
                  Deposit USDC anytime without restrictions. Your vault address is displayed for easy transfers 
                  from any wallet or exchange.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">How to Use</h2>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Connect Your Wallet</h3>
                  <p className="text-gray-400 text-sm">
                    Connect with MetaMask or any compatible wallet. Make sure you're on Arc Network.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Create Your Vault</h3>
                  <p className="text-gray-400 text-sm">
                    Click "Create Vault" to deploy your personal vault smart contract. This is a one-time action.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Set Password</h3>
                  <p className="text-gray-400 text-sm">
                    Choose a strong password. This will be required for all withdrawals. Store it safely - it cannot be recovered.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Configure Security</h3>
                  <p className="text-gray-400 text-sm">
                    Set your daily spending limit and optionally enable whitelist mode with trusted addresses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Deposit & Manage</h3>
                  <p className="text-gray-400 text-sm">
                    Send USDC to your vault address. Withdraw anytime with your password, respecting your security limits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">Coming Soon</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-lg text-red-400">Multi-Signature Support</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Require multiple approvals for large transactions. Perfect for teams, DAOs, or extra personal security. 
                Configure 2-of-3, 3-of-5, or custom threshold schemes.
              </p>
              <div className="mt-4 inline-block px-3 py-1 bg-red-500/20 rounded-full text-xs text-red-300">
                In Development
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-lg text-red-400">Developer Security Tools</h3>
              </div>
              <p className="text-gray-400 text-sm">
                API access for developers to integrate vault security into their dApps. 
                Programmable spending rules, webhooks for transactions, and SDK for easy integration.
              </p>
              <div className="mt-4 inline-block px-3 py-1 bg-red-500/20 rounded-full text-xs text-red-300">
                Planned
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Built on Arc Network • Secured by Smart Contracts
          </p>
        </div>

      </div>
    </div>
  );
}
