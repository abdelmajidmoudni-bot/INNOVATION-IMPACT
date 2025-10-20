import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PropositionsView } from './components/Projects';
import { PropositionDetail } from './components/ProjectDetail';
import type { View, AppData, PropositionProjet, TheorieChangement, Objectif, Resultat, Activite, PublicCible, Risque, PlanAction, BudgetLigne, Communication, Capitalisation } from './types';
import { initialData } from './data';
import { produce } from 'https://esm.sh/immer@10.1.1';

type DataKey = keyof AppData;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPropositionId, setSelectedPropositionId] = useState<string | null>(null);
  const [appData, setAppData] = useState<AppData>(initialData);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (view !== 'propositionDetail') {
      setSelectedPropositionId(null);
    }
  };

  const handleSelectProposition = (propositionId: string) => {
    setSelectedPropositionId(propositionId);
    setCurrentView('propositionDetail');
  };

  // --- Generic CRUD Handlers ---

  const createHandler = <T extends { [K in keyof T]: T[K] }>(key: DataKey, idPrefix: string) => (item: Omit<T, `id_${string}`>) => {
    setAppData(
      produce(draft => {
        const newId = `${idPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newItem = { ...item, [`id_${idPrefix}`]: newId } as T;
        (draft[key] as T[]).push(newItem);
      })
    );
  };

  const updateHandler = <T extends { [K in keyof T]: T[K] }>(key: DataKey, idField: keyof T) => (item: T) => {
    setAppData(
      produce(draft => {
        const items = draft[key] as T[];
        const index = items.findIndex(i => i[idField] === item[idField]);
        if (index !== -1) {
          items[index] = item;
        }
      })
    );
  };
  
  const deleteHandler = <T extends { [K in keyof T]: T[K] }>(key: DataKey, idField: keyof T) => (id: string) => {
     setAppData(
      produce(draft => {
        (draft[key] as T[]) = (draft[key] as T[]).filter(i => i[idField] !== id);
      })
    );
  };

  const handleUpdateBudget = (newBudget: BudgetLigne[]) => {
      setAppData(
        produce(draft => {
            const otherPropositionsBudget = draft.budget.filter(b => b.id_proposition !== selectedPropositionId);
            const updatedPropositionBudget = newBudget.map(line => {
                if (line.id_budget.startsWith('new_')) {
                    return { ...line, id_budget: `b_${Date.now()}_${Math.random()}` };
                }
                return line;
            });
            draft.budget = [...otherPropositionsBudget, ...updatedPropositionBudget];
        })
    );
  }

  // --- Cascade Delete Logic ---
  const cascadeDeleteActivite = (draft: AppData, activiteId: string) => {
    draft.plansAction = draft.plansAction.filter(p => p.id_activite !== activiteId);
    draft.budget = draft.budget.filter(b => b.id_activite !== activiteId);
  }
  
  const cascadeDeleteResultat = (draft: AppData, resultatId: string) => {
    const activitesToDelete = draft.activites.filter(a => a.id_resultat === resultatId);
    activitesToDelete.forEach(a => cascadeDeleteActivite(draft, a.id_activite));
    draft.activites = draft.activites.filter(a => a.id_resultat !== resultatId);
  }

  const cascadeDeleteObjectif = (draft: AppData, objectifId: string) => {
      const resultatsToDelete = draft.resultats.filter(r => r.id_objectif === objectifId);
      resultatsToDelete.forEach(r => cascadeDeleteResultat(draft, r.id_resultat));
      draft.resultats = draft.resultats.filter(r => r.id_objectif !== objectifId);
  }

  const cascadeDeleteTheorie = (draft: AppData, theorieId: string) => {
      const objectifsToDelete = draft.objectifs.filter(o => o.id_theorie === theorieId);
      objectifsToDelete.forEach(o => cascadeDeleteObjectif(draft, o.id_objectif));
      draft.objectifs = draft.objectifs.filter(o => o.id_theorie !== theorieId);
      draft.theories = draft.theories.filter(t => t.id_theorie !== theorieId);
  };

  const handleDeleteTheorie = (theorieId: string) => {
    if (!window.confirm('Supprimer cette théorie supprimera aussi tous ses objectifs, résultats et activités. Continuer ?')) return;
    setAppData(produce(draft => cascadeDeleteTheorie(draft, theorieId)));
  }
  
  const handleDeleteObjectif = (objectifId: string) => {
    if (!window.confirm('Supprimer cet objectif supprimera aussi tous ses résultats et activités. Continuer ?')) return;
    setAppData(produce(draft => cascadeDeleteObjectif(draft, objectifId)));
  }

  const handleDeleteResultat = (resultatId: string) => {
    if (!window.confirm('Supprimer ce résultat supprimera aussi toutes ses activités. Continuer ?')) return;
    setAppData(produce(draft => cascadeDeleteResultat(draft, resultatId)));
  }

  const handleDeleteActivite = (activiteId: string) => {
    if (!window.confirm('Supprimer cette activité supprimera aussi ses plans d\'action associés. Continuer ?')) return;
    setAppData(produce(draft => {
        cascadeDeleteActivite(draft, activiteId);
        draft.activites = draft.activites.filter(a => a.id_activite !== activiteId);
    }));
  }

  const handleDeleteProposition = (propositionId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette proposition de projet et TOUTES ses données associées ? Cette action est irréversible.')) return;
    
    setAppData(produce(draft => {
        const theoriesToDelete = draft.theories.filter(t => t.id_proposition === propositionId);
        theoriesToDelete.forEach(t => cascadeDeleteTheorie(draft, t.id_theorie));

        draft.propositions = draft.propositions.filter(p => p.id_proposition !== propositionId);
        
        draft.publicsCibles = draft.publicsCibles.filter(pc => pc.id_proposition !== propositionId);
        draft.risques = draft.risques.filter(r => r.id_proposition !== propositionId);
        draft.budget = draft.budget.filter(b => b.id_proposition !== propositionId);
        draft.communications = draft.communications.filter(c => c.id_proposition !== propositionId);
        draft.capitalisations = draft.capitalisations.filter(c => c.id_proposition !== propositionId);
    }));

    if (selectedPropositionId === propositionId) {
      handleViewChange('propositions');
    }
  };


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          propositions={appData.propositions} 
          budget={appData.budget}
          onSelectProposition={handleSelectProposition}
        />;
      case 'propositions':
        return <PropositionsView 
          propositions={appData.propositions} 
          budget={appData.budget}
          onAddProposition={createHandler<PropositionProjet>('propositions', 'proposition')}
          onSelectProposition={handleSelectProposition}
          onDeleteProposition={handleDeleteProposition}
        />;
      case 'propositionDetail':
        if (selectedPropositionId) {
          const proposition = appData.propositions.find(p => p.id_proposition === selectedPropositionId);
          if (proposition) {
            return <PropositionDetail 
              proposition={proposition} 
              appData={appData}
              onBack={() => handleViewChange('propositions')}
              handlers={{
                updateProposition: updateHandler<PropositionProjet>('propositions', 'id_proposition'),
                addTheorie: createHandler<TheorieChangement>('theories', 'theorie'),
                updateTheorie: updateHandler<TheorieChangement>('theories', 'id_theorie'),
                deleteTheorie: handleDeleteTheorie,
                addObjectif: createHandler<Objectif>('objectifs', 'objectif'),
                updateObjectif: updateHandler<Objectif>('objectifs', 'id_objectif'),
                deleteObjectif: handleDeleteObjectif,
                addResultat: createHandler<Resultat>('resultats', 'resultat'),
                updateResultat: updateHandler<Resultat>('resultats', 'id_resultat'),
                deleteResultat: handleDeleteResultat,
                addActivite: createHandler<Activite>('activites', 'activite'),
                updateActivite: updateHandler<Activite>('activites', 'id_activite'),
                deleteActivite: handleDeleteActivite,
                addPublicCible: createHandler<PublicCible>('publicsCibles', 'public'),
                updatePublicCible: updateHandler<PublicCible>('publicsCibles', 'id_public'),
                deletePublicCible: deleteHandler<PublicCible>('publicsCibles', 'id_public'),
                addRisque: createHandler<Risque>('risques', 'risque'),
                updateRisque: updateHandler<Risque>('risques', 'id_risque'),
                deleteRisque: deleteHandler<Risque>('risques', 'id_risque'),
                addPlanAction: createHandler<PlanAction>('plansAction', 'plan'),
                updatePlanAction: updateHandler<PlanAction>('plansAction', 'id_plan'),
                deletePlanAction: deleteHandler<PlanAction>('plansAction', 'id_plan'),
                addCommunication: createHandler<Communication>('communications', 'communication'),
                updateCommunication: updateHandler<Communication>('communications', 'id_communication'),
                deleteCommunication: deleteHandler<Communication>('communications', 'id_communication'),
                addCapitalisation: createHandler<Capitalisation>('capitalisations', 'capitalisation'),
                updateCapitalisation: updateHandler<Capitalisation>('capitalisations', 'id_capitalisation'),
                deleteCapitalisation: deleteHandler<Capitalisation>('capitalisations', 'id_capitalisation'),
                updateBudget: handleUpdateBudget,
              }}
            />;
          }
        }
        handleViewChange('propositions');
        return null;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 ml-64">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;