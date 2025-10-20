import React, { useState } from 'react';
import type { PropositionProjet, AppData, TheorieChangement, Objectif, Resultat, Activite, PublicCible, Risque, PlanAction, BudgetLigne, Communication, Capitalisation } from '../types';
import { Modal } from './Modal';
import { PlusIcon } from './icons';
import { PropositionForm } from './forms/ProjetForm';
import { TheorieForm } from './forms/TheorieForm';
import { ObjectifForm } from './forms/ObjectifForm';
import { ResultatForm } from './forms/ResultatForm';
import { ActiviteForm } from './forms/ActiviteForm';
import { BudgetEditor } from './forms/BudgetEditor';
import { PublicCibleForm } from './forms/PublicCibleForm';
import { RisqueForm } from './forms/RisqueForm';
import { PlanActionForm } from './forms/PlanActionForm';
import { CommunicationForm } from './forms/CommunicationForm';
import { CapitalisationForm } from './forms/CapitalisationForm';
import { MarkdownRenderer } from './MarkdownRenderer';

type ModalState = 
  | { type: 'editProposition'; data: PropositionProjet }
  | { type: 'addTheorie' }
  | { type: 'editTheorie'; data: TheorieChangement }
  | { type: 'addObjectif' }
  | { type: 'editObjectif'; data: Objectif }
  | { type: 'addResultat' }
  | { type: 'editResultat'; data: Resultat }
  | { type: 'addActivite' }
  | { type: 'editActivite'; data: Activite }
  | { type: 'editBudget' }
  | { type: 'addPublicCible' }
  | { type: 'editPublicCible'; data: PublicCible }
  | { type: 'addRisque' }
  | { type: 'editRisque'; data: Risque }
  | { type: 'addPlanAction' }
  | { type: 'editPlanAction'; data: PlanAction }
  | { type: 'addCommunication' }
  | { type: 'editCommunication'; data: Communication }
  | { type: 'addCapitalisation' }
  | { type: 'editCapitalisation'; data: Capitalisation }
  | null;


interface Handlers {
    updateProposition: (p: PropositionProjet) => void;
    addTheorie: (t: Omit<TheorieChangement, 'id_theorie'>) => void;
    updateTheorie: (t: TheorieChangement) => void;
    deleteTheorie: (id: string) => void;
    addObjectif: (o: Omit<Objectif, 'id_objectif'>) => void;
    updateObjectif: (o: Objectif) => void;
    deleteObjectif: (id: string) => void;
    addResultat: (r: Omit<Resultat, 'id_resultat'>) => void;
    updateResultat: (r: Resultat) => void;
    deleteResultat: (id: string) => void;
    addActivite: (a: Omit<Activite, 'id_activite'>) => void;
    updateActivite: (a: Activite) => void;
    deleteActivite: (id: string) => void;
    updateBudget: (b: BudgetLigne[]) => void;
    addPublicCible: (pc: Omit<PublicCible, 'id_public'>) => void;
    updatePublicCible: (pc: PublicCible) => void;
    deletePublicCible: (id: string) => void;
    addRisque: (r: Omit<Risque, 'id_risque'>) => void;
    updateRisque: (r: Risque) => void;
    deleteRisque: (id: string) => void;
    addPlanAction: (p: Omit<PlanAction, 'id_plan'>) => void;
    updatePlanAction: (p: PlanAction) => void;
    deletePlanAction: (id: string) => void;
    addCommunication: (c: Omit<Communication, 'id_communication'>) => void;
    updateCommunication: (c: Communication) => void;
    deleteCommunication: (id: string) => void;
    addCapitalisation: (c: Omit<Capitalisation, 'id_capitalisation'>) => void;
    updateCapitalisation: (c: Capitalisation) => void;
    deleteCapitalisation: (id: string) => void;
}
  
interface PropositionDetailProps {
  proposition: PropositionProjet;
  appData: AppData;
  handlers: Handlers;
  onBack: () => void;
}

type Tab = 'info' | 'theorie' | 'objectifs' | 'resultats' | 'activites' | 'budget' | 'public' | 'risques' | 'plan' | 'communication' | 'capitalisation';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
            isActive ? 'bg-primary-500 text-white shadow' : 'text-slate-600 hover:bg-primary-100'
        }`}
    >
        {label}
    </button>
);

const SectionHeader: React.FC<{title: string, onAdd?: () => void, addDisabled?: boolean, disabledTooltip?: string}> = ({ title, onAdd, addDisabled = false, disabledTooltip }) => (
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        {onAdd && (
            <div className="relative group">
                <button 
                    onClick={onAdd} 
                    disabled={addDisabled}
                    className="flex items-center bg-primary-100 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-200 transition-colors text-sm font-semibold disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    <PlusIcon className="w-4 h-4 mr-1.5" />
                    Ajouter
                </button>
                {addDisabled && disabledTooltip && (
                    <div className="absolute bottom-full mb-2 w-max bg-slate-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {disabledTooltip}
                    </div>
                )}
            </div>
        )}
    </div>
);

const ActionButtons: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
    <div className="flex items-center space-x-2 flex-shrink-0">
        <button onClick={onEdit} className="text-sm font-medium text-primary-600 hover:underline">Modifier</button>
        <button onClick={onDelete} className="text-sm font-medium text-red-600 hover:underline">Supprimer</button>
    </div>
);


export const PropositionDetail: React.FC<PropositionDetailProps> = ({ proposition, appData, handlers, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('info');
    const [modalState, setModalState] = useState<ModalState>(null);

    const closeModal = () => setModalState(null);

    const propositionTheories = appData.theories.filter(t => t.id_proposition === proposition.id_proposition);
    const propositionTheoriesIds = propositionTheories.map(t => t.id_theorie);
    const propositionObjectifs = appData.objectifs.filter(o => propositionTheoriesIds.includes(o.id_theorie));
    const propositionObjectifsIds = propositionObjectifs.map(o => o.id_objectif);
    const propositionResultats = appData.resultats.filter(r => propositionObjectifsIds.includes(r.id_objectif));
    const propositionResultatsIds = propositionResultats.map(r => r.id_resultat);
    const propositionActivites = appData.activites.filter(a => propositionResultatsIds.includes(a.id_resultat));
    const propositionActivitesIds = propositionActivites.map(a => a.id_activite);
    const propositionBudget = appData.budget.filter(b => b.id_proposition === proposition.id_proposition);
    const propositionPublics = appData.publicsCibles.filter(pc => pc.id_proposition === proposition.id_proposition);
    const propositionRisques = appData.risques.filter(r => r.id_proposition === proposition.id_proposition);
    const propositionPlans = appData.plansAction.filter(p => propositionActivitesIds.includes(p.id_activite));
    const propositionCommunications = appData.communications.filter(c => c.id_proposition === proposition.id_proposition);
    const propositionCapitalisations = appData.capitalisations.filter(c => c.id_proposition === proposition.id_proposition);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <div className="flex justify-between items-center">
                             <h3 className="text-xl font-bold text-slate-800">Informations Générales</h3>
                             <button onClick={() => setModalState({ type: 'editProposition', data: proposition })} className="text-sm font-medium text-primary-600 hover:underline">Modifier la proposition</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <p><strong className="font-semibold text-slate-600">Bailleur de fond:</strong> {proposition.bailleur_de_fond}</p>
                            <p><strong className="font-semibold text-slate-600">Année:</strong> {proposition.annee}</p>
                            <p><strong className="font-semibold text-slate-600">Zone:</strong> {proposition.zone_intervention}</p>
                            <p><strong className="font-semibold text-slate-600">Période:</strong> {new Date(proposition.date_debut).toLocaleDateString()} au {new Date(proposition.date_fin).toLocaleDateString()}</p>
                        </div>

                        <div className="pt-4 border-t mt-4">
                             <h4 className="text-lg font-bold text-slate-700 mb-2">Suivi de la soumission</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <p><strong className="font-semibold text-slate-600">Statut:</strong> {proposition.statut_proposition || 'N/A'}</p>
                                <p><strong className="font-semibold text-slate-600">Date du statut:</strong> {proposition.date_statut ? new Date(proposition.date_statut).toLocaleDateString() : 'N/A'}</p>
                                <p><strong className="font-semibold text-slate-600">Date limite:</strong> {proposition.date_limite_proposition ? new Date(proposition.date_limite_proposition).toLocaleDateString() : 'N/A'}</p>
                                <p><strong className="font-semibold text-slate-600">Email de contact:</strong> {proposition.email_envoi || 'N/A'}</p>
                             </div>
                        </div>

                        <div className="pt-4 border-t mt-4"><strong className="font-semibold text-slate-600 block mb-1">Description & Contexte:</strong> <div className="p-3 bg-slate-50 rounded-md"><MarkdownRenderer markdown={proposition.description_contexte} /></div></div>
                        <div className="pt-2"><strong className="font-semibold text-slate-600 block mb-1">Défis Identifiés:</strong> <div className="p-3 bg-slate-50 rounded-md"><MarkdownRenderer markdown={proposition.defis_identifies} /></div></div>
                        <div className="pt-2"><strong className="font-semibold text-slate-600 block mb-1">Justification:</strong> <div className="p-3 bg-slate-50 rounded-md"><MarkdownRenderer markdown={proposition.justification} /></div></div>
                    </div>
                );
            case 'theorie':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Théorie du Changement" onAdd={() => setModalState({ type: 'addTheorie' })} addDisabled={propositionTheories.length > 0} disabledTooltip="Une seule théorie par proposition." />
                        {propositionTheories.map(t => (
                            <div key={t.id_theorie} className="p-4 border rounded-md">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-lg text-primary-700">Vision</h4>
                                  <ActionButtons onEdit={() => setModalState({type: 'editTheorie', data: t})} onDelete={() => handlers.deleteTheorie(t.id_theorie)} />
                                </div>
                                <p>{t.formulation_long_terme}</p>
                            </div>
                        ))}
                    </div>
                );
             case 'objectifs':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Objectifs" onAdd={() => setModalState({ type: 'addObjectif' })} addDisabled={propositionTheories.length === 0} disabledTooltip="Veuillez d'abord créer une Théorie du Changement."/>
                        <ul className="space-y-3">
                        {propositionObjectifs.map(o => (
                            <li key={o.id_objectif} className="p-4 border rounded-md">
                               <div className="flex justify-between items-start">
                                 <div>
                                    <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${o.type_objectif === 'général' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{o.type_objectif}</span>
                                    <p className="font-semibold mt-1">{o.formulation_objectif}</p>
                                 </div>
                                 <ActionButtons onEdit={() => setModalState({type: 'editObjectif', data: o})} onDelete={() => handlers.deleteObjectif(o.id_objectif)} />
                               </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                );
            case 'resultats':
                 return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Résultats Attendus" onAdd={() => setModalState({ type: 'addResultat' })} addDisabled={propositionObjectifs.length === 0} disabledTooltip="Veuillez d'abord créer au moins un Objectif." />
                        <ul className="space-y-3">
                        {propositionResultats.map(r => (
                            <li key={r.id_resultat} className="p-4 border rounded-md">
                               <div className="flex justify-between items-start">
                                 <div>
                                    <p className="font-semibold">{r.formulation_resultat}</p>
                                    <p className="text-sm text-slate-500">Objectif: {appData.objectifs.find(o => o.id_objectif === r.id_objectif)?.formulation_objectif}</p>
                                 </div>
                                 <ActionButtons onEdit={() => setModalState({type: 'editResultat', data: r})} onDelete={() => handlers.deleteResultat(r.id_resultat)} />
                               </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                );
            case 'activites':
                 return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Activités" onAdd={() => setModalState({ type: 'addActivite' })} addDisabled={propositionResultats.length === 0} disabledTooltip="Veuillez d'abord créer au moins un Résultat."/>
                         <ul className="space-y-3">
                        {propositionActivites.map(a => (
                            <li key={a.id_activite} className="p-4 border rounded-md">
                               <div className="flex justify-between items-start">
                                 <div>
                                    <p className="font-semibold">{a.intitule_activite}</p>
                                    <p className="text-sm text-slate-500">Résultat: {appData.resultats.find(r => r.id_resultat === a.id_resultat)?.formulation_resultat}</p>
                                 </div>
                                 <ActionButtons onEdit={() => setModalState({type: 'editActivite', data: a})} onDelete={() => handlers.deleteActivite(a.id_activite)} />
                               </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                );
            case 'budget':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Budget Détaillé" />
                         <BudgetEditor 
                           initialBudget={propositionBudget}
                           projectActivites={propositionActivites}
                           id_proposition={proposition.id_proposition}
                           onSave={(budget) => { handlers.updateBudget(budget); }}
                           onClose={() => {}}
                           isModal={false}
                         />
                    </div>
                );
            case 'public':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Publics Cibles" onAdd={() => setModalState({ type: 'addPublicCible' })} />
                        <ul className="space-y-3">
                            {propositionPublics.map(pc => (
                                <li key={pc.id_public} className="p-4 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{pc.categorie} ({pc.sexe}) - {pc.tranche_d_age}</p>
                                            <p className="text-sm text-slate-500">{pc.localisation} | Vulnérabilité: {pc.niveau_vulnerabilite}</p>
                                            <p className="text-sm text-slate-500">Estimé: {pc.nombre_estime} / Atteint: {pc.nombre_atteint}</p>
                                        </div>
                                        <ActionButtons onEdit={() => setModalState({ type: 'editPublicCible', data: pc })} onDelete={() => window.confirm('Supprimer ce public cible ?') && handlers.deletePublicCible(pc.id_public)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'risques':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Analyse des Risques" onAdd={() => setModalState({ type: 'addRisque' })} />
                        <ul className="space-y-3">
                            {propositionRisques.map(r => (
                                <li key={r.id_risque} className="p-4 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{r.description_risque}</p>
                                            <p className="text-sm text-slate-500">Probabilité: <span className="capitalize">{r.probabilite}</span> | Impact: <span className="capitalize">{r.impact}</span> | Statut: <span className="capitalize">{r.statut}</span></p>
                                        </div>
                                        <ActionButtons onEdit={() => setModalState({ type: 'editRisque', data: r })} onDelete={() => window.confirm('Supprimer ce risque ?') && handlers.deleteRisque(r.id_risque)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'plan':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Plan d'Action" onAdd={() => setModalState({ type: 'addPlanAction' })} addDisabled={propositionActivites.length === 0} disabledTooltip="Veuillez d'abord créer au moins une Activité." />
                        <ul className="space-y-3">
                            {propositionPlans.map(p => (
                                <li key={p.id_plan} className="p-4 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{p.mois} - {appData.activites.find(a => a.id_activite === p.id_activite)?.intitule_activite}</p>
                                            <p className="text-sm text-slate-500">Phase: <span className="capitalize">{p.phase}</span> | Statut: <span className="capitalize">{p.statut}</span> | Responsable: {p.responsable}</p>
                                        </div>
                                        <ActionButtons onEdit={() => setModalState({ type: 'editPlanAction', data: p })} onDelete={() => window.confirm('Supprimer cette entrée du plan ?') && handlers.deletePlanAction(p.id_plan)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'communication':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Plan de Communication" onAdd={() => setModalState({ type: 'addCommunication' })} />
                        <ul className="space-y-3">
                            {propositionCommunications.map(c => (
                                <li key={c.id_communication} className="p-4 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{c.type_support} pour "{c.cible}"</p>
                                            <p className="text-sm text-slate-500">Canal: {c.canal} | Diffusion: {new Date(c.date_diffusion).toLocaleDateString()}</p>
                                        </div>
                                        <ActionButtons onEdit={() => setModalState({ type: 'editCommunication', data: c })} onDelete={() => window.confirm('Supprimer ce plan de communication ?') && handlers.deleteCommunication(c.id_communication)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'capitalisation':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <SectionHeader title="Plan de Capitalisation" onAdd={() => setModalState({ type: 'addCapitalisation' })} />
                        <ul className="space-y-3">
                            {propositionCapitalisations.map(c => (
                                <li key={c.id_capitalisation} className="p-4 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{c.theme}</p>
                                            <p className="text-sm text-slate-500">Type: {c.type_document} | Crée le: {new Date(c.date_creation).toLocaleDateString()}</p>
                                            {c.lien_document && <a href={c.lien_document} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">Voir le document</a>}
                                        </div>
                                        <ActionButtons onEdit={() => setModalState({ type: 'editCapitalisation', data: c })} onDelete={() => window.confirm('Supprimer ce plan de capitalisation ?') && handlers.deleteCapitalisation(c.id_capitalisation)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default: return null;
        }
    }

    const renderModal = () => {
        if (!modalState) return null;

        switch (modalState.type) {
            case 'editProposition':
                return <Modal isOpen={true} onClose={closeModal} title="Modifier la proposition"><PropositionForm onSubmit={p => { handlers.updateProposition(p as PropositionProjet); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addTheorie':
                return <Modal isOpen={true} onClose={closeModal} title="Ajouter une Théorie du Changement"><TheorieForm proposition={proposition} onSubmit={t => { handlers.addTheorie(t); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editTheorie':
                return <Modal isOpen={true} onClose={closeModal} title="Modifier la Théorie du Changement"><TheorieForm proposition={proposition} onSubmit={t => { handlers.updateTheorie(t as TheorieChangement); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addObjectif':
                return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Objectif"><ObjectifForm proposition={proposition} projectTheorie={propositionTheories[0]} onSubmit={o => { handlers.addObjectif(o); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editObjectif':
                return <Modal isOpen={true} onClose={closeModal} title="Modifier l'Objectif"><ObjectifForm proposition={proposition} projectTheorie={propositionTheories[0]} onSubmit={o => { handlers.updateObjectif(o as Objectif); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addResultat':
                return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Résultat"><ResultatForm proposition={proposition} projectObjectifs={propositionObjectifs} onSubmit={r => { handlers.addResultat(r); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editResultat':
                return <Modal isOpen={true} onClose={closeModal} title="Modifier le Résultat"><ResultatForm proposition={proposition} projectObjectifs={propositionObjectifs} onSubmit={r => { handlers.updateResultat(r as Resultat); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addActivite':
                 return <Modal isOpen={true} onClose={closeModal} title="Ajouter une Activité"><ActiviteForm proposition={proposition} projectResultats={propositionResultats} onSubmit={a => { handlers.addActivite(a); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editActivite':
                 return <Modal isOpen={true} onClose={closeModal} title="Modifier l'Activité"><ActiviteForm proposition={proposition} projectResultats={propositionResultats} onSubmit={a => { handlers.updateActivite(a as Activite); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'editBudget':
                 return <Modal isOpen={true} onClose={closeModal} title="Éditer le Budget Détaillé"><BudgetEditor initialBudget={propositionBudget} projectActivites={propositionActivites} id_proposition={proposition.id_proposition} onSave={budget => { handlers.updateBudget(budget); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'addPublicCible':
                return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Public Cible"><PublicCibleForm proposition={proposition} onSubmit={pc => { handlers.addPublicCible(pc); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editPublicCible':
                return <Modal isOpen={true} onClose={closeModal} title="Modifier le Public Cible"><PublicCibleForm proposition={proposition} onSubmit={pc => { handlers.updatePublicCible(pc as PublicCible); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addRisque':
                 return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Risque"><RisqueForm proposition={proposition} onSubmit={r => { handlers.addRisque(r); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editRisque':
                 return <Modal isOpen={true} onClose={closeModal} title="Modifier le Risque"><RisqueForm proposition={proposition} onSubmit={r => { handlers.updateRisque(r as Risque); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addPlanAction':
                 return <Modal isOpen={true} onClose={closeModal} title="Ajouter au Plan d'Action"><PlanActionForm proposition={proposition} projectActivites={propositionActivites} onSubmit={p => { handlers.addPlanAction(p); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editPlanAction':
                 return <Modal isOpen={true} onClose={closeModal} title="Modifier le Plan d'Action"><PlanActionForm proposition={proposition} projectActivites={propositionActivites} onSubmit={p => { handlers.updatePlanAction(p as PlanAction); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addCommunication':
                 return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Plan de Communication"><CommunicationForm proposition={proposition} onSubmit={c => { handlers.addCommunication(c); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editCommunication':
                 return <Modal isOpen={true} onClose={closeModal} title="Modifier le Plan de Communication"><CommunicationForm proposition={proposition} onSubmit={c => { handlers.updateCommunication(c as Communication); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;
            case 'addCapitalisation':
                 return <Modal isOpen={true} onClose={closeModal} title="Ajouter un Plan de Capitalisation"><CapitalisationForm proposition={proposition} onSubmit={c => { handlers.addCapitalisation(c); closeModal(); }} onClose={closeModal} /></Modal>;
            case 'editCapitalisation':
                 return <Modal isOpen={true} onClose={closeModal} title="Modifier le Plan de Capitalisation"><CapitalisationForm proposition={proposition} onSubmit={c => { handlers.updateCapitalisation(c as Capitalisation); closeModal(); }} onClose={closeModal} initialData={modalState.data} /></Modal>;

            default: return null;
        }
    };
    
    return (
        <div className="p-8">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-primary-600 hover:underline">
                    &larr; Retour aux propositions
                </button>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{proposition.nom_projet}</h2>
            <p className="text-slate-500 mb-6">{proposition.bailleur_de_fond}</p>

            <div className="mb-6 border-b border-slate-200">
                <div className="flex space-x-2 overflow-x-auto pb-px">
                   <TabButton label="Info Générales" isActive={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                   <TabButton label="Théorie" isActive={activeTab === 'theorie'} onClick={() => setActiveTab('theorie')} />
                   <TabButton label="Objectifs" isActive={activeTab === 'objectifs'} onClick={() => setActiveTab('objectifs')} />
                   <TabButton label="Résultats" isActive={activeTab === 'resultats'} onClick={() => setActiveTab('resultats')} />
                   <TabButton label="Activités" isActive={activeTab === 'activites'} onClick={() => setActiveTab('activites')} />
                   <TabButton label="Budget" isActive={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
                   <TabButton label="Publics Cibles" isActive={activeTab === 'public'} onClick={() => setActiveTab('public')} />
                   <TabButton label="Risques" isActive={activeTab === 'risques'} onClick={() => setActiveTab('risques')} />
                   <TabButton label="Plan d'Action" isActive={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
                   <TabButton label="Communication" isActive={activeTab === 'communication'} onClick={() => setActiveTab('communication')} />
                   <TabButton label="Capitalisation" isActive={activeTab === 'capitalisation'} onClick={() => setActiveTab('capitalisation')} />
                </div>
            </div>

            <div>
                {renderTabContent()}
            </div>
            
            {renderModal()}
        </div>
    );
};