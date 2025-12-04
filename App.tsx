import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SimulationControls from './components/SimulationControls';
import Dashboard from './components/Dashboard';
import ContractViewer from './components/ContractViewer';
import { CONTRACTS_DATA } from './constants';
import { generateTrendData } from './utils';
import { ContractType, InflationScenario, ClauseOption, TabType } from './types';
import { FileText, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [selectedContractId, setSelectedContractId] = useState<ContractType>('hospital');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isContractViewerOpen, setContractViewerOpen] = useState(false);
  
  // --- Simulation State ---
  const [activeTab, setActiveTab] = useState<TabType>('nlp');
  
  // Dynamic Controls (mapped to generic state 1 & 2)
  const [control1Val, setControl1Val] = useState(0);
  const [control2Val, setControl2Val] = useState(0);
  const [inflationScenario, setInflationScenario] = useState<InflationScenario>('med');
  
  // NLP State
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [clauseDecisions, setClauseDecisions] = useState<Record<string, ClauseOption>>({});
  
  // Contract State
  const [isContractUpdated, setIsContractUpdated] = useState(false);
  const [appliedDecisions, setAppliedDecisions] = useState<Record<string, ClauseOption>>({});

  const activeContract = CONTRACTS_DATA[selectedContractId];
  
  // Reset state on contract switch
  const resetState = () => {
    setControl1Val(activeContract.rateControls[0].default);
    setControl2Val(activeContract.rateControls[1].default);
    setInflationScenario('med');
    
    // Default clause decisions based on first options (usually provider_fav/status quo in this mock)
    // We assume the initial "Applied" state matches the 'provider_fav' or whatever we define as default
    // For this simulation, we'll map the "Applied" state initially to the 'provider_fav' option (which matches original legal text)
    const defaults: Record<string, ClauseOption> = {
        [activeContract.clauses[0].id]: 'provider_fav',
        [activeContract.clauses[1].id]: 'provider_fav' 
    };

    setClauseDecisions(defaults);
    setAppliedDecisions(defaults);
    setIsContractUpdated(false);
    setSelectedClauseIndex(0);
  };

  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContractId]);

  const handleUpdateContract = () => {
    setAppliedDecisions({ ...clauseDecisions });
    setIsContractUpdated(true);
    // Optional: Add a toast notification here if we had a toast component
  };

  // Calculate Impact Logic
  // This calculates the ANNUALized impact of a specific decision
  const getFinancialImpact = (clauseId: string, optionId: string): number => {
    const scaler = selectedContractId === 'hospital' ? 50 : 10; // Base K per month scaler
    let factor = 0;
    
    // Logic mirroring the calculateClauseImpact totals
    if (optionId === 'provider_fav') factor = 3;
    if (optionId === 'balanced') factor = 1;
    if (optionId === 'aggressive') factor = 0;

    // Monthly impact in k * 12 months * 1000 to get raw dollars
    return factor * scaler * 1000 * 12;
  }

  // Calculate Total Impact for Chart
  const calculateTotalClauseImpact = () => {
    let impact = 0;
    const c1 = activeContract.clauses[0];
    const c2 = activeContract.clauses[1];
    
    const d1 = clauseDecisions[c1.id];
    const d2 = clauseDecisions[c2.id];
    
    const scaler = selectedContractId === 'hospital' ? 50 : 10;

    if (d1 === 'provider_fav') impact += (3 * scaler);
    if (d1 === 'balanced') impact += (1 * scaler);
    
    if (d2 === 'provider_fav') impact += (2 * scaler);
    if (d2 === 'balanced') impact += (0.5 * scaler); // Adding minor impact for balanced on 2nd clause

    return impact;
  };

  const chartData = generateTrendData(
    selectedContractId,
    control1Val,
    control2Val,
    inflationScenario,
    calculateTotalClauseImpact()
  );

  const totalAnnualSpend = chartData.reduce((acc, curr) => acc + curr.Proposed, 0);
  const totalMarketSpend = chartData.reduce((acc, curr) => acc + curr.MarketAvg, 0);
  const variance = totalAnnualSpend - totalMarketSpend;
  const riskScore = calculateTotalClauseImpact() > (selectedContractId === 'hospital' ? 100 : 20) ? 'High' : 'Medium';

  const handleClauseClickFromContract = (clauseId: string) => {
    const idx = activeContract.clauses.findIndex(c => c.id === clauseId);
    if (idx !== -1) {
      setSelectedClauseIndex(idx);
      setActiveTab('nlp');
      setContractViewerOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)}
        selectedId={selectedContractId}
        onSelect={setSelectedContractId}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
          activeContract={activeContract} 
          onReset={resetState} 
          onUpdate={handleUpdateContract}
        />

        <div className="flex flex-1 overflow-hidden">
          <SimulationControls 
            activeContract={activeContract}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            control1Val={control1Val}
            setControl1Val={setControl1Val}
            control2Val={control2Val}
            setControl2Val={setControl2Val}
            inflationScenario={inflationScenario}
            setInflationScenario={setInflationScenario}
            selectedClauseIndex={selectedClauseIndex}
            setSelectedClauseIndex={setSelectedClauseIndex}
            clauseDecisions={clauseDecisions}
            setClauseDecisions={setClauseDecisions}
            getFinancialImpact={getFinancialImpact}
          />

          <Dashboard 
            activeContract={activeContract}
            chartData={chartData}
            totalAnnualSpend={totalAnnualSpend}
            variance={variance}
            riskScoreLevel={riskScore}
          />
        </div>

        {/* Floating Action Button for Contract Viewer */}
        <button 
          onClick={() => setContractViewerOpen(true)}
          className={`absolute bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 group ${
            isContractUpdated ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-900 text-white'
          }`}
          title="View Contract"
        >
          {isContractUpdated ? <CheckCircle size={28} /> : <FileText size={24} />}
          
          {/* Notification Dot if updated */}
          {isContractUpdated && (
             <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-50"></span>
          )}

          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            View Contract {isContractUpdated ? '(Updated)' : ''}
          </span>
        </button>

        {/* Contract Viewer Modal */}
        <ContractViewer 
          isOpen={isContractViewerOpen} 
          onClose={() => setContractViewerOpen(false)} 
          contract={activeContract}
          appliedDecisions={appliedDecisions}
          isUpdated={isContractUpdated}
          onClauseClick={handleClauseClickFromContract}
        />
      </div>
    </div>
  );
};

export default App;