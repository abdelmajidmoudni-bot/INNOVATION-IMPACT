import React, { useState } from 'react';
import type { PropositionProjet, Objectif, Resultat } from '../../types';
import { AIInputField } from '../AIInputField';

interface ResultatFormProps {
  proposition: PropositionProjet;
  projectObjectifs: Objectif[];
  initialData?: Resultat;
  onSubmit: (data: Omit<Resultat, 'id_resultat'> | Resultat) => void;
  onClose: () => void;
}

export const ResultatForm: React.FC<ResultatFormProps> = ({ proposition, projectObjectifs, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id_objectif: projectObjectifs[0]?.id_objectif || '',
      formulation_resultat: '',
      type_resultat: 'produit' as 'produit' | 'effet' | 'résultat intermédiaire',
      indicateurs_resultat: '',
      valeur_reference: 0,
      valeur_cible: 100,
      source_verification: '',
      responsable: '',
      niveau_atteinte: 0,
    }
  );

  const handleFieldChange = (name: string, value: string | number) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFieldChange(name, (name === 'valeur_reference' || name === 'valeur_cible') ? Number(value) : value)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.id_objectif) {
        alert("Veuillez sélectionner un objectif.");
        return;
    }
    onSubmit(formData);
  };

  const formId = "resultat-form";
  const selectedObjectif = projectObjectifs.find(o => o.id_objectif === formData.id_objectif);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="text-sm font-medium">Lié à l'objectif</label>
            <select name="id_objectif" value={formData.id_objectif} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white" required>
                <option value="" disabled>-- Sélectionnez un objectif --</option>
                {projectObjectifs.map(o => <option key={o.id_objectif} value={o.id_objectif}>{o.formulation_objectif}</option>)}
            </select>
        </div>
        <div>
            <label className="text-sm font-medium">Type de résultat</label>
            <select name="type_resultat" value={formData.type_resultat} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                <option value="produit">Produit</option>
                <option value="effet">Effet</option>
                <option value="résultat intermédiaire">Résultat intermédiaire</option>
            </select>
        </div>

        <AIInputField
            label="Formulation du résultat"
            name="formulation_resultat"
            initialValue={formData.formulation_resultat}
            onValueChange={(name, value) => handleFieldChange(name, value)}
            context={{ proposition, objectif: selectedObjectif }}
            textarea
            required
        />
        <AIInputField
            label="Indicateurs"
            name="indicateurs_resultat"
            initialValue={formData.indicateurs_resultat}
            onValueChange={(name, value) => handleFieldChange(name, value)}
            context={{ ...formData, objectif: selectedObjectif }}
            textarea
            required
        />
        <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Valeur de référence</label><input type="number" name="valeur_reference" value={formData.valeur_reference} onChange={handleChange} className="w-full border rounded p-2 mt-1" required /></div>
            <div><label className="text-sm font-medium">Valeur cible</label><input type="number" name="valeur_cible" value={formData.valeur_cible} onChange={handleChange} className="w-full border rounded p-2 mt-1" required /></div>
        </div>
        <AIInputField
            label="Source de vérification"
            name="source_verification"
            initialValue={formData.source_verification}
            onValueChange={(name, value) => handleFieldChange(name, value)}
            context={{ ...formData }}
            textarea={false}
            required
        />
        <AIInputField
            label="Responsable"
            name="responsable"
            initialValue={formData.responsable}
            onValueChange={(name, value) => handleFieldChange(name, value)}
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