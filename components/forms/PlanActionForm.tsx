import React, { useState } from 'react';
import type { PropositionProjet, Activite, PlanAction } from '../../types';
import { AIInputField } from '../AIInputField';

interface PlanActionFormProps {
  proposition: PropositionProjet;
  projectActivites: Activite[];
  initialData?: PlanAction;
  onSubmit: (data: Omit<PlanAction, 'id_plan'> | PlanAction) => void;
  onClose: () => void;
}

export const PlanActionForm: React.FC<PlanActionFormProps> = ({ proposition, projectActivites, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_activite: projectActivites[0]?.id_activite || '',
      phase: 'préparation' as 'préparation' | 'mise en œuvre' | 'évaluation',
      mois: '',
      responsable: '',
      statut: 'à faire' as 'à faire' | 'en cours' | 'terminé',
      commentaire_de_suivi: '',
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
    if(!formData.id_activite) {
        alert("Veuillez sélectionner une activité.");
        return;
    }
    onSubmit(formData);
  };

  const formId = "plan-action-form";
  const selectedActivite = projectActivites.find(a => a.id_activite === formData.id_activite);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="text-sm font-medium">Lié à l'activité</label>
            <select name="id_activite" value={formData.id_activite} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white" required>
                <option value="" disabled>-- Sélectionnez une activité --</option>
                {projectActivites.map(a => <option key={a.id_activite} value={a.id_activite}>{a.intitule_activite}</option>)}
            </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium">Phase</label>
                <select name="phase" value={formData.phase} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                    <option value="préparation">Préparation</option>
                    <option value="mise en œuvre">Mise en œuvre</option>
                    <option value="évaluation">Évaluation</option>
                </select>
            </div>
            <div><label className="text-sm font-medium">Mois</label><input type="text" name="mois" value={formData.mois} onChange={handleChange} placeholder="ex: Jan 2024" className="w-full border rounded p-2 mt-1" /></div>
            <div>
                <label className="text-sm font-medium">Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                    <option value="à faire">À faire</option>
                    <option value="en cours">En cours</option>
                    <option value="terminé">Terminé</option>
                </select>
            </div>
            <AIInputField
                label="Responsable"
                name="responsable"
                initialValue={formData.responsable}
                onValueChange={handleFieldChange}
                context={{ proposition, activite: selectedActivite }}
            />
        </div>
        
        <AIInputField
            label="Commentaire de suivi"
            name="commentaire_de_suivi"
            initialValue={formData.commentaire_de_suivi}
            onValueChange={handleFieldChange}
            context={{ ...formData }}
            textarea
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