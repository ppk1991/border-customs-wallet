import React, { useState } from 'react';
import { Credential } from '../types';
import { LinkIcon, CheckCircleIcon } from './Icons';

interface CredentialsListProps {
  credentials: Credential[];
  searchQuery?: string;
  walletId: string;
}

const highlightMatch = (text: string, query: string | undefined) => {
    const safeQuery = query?.trim();
    if (!safeQuery) {
      return <>{text}</>;
    }
    const regex = new RegExp(`(${safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.filter(part => part).map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-cyan-800 text-cyan-200 rounded not-italic px-1">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

const CredentialsList: React.FC<CredentialsListProps> = ({ credentials, searchQuery, walletId }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (credentialId: string) => {
    // Simulate generating a secure, time-limited, single-use token/URL
    const expiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const token = btoa(`${credentialId}::${expiration}::${Math.random()}`).slice(0, 20);
    
    const url = `${window.location.origin}${window.location.pathname}?view=credential&walletId=${walletId}&credentialId=${encodeURIComponent(credentialId)}&token=${token}&expires=${expiration}`;

    navigator.clipboard.writeText(url).then(() => {
        setCopiedId(credentialId);
        setTimeout(() => setCopiedId(null), 3000); // Reset after 3 seconds
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link.');
    });
  };

  return (
    <div className="space-y-4">
      {credentials.length > 0 ? (
        credentials.map(cred => (
          <details key={cred.id_number} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <summary className="p-4 cursor-pointer hover:bg-gray-700 font-semibold flex justify-between">
              <span>{cred.cred_type} – {highlightMatch(cred.id_number, searchQuery)}</span>
              <span className="text-gray-400 text-sm">▼</span>
            </summary>
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 space-y-4">
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold text-gray-400">Issuer:</span> 
                  <span>{highlightMatch(cred.issuer, searchQuery)}</span>

                  <span className="font-semibold text-gray-400">Valid from:</span>
                  <span>{cred.valid_from}</span>

                  <span className="font-semibold text-gray-400">Valid to:</span>
                  <span>{cred.valid_to}</span>
              </div>
              
              {Object.keys(cred.metadata).length > 0 && (
                <div>
                  <p className="font-semibold text-gray-400 text-sm">Metadata:</p>
                  <pre className="text-sm bg-gray-900 p-2 rounded-md mt-1 text-gray-300">
                    {JSON.stringify(cred.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Share Link Button */}
              <div className="pt-3 border-t border-gray-700/50">
                  <button
                      onClick={() => handleCopyLink(cred.id_number)}
                      className={`w-full flex items-center justify-center text-sm font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
                          copiedId === cred.id_number
                              ? 'bg-green-600 text-white cursor-default'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                      disabled={copiedId === cred.id_number}
                  >
                      {copiedId === cred.id_number ? (
                          <>
                              <CheckCircleIcon className="w-5 h-5 mr-2" />
                              Link Copied!
                          </>
                      ) : (
                          <>
                              <LinkIcon className="w-5 h-5 mr-2" />
                              Copy Sharable Link
                          </>
                      )}
                  </button>
              </div>
            </div>
          </details>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4 bg-gray-800 rounded-lg">
          No credentials match the selected filter.
        </div>
      )}
    </div>
  );
};

export default CredentialsList;