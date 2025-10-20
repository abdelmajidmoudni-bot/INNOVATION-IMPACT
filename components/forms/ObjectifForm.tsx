import React, { useState } from 'react';
import type { PropositionProjet, Objectif, TheorieChangement } from '../../types';
import { AIInputField } from '../AIInputField';

interface ObjectifFormProps {
  proposition: PropositionProjet;
  projectTheorie: TheorieChangement;
  initialData?: Objectif;
  onSubmit: (data: Omit<Objectif, 'id_objectif'> | Objectif) => void;
  onClose: () => void;
}

export const ObjectifForm: React.FC<ObjectifFormProps> = ({ proposition, projectTheorie, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_theorie: projectTheorie.id_theorie,
      type_objectif: 'spécifique' as 'spécifique' | 'général',
      formulation_objectif: '',
      indicateurs_objectif: '',
      sources_verification: '',
      moyens_de_suivi: '',
      responsable_suivi: '',
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

  const formId = "objectif-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="text-sm font-medium">Type d'objectif</label>
            <select name="type_objectif" value={formData.type_objectif} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                <option value="général">Général</option>
                <option value="spécifique">Spécifique</option>
            </select>
        </div>
        
        <AIInputField
            label="Formulation de l'objectif"
            name="formulation_objectif"
            initialValue={formData.formulation_objectif}
            onValueChange={handleFieldChange}
            context={{ proposition, projectTheorie, type_objectif: formData.type_objectif }}
            textarea
            required
        />
        <AIInputField
            label="Indicateurs"
            name="indicateurs_objectif"
            initialValue={formData.indicateurs_objectif}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Sources de vérification"
            name="sources_verification"
            initialValue={formData.sources_verification}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
            required
        />
        <AIInputField
            label="Moyens de suivi"
            name="moyens_de_suivi"
            initialValue={formData.moyens_de_suivi}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea={false}
            required
        />
        <AIInputField
            label="Responsable du suivi"
            name="responsable_suivi"
            initialValue={formData.responsable_suivi}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea={false}
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