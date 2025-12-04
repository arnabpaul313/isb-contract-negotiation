import { ReactNode } from 'react';

export type ContractType = 'hospital' | 'anesthesia' | 'home_health';
export type ClauseOption = 'aggressive' | 'balanced' | 'provider_fav';
export type InflationScenario = 'low' | 'med' | 'high';
export type TabType = 'financial' | 'nlp';

export interface RateControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  default: number;
}

export interface ClauseOptionDetail {
  id: ClauseOption;
  label: string;
  impact: string;
  legalText: string;
}

export interface Clause {
  id: string;
  title: string;
  risk: 'Critical' | 'High' | 'Med' | 'Low';
  currentText: string;
  legalText: string; // The original text
  marketStat: string;
  options: ClauseOptionDetail[];
}

export interface ContractData {
  id: ContractType;
  name: string;
  type: string;
  icon: ReactNode;
  primaryColor: string;
  currencyFormat: (val: number) => string;
  rateControls: [RateControl, RateControl];
  clauses: Clause[];
}

export interface ChartDataPoint {
  name: string;
  Proposed: number;
  MarketAvg: number;
}