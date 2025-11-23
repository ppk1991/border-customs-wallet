import React, { useState, useRef, useEffect } from 'react';
import { WALLETS } from '../services/geminiService'; // repurposed
import WalletSummary from './BalanceCard'; // repurposed
import CredentialsList from './TransactionHistory'; // repurposed
import { timeAgo } from '../utils';
import { FingerPrintIcon, SearchIcon } from './Icons';

const CREDENTIAL_TYPE_DESCRIPTIONS: Record<string, string> = {
    "eID": "Electronic Identification. A digital version of a national ID card or passport.",
    "Visa": "An official document permitting entry into and travel within a specific country.",
    "Vaccination": "A digital record of immunizations, like the EU Digital COVID Certificate."
};

const TravelerView: React.FC = () => {
  const walletIds = Object.keys(WALLETS);
  const [selectedId, setSelectedId] = useState<string>(walletIds[0]);
  const wallet = WALLETS[selectedId];

  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Biometric scan state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [biometricToken, setBiometricToken] = useState<string>('');
  const scanTimeoutRef = useRef<number | null>(null);

  // Dynamically generate filter options from the current wallet's credentials
  const credentialTypes = ['All', ...Array.from(new Set(wallet.credentials.map(c => c.cred_type)))];

  const handleWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
    }
    setSelectedId(e.target.value);
    setFilterType('All'); // Reset filter when wallet changes for better UX
    setSearchQuery(''); // Also reset search query
    // Reset biometric scan state
    setIsScanning(false);
    setScanComplete(false);
    setBiometricToken('');
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setBiometricToken('');

    scanTimeoutRef.current = window.setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        // Simulate a base64 encoded token from wallet ID and current timestamp
        const token = `BIO_TOKEN::${btoa(wallet.wallet_id + "::" + Date.now())}`;
        setBiometricToken(token);
        scanTimeoutRef.current = null;
    }, 2500);
  };

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }
        };
    }, []);

  // Filter credentials based on the selected type AND search query
  const filteredCredentials = wallet.credentials.filter(cred => {
    const typeMatch = filterType === 'All' || cred.cred_type === filterType;
    
    const query = searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
                        cred.issuer.toLowerCase().includes(query) || 
                        cred.id_number.toLowerCase().includes(query);

    return typeMatch && searchMatch;
  });


  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Traveler View – Digital Wallet</h2>
      
      <div className="mb-6 max-w-sm">
        <label htmlFor="wallet-select" className="block text-sm font-medium text-gray-400 mb-1">Select a sample wallet</label>
        <select
          id="wallet-select"
          value={selectedId}
          onChange={handleWalletChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
          {walletIds.map(id => <option key={id} value={id}>{id} - {WALLETS[id].owner.full_name} (Updated: {timeAgo(WALLETS[id].last_updated)})</option>)}
        </select>
      </div>

      <div className="space-y-6">
        <WalletSummary wallet={wallet} />
        <hr className="border-gray-700" />
        
        {/* Credentials Section with Filter */}
        <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Stored Credentials</h3>
            
            <div className="space-y-4 mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              {/* Search Input */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by issuer or ID number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-400 mr-2 shrink-0">Filter by type:</span>
                  {credentialTypes.map(type => {
                    const tooltipId = `tooltip-${type.replace(/\s+/g, '-')}`;
                    const hasTooltip = CREDENTIAL_TYPE_DESCRIPTIONS[type];
                    return (
                      <div key={type} className="relative group">
                          <button
                              onClick={() => setFilterType(type)}
                              aria-describedby={hasTooltip ? tooltipId : undefined}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                  filterType === type 
                                      ? 'bg-cyan-600 text-white font-semibold' 
                                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                              }`}
                          >
                              {type}
                          </button>
                          {hasTooltip && (
                            <div 
                              id={tooltipId}
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 bg-gray-900 border border-gray-600 text-gray-300 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 invisible group-hover:visible group-focus-within:visible z-10">
                              {CREDENTIAL_TYPE_DESCRIPTIONS[type]}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-600"></div>
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <CredentialsList credentials={filteredCredentials} searchQuery={searchQuery} />
        </div>

        <hr className="border-gray-700" />
        <div>
            <h3 className="text-lg font-semibold text-cyan-400">Biometric Scan (Simulated)</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">In a real system, biometrics (like a fingerprint or face scan) would generate a secure, single-use token to authorize wallet access without revealing private keys.</p>

            <button
                onClick={handleBiometricScan}
                disabled={isScanning}
                className={`inline-flex items-center justify-center font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait ${
                    scanComplete 
                        ? 'bg-green-600 hover:bg-green-500 text-white' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
            >
                <FingerPrintIcon className="w-5 h-5 mr-2" />
                {isScanning ? 'Scanning...' : (scanComplete ? 'Scan Complete ✓' : 'Authorize with Biometrics')}
            </button>

            {scanComplete && biometricToken && (
                <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-400">Generated Biometric Token:</p>
                    <code className="block bg-gray-800 p-4 rounded-md mt-2 text-gray-300 break-all">{biometricToken}</code>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TravelerView;
