import React, { useState } from 'react';
import type { PropositionProjet, Risque } from '../../types';
import { AIInputField } from '../AIInputField';

interface RisqueFormProps {
  proposition: PropositionProjet;
  initialData?: Risque;
  onSubmit: (data: Omit<Risque, 'id_risque'> | Risque) => void;
  onClose: () => void;
}

export const RisqueForm: React.FC<RisqueFormProps> = ({ proposition, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_proposition: proposition.id_proposition,
      description_risque: '',
      probabilite: 'moyenne' as 'faible' | 'moyenne' | 'élevée',
      impact: 'moyen' as 'faible' | 'moyen' | 'élevé',
      mesures_attenuation: '',
      responsable_suivi: '',
      statut: 'actif' as 'actif' | 'mitigé' | 'clos',
    }
  );
  
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formId = "risque-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <AIInputField
            label="Description du risque"
            name="description_risque"
            initialValue={formData.description_risque}
            onValueChange={handleFieldChange}
            context={{ proposition }}
            textarea
            required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium">Probabilité</label>
                <select name="probabilite" value={formData.probabilite} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="élevée">Élevée</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium">Impact</label>
                <select name="impact" value={formData.impact} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="élevé">Élevé</option>
                </select>
            </div>
        </div>

        <AIInputField
            label="Mesures d'atténuation"
            name="mesures_attenuation"
            initialValue={formData.mesures_attenuation}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
        />
        <AIInputField
            label="Responsable du suivi"
            name="responsable_suivi"
            initialValue={formData.responsable_suivi}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
        />
        <div>
            <label className="text-sm font-medium">Statut</label>
            <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                <option value="actif">Actif</option>
                <option value="mitigé">Mitigé</option>
                <option value="clos">Clos</option>
            </select>
        </div>
        
        <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-4 rounded-b-2xl flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
            <button type="submit" form={formId} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                {initialData ? 'Enregistrer les modifications' : 'Sauvegarder'}
            </button>
        </footer>
    </form>
  );
};