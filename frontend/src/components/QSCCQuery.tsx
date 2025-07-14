import React, { useState } from 'react';
import { Database, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { ApiResponse } from '../types/api';

export const QSCCQuery: React.FC = () => {
  const [channelName, setChannelName] = useState('');
  const [chaincodeName, setChaincodeName] = useState('');
  const [fcn, setFcn] = useState('');
  const [args, setArgs] = useState('');
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
      const result = await apiService.queryQSCC({
        channelName,
        chaincodeName,
        fcn,
        args
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

  const commonQueries = [
    {
      name: 'Get Chaincode Data',
      fcn: 'GetChaincodeData',
      args: '["chaincodeName"]',
      description: 'Get information about a specific chaincode'
    },
    {
      name: 'Get Chaincodes',
      fcn: 'GetChaincodes',
      args: '[]',
      description: 'List all chaincodes on the channel'
    },
    {
      name: 'Get Block by Number',
      fcn: 'GetBlockByNumber',
      args: '["channelName", "blockNumber"]',
      description: 'Get a specific block by its number'
    },
    {
      name: 'Get Block by Hash',
      fcn: 'GetBlockByHash',
      args: '["channelName", "blockHash"]',
      description: 'Get a specific block by its hash'
    }
  ];

  const fillExample = (query: typeof commonQueries[0]) => {
    setFcn(query.fcn);
    setArgs(query.args);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QSCC Query</h2>
        <p className="text-gray-600">Query the Query System Chaincode for blockchain metadata</p>
      </div>

      {/* Common Queries */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Queries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonQueries.map((query, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => fillExample(query)}
            >
              <h4 className="font-medium text-gray-900 mb-1">{query.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{query.description}</p>
              <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {query.fcn}
              </code>
            </div>
          ))}
        </div>
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
              placeholder="e.g., qscc"
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
            placeholder="e.g., GetChaincodes"
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
            placeholder='["arg1", "arg2"]'
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter arguments as a JSON array. Use [] for functions that don't require arguments.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !channelName || !chaincodeName || !fcn || !args}
          className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Querying...
            </>
          ) : (
            <>
              <Database className="w-5 h-5 mr-2" />
              Query QSCC
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
                  {response.error ? 'QSCC Query Failed' : 'QSCC Query Successful'}
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