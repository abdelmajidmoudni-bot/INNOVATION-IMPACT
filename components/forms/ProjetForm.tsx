import React, { useState, useEffect } from 'react';
import type { PropositionProjet, StatutProposition } from '../../types';
import { AIInputField } from '../AIInputField';

interface PropositionFormProps {
    onSubmit: (proposition: Omit<PropositionProjet, 'id_proposition'> | PropositionProjet) => void;
    onClose: () => void;
    initialData?: PropositionProjet;
}

const statutOptions: StatutProposition[] = ['En rédaction', 'Soumise', 'Acceptée', 'Refusée', 'Reportée', 'Annulée'];

export const PropositionForm: React.FC<PropositionFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [proposition, setProposition] = useState(
        initialData || {
            nom_projet: '',
            annee: new Date().getFullYear(),
            bailleur_de_fond: '',
            zone_intervention: '',
            date_debut: '',
            date_fin: '',
            description_contexte: '',
            defis_identifies: '',
            justification: '',
            valeurs_et_principes: '',
            approche_transversale: '',
            date_limite_proposition: '',
            email_envoi: '',
            statut_proposition: 'En rédaction' as StatutProposition,
            date_statut: new Date().toISOString().split('T')[0],
        }
    );
    const [durationInMonths, setDurationInMonths] = useState<number | null>(null);

    useEffect(() => {
        if (proposition.date_debut && proposition.date_fin) {
            const start = new Date(proposition.date_debut);
            const end = new Date(proposition.date_fin);
            if (end >= start) {
                const yearDiff = end.getFullYear() - start.getFullYear();
                const monthDiff = end.getMonth() - start.getMonth();
                const dayDiff = end.getDate() - start.getDate();
                let totalMonths = yearDiff * 12 + monthDiff;
                if (dayDiff > 0) totalMonths +=1;
                setDurationInMonths(totalMonths > 0 ? totalMonths: 1);
            } else {
                setDurationInMonths(null);
            }
        } else {
            setDurationInMonths(null);
        }
    }, [proposition.date_debut, proposition.date_fin]);
    
    const handleFieldChange = (name: string, value: string | number) => {
        setProposition(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Fix: Handle statut_proposition as a special case to preserve its type.
        // The value from a select is a string, so we cast it to StatutProposition.
        if (name === 'statut_proposition') {
            setProposition(prev => ({ ...prev, statut_proposition: value as StatutProposition }));
        } else {
            handleFieldChange(name, name === 'annee' ? Number(value) : value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(proposition);
    };

    const formId = "proposition-form";

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-slate-900 border-b pb-2 mb-4">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                   <div><label className="text-sm font-medium">Nom de la proposition</label><input type="text" name="nom_projet" value={proposition.nom_projet} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   <div><label className="text-sm font-medium">Année</label><input type="number" name="annee" value={proposition.annee} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   <div><label className="text-sm font-medium">Commettant / Bailleur de fond</label><input type="text" name="bailleur_de_fond" value={proposition.bailleur_de_fond} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   <div><label className="text-sm font-medium">Zone d'intervention</label><input type="text" name="zone_intervention" value={proposition.zone_intervention} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   <div><label className="text-sm font-medium">Date de début</label><input type="date" name="date_debut" value={proposition.date_debut} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   <div><label className="text-sm font-medium">Date de fin</label><input type="date" name="date_fin" value={proposition.date_fin} onChange={handleChange} required className="w-full border rounded p-2 mt-1" /></div>
                   
                   {durationInMonths !== null && (
                      <div className="md:col-span-2 bg-primary-50 text-primary-700 p-3 rounded-md text-center">
                          <p className="font-semibold">Durée calculée : {durationInMonths} mois</p>
                      </div>
                   )}
              </div>
            </div>

            <div>
                 <h3 className="text-lg font-medium leading-6 text-slate-900 border-b pb-2 mb-4">Suivi de la Soumission</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                     <div><label className="text-sm font-medium">Date limite de soumission</label><input type="date" name="date_limite_proposition" value={proposition.date_limite_proposition} onChange={handleChange} className="w-full border rounded p-2 mt-1" /></div>
                     <div><label className="text-sm font-medium">Email d'envoi</label><input type="email" name="email_envoi" value={proposition.email_envoi} onChange={handleChange} className="w-full border rounded p-2 mt-1" /></div>
                     <div>
                         <label className="text-sm font-medium">Statut</label>
                         <select name="statut_proposition" value={proposition.statut_proposition} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white">
                            {statutOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                         </select>
                     </div>
                     <div><label className="text-sm font-medium">Date du statut</label><input type="date" name="date_statut" value={proposition.date_statut} onChange={handleChange} className="w-full border rounded p-2 mt-1" /></div>
                 </div>
            </div>
            
            <div>
                <h3 className="text-lg font-medium leading-6 text-slate-900 border-b pb-2 mb-4">Contenu de la Proposition</h3>
                <div className="space-y-4 mt-4">
                    <AIInputField label="Description & contexte" name="description_contexte" initialValue={proposition.description_contexte} onValueChange={handleFieldChange} context={{ ...proposition }} textarea required />
                    <AIInputField label="Défis identifiés" name="defis_identifies" initialValue={proposition.defis_identifies} onValueChange={handleFieldChange} context={{ proposition }} textarea />
                    <AIInputField label="Justification" name="justification" initialValue={proposition.justification} onValueChange={handleFieldChange} context={{ proposition }} textarea />
                    <AIInputField label="Valeurs et principes" name="valeurs_et_principes" initialValue={proposition.valeurs_et_principes} onValueChange={handleFieldChange} context={{ proposition }} textarea />
                    <AIInputField label="Approche transversale" name="approche_transversale" initialValue={proposition.approche_transversale} onValueChange={handleFieldChange} context={{ proposition }} textarea />
                </div>
            </div>

            <footer className="p-6 bg-slate-50 border-t border-slate-200 -m-6 mt-6 rounded-b-2xl flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Annuler</button>
                <button type="submit" form={formId} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                    {initialData ? 'Enregistrer les modifications' : 'Créer la proposition'}
                </button>
            </footer>
        </form>
    );
};
