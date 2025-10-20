import React, { useState, useEffect } from 'react';
import type { BudgetLigne, Activite } from '../../types';

interface BudgetEditorProps {
    initialBudget: BudgetLigne[];
    projectActivites: Activite[];
    id_proposition: string;
    onSave: (budget: BudgetLigne[]) => void;
    onClose: () => void;
    isModal?: boolean;
}

const budgetPostes = [
    'Honoraire',
    'Transport',
    'Perdiem',
    'Alimentation',
    'Reception',
    'Petits materiels',
    'Impression',
    'Autres'
];

export const BudgetEditor: React.FC<BudgetEditorProps> = ({ 
    initialBudget, 
    projectActivites, 
    id_proposition, 
    onSave, 
    onClose,
    isModal = true 
}) => {
    const [budgetLines, setBudgetLines] = useState<BudgetLigne[]>([]);

    useEffect(() => {
        setBudgetLines(JSON.parse(JSON.stringify(initialBudget)));
    }, [initialBudget]);

    const handleLineChange = (index: number, field: keyof BudgetLigne, value: any) => {
        const newLines = [...budgetLines];
        const line = newLines[index];

        const numericValue = Math.max(0, parseFloat(value) || 0);

        switch(field) {
            case 'quantite':
            case 'cout_unitaire':
                (line as any)[field] = numericValue;
                line.montant_total = (line.quantite || 0) * (line.cout_unitaire || 0);
                // Reset allocation when total changes to force user re-validation
                line.part_bailleur = line.montant_total;
                line.part_associee = 0;
                break;
            
            case 'part_bailleur':
                const bailleurValue = Math.min(numericValue, line.montant_total);
                line.part_bailleur = bailleurValue;
                line.part_associee = line.montant_total - bailleurValue;
                break;

            case 'part_associee':
                const associeeValue = Math.min(numericValue, line.montant_total);
                line.part_associee = associeeValue;
                line.part_bailleur = line.montant_total - associeeValue;
                break;
            
            default:
                 (line as any)[field] = value;
        }
        
        setBudgetLines(newLines);
    };

    const addLine = () => {
        setBudgetLines([
            ...budgetLines,
            {
                id_budget: `new_${Date.now()}`,
                id_proposition,
                id_activite: '',
                code_comptable: '',
                designation: budgetPostes[0], // Default to the first option
                libelle: '',
                unite: 'Forfait',
                quantite: 1,
                cout_unitaire: 0,
                montant_total: 0,
                part_bailleur: 0,
                part_associee: 0,
            },
        ]);
    };

    const removeLine = (index: number) => {
        setBudgetLines(budgetLines.filter((_, i) => i !== index));
    };

    const totalBudget = budgetLines.reduce((sum, line) => sum + (line.montant_total || 0), 0);
    const totalBailleur = budgetLines.reduce((sum, line) => sum + (line.part_bailleur || 0), 0);
    const totalAssociee = budgetLines.reduce((sum, line) => sum + (line.part_associee || 0), 0);

    return (
        <div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activité</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Désignation</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Libellé (Description)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qté</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Coût U.</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Part Bailleur</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Part Associée</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reste</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {budgetLines.map((line, index) => {
                            const remaining = line.montant_total - (line.part_bailleur + line.part_associee);
                            return (
                                <tr key={line.id_budget}>
                                    <td className="px-2 py-1.5"><select value={line.id_activite} onChange={(e) => handleLineChange(index, 'id_activite', e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500"><option value="">Général/Proposition</option>{projectActivites.map(a => <option key={a.id_activite} value={a.id_activite}>{a.intitule_activite}</option>)}</select></td>
                                    <td className="px-2 py-1.5">
                                        <select value={line.designation} onChange={(e) => handleLineChange(index, 'designation', e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500">
                                            {budgetPostes.map(poste => (
                                                <option key={poste} value={poste}>{poste}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-2 py-1.5"><input type="text" value={line.libelle} onChange={(e) => handleLineChange(index, 'libelle', e.target.value)} placeholder="Précisez la dépense..." className="w-full border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" /></td>
                                    <td className="px-2 py-1.5"><input type="number" min="0" value={line.quantite} onChange={(e) => handleLineChange(index, 'quantite', e.target.value)} className="w-16 border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" /></td>
                                    <td className="px-2 py-1.5"><input type="number" min="0" value={line.cout_unitaire} onChange={(e) => handleLineChange(index, 'cout_unitaire', e.target.value)} className="w-24 border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" /></td>
                                    <td className="px-2 py-1.5 text-sm font-semibold text-slate-900 bg-slate-50 text-right">{line.montant_total.toLocaleString()}</td>
                                    <td className="px-2 py-1.5"><input type="number" min="0" max={line.montant_total} value={line.part_bailleur} onChange={(e) => handleLineChange(index, 'part_bailleur', e.target.value)} className="w-24 border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" /></td>
                                    <td className="px-2 py-1.5"><input type="number" min="0" max={line.montant_total} value={line.part_associee} onChange={(e) => handleLineChange(index, 'part_associee', e.target.value)} className="w-24 border-slate-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" /></td>
                                    <td className={`px-2 py-1.5 text-sm font-medium text-right ${remaining !== 0 ? 'text-red-600' : 'text-green-600'}`}>{remaining.toLocaleString()}</td>
                                    <td className="px-2 py-1.5 text-center"><button onClick={() => removeLine(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">X</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                     <tfoot className="bg-slate-100 font-bold">
                        <tr>
                            <td colSpan={5} className="px-3 py-2 text-right text-sm text-slate-800 uppercase">Totaux</td>
                            <td className="px-3 py-2 text-right text-sm text-slate-900">{totalBudget.toLocaleString()} MAD</td>
                            <td className="px-3 py-2 text-right text-sm text-slate-900">{totalBailleur.toLocaleString()} MAD</td>
                            <td className="px-3 py-2 text-right text-sm text-slate-900">{totalAssociee.toLocaleString()} MAD</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                 <button onClick={addLine} type="button" className="text-sm bg-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-300 font-semibold text-slate-700">Ajouter une ligne</button>
            </div>
            {isModal && (
              <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-4 rounded-b-2xl flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
                  <button type="button" onClick={() => onSave(budgetLines)} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Sauvegarder le budget</button>
              </footer>
            )}
        </div>
    );
};