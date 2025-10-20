import React from 'react';
import type { PropositionProjet, BudgetLigne, StatutProposition } from '../types';
import { Modal } from './Modal';
import { PlusIcon } from './icons';
import { PropositionForm } from './forms/ProjetForm';

interface PropositionsViewProps {
  propositions: PropositionProjet[];
  budget: BudgetLigne[];
  onAddProposition: (proposition: Omit<PropositionProjet, 'id_proposition'>) => void;
  onSelectProposition: (propositionId: string) => void;
  onDeleteProposition: (propositionId: string) => void;
}

const getStatusBadgeColor = (status?: StatutProposition) => {
    switch (status) {
        case 'Acceptée':
            return 'bg-green-100 text-green-800';
        case 'Refusée':
        case 'Annulée':
            return 'bg-red-100 text-red-800';
        case 'Soumise':
        case 'Reportée':
            return 'bg-yellow-100 text-yellow-800';
        case 'En rédaction':
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

const PropositionCard: React.FC<{
    proposition: PropositionProjet;
    budgetTotal: number;
    onSelect: () => void;
    onDelete: () => void;
}> = ({ proposition, budgetTotal, onSelect, onDelete }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer group" onClick={onSelect}>
        <div>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary-600 flex-1 mr-2">{proposition.nom_projet}</h3>
                {proposition.statut_proposition && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeColor(proposition.statut_proposition)}`}>
                        {proposition.statut_proposition}
                    </span>
                )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{proposition.bailleur_de_fond}</p>
            
            {proposition.date_limite_proposition && (
                <p className="text-xs text-red-600 font-medium mt-2">
                    Date limite: {new Date(proposition.date_limite_proposition).toLocaleDateString()}
                </p>
            )}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
             <div className="text-sm font-bold text-slate-700">{budgetTotal.toLocaleString()} MAD</div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-sm font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 hover:underline">Supprimer</button>
        </div>
    </div>
);

export const PropositionsView: React.FC<PropositionsViewProps> = ({ propositions, budget, onAddProposition, onSelectProposition, onDeleteProposition }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const handleAddProposition = (proposition: Omit<PropositionProjet, 'id_proposition'>) => {
    onAddProposition(proposition);
    setIsModalOpen(false);
  }

  const getPropositionBudget = (propositionId: string) => {
    return budget
        .filter(l => l.id_proposition === propositionId)
        .reduce((sum, l) => sum + l.montant_total, 0);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Propositions de Projets</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300 transform hover:scale-105">
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouvelle Proposition
        </button>
      </div>
      
      {propositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {propositions.map(proposition => (
            <PropositionCard 
                key={proposition.id_proposition} 
                proposition={proposition}
                budgetTotal={getPropositionBudget(proposition.id_proposition)}
                onSelect={() => onSelectProposition(proposition.id_proposition)}
                onDelete={() => onDeleteProposition(proposition.id_proposition)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Aucune proposition</h3>
            <p className="mt-1 text-sm text-slate-500">Commencez par créer une nouvelle proposition.</p>
            <div className="mt-6">
                 <button onClick={() => setIsModalOpen(true)} className="flex items-center mx-auto bg-primary-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-600 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Créer une proposition
                </button>
            </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Créer une nouvelle proposition"
      >
        <PropositionForm 
            onSubmit={handleAddProposition as (p: PropositionProjet | Omit<PropositionProjet, 'id_proposition'>) => void} 
            onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
