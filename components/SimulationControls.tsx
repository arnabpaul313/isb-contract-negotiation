import React, { useState } from 'react';
import { AlertTriangle, Scale, CheckCircle, FileText, Activity, DollarSign, TrendingUp, Info } from 'lucide-react';
import { ClauseOption, ContractData, InflationScenario, TabType } from '../types';

interface SimulationControlsProps {
  activeContract: ContractData;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  control1Val: number;
  setControl1Val: (val: number) => void;
  control2Val: number;
  setControl2Val: (val: number) => void;
  inflationScenario: InflationScenario;
  setInflationScenario: (val: InflationScenario) => void;
  selectedClauseIndex: number;
  setSelectedClauseIndex: (idx: number) => void;
  clauseDecisions: Record<string, ClauseOption>;
  setClauseDecisions: React.Dispatch<React.SetStateAction<Record<string, ClauseOption>>>;
  getFinancialImpact: (clauseId: string, optionId: string) => number;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  activeContract,
  activeTab,
  setActiveTab,
  control1Val,
  setControl1Val,
  control2Val,
  setControl2Val,
  inflationScenario,
  setInflationScenario,
  selectedClauseIndex,
  setSelectedClauseIndex,
  clauseDecisions,
  setClauseDecisions,
  getFinancialImpact
}) => {
  const activeClause = activeContract.clauses[selectedClauseIndex];
  const currentDecision = clauseDecisions[activeClause.id] || 'provider_fav';
  const [hoveredClauseId, setHoveredClauseId] = useState<string | null>(null);

  const formatImpact = (val: number) => {
    const inMillions = val / 1000000;
    const sign = val > 0 ? '+' : '';
    if (Math.abs(inMillions) >= 0.1) {
        return `${sign}$${inMillions.toFixed(1)}M`;
    }
    return `${sign}$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <aside className="w-[420px] bg-white border-r border-slate-200 flex flex-col shadow-lg z-10 shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('nlp')} 
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'nlp' ? 'text-slate-800 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            style={{borderColor: activeTab === 'nlp' ? activeContract.primaryColor : 'transparent'}}
          >
              <FileText size={16} /> NLP Analysis
          </button>
          <button 
            onClick={() => setActiveTab('financial')} 
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'financial' ? 'text-slate-800 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            style={{borderColor: activeTab === 'financial' ? activeContract.primaryColor : 'transparent'}}
          >
              <Activity size={16} /> Rate Modeling
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 relative">
          {/* NLP Content */}
          {activeTab === 'nlp' && (
              <div className="flex gap-4 h-full flex-col lg:flex-row">
                  <div className="w-full lg:w-1/3 border-r lg:border-r-0 lg:border-b border-slate-100 pr-0 lg:pr-2 lg:pb-2 space-y-2 lg:block flex overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 pb-2 lg:pb-0">
                      <h3 className="hidden lg:block text-xs font-bold text-slate-400 uppercase mb-3">Clauses</h3>
                      {activeContract.clauses.map((item, idx) => (
                          <div 
                            key={item.id} 
                            className="relative"
                            onMouseEnter={() => setHoveredClauseId(item.id)}
                            onMouseLeave={() => setHoveredClauseId(null)}
                          >
                            <button
                                onClick={() => setSelectedClauseIndex(idx)}
                                className={`w-full text-left p-2 rounded text-sm font-medium transition-colors flex justify-between items-center whitespace-nowrap lg:whitespace-normal min-w-[140px] lg:min-w-0 ${
                                    selectedClauseIndex === idx ? 'bg-slate-100 text-slate-900 ring-1 ring-slate-200' : 'hover:bg-slate-50 text-slate-500'
                                }`}
                            >
                                <span className="truncate">{item.title}</span>
                                <div className={`w-2 h-2 rounded-full shrink-0 ml-2 ${item.risk === 'Critical' ? 'bg-red-500' : item.risk === 'High' ? 'bg-orange-500' : 'bg-yellow-400'}`}></div>
                            </button>
                            
                            {/* Hover Tooltip for Legal Text */}
                            {hoveredClauseId === item.id && (
                                <div className="absolute left-full top-0 ml-2 w-64 bg-slate-800 text-slate-200 p-3 rounded-lg shadow-xl text-xs z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200 hidden lg:block">
                                    <div className="font-bold text-white mb-1 border-b border-slate-700 pb-1">Actual Contract Language</div>
                                    <p className="leading-relaxed italic font-serif">"{item.legalText}"</p>
                                </div>
                            )}
                          </div>
                      ))}
                  </div>
                  
                  <div className="flex-1 space-y-6 animate-in fade-in duration-300">
                      {/* Risk Banner */}
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start gap-3">
                          <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                          <div>
                              <h4 className="font-bold text-orange-900 text-sm">Detected Risk: {activeClause.risk}</h4>
                              <p className="text-xs text-orange-800 mt-1 leading-relaxed">{activeClause.currentText}</p>
                          </div>
                      </div>

                      {/* Benchmarking */}
                      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                              <Scale size={12}/> {activeContract.id === 'anesthesia' ? 'Regional Benchmark' : 'Market Benchmark'}
                          </h4>
                          <div className="relative pt-4 pb-2 px-2">
                              <div className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full w-full opacity-80"></div>
                              <div 
                                  className="absolute top-1 w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow-md transition-all duration-500 transform -translate-x-1/2"
                                  style={{
                                      left: currentDecision === 'aggressive' ? '15%' : currentDecision === 'balanced' ? '50%' : '85%'
                                  }}
                              ></div>
                              <div className="text-xs text-center mt-3 text-slate-500 italic">
                                  {activeClause.marketStat}
                              </div>
                          </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-700">Optimization Options</h4>
                          {activeClause.options.map((opt) => {
                              const annualImpact = getFinancialImpact(activeClause.id, opt.id);
                              const barWidth = Math.min(Math.abs(annualImpact) / 2000000 * 100, 100); // Scale logic roughly

                              return (
                                  <div 
                                      key={opt.id}
                                      onClick={() => setClauseDecisions(prev => ({...prev, [activeClause.id]: opt.id as ClauseOption}))}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden ${
                                          currentDecision === opt.id 
                                          ? `bg-slate-50 ring-1 ring-${activeContract.primaryColor}` 
                                          : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'
                                      }`}
                                      style={{borderColor: currentDecision === opt.id ? activeContract.primaryColor : undefined}}
                                  >
                                      <div className="relative z-10 flex-1">
                                          <div className="font-bold text-sm text-slate-800">{opt.label}</div>
                                          <div className="text-xs text-slate-500 mt-0.5">{opt.impact}</div>
                                      </div>
                                      
                                      <div className="relative z-10 flex items-center gap-3">
                                        <div className="text-right">
                                            <div className={`text-xs font-bold ${annualImpact > 0 ? 'text-red-500' : annualImpact < 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                                {annualImpact === 0 ? '-' : formatImpact(annualImpact)}
                                            </div>
                                            <div className="h-1 bg-slate-100 w-16 rounded-full mt-1 overflow-hidden flex justify-end">
                                                <div 
                                                    className={`h-full rounded-full ${annualImpact > 0 ? 'bg-red-400' : 'bg-green-400'}`} 
                                                    style={{ width: `${barWidth}%`, opacity: annualImpact === 0 ? 0 : 1 }}
                                                ></div>
                                            </div>
                                        </div>
                                        {currentDecision === opt.id && <CheckCircle size={16} color={activeContract.primaryColor} className="shrink-0"/>}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>
          )}

          {/* Financial Content */}
          {activeTab === 'financial' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-6">
                          <DollarSign size={14}/> {activeContract.type} Rate Controls
                      </h3>
                      
                      {/* Dynamic Control 1 */}
                      <div className="mb-8">
                          <div className="flex justify-between mb-3 items-end">
                              <label className="text-sm font-bold text-slate-700 leading-none">{activeContract.rateControls[0].label}</label>
                              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                  {activeContract.rateControls[0].unit === '$' ? '$' : ''}{control1Val}{activeContract.rateControls[0].unit !== '$' ? activeContract.rateControls[0].unit : ''}
                              </span>
                          </div>
                          <input 
                              type="range" 
                              min={activeContract.rateControls[0].min} 
                              max={activeContract.rateControls[0].max} 
                              step={activeContract.rateControls[0].step}
                              value={control1Val} 
                              onChange={(e) => setControl1Val(Number(e.target.value))} 
                              className="w-full h-2 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                              <span>{activeContract.rateControls[0].min}</span>
                              <span>{activeContract.rateControls[0].max}</span>
                          </div>
                      </div>

                      {/* Dynamic Control 2 */}
                      <div>
                          <div className="flex justify-between mb-3 items-end">
                              <label className="text-sm font-bold text-slate-700 leading-none">{activeContract.rateControls[1].label}</label>
                              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                  {activeContract.rateControls[1].unit === '$' ? '$' : ''}{control2Val}{activeContract.rateControls[1].unit !== '$' ? activeContract.rateControls[1].unit : ''}
                              </span>
                          </div>
                          <input 
                              type="range" 
                              min={activeContract.rateControls[1].min} 
                              max={activeContract.rateControls[1].max} 
                              step={activeContract.rateControls[1].step}
                              value={control2Val} 
                              onChange={(e) => setControl2Val(Number(e.target.value))} 
                              className="w-full h-2 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                          />
                           <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                              <span>{activeContract.rateControls[1].min}</span>
                              <span>{activeContract.rateControls[1].max}</span>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                          <TrendingUp size={14}/> Economic Trend (CPI)
                      </h3>
                      <div className="flex gap-2">
                          {(['low', 'med', 'high'] as InflationScenario[]).map((scen) => (
                              <button
                                  key={scen}
                                  onClick={() => setInflationScenario(scen)}
                                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                                      inflationScenario === scen 
                                      ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                  }`}
                              >
                                  {scen.toUpperCase()}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </div>
    </aside>
  );
};

export default SimulationControls;