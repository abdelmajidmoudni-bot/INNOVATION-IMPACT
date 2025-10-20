import React, { useState } from 'react';
import type { PropositionProjet, PublicCible } from '../../types';
import { AIInputField } from '../AIInputField';

interface PublicCibleFormProps {
  proposition: PropositionProjet;
  initialData?: PublicCible;
  onSubmit: (data: Omit<PublicCible, 'id_public'> | PublicCible) => void;
  onClose: () => void;
}

export const PublicCibleForm: React.FC<PublicCibleFormProps> = ({ proposition, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_proposition: proposition.id_proposition,
      categorie: '',
      sexe: 'Mixte' as 'Hommes' | 'Femmes' | 'Mixte',
      tranche_d_age: '',
      localisation: '',
      niveau_vulnerabilite: '',
      nombre_estime: 0,
      nombre_atteint: 0,
      commentaire_impact: '',
    }
  );

  const handleFieldChange = (name: string, value: string | number) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFieldChange(name, (name === 'nombre_estime' || name === 'nombre_atteint') ? Number(value) : value)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formId = "public-form";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AIInputField label="Catégorie" name="categorie" placeholder="ex: Jeunes déscolarisés" initialValue={formData.categorie} onValueChange={handleFieldChange} context={{proposition}} required />
            <div>
                <label className="text-sm font-medium">Sexe</label>
                <select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                    <option value="Hommes">Hommes</option>
                    <option value="Femmes">Femmes</option>
                    <option value="Mixte">Mixte</option>
                </select>
            </div>
            <AIInputField label="Tranche d'âge" name="tranche_d_age" placeholder="ex: 16-25 ans" initialValue={formData.tranche_d_age} onValueChange={handleFieldChange} context={{...formData}} />
            <AIInputField label="Localisation" name="localisation" initialValue={formData.localisation} onValueChange={handleFieldChange} context={{...formData}} />
            <AIInputField label="Niveau de vulnérabilité" name="niveau_vulnerabilite" placeholder="ex: Élevé" initialValue={formData.niveau_vulnerabilite} onValueChange={handleFieldChange} context={{...formData}} />
            <div></div>
            <div><label className="text-sm font-medium">Nombre estimé</label><input type="number" name="nombre_estime" value={formData.nombre_estime} onChange={handleChange} className="w-full border rounded p-2 mt-1" required /></div>
            <div><label className="text-sm font-medium">Nombre atteint</label><input type="number" name="nombre_atteint" value={formData.nombre_atteint} onChange={handleChange} className="w-full border rounded p-2 mt-1" required /></div>
        </div>
        <AIInputField label="Commentaire sur l'impact" name="commentaire_impact" initialValue={formData.commentaire_impact} onValueChange={handleFieldChange} context={{...formData}} textarea />

        <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-4 rounded-b-2xl flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
            <button type="submit" form={formId} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                {initialData ? 'Enregistrer les modifications' : 'Sauvegarder'}
            </button>
        </footer>
    </form>
  );
};