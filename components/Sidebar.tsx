import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { CONTRACTS_DATA } from '../constants';
import { ContractType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  selectedId: ContractType;
  onSelect: (id: ContractType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, selectedId, onSelect }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800 z-20 shrink-0`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
           {isOpen && <span className="font-bold text-white tracking-wide text-sm truncate">MY PORTFOLIO</span>}
           <button onClick={toggle} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
              {isOpen ? <ChevronLeft size={16}/> : <Menu size={16}/>}
           </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {Object.values(CONTRACTS_DATA).map((c) => (
              <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-all border-l-4 ${
                      selectedId === c.id ? `bg-slate-800 text-white` : 'border-transparent'
                  }`}
                  style={{borderColor: selectedId === c.id ? c.primaryColor : 'transparent'}}
              >
                  <div className={`transition-colors ${selectedId === c.id ? 'text-white' : 'text-slate-400'}`}>
                    {c.icon}
                  </div>
                  {isOpen && (
                      <div className="text-left animate-in fade-in duration-200">
                          <div className="text-sm font-semibold truncate">{c.name}</div>
                          <div className="text-[10px] uppercase tracking-wider opacity-60 truncate">{c.type}</div>
                      </div>
                  )}
              </button>
          ))}
      </div>
      
      <div className="p-4 border-t border-slate-800">
           {isOpen ? (
              <div className="bg-slate-800 rounded p-3 text-xs animate-in fade-in">
                  <div className="font-bold text-white mb-1">Portfolio Status</div>
                  <div className="flex justify-between">
                      <span>Renewals Due</span>
                      <span className="text-orange-400 font-bold">3</span>
                  </div>
              </div>
           ) : (
              <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto"></div>
           )}
      </div>
    </div>
  );
};

export default Sidebar;