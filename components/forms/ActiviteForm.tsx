// Fix: Implement the ActiviteForm component.
import React, { useState } from 'react';
import type { PropositionProjet, Resultat, Activite } from '../../types';
import { AIInputField } from '../AIInputField';

interface ActiviteFormProps {
  proposition: PropositionProjet;
  projectResultats: Resultat[];
  initialData?: Activite;
  onSubmit: (data: Omit<Activite, 'id_activite'> | Activite) => void;
  onClose: () => void;
}

export const ActiviteForm: React.FC<ActiviteFormProps> = ({ proposition, projectResultats, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_resultat: projectResultats[0]?.id_resultat || '',
      intitule_activite: '',
      description: '',
      responsable: '',
      periode_execution: '',
    }
  );

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.id_resultat) {
        alert("Veuillez sélectionner un résultat.");
        return;
    }
    onSubmit(formData);
  };
  
  const formId = "activite-form";
  const selectedResultat = projectResultats.find(r => r.id_resultat === formData.id_resultat);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="text-sm font-medium">Liée au résultat</label>
            <select name="id_resultat" value={formData.id_resultat} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white" required>
                <option value="" disabled>-- Sélectionnez un résultat --</option>
                {projectResultats.map(r => <option key={r.id_resultat} value={r.id_resultat}>{r.formulation_resultat}</option>)}
            </select>
        </div>
        
        <AIInputField
            label="Intitulé de l'activité"
            name="intitule_activite"
            initialValue={formData.intitule_activite}
            onValueChange={handleFieldChange}
            context={{ proposition, resultat: selectedResultat }}
            required
        />
        <AIInputField
            label="Description"
            name="description"
            initialValue={formData.description}
            onValueChange={handleFieldChange}
            context={{ ...formData, resultat: selectedResultat }}
            textarea
            required
        />
        <AIInputField
            label="Responsable"
            name="responsable"
            initialValue={formData.responsable}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
        />
         <AIInputField
            label="Période d'exécution"
            name="periode_execution"
            placeholder="ex: Jan - Mars 2024"
            initialValue={formData.periode_execution}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
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