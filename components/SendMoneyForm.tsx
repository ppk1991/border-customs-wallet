import React, { useState } from 'react';
import { WALLETS, computeRiskScore } from '../services/geminiService'; // repurposed
import { CrossingContext, RiskResult } from '../types';
import WalletSummary from './BalanceCard'; // repurposed
import RiskAnalysisResult from './CurrencyConverter'; // repurposed
import { timeAgo } from '../utils';

const PREDEFINED_GOODS_TYPES = ["personal", "commercial", "dual-use", "high-risk"];

const OfficerView: React.FC = () => {
  const walletIds = Object.keys(WALLETS);
  const [selectedId, setSelectedId] = useState<string>(walletIds[0]);
  const wallet = WALLETS[selectedId];

  const [context, setContext] = useState<CrossingContext>({
    direction: 'entry',
    border_type: 'land',
    origin_country: 'UA',
    destination_country: 'RO',
    transport_mode: 'car',
    has_customs_declaration: true,
    declared_goods_value: 5000,
    goods_type: 'personal',
    num_items: 5,
  });

  const [result, setResult] = useState<RiskResult | null>(null);

  const handleContextChange = (field: keyof CrossingContext, value: any) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const handleGoodsTypeDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // If 'other' is selected, clear the goods type to show the custom input field.
    // Otherwise, set the selected predefined type.
    const newGoodsType = value === 'other' ? '' : value;
    handleContextChange('goods_type', newGoodsType);
  };
  
  const handleCustomGoodsTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Directly update the context with the custom value.
      handleContextChange('goods_type', e.target.value);
  };

  const handleRunAnalysis = () => {
    const analysisResult = computeRiskScore(wallet, context);
    setResult(analysisResult);
  };
  
  const selectedWalletAsJson = {
    wallet: wallet,
    crossing_context: context,
  }

  const isOtherSelected = !PREDEFINED_GOODS_TYPES.includes(context.goods_type);
  const dropdownValue = isOtherSelected ? 'other' : context.goods_type;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Officer View – Border & Customs Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="wallet-select" className="block text-sm font-medium text-gray-400 mb-1">Scan / select wallet token</label>
          <select
            id="wallet-select"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setResult(null); // Reset result when wallet changes
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            {walletIds.map(id => <option key={id} value={id}>{id} - {WALLETS[id].owner.full_name} (Updated: {timeAgo(WALLETS[id].last_updated)})</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-2">1. Traveler Overview</h3>
          <WalletSummary wallet={wallet} />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">2. Crossing Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Direction</label>
                <select value={context.direction} onChange={e => handleContextChange('direction', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                  <option value="entry">Entry</option>
                  <option value="exit">Exit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Border Type</label>
                <select value={context.border_type} onChange={e => handleContextChange('border_type', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                  <option value="land">Land</option>
                  <option value="air">Air</option>
                  <option value="sea">Sea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Mode of Transport</label>
                <select value={context.transport_mode} onChange={e => handleContextChange('transport_mode', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                  <option>car</option>
                  <option>truck</option>
                  <option>bus</option>
                  <option>train</option>
                  <option>air</option>
                  <option>sea</option>
                </select>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Goods Type</label>
                <select 
                  value={dropdownValue} 
                  onChange={handleGoodsTypeDropdownChange} 
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                >
                  {PREDEFINED_GOODS_TYPES.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                  <option value="other">Other...</option>
                </select>
              </div>

              {isOtherSelected && (
                <div>
                  {/* <label className="block text-sm font-medium text-gray-400">Please Specify Goods</label> */}
                  <input
                    type="text"
                    value={context.goods_type}
                    onChange={handleCustomGoodsTypeChange}
                    placeholder="Please specify goods..."
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400"
                  />
                </div>
              )}
               <div>
                <label className="block text-sm font-medium text-gray-400">Number of items</label>
                <input type="number" min="0" step="1" value={context.num_items} onChange={e => handleContextChange('num_items', parseInt(e.target.value, 10))} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Declared Goods Value (EUR)</label>
                <input type="number" value={context.declared_goods_value} onChange={e => handleContextChange('declared_goods_value', parseFloat(e.target.value))} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
              </div>
              <div className="flex items-center pt-2">
                <input id="customs-declaration-checkbox" type="checkbox" checked={context.has_customs_declaration} onChange={e => handleContextChange('has_customs_declaration', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                <label htmlFor="customs-declaration-checkbox" className="ml-2 block text-sm text-gray-300">Customs declaration submitted?</label>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
            <button onClick={handleRunAnalysis} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition text-lg">
                Run Risk Analysis
            </button>
        </div>

        {result && <RiskAnalysisResult result={result} />}

        <hr className="border-gray-700" />
        <details className="bg-gray-800 border border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-700 font-semibold">View raw structured data (for audit / integration)</summary>
            <div className="p-4 bg-gray-900 border-t border-gray-700">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{JSON.stringify(selectedWalletAsJson, null, 2)}</pre>
            </div>
        </details>
      </div>
    </div>
  );
};

export default OfficerView;