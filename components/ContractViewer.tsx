import React, { useState } from 'react';
import { X, FileText, ExternalLink, GitCommitVertical, ArrowRightLeft } from 'lucide-react';
import { ContractData, ClauseOption } from '../types';

interface ContractViewerProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractData;
  appliedDecisions: Record<string, ClauseOption>;
  isUpdated: boolean;
  onClauseClick: (clauseId: string) => void;
}

const ContractViewer: React.FC<ContractViewerProps> = ({ 
  isOpen, 
  onClose, 
  contract, 
  appliedDecisions, 
  isUpdated,
  onClauseClick 
}) => {
  const [showDiff, setShowDiff] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded text-slate-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Master Service Agreement</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                 <span>Document ID: {contract.id.toUpperCase()}-2024-V{isUpdated ? '2' : '1'}</span>
                 {isUpdated && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold">UPDATED</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isUpdated && (
              <button 
                onClick={() => setShowDiff(!showDiff)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  showDiff 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowRightLeft size={14} />
                {showDiff ? 'Hide Changes' : 'Compare Versions'}
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 min-h-[800px] p-8 md:p-12 text-sm text-slate-700 font-serif leading-relaxed relative">
            
            <div className="text-center mb-12">
              <h1 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-2">Service Agreement</h1>
              <p className="italic text-slate-500">Between</p>
              <h3 className="font-bold text-lg mt-2">HiLabs Payer Solutions, Inc.</h3>
              <p className="italic text-slate-500">and</p>
              <h3 className="font-bold text-lg mt-2">{contract.name}</h3>
            </div>

            <p className="mb-6 text-justify">
              This Agreement is made and entered into as of the Effective Date by and between the parties listed above. 
              WHEREAS, Provider is licensed to provide medical services in the State; and WHEREAS, Payer desires to contract with Provider 
              to arrange for the provision of Covered Services to Members.
            </p>

            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2 mt-8">Article I: Definitions</h4>
            <p className="mb-4 text-justify">
              1.1 "Clean Claim" shall mean a claim that has no defect or impropriety, including any lack of any required substantiating documentation, 
              or particular circumstance requiring special treatment that prevents timely payment from being made on the claim under this Agreement.
            </p>

            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2 mt-8">Article II: Compensation</h4>
            <p className="mb-4 text-justify">
              2.1 <strong>Base Reimbursement.</strong> Payer shall compensate Provider for Covered Services in accordance with the Fee Schedule attached hereto as Exhibit A.
            </p>

            {/* Dynamic Clauses Render Loop */}
            {contract.clauses.map((clause, index) => {
              const decision = appliedDecisions[clause.id];
              const selectedOption = clause.options.find(opt => opt.id === decision);
              
              // If not updated, show original text (which matches "provider_fav" or whatever is set as legalText in constants)
              // Actually, to make it realistic, lets assume "Original" is the `legalText` on the clause object.
              // "New" is the `legalText` on the selected Option object.
              
              const originalText = clause.legalText;
              const newText = selectedOption?.legalText || originalText;
              const isChanged = newText !== originalText && isUpdated;

              return (
                <div key={clause.id} className={`my-6 pl-4 border-l-4 transition-colors group ${isChanged ? 'border-green-400 bg-green-50/10' : 'border-indigo-100 hover:border-indigo-400'}`}>
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2 flex items-center gap-2">
                    2.{index + 2} {clause.title}
                    {isChanged && !showDiff && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-sans font-bold">
                        MODIFIED
                      </span>
                    )}
                  </h4>
                  
                  <div 
                    className={`p-2 rounded cursor-pointer transition-colors relative ${isChanged && !showDiff ? 'bg-green-50' : 'bg-transparent hover:bg-slate-50'}`} 
                    onClick={() => onClauseClick(clause.id)}
                  >
                    {showDiff && isChanged ? (
                      <div className="space-y-3">
                        <div className="bg-red-50 p-2 rounded border border-red-100 text-red-900 line-through opacity-70">
                          {originalText}
                        </div>
                        <div className="flex justify-center">
                           <GitCommitVertical size={16} className="text-slate-300" />
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-100 text-green-900">
                          {newText}
                        </div>
                      </div>
                    ) : (
                      <p>
                        {isUpdated ? newText : originalText}
                      </p>
                    )}

                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-indigo-600 font-sans text-xs font-bold opacity-0 group-hover:opacity-100 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                       Simulation <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              );
            })}

             <p className="mb-4 text-justify">
              2.{contract.clauses.length + 2} <strong>Timely Filing.</strong> Provider must submit all claims within one hundred eighty (180) days from the date of service.
            </p>

            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2 mt-8">Article III: Term and Termination</h4>
            <p className="mb-4 text-justify">
              3.1 <strong>Initial Term.</strong> This Agreement shall have an initial term of one (1) year commencing on the Effective Date.
              Thereafter, this Agreement shall automatically renew for successive one (1) year terms unless either party provides written notice.
            </p>

             <div className="mt-16 pt-8 border-t border-slate-300 flex justify-between">
                <div>
                   <div className="h-12 w-32 border-b border-slate-900 mb-2"></div>
                   <p className="text-xs uppercase">Authorized Signature</p>
                   <p className="text-xs font-bold">HiLabs Payer Solutions</p>
                </div>
                <div>
                   <div className="h-12 w-32 border-b border-slate-900 mb-2"></div>
                   <p className="text-xs uppercase">Authorized Signature</p>
                   <p className="text-xs font-bold">{contract.name}</p>
                </div>
             </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-between items-center text-xs text-slate-500 shrink-0">
           <span>Page 1 of 12</span>
           <span>Confidential & Proprietary</span>
        </div>
      </div>
    </div>
  );
};

export default ContractViewer;