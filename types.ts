export type StatutProposition = 'En rédaction' | 'Soumise' | 'Acceptée' | 'Refusée' | 'Reportée' | 'Annulée';

export interface PropositionProjet {
  id_proposition: string;
  nom_projet: string;
  annee: number;
  bailleur_de_fond: string;
  zone_intervention: string;
  date_debut: string;
  date_fin: string;
  description_contexte: string;
  defis_identifies: string;
  justification: string;
  valeurs_et_principes: string;
  approche_transversale: string;
  // Submission tracking
  date_limite_proposition?: string;
  email_envoi?: string;
  statut_proposition?: StatutProposition;
  date_statut?: string;
}

export interface TheorieChangement {
  id_theorie: string;
  id_proposition: string;
  formulation_long_terme: string;
  hypotheses_clefs: string;
  facteurs_de_changement: string;
  enjeux_sociaux_vises: string;
  indicateurs_impact: string;
  sources_de_verification_impact: string;
}

export interface Objectif {
  id_objectif: string;
  id_theorie: string;
  type_objectif: 'spécifique' | 'général';
  formulation_objectif: string;
  indicateurs_objectif: string;
  sources_verification: string;
  moyens_de_suivi: string;
  responsable_suivi: string;
}

export interface Resultat {
  id_resultat: string;
  id_objectif: string;
  formulation_resultat: string;
  type_resultat: 'produit' | 'effet' | 'résultat intermédiaire';
  indicateurs_resultat: string;
  valeur_reference: number;
  valeur_cible: number;
  source_verification: string;
  responsable: string;
  niveau_atteinte: number;
}

export interface Activite {
  id_activite: string;
  id_resultat: string;
  intitule_activite: string;
  description: string;
  responsable: string;
  periode_execution: string;
}

export interface PublicCible {
  id_public: string;
  id_proposition: string;
  categorie: string;
  sexe: 'Hommes' | 'Femmes' | 'Mixte';
  tranche_d_age: string;
  localisation: string;
  niveau_vulnerabilite: string;
  nombre_estime: number;
  nombre_atteint: number;
  commentaire_impact: string;
}

export interface Risque {
  id_risque: string;
  id_proposition: string;
  description_risque: string;
  probabilite: 'faible' | 'moyenne' | 'élevée';
  impact: 'faible' | 'moyen' | 'élevé';
  mesures_attenuation: string;
  responsable_suivi: string;
  statut: 'actif' | 'mitigé' | 'clos';
}

export interface PlanAction {
  id_plan: string;
  id_activite: string;
  phase: 'préparation' | 'mise en œuvre' | 'évaluation';
  mois: string;
  responsable: string;
  statut: 'à faire' | 'en cours' | 'terminé';
  commentaire_de_suivi: string;
}

export interface BudgetLigne {
  id_budget: string;
  id_activite: string;
  id_proposition: string;
  code_comptable: string;
  designation: string;
  libelle: string;
  unite: string;
  quantite: number;
  cout_unitaire: number;
  montant_total: number;
  part_bailleur: number;
  part_associee: number;
}

export interface Communication {
  id_communication: string;
  id_proposition: string;
  type_support: string;
  cible: string;
  message_cle: string;
  date_diffusion: string;
  canal: string;
  responsable: string;
}

export interface Capitalisation {
  id_capitalisation: string;
  id_proposition: string;
  theme: string;
  type_document: string;
  lien_document: string;
  date_creation: string;
}

export type View = 'dashboard' | 'propositions' | 'propositionDetail';

export interface AppData {
  propositions: PropositionProjet[];
  theories: TheorieChangement[];
  objectifs: Objectif[];
  resultats: Resultat[];
  activites: Activite[];
  publicsCibles: PublicCible[];
  risques: Risque[];
  plansAction: PlanAction[];
  budget: BudgetLigne[];
  communications: Communication[];
  capitalisations: Capitalisation[];
}
