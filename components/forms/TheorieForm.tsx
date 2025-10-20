import React, { useState } from 'react';
import type { PropositionProjet, TheorieChangement } from '../../types';
import { AIInputField } from '../AIInputField';

interface TheorieFormProps {
  proposition: PropositionProjet;
  initialData?: TheorieChangement;
  onSubmit: (data: Omit<TheorieChangement, 'id_theorie'> | TheorieChangement) => void;
  onClose: () => void;
}

export const TheorieForm: React.FC<TheorieFormProps> = ({ proposition, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_proposition: proposition.id_proposition,
      formulation_long_terme: '',
      hypotheses_clefs: '',
      facteurs_de_changement: '',
      enjeux_sociaux_vises: '',
      indicateurs_impact: '',
      sources_de_verification_impact: '',
    }
  );
  
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formId = "theorie-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <AIInputField
            label="Vision à long terme"
            name="formulation_long_terme"
            initialValue={formData.formulation_long_terme}
            onValueChange={handleFieldChange}
            context={{ proposition }}
            textarea
            required
        />
        <AIInputField
            label="Hypothèses clés"
            name="hypotheses_clefs"
            initialValue={formData.hypotheses_clefs}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Facteurs de changement"
            name="facteurs_de_changement"
            initialValue={formData.facteurs_de_changement}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Enjeux sociaux visés"
            name="enjeux_sociaux_vises"
            initialValue={formData.enjeux_sociaux_vises}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Indicateurs d'impact"
            name="indicateurs_impact"
            initialValue={formData.indicateurs_impact}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Sources de vérification"
            name="sources_de_verification_impact"
            initialValue={formData.sources_de_verification_impact}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />

        <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-4 rounded-b-2xl flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
            <button type="submit" form={formId} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                {initialData ? 'Enregistrer les modifications' : 'Sauvegarder'}
            </button>
        </footer>
    </form>
  );
};