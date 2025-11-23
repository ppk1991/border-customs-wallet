
import React from 'react';
import { FingerPrintIcon, WalletIcon } from './Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center items-center mb-6">
          <WalletIcon className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Digital Wallet Prototype</h1>
        <p className="text-gray-400 mb-8">
          A research demo for digital wallets, and border and customs risk analysis.
        </p>
        <button
          onClick={onLogin}
          className="w-full inline-flex items-center justify-center font-bold py-3 px-6 rounded-lg transition-colors bg-cyan-600 hover:bg-cyan-500 text-white text-lg disabled:opacity-50"
        >
          <FingerPrintIcon className="w-6 h-6 mr-3" />
          Login / Authenticate
        </button>
        <p className="text-xs text-gray-500 mt-6">
            Note: This is a prototype. Authentication is simulated for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;