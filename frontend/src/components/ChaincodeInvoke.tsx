import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { apiService } from '../services/api';
import { ApiResponse } from '../types/api';

const FUNCTION_ARGS = {
  createCar: ['Key', 'Make', 'Model', 'Colour', 'Owner'],
  changeCarOwner: ['Key', 'NewOwner']
};

const TRANSIENT_FUNCTIONS: string[] = [];

export const ChaincodeInvoke: React.FC = () => {
  const [channelName, setChannelName] = useState('');
  const [chaincodeName, setChaincodeName] = useState('');
  const [fcn, setFcn] = useState('createCar');
  const [argValues, setArgValues] = useState<Record<string, string>>({});
  const [peers, setPeers] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const functions = Object.keys(FUNCTION_ARGS);
  const currentArgs = FUNCTION_ARGS[fcn as keyof typeof FUNCTION_ARGS] || [];
  const isTransientFunction = TRANSIENT_FUNCTIONS.includes(fcn);

  useEffect(() => {
    // Reset arg values when function changes
    const newArgValues: Record<string, string> = {};
    currentArgs.forEach(arg => {
      newArgValues[arg] = argValues[arg] || '';
    });
    setArgValues(newArgValues);
  }, [fcn]);

  const updateArgValue = (argName: string, value: string) => {
    setArgValues(prev => ({
      ...prev,
      [argName]: value
    }));
  };

  const addPeer = () => {
    setPeers([...peers, '']);
  };

  const removePeer = (index: number) => {
    if (peers.length > 1) {
      setPeers(peers.filter((_, i) => i !== index));
    }
  };

  const updatePeer = (index: number, value: string) => {
    const newPeers = [...peers];
    newPeers[index] = value;
    setPeers(newPeers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName || !chaincodeName || !fcn) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const filteredPeers = peers.filter(peer => peer.trim() !== '');
      
      let requestData;
      if (isTransientFunction) {
        // For transient functions, send args as empty array and data in transient
        const transientData: Record<string, string> = {};
        currentArgs.forEach(arg => {
          if (argValues[arg]) {
            transientData[arg] = argValues[arg];
          }
        });

        requestData = {
          channelName,
          chaincodeName,
          fcn,
          args: [],
          peers: filteredPeers.length > 0 ? filteredPeers : undefined,
          transient: transientData
        };
      } else {
        // For regular functions, send args as array
        const argsArray = currentArgs.map(arg => argValues[arg] || '');
        
        requestData = {
          channelName,
          chaincodeName,
          fcn,
          args: argsArray,
          peers: filteredPeers.length > 0 ? filteredPeers : undefined
        };
      }

      const result = await apiService.invokeChaincode(requestData);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoke Chaincode</h2>
        <p className="text-gray-600">Execute a transaction on the blockchain network</p>
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
          <select
            id="fcn"
            value={fcn}
            onChange={(e) => setFcn(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {functions.map((func) => (
              <option key={func} value={func}>
                {func}
              </option>
            ))}
          </select>
        </div>

        {currentArgs.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isTransientFunction ? 'Transient Data' : 'Arguments'} *
            </label>
            <div className="space-y-3">
              {currentArgs.map((arg) => (
                <div key={arg}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {arg}
                  </label>
                  <input
                    type="text"
                    value={argValues[arg] || ''}
                    onChange={(e) => updateArgValue(arg, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${arg}`}
                    required
                  />
                </div>
              ))}
            </div>
            {isTransientFunction && (
              <p className="mt-2 text-sm text-gray-500">
                This function uses transient data for private information
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peers (Optional)
          </label>
          <div className="space-y-3">
            {peers.map((peer, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={peer}
                  onChange={(e) => updatePeer(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Peer ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removePeer(index)}
                  disabled={peers.length === 1}
                  className="px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPeer}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
            >
              Add Peer
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !channelName || !chaincodeName || !fcn}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Invoking...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Invoke Chaincode
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
                  {response.error ? 'Transaction Failed' : 'Transaction Successful'}
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