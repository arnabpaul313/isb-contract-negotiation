import React from 'react';
import { Building2, Stethoscope, Home } from 'lucide-react';
import { ContractData, ContractType } from './types';

export const CONTRACTS_DATA: Record<ContractType, ContractData> = {
  hospital: {
    id: 'hospital',
    name: 'Memorial Health System',
    type: 'Inpatient Facility',
    icon: <Building2 size={18} />,
    primaryColor: '#4f46e5', // Indigo
    currencyFormat: (val: number) => `$${(val/1000).toFixed(1)}M`,
    rateControls: [
      { id: 'base', label: 'DRG Base Rate Increase', min: 0, max: 10, step: 0.5, unit: '%', default: 3.5 },
      { id: 'carveout', label: 'Ortho Carve-Out', min: -5, max: 5, step: 0.5, unit: '%', default: 0 }
    ],
    clauses: [
      {
        id: 'implant',
        title: "High-Cost Implants",
        risk: "Critical",
        currentText: "60% of Billed Charges",
        legalText: "Reimbursement for high-cost implants, defined as any implantable device with a cost exceeding $500, shall be set at sixty percent (60%) of the Provider's billed charges for such items. This rate applies regardless of the invoice cost to the Provider.",
        marketStat: "85% use Cost Plus",
        options: [
           { 
             id: 'aggressive', 
             label: 'Fixed Fee ($3k max)', 
             impact: 'High Savings',
             legalText: "Reimbursement for high-cost implants shall be set at a fixed fee not to exceed $3,000 per item, inclusive of all shipping and handling. Any cost in excess of this limit shall be the sole responsibility of the Provider."
           },
           { 
             id: 'balanced', 
             label: 'Cost Plus 10%', 
             impact: 'Market Std',
             legalText: "Reimbursement for high-cost implants shall be set at the Provider's invoice cost plus ten percent (10%), not to exceed a maximum markup of $500 per item. Provider must submit valid invoices with claims."
           },
           { 
             id: 'provider_fav', 
             label: '% of Billed', 
             impact: 'High Risk',
             legalText: "Reimbursement for high-cost implants, defined as any implantable device with a cost exceeding $500, shall be set at sixty percent (60%) of the Provider's billed charges for such items. This rate applies regardless of the invoice cost to the Provider."
           },
        ]
      },
      {
        id: 'stoploss',
        title: "Stop-Loss Threshold",
        risk: "Med",
        currentText: "Threshold at $75k",
        legalText: "For inpatient claims where total billed charges exceed seventy-five thousand dollars ($75,000), a stop-loss provision shall apply. Reimbursement for charges in excess of this threshold shall be paid at fifty percent (50%) of billed charges in addition to the base DRG payment.",
        marketStat: "Market avg is $125k",
        options: [
           { 
             id: 'aggressive', 
             label: '$150k Threshold', 
             impact: 'Savings',
             legalText: "For inpatient claims where total billed charges exceed one hundred fifty thousand dollars ($150,000), a stop-loss provision shall apply. Reimbursement for charges in excess of this threshold shall be paid at forty percent (40%) of billed charges."
           },
           { 
             id: 'balanced', 
             label: '$100k Threshold', 
             impact: 'Neutral',
             legalText: "For inpatient claims where total billed charges exceed one hundred thousand dollars ($100,000), a stop-loss provision shall apply. Reimbursement for charges in excess of this threshold shall be paid at fifty percent (50%) of billed charges in addition to the base DRG payment."
           },
           { 
             id: 'provider_fav', 
             label: '$75k Threshold', 
             impact: 'Costly',
             legalText: "For inpatient claims where total billed charges exceed seventy-five thousand dollars ($75,000), a stop-loss provision shall apply. Reimbursement for charges in excess of this threshold shall be paid at fifty percent (50%) of billed charges in addition to the base DRG payment."
           },
        ]
      }
    ]
  },
  anesthesia: {
    id: 'anesthesia',
    name: 'Metro Anesthesia Group',
    type: 'Professional Services',
    icon: <Stethoscope size={18} />,
    primaryColor: '#0891b2', // Cyan
    currencyFormat: (val: number) => `$${val.toLocaleString()}k`,
    rateControls: [
      { id: 'base', label: 'ASA Conversion Factor', min: 40, max: 80, step: 1, unit: '$', default: 52 }, // $ per unit
      { id: 'carveout', label: 'Flat Fee Modifiers', min: 0, max: 20, step: 5, unit: '%', default: 5 }
    ],
    clauses: [
      {
        id: 'afterhours',
        title: "After-Hours Premium",
        risk: "High",
        currentText: "50% premium for all weekend cases",
        legalText: "Services rendered on weekends (Saturday 12:00 AM through Sunday 11:59 PM) or federal holidays shall be reimbursed at a fifty percent (50%) premium over the standard allowable rate per unit.",
        marketStat: "Standard is 20% or flat call stipend",
        options: [
           { 
             id: 'aggressive', 
             label: 'Flat Stipend Only', 
             impact: 'High Savings',
             legalText: "Services rendered after hours or on weekends shall not accrue additional unit value. Provider shall receive a flat annual stipend of $25,000 to cover all call coverage requirements."
           },
           { 
             id: 'balanced', 
             label: '20% Premium', 
             impact: 'Market Std',
             legalText: "Services rendered on federal holidays shall be reimbursed at a twenty percent (20%) premium over the standard allowable rate. Weekend services shall be reimbursed at the standard rate."
           },
           { 
             id: 'provider_fav', 
             label: '50% Premium', 
             impact: 'High Cost',
             legalText: "Services rendered on weekends (Saturday 12:00 AM through Sunday 11:59 PM) or federal holidays shall be reimbursed at a fifty percent (50%) premium over the standard allowable rate per unit."
           },
        ]
      },
      {
        id: 'supervision',
        title: "CRNA Supervision Ratio",
        risk: "Low",
        currentText: "1:4 Ratio Permitted",
        legalText: "Anesthesiologists may supervise up to four (4) Certified Registered Nurse Anesthetists (CRNAs) concurrently. Claims for medical direction shall be submitted with the appropriate modifiers indicating a ratio of 1:4 or fewer.",
        marketStat: "Standard is 1:4",
        options: [
           { 
             id: 'aggressive', 
             label: '1:4 Mandatory', 
             impact: 'Neutral',
             legalText: "Anesthesiologists must supervise four (4) Certified Registered Nurse Anesthetists (CRNAs) concurrently where volume permits. Payer shall not reimburse for medical direction at ratios lower than 1:4 unless emergency circumstances exist."
           },
           { 
             id: 'balanced', 
             label: '1:3 Permitted', 
             impact: 'Minor Cost',
             legalText: "Anesthesiologists may supervise up to three (3) Certified Registered Nurse Anesthetists (CRNAs) concurrently. Claims shall be submitted with appropriate modifiers indicating the actual supervision ratio."
           },
           { 
             id: 'provider_fav', 
             label: '1:2 Required', 
             impact: 'High Cost',
             legalText: "Anesthesiologists shall supervise no more than two (2) Certified Registered Nurse Anesthetists (CRNAs) concurrently to ensure highest quality of care. Reimbursement shall reflect the 1:2 medical direction rate."
           },
        ]
      }
    ]
  },
  home_health: {
    id: 'home_health',
    name: 'Valley Visiting Nurses',
    type: 'Post-Acute Care',
    icon: <Home size={18} />,
    primaryColor: '#16a34a', // Green
    currencyFormat: (val: number) => `$${val.toLocaleString()}k`,
    rateControls: [
      { id: 'base', label: 'Per Visit Rate (RN)', min: 120, max: 200, step: 5, unit: '$', default: 145 },
      { id: 'carveout', label: 'Rural Add-on', min: 0, max: 15, step: 1, unit: '%', default: 5 }
    ],
    clauses: [
      {
        id: 'mileage',
        title: "Mileage Reimbursement",
        risk: "Med",
        currentText: "IRS Rate + $5 Surcharge",
        legalText: "Provider shall be reimbursed for mileage incurred during patient visits at the current IRS standard mileage rate, plus an additional five dollar ($5.00) administrative surcharge per visit requiring travel exceeding 10 miles.",
        marketStat: "Standard is IRS Rate only",
        options: [
           { 
             id: 'aggressive', 
             label: 'IRS Rate Capped', 
             impact: 'Savings',
             legalText: "Mileage reimbursement shall be limited to the current IRS standard mileage rate for travel exceeding 20 miles round trip. No additional surcharges or administrative fees shall apply."
           },
           { 
             id: 'balanced', 
             label: 'IRS Rate Flat', 
             impact: 'Market Std',
             legalText: "Provider shall be reimbursed for mileage incurred during patient visits at the current IRS standard mileage rate. This payment is inclusive of all travel-related expenses."
           },
           { 
             id: 'provider_fav', 
             label: 'IRS + Surcharge', 
             impact: 'Costly',
             legalText: "Provider shall be reimbursed for mileage incurred during patient visits at the current IRS standard mileage rate, plus an additional five dollar ($5.00) administrative surcharge per visit requiring travel exceeding 10 miles."
           },
        ]
      },
      {
        id: 'supplies',
        title: "Wound Care Supplies",
        risk: "High",
        currentText: "Paid separately at Invoice Cost",
        legalText: "Wound care supplies and other disposable medical items used during the course of a visit shall be billed separately and reimbursed at one hundred percent (100%) of the invoice cost to the Provider.",
        marketStat: "Usually included in Visit Rate",
        options: [
           { 
             id: 'aggressive', 
             label: 'Inclusive in Rate', 
             impact: 'High Savings',
             legalText: "The Per Visit Rate shall be all-inclusive. No separate reimbursement shall be made for wound care supplies, durable medical equipment, or other disposable items used during the visit."
           },
           { 
             id: 'balanced', 
             label: 'Capped Per Visit', 
             impact: 'Neutral',
             legalText: "Routine wound care supplies are included in the Per Visit Rate. Specialized supplies may be billed separately, not to exceed $25.00 per visit, provided prior authorization is obtained."
           },
           { 
             id: 'provider_fav', 
             label: 'Separate Payment', 
             impact: 'High Risk',
             legalText: "Wound care supplies and other disposable medical items used during the course of a visit shall be billed separately and reimbursed at one hundred percent (100%) of the invoice cost to the Provider."
           },
        ]
      }
    ]
  }
};