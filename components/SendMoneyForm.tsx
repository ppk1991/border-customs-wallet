import React, { useState } from 'react';
import { WALLETS, computeRiskScore } from '../services/geminiService'; // repurposed
import { CrossingContext, RiskResult } from '../types';
import WalletSummary from './BalanceCard'; // repurposed
import SystemAlerts from './SystemAlerts'; // new
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
    origin_country: 'TR',
    destination_country: 'DE',
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
      <h2 className="text-2xl font-bold mb-6">Border Guard and Customs Dashboard</h2>
      
      <div className="mb-8">
        <label htmlFor="wallet-select" className="block text-sm font-medium text-gray-400 mb-1">Scan / select wallet token</label>
        <select
          id="wallet-select"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setResult(null); // Reset result when wallet changes
          }}
          className="w-full max-w-sm bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
          {walletIds.map(id => <option key={id} value={id}>{id} | {WALLETS[id].owner.full_name} | Updated {timeAgo(WALLETS[id].last_updated)}</option>)}
        </select>
      </div>

      <div className="space-y-8">
        {/* Integrated View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Border Control */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cyan-400">Border Control - Identity & Travel</h3>
            <WalletSummary wallet={wallet} />
            <SystemAlerts alerts={wallet.owner.system_alerts} />
          </div>
          {/* Right Column: Customs Control */}
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Customs Control - Goods Declaration</h3>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>

        <hr className="border-gray-700" />

        <div className="text-center">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Risk Analysis</h3>
            <p className="text-sm text-gray-400 mb-4 max-w-xl mx-auto">Run analysis based on combined traveler identity, travel history, and customs declaration data to generate a unified risk score.</p>
            <button onClick={handleRunAnalysis} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Run Risk Analysis</button>
        </div>
        
        {result && (
          <>
            <hr className="border-gray-700" />
            <RiskAnalysisResult result={result} />
          </>
        )}
      </div>

       {/* Floating JSON Viewer */}
       <details className="fixed bottom-4 right-4 max-w-md w-full">
        <summary className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex justify-between items-center">
          <span>View Raw Wallet Data</span>
          <span className="text-xs text-gray-400">▼</span>
        </summary>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mt-2 max-h-80 overflow-auto">
          <pre className="text-xs text-gray-300">
            {JSON.stringify(selectedWalletAsJson, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
};

export default OfficerView;