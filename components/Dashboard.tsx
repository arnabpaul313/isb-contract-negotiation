import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { ChartDataPoint, ContractData } from '../types';

interface DashboardProps {
  activeContract: ContractData;
  chartData: ChartDataPoint[];
  totalAnnualSpend: number;
  variance: number;
  riskScoreLevel: 'High' | 'Medium' | 'Low';
}

const Dashboard: React.FC<DashboardProps> = ({ 
  activeContract, 
  chartData, 
  totalAnnualSpend, 
  variance, 
  riskScoreLevel 
}) => {
  return (
    <main className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02] duration-300">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Proj. Annual Spend</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">{activeContract.currencyFormat(totalAnnualSpend)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02] duration-300">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Variance vs Market</span>
              <div className={`text-2xl font-bold mt-1 ${variance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {variance > 0 ? '+' : ''}{activeContract.currencyFormat(variance)}
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02] duration-300">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Risk Score</span>
              <div className={`text-2xl font-bold mt-1 ${
                riskScoreLevel === 'High' ? 'text-orange-500' : 
                riskScoreLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                  {riskScoreLevel}
              </div>
          </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 h-[500px] relative">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700">Projected Financial Performance</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> 
                      <span className="text-slate-500">Market Benchmark</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: activeContract.primaryColor}}></span> 
                      <span className="text-slate-700 font-semibold">Proposed</span>
                  </div>
              </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                      <linearGradient id="colorProposed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeContract.primaryColor} stopOpacity={0.15}/>
                          <stop offset="95%" stopColor={activeContract.primaryColor} stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickFormatter={(val) => `${val/1000}M`} 
                    dx={-10}
                  />
                  <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      itemStyle={{fontSize: '13px', fontWeight: 600}}
                      labelStyle={{fontSize: '12px', color: '#64748b', marginBottom: '8px'}}
                      formatter={(val: number) => activeContract.currencyFormat(val)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Proposed" 
                    stroke={activeContract.primaryColor} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorProposed)" 
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="MarketAvg" 
                    stroke="#cbd5e1" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    animationDuration={1000}
                  />
              </AreaChart>
          </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;