import React, { useState } from 'react';
import { Search, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { ApiResponse } from '../types/api';

export const ChaincodeQuery: React.FC = () => {
  const [channelName, setChannelName] = useState('');
  const [chaincodeName, setChaincodeName] = useState('');
  const [fcn, setFcn] = useState('');
  const [args, setArgs] = useState('');
  const [peer, setPeer] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName || !chaincodeName || !fcn || !args) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const result = await apiService.queryChaincode({
        channelName,
        chaincodeName,
        fcn,
        args,
        peer: peer.trim() || undefined
      });

      setResponse(result);
    } catch (error) {
      setResponse({
        result: null,
        error: error instanceof Error ? error.name : 'Unknown Error',
        errorData: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Query Chaincode</h2>
        <p className="text-gray-600">Read data from the blockchain without modifying state</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-2">
              Channel Name *
            </label>
            <input
              id="channelName"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., mychannel"
              required
            />
          </div>

          <div>
            <label htmlFor="chaincodeName" className="block text-sm font-medium text-gray-700 mb-2">
              Chaincode Name *
            </label>
            <input
              id="chaincodeName"
              type="text"
              value={chaincodeName}
              onChange={(e) => setChaincodeName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., mycontract"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="fcn" className="block text-sm font-medium text-gray-700 mb-2">
            Function Name *
          </label>
          <input
            id="fcn"
            type="text"
            value={fcn}
            onChange={(e) => setFcn(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., queryAsset"
            required
          />
        </div>

        <div>
          <label htmlFor="args" className="block text-sm font-medium text-gray-700 mb-2">
            Arguments (JSON Array) *
          </label>
          <textarea
            id="args"
            value={args}
            onChange={(e) => setArgs(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder='["arg1", "arg2", "arg3"]'
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter arguments as a JSON array, e.g., ["assetId"] or ["key1", "key2"]
          </p>
        </div>

        <div>
          <label htmlFor="peer" className="block text-sm font-medium text-gray-700 mb-2">
            Peer (Optional)
          </label>
          <input
            id="peer"
            type="text"
            value={peer}
            onChange={(e) => setPeer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., peer0.org1.example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !channelName || !chaincodeName || !fcn || !args}
          className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Querying...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Query Chaincode
            </>
          )}
        </button>
      </form>

      {response && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Response</h3>
            <button
              onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
          
          <div className={`rounded-lg border-l-4 p-4 ${
            response.error 
              ? 'bg-red-50 border-red-400' 
              : 'bg-green-50 border-green-400'
          }`}>
            <div className="flex items-start">
              {response.error ? (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium ${
                  response.error ? 'text-red-800' : 'text-green-800'
                }`}>
                  {response.error ? 'Query Failed' : 'Query Successful'}
                </h4>
                <div className="mt-2">
                  <pre className={`text-sm overflow-x-auto ${
                    response.error ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};