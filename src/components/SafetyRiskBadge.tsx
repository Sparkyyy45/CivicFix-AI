import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { RiskContext } from '@/lib/safety-shield';

interface SafetyRiskBadgeProps {
    riskContext: RiskContext | null;
}

export default function SafetyRiskBadge({ riskContext }: SafetyRiskBadgeProps) {
    if (!riskContext) return null;

    if (riskContext.level === 'CRITICAL') {
        return (
            <div className="mt-6 rounded-2xl bg-red-50 border-2 border-red-100 p-4 relative overflow-hidden animate-pulse-slow">
                <div className="absolute inset-0 bg-red-100/30 animate-pulse"></div>
                <div className="relative z-10 flex items-start gap-3">
                    <div className="bg-red-500 rounded-full p-2 text-white shadow-lg shadow-red-500/30 shrink-0">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                        <h4 className="text-red-800 font-extrabold text-lg uppercase tracking-wide mb-1">
                            Critical Priority: Safety Shield Active
                        </h4>
                        <p className="text-red-700 font-medium text-sm">
                            {riskContext.reason}
                        </p>
                        <p className="text-red-600/80 text-xs mt-1 font-bold">
                            High-Risk Zone • Immediate Dispatch Requested
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
            <Shield className="w-4 h-4" />
            <span>🛡️ Safety Shield: {riskContext.reason}</span>
        </div>
    );
}
