import React, { useState } from 'react';
import { LogOut, Network, Database, Search, Send, User } from 'lucide-react';
import { apiService } from '../services/api';
import { ChaincodeInvoke } from './ChaincodeInvoke';
import { ChaincodeQuery } from './ChaincodeQuery';
import { QSCCQuery } from './QSCCQuery';

interface DashboardProps {
  onLogout: () => void;
}

type ActiveTab = 'invoke' | 'query' | 'qscc';

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('invoke');

  const handleLogout = () => {
    apiService.logout();
    onLogout();
  };

  const tabs = [
    {
      id: 'invoke' as ActiveTab,
      label: 'Invoke Chaincode',
      icon: Send,
      description: 'Execute transactions on the blockchain'
    },
    {
      id: 'query' as ActiveTab,
      label: 'Query Chaincode',
      icon: Search,
      description: 'Read data from the blockchain'
    },
    {
      id: 'qscc' as ActiveTab,
      label: 'QSCC Query',
      icon: Database,
      description: 'Query system chaincode'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'invoke':
        return <ChaincodeInvoke />;
      case 'query':
        return <ChaincodeQuery />;
      case 'qscc':
        return <QSCCQuery />;
      default:
        return <ChaincodeInvoke />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Network className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hyperledger Fabric Client</h1>
                <p className="text-sm text-gray-500">Blockchain API Interface</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="mr-2">Logout</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mr-2 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Description */}
          <div className="mt-4">
            <p className="text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Active Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};