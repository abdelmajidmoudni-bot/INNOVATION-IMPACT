// Fix: Implement the Dashboard component.
import React from 'react';
import { PropositionProjet, BudgetLigne } from '../types';
import { ProjectIcon, EvaluationIcon, TeamIcon } from './icons';

interface DashboardProps {
  propositions: PropositionProjet[];
  budget: BudgetLigne[];
  onSelectProposition: (propositionId: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md flex items-center border-l-4 ${color}`}>
        {icon}
        <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ propositions, budget, onSelectProposition }) => {
    const totalBudget = budget.reduce((sum, item) => sum + item.montant_total, 0);
    const activePropositions = propositions.filter(p => p.statut_proposition === 'Acceptée');
    
    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    icon={<ProjectIcon className="w-8 h-8 text-blue-500" />} 
                    label="Propositions au total" 
                    value={propositions.length}
                    color="border-blue-500"
                />
                 <StatCard 
                    icon={<EvaluationIcon className="w-8 h-8 text-green-500" />}
                    label="Budget total"
                    value={`${totalBudget.toLocaleString()} MAD`}
                    color="border-green-500"
                />
                 <StatCard 
                    icon={<TeamIcon className="w-8 h-8 text-yellow-500" />}
                    label="Projets actifs"
                    value={activePropositions.length}
                    color="border-yellow-500"
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Propositions Récentes</h2>
                 {propositions.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                       <ul role="list" className="divide-y divide-slate-200">
                           {propositions.slice(0, 5).map((proposition) => (
                                <li key={proposition.id_proposition} onClick={() => onSelectProposition(proposition.id_proposition)} className="p-4 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-primary-600">{proposition.nom_projet}</p>
                                        <p className="text-sm text-slate-500">{proposition.bailleur_de_fond}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Fin: {new Date(proposition.date_fin).toLocaleDateString()}</p>
                                        <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{proposition.annee}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl shadow-md">
                        <p className="text-slate-500">Aucune proposition à afficher.</p>
                    </div>
                )}
            </div>
        </div>
    );
};