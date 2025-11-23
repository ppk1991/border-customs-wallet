import React, { useState, useEffect } from 'react';
import { Credential } from '../types';
import { WALLETS } from '../services/geminiService';
import { AlertTriangleIcon, CheckCircleIcon, WalletIcon } from './Icons';

type ViewState = 'loading' | 'valid' | 'invalid';

const SharedCredentialView: React.FC = () => {
    const [credential, setCredential] = useState<Credential | null>(null);
    const [walletOwner, setWalletOwner] = useState<string>('');
    const [viewState, setViewState] = useState<ViewState>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const walletId = params.get('walletId');
        const credentialId = params.get('credentialId');
        const expires = params.get('expires');
        const token = params.get('token');

        if (!walletId || !credentialId || !expires || !token) {
            setErrorMessage('Missing required information in the link.');
            setViewState('invalid');
            return;
        }

        const expirationTime = parseInt(expires, 10);
        if (isNaN(expirationTime) || Date.now() > expirationTime) {
            setErrorMessage('This sharing link has expired.');
            setViewState('invalid');
            return;
        }
        
        const wallet = WALLETS[walletId];
        if (!wallet) {
            setErrorMessage('The specified wallet could not be found.');
            setViewState('invalid');
            return;
        }

        const foundCredential = wallet.credentials.find(c => c.id_number === credentialId);
        if (!foundCredential) {
            setErrorMessage('The specified credential could not be found in the wallet.');
            setViewState('invalid');
            return;
        }

        setCredential(foundCredential);
        setWalletOwner(wallet.owner.full_name);
        setViewState('valid');

    }, []);

    const renderContent = () => {
        if (viewState === 'loading') {
            return <p>Loading and verifying credential...</p>;
        }

        if (viewState === 'invalid' || !credential) {
            return (
                <div className="text-center text-red-400">
                    <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Expired or Invalid Link</h2>
                    <p>{errorMessage}</p>
                </div>
            );
        }

        return (
            <>
                <div className="text-center mb-6">
                    <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <h1 className="text-3xl font-bold text-white mb-2">Shared Credential Details</h1>
                    <p className="text-gray-400">This is a secure, read-only view of a credential shared from a digital wallet.</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">{credential.cred_type}</h3>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                        
                        <span className="font-semibold text-gray-400">Owner:</span>
                        <span className="text-gray-200">{walletOwner}</span>

                        <span className="font-semibold text-gray-400">ID Number:</span>
                        <span className="text-gray-200">{credential.id_number}</span>
                        
                        <span className="font-semibold text-gray-400">Issuer:</span>
                        <span className="text-gray-200">{credential.issuer}</span>
                
                        <span className="font-semibold text-gray-400">Valid from:</span>
                        <span className="text-gray-200">{credential.valid_from}</span>
                
                        <span className="font-semibold text-gray-400">Valid to:</span>
                        <span className="text-gray-200">{credential.valid_to}</span>

                    </div>
                    {Object.keys(credential.metadata).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                          <p className="font-semibold text-gray-400 text-sm">Additional Metadata:</p>
                          <pre className="text-sm bg-gray-900 p-3 rounded-md mt-2 text-gray-300">
                            {JSON.stringify(credential.metadata, null, 2)}
                          </pre>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-6">
                    This link was valid until {new Date(parseInt(new URLSearchParams(window.location.search).get('expires') || '0', 10)).toLocaleString()}.
                </p>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="text-center max-w-lg w-full">
                <div className="flex justify-center items-center mb-4">
                    <WalletIcon className="w-8 h-8 text-cyan-400" />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SharedCredentialView;
