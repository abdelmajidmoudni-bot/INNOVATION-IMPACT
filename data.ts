import type { AppData } from './types';

export const initialData: AppData = {
  propositions: [
    {
      id_proposition: 'proj_1',
      nom_projet: 'Soutien scolaire pour enfants défavorisés',
      annee: 2024,
      bailleur_de_fond: 'Fondation "Sourire d\'Enfant"',
      zone_intervention: 'Quartiers périurbains de Casablanca',
      date_debut: '2024-01-15',
      date_fin: '2024-12-20',
      description_contexte: 'De nombreux enfants dans les quartiers périurbains de Casablanca font face à des difficultés scolaires dues à un manque de soutien familial et de ressources. Le taux d\'échec scolaire y est particulièrement élevé.',
      defis_identifies: '- Manque de suivi personnalisé\n- Espaces de travail inadaptés à la maison\n- Faible implication des parents dans le suivi scolaire',
      justification: 'Le projet vise à offrir un cadre d\'apprentissage stimulant et un soutien personnalisé pour améliorer les résultats scolaires et prévenir le décrochage.',
      valeurs_et_principes: 'Égalité des chances, bienveillance, solidarité.',
      approche_transversale: 'Approche genre, inclusion des enfants en situation de handicap.',
      date_limite_proposition: '2023-11-30',
      email_envoi: 'soumissions@fondation-sourire.org',
      statut_proposition: 'Acceptée',
      date_statut: '2023-12-15',
    },
    {
      id_proposition: 'proj_2',
      nom_projet: 'Ateliers d\'art-thérapie pour jeunes',
      annee: 2024,
      bailleur_de_fond: 'Ministère de la Culture',
      zone_intervention: 'Maison des jeunes, Marrakech',
      date_debut: '2024-03-01',
      date_fin: '2024-09-30',
      description_contexte: 'Les jeunes de Marrakech expriment un besoin d\'espaces d\'expression pour gérer le stress et les anxiétés post-pandémie. L\'art est un vecteur puissant pour le bien-être mental.',
      defis_identifies: '- Tabou autour de la santé mentale.\n- Offre culturelle limitée pour les adolescents.',
      justification: 'Les ateliers d\'art-thérapie offrent un exutoire créatif et un soutien psychologique accessible, favorisant la résilience et l\'expression de soi.',
      valeurs_et_principes: 'Confidentialité, non-jugement, créativité.',
      approche_transversale: 'Inclusion des jeunes issus de milieux divers.',
      date_limite_proposition: '2024-01-15',
      email_envoi: 'projets.jeunesse@minculture.gov.ma',
      statut_proposition: 'Soumise',
      date_statut: '2024-01-12',
    },
  ],
  theories: [
    {
        id_theorie: 'theo_1',
        id_proposition: 'proj_1',
        formulation_long_terme: 'Les enfants des quartiers périurbains de Casablanca ont les mêmes chances de réussite scolaire que les autres.',
        hypotheses_clefs: 'Un soutien scolaire régulier améliore les notes. L\'implication des parents est un facteur clé de succès.',
        facteurs_de_changement: 'Tutorat, ateliers parents-enfants, mise à disposition de matériel.',
        enjeux_sociaux_vises: 'Réduction des inégalités sociales, lutte contre le décrochage scolaire.',
        indicateurs_impact: 'Taux de réussite au brevet, taux de passage en classe supérieure.',
        sources_de_verification_impact: 'Statistiques du ministère de l\'Éducation, registres scolaires.',
    }
  ],
  objectifs: [
    {
        id_objectif: 'obj_1',
        id_theorie: 'theo_1',
        type_objectif: 'spécifique',
        formulation_objectif: 'Améliorer de 20% les résultats en mathématiques et en français de 100 enfants bénéficiaires d\'ici la fin de l\'année scolaire.',
        indicateurs_objectif: '% d\'amélioration des notes, nombre d\'enfants atteignant la moyenne.',
        sources_verification: 'Bulletins scolaires, tests pré/post projet.',
        moyens_de_suivi: 'Comités de suivi mensuels.',
        responsable_suivi: 'Coordinateur pédagogique',
    }
  ],
  resultats: [
    {
        id_resultat: 'res_1',
        id_objectif: 'obj_1',
        formulation_resultat: 'Les 100 enfants bénéficiaires participent régulièrement aux sessions de soutien scolaire.',
        type_resultat: 'produit',
        indicateurs_resultat: 'Taux de participation aux sessions.',
        valeur_reference: 0,
        valeur_cible: 85,
        source_verification: 'Feuilles de présence.',
        responsable: 'Animateurs',
        niveau_atteinte: 0,
    },
    {
        id_resultat: 'res_2',
        id_objectif: 'obj_1',
        formulation_resultat: 'Les parents des enfants bénéficiaires sont plus impliqués dans le suivi scolaire.',
        type_resultat: 'effet',
        indicateurs_resultat: 'Nombre de parents participant aux ateliers.',
        valeur_reference: 5,
        valeur_cible: 50,
        source_verification: 'Listes d\'émargement des ateliers.',
        responsable: 'Chargé de relations familles',
        niveau_atteinte: 0,
    }
  ],
  activites: [
    {
        id_activite: 'act_1',
        id_resultat: 'res_1',
        intitule_activite: 'Organisation de 3 sessions de tutorat par semaine',
        description: 'Mise en place de groupes de travail de 5 enfants par tuteur pour les matières principales.',
        responsable: 'Équipe d\'animation',
        periode_execution: 'Fév - Déc 2024',
    },
    {
        id_activite: 'act_2',
        id_resultat: 'res_2',
        intitule_activite: 'Conduite d\'un atelier mensuel pour les parents',
        description: 'Ateliers sur les thèmes de l\'aide aux devoirs et la communication positive.',
        responsable: 'Chargé de relations familles',
        periode_execution: 'Mar - Nov 2024',
    }
  ],
  publicsCibles: [
    {
        id_public: 'pub_1',
        id_proposition: 'proj_1',
        categorie: 'Élèves du primaire',
        sexe: 'Mixte',
        tranche_d_age: '6-12 ans',
        localisation: 'Quartier Sidi Moumen',
        niveau_vulnerabilite: 'Élevé',
        nombre_estime: 100,
        nombre_atteint: 0,
        commentaire_impact: 'Les enfants montrent une plus grande confiance en eux et une motivation accrue.'
    }
  ],
  risques: [
    {
        id_risque: 'risk_1',
        id_proposition: 'proj_1',
        description_risque: 'Faible participation des parents aux ateliers prévus.',
        probabilite: 'moyenne',
        impact: 'élevé',
        mesures_attenuation: 'Adapter les horaires des ateliers, proposer des formats ludiques, communication ciblée.',
        responsable_suivi: 'Chargé de relations familles',
        statut: 'actif',
    }
  ],
  plansAction: [
      {
          id_plan: 'plan_1',
          id_activite: 'act_1',
          phase: 'mise en œuvre',
          mois: 'Fév 2024',
          responsable: 'Équipe animation',
          statut: 'terminé',
          commentaire_de_suivi: 'Recrutement des tuteurs finalisé.'
      }
  ],
  budget: [
    {
      id_budget: 'b1',
      id_activite: 'act_1',
      id_proposition: 'proj_1',
      code_comptable: '6110',
      designation: 'Petits materiels',
      libelle: 'Kits de fournitures scolaires pour 100 enfants',
      unite: 'Kit',
      quantite: 100,
      cout_unitaire: 150,
      montant_total: 15000,
      part_bailleur: 10000,
      part_associee: 5000,
    },
     {
      id_budget: 'b2',
      id_activite: '',
      id_proposition: 'proj_2',
      code_comptable: '6120',
      designation: 'Autres',
      libelle: 'Location de la salle principale pour les ateliers',
      unite: 'Mois',
      quantite: 6,
      cout_unitaire: 2000,
      montant_total: 12000,
      part_bailleur: 12000,
      part_associee: 0,
    }
  ],
  communications: [
      {
          id_communication: 'com_1',
          id_proposition: 'proj_1',
          type_support: 'Brochure de présentation',
          cible: 'Parents d\'élèves et partenaires locaux',
          message_cle: 'Un soutien scolaire gratuit et de qualité pour la réussite de vos enfants.',
          date_diffusion: '2024-01-20',
          canal: 'Distribution dans les écoles, affichage local',
          responsable: 'Chargé de communication'
      }
  ],
  capitalisations: [
      {
          id_capitalisation: 'cap_1',
          id_proposition: 'proj_1',
          theme: 'Guide des bonnes pratiques du tutorat',
          type_document: 'Document PDF',
          lien_document: '/documents/guide-tutorat.pdf',
          date_creation: '2024-12-15'
      }
  ],
};
