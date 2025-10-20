// Fix: Implement the CapitalisationForm component.
import React, { useState } from 'react';
import type { PropositionProjet, Capitalisation } from '../../types';
import { AIInputField } from '../AIInputField';

interface CapitalisationFormProps {
  proposition: PropositionProjet;
  initialData?: Capitalisation;
  onSubmit: (data: Omit<Capitalisation, 'id_capitalisation'> | Capitalisation) => void;
  onClose: () => void;
}

export const CapitalisationForm: React.FC<CapitalisationFormProps> = ({ proposition, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_proposition: proposition.id_proposition,
      theme: '',
      type_document: '',
      lien_document: '',
      date_creation: new Date().toISOString().split('T')[0],
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

  const formId = "capitalisation-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <AIInputField label="Thème" name="theme" initialValue={formData.theme} onValueChange={handleFieldChange} context={{proposition}} required />
        <AIInputField label="Type de document" name="type_document" placeholder="ex: Rapport, Guide, Vidéo" initialValue={formData.type_document} onValueChange={handleFieldChange} context={{proposition}} required />
        <AIInputField label="Lien vers le document" name="lien_document" placeholder="ex: https://..." initialValue={formData.lien_document} onValueChange={handleFieldChange} context={{proposition}} />
        <div>
          <label htmlFor="date_creation" className="block text-sm font-medium text-slate-700 mb-1">Date de création</label>
          <input type="date" id="date_creation" name="date_creation" value={formData.date_creation} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
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