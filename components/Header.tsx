import React from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { ContractData } from '../types';

interface HeaderProps {
  activeContract: ContractData;
  onReset: () => void;
  onUpdate: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeContract, onReset, onUpdate }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 shadow-sm">
                {activeContract.icon}
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">{activeContract.name}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    Contract Type: <span className="font-semibold text-indigo-600 px-1.5 py-0.5 bg-indigo-50 rounded">{activeContract.type}</span>
                </p>
            </div>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
                <RefreshCw size={14} /> Reset
            </button>
            <button 
                onClick={onUpdate}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95 bg-indigo-600"
            >
                <Save size={14} /> Update Contract
            </button>
        </div>
    </header>
  );
};

export default Header;