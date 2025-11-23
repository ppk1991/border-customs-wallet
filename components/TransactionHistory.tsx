import React from 'react';
import { Credential } from '../types';

interface CredentialsListProps {
  credentials: Credential[];
  searchQuery?: string;
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

const CredentialsList: React.FC<CredentialsListProps> = ({ credentials, searchQuery }) => {
  return (
    <div className="space-y-4">
      {credentials.length > 0 ? (
        credentials.map(cred => (
          <details key={cred.id_number} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <summary className="p-4 cursor-pointer hover:bg-gray-700 font-semibold flex justify-between">
              <span>{cred.cred_type} – {highlightMatch(cred.id_number, searchQuery)}</span>
              <span className="text-gray-400 text-sm">▼</span>
            </summary>
            <div className="p-4 bg-gray-800 border-t border-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-400">Issuer:</span> {highlightMatch(cred.issuer, searchQuery)}</p>
              <p><span className="font-semibold text-gray-400">Valid from:</span> {cred.valid_from}</p>
              <p><span className="font-semibold text-gray-400">Valid to:</span> {cred.valid_to}</p>
              {Object.keys(cred.metadata).length > 0 && (
                <div>
                  <p className="font-semibold text-gray-400">Metadata:</p>
                  <pre className="text-sm bg-gray-900 p-2 rounded-md mt-1 text-gray-300">
                    {JSON.stringify(cred.metadata, null, 2)}
                  </pre>
                </div>
              )}
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