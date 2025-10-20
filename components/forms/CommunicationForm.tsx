// Fix: Implement the CommunicationForm component.
import React, { useState } from 'react';
import type { PropositionProjet, Communication } from '../../types';
import { AIInputField } from '../AIInputField';

interface CommunicationFormProps {
  proposition: PropositionProjet;
  initialData?: Communication;
  onSubmit: (data: Omit<Communication, 'id_communication'> | Communication) => void;
  onClose: () => void;
}

export const CommunicationForm: React.FC<CommunicationFormProps> = ({ proposition, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_proposition: proposition.id_proposition,
      type_support: '',
      cible: '',
      message_cle: '',
      date_diffusion: '',
      canal: '',
      responsable: '',
    }
  );
  
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formId = "communication-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <AIInputField label="Type de support" name="type_support" initialValue={formData.type_support} onValueChange={handleFieldChange} context={{proposition}} required />
        <AIInputField label="Cible" name="cible" initialValue={formData.cible} onValueChange={handleFieldChange} context={{proposition}} required />
        <AIInputField label="Message clé" name="message_cle" initialValue={formData.message_cle} onValueChange={handleFieldChange} context={{proposition}} textarea required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Date de diffusion</label><input type="date" name="date_diffusion" value={formData.date_diffusion} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
            <AIInputField label="Canal de diffusion" name="canal" initialValue={formData.canal} onValueChange={handleFieldChange} context={{proposition}} required />
        </div>
        <AIInputField label="Responsable" name="responsable" initialValue={formData.responsable} onValueChange={handleFieldChange} context={{proposition}} required />
        
        <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-4 rounded-b-2xl flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
            <button type="submit" form={formId} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                {initialData ? 'Enregistrer les modifications' : 'Sauvegarder'}
            </button>
        </footer>
    </form>
  );
};