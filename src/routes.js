import Dashboard from './views/dashboard/Dashboard';

import UpdatePassword from './views/salaries/updatePassword';
import AllSalaries from './views/salaries/listSalarie';
import AddSalarie from './views/salaries/addSalarie';
import UpdateSalarie from './views/salaries/updateSalarie';
import AddConges from './views/salaryAndPost/conge/addConges';
import AddVisiteMedicale from './views/salaryAndPost/visiteMedicale/addVisiteMedicale';
import UpdateVisiteMedicale from './views/salaryAndPost/visiteMedicale/updateVisiteMedicale';

/*import AllAdresses from './views/adresses/allAdresses';
import Adresse from './views/adresses/Adresse';
import CreateAdresse from './views/adresses/CreateAdresseV';
//const UpdateAdresse from './views/adresses/Adresse'))*/

import AllEntreprise from './views/entreprise/allEntreprise';
import UpdateEntreprise from './views/entreprise/updateEntreprise';
import CreateEntreprise from './views/entreprise/createEntreprise';

import AllTypeContrat from './views/type-contrat/allTypeContrat';
import UpdateTypeContrat from './views/type-contrat/modification-type-contrat';
import CreateTypeContrat from './views/type-contrat/creation-type-contrat';

import AllService from './views/service/allService';
import UpdateService from './views/service/modification-service';
import CreateService from './views/service/creation-service';

import CreateRole from './views/role/creation-role';
import AllRole from './views/role/allRole';
import UpdateRole from './views/role/modification-role';

import AllCompetence from './views/competence/allCompetence';
import CreateCompetence from './views/competence/creation-competence';
import UpdateCompetence from './views/competence/modification-competence';

import AllTitrePoste from './views/titre-poste/allTitrePoste';
import CreateTitrePoste from './views/titre-poste/creation-titre-poste';
import UpdateTitrePoste from './views/titre-poste/modification-titre-poste';

import PosteFiches from './views/poste-fiche/poste-fiche';

import ListFormation from './views/formation/listFormation';
import Formation from './views/formation/formation';
import InsertSalarieFormation from './views/formation/insertSalarie';
import CreateFormation from './views/formation/createFormation';
import UpdateFormation from './views/formation/updateFormation';
import RequestFormation from './views/formation/requestFormation';
import ValidateRequestFormation from './views/formation/validateRequestFormation';

import AllPoste from './views/poste/listPoste';
import CreatePoste from './views/poste/creation-poste';
import UpdatePoste from './views/poste/modification-poste';
import DetailPoste from './views/poste/detailPoste';

import AllEntretien from './views/entretiens/allEntretiens';
import AllEntretienSalarie from './views/entretiens/allEntretienSalarie';
import AllEntretienManager from './views/entretiens/allEntretienManager';
import CreateEntretien from './views/entretiens/createEntretien';
import UpdateEntretien from './views/entretiens/updateEntretien';
import Entretien from './views/entretiens/entretien';

import AllTypeEntretien from './views/type-entretien/allTypeEntretien';
import CreateTypeEntretien from './views/type-entretien/creation-type-contrat';
import UpdateTypeEntretien from './views/type-entretien/modification-type-contrat';

import AnswerInterview from './views/compte-rendu/repondre-entretien';

import AllQuestionnaire from './views/questionnaire/allQuestionnaire';
import CreateQuestionnaire from './views/questionnaire/createQuestionnaire';
import UpdateQuestionnaire from './views/questionnaire/updateQuestionnaire';
import InsertQuestions from './views/questionnaire/insertQuestions';

import CreateQuestion from './views/question/creation-question';
import ListQuestion from './views/question/all-question';
import UpdateQuestion from './views/question/modification-question.js';

import ReadCompteRendu from './views/compte-rendu/seeReport';
import AddCommentReport from './views/compte-rendu/addCommentReport';

// import AllRoute from './views/droit-acces/allRoute';
// import CreateRoute from './views/droit-acces/createRoute';
// import UpdateRoute from './views/droit-acces/updateRoute';
// //
import AllActivityDomain from './views/ActivityDomain/allActivityDomain';
import CreateActivityDomain from './views/ActivityDomain/createActivityDomain';
import UpdateActivityDomain from './views/ActivityDomain/updateActivityDomain';
//
import MyAllActivityPlan from  './views/PlanActivity/myAllPlanActivity';
import AllActivityPlan from './views/PlanActivity/allPlanActivity';
import CreateActivityPlan from './views/PlanActivity/createPlanActivity';
import UpdateActivityPlan from './views/PlanActivity/updatePlanActivity';
import planActivity from './views/PlanActivity/planActivity';
import addComment from './views/PlanActivity/addComment';

import allNotification from './views/Notification/allNotification';

import calculator from './views/cotisation/calculator';
import createdSalaryAndPost from './views/salaryAndPost/createdSalaryAndPost';

import OrganigrammeEntreprise from './component/Entreprise/OrganigrammeEntreprise';
import OrganigrammeCompetence from './component/Competence/OrganigrammeCompetence';

import listeOrganisme from './views/Organisme/listeOrganisme';
import organismeDeFormation from './views/Organisme/organismeDeFormation';
import detailOrganisme from './views/Organisme/detailOrganisme';
import updateOrganisme from './views/Organisme/updateOrganisme';
import profilSalarie from './views/salaries/profilSalarie';
import dossiersPersonnel from './views/salaryAndPost/dossiersPersonnel';
import vieProfessionnelle from './views/salaryAndPost/vieProfessionnelle';
import ConventionCollective from './component/RefonteMenu/ConventionCollective';
import Remuneration from './component/RefonteMenu/Remuneration';
import ArchivagesCSE from './component/RefonteMenu/ArchivagesCSE';
import Harcelement from './component/RefonteMenu/Harcelement';
import DawanPv from './component/RefonteMenu/DawanPv';
import JehannPv from './component/RefonteMenu/JehannPv';
import DeleguesDawan from './component/RefonteMenu/DeleguesDawan';
import DeleguesJehann from './component/RefonteMenu/DeleguesJehann';
import FichePoste from './component/RefonteMenu/FichePoste';
import referents from './component/RefonteMenu/referents';
import Organigrammes from './component/RefonteMenu/Organigrammes';
import Livret from './component/RefonteMenu/Livret';
import DossierRecrutement from './component/RefonteMenu/DossierRecrutement';
import kitSalarie from './component/RefonteMenu/kitSalarie';
import KitApprenti from './component/RefonteMenu/KitApprenti';
import QuestionnaireIntegration from './component/RefonteMenu/QuestionnaireIntegration';
import periodeEssaie from './component/RefonteMenu/periodeEssaie';
import Review from './component/RefonteMenu/Review';
import RapportRse from './component/RefonteMenu/RapportRse';
import DeveloppementRse from './component/RefonteMenu/DeveloppementRse';
import SanctionDisciplinaire from './component/SanctionDisciplinaire/SanctionDisciplinaire';
import CreateSantionDisciplinaire from './component/SanctionDisciplinaire/CreateSantionDisciplinaire';


// WARNING : la variable ':idSalarie' est remplacé dans le menu à gauche par l'id de l'utilisateur



const routes = [
  { path: '/', exact: true, name: 'Home', component: Dashboard },
  { path: '/dashboard',exact:true, name: 'Tableau de bord', component: Dashboard },

  //Estimateur de cotissation (Calculator)
  { path: '/estimateur',exact: true, name: 'Estimateur de cotisation mensuel et annuel', component: calculator },

  // Salarie
  { path: '/salaries', exact: true, name: 'Salaries',redirectTo:"/dashboard", component: AllSalaries },
  { path: '/salaries/liste', name: 'Listes des salaries', redirectTo:"/dashboard",component: AllSalaries },
  { path: '/salaries/creation', name: 'Ajout d\'un salarie', component: AddSalarie },
  { path: '/salaries/profil/:id', exact: true, name: 'Dossiers personnel', component: profilSalarie },
  //{ path: '/salaries/dossiers-personnel', exact: true, name: 'Dossiers personnel', component: _DossiersPersonnel },
  { path: '/salaries/dossiers-personnel/:idSalarie', exact: true, name: 'Dossiers personnel', component: dossiersPersonnel },
  //{ path: '/salaries/vie-professionnelle', exact: true, name: 'Vie Professionnelle', component: _VieProfessionnelle },
  { path: '/salaries/vie-professionnelle/:idSalarie', exact: true, name: 'Vie Professionnelle', component: vieProfessionnelle },
  { path: '/salaries/vie-professionnelle/sanction', exact: true, name: 'Sanction disciplinaire', component: SanctionDisciplinaire },
  { path: '/salaries/vie-professionnelle/:idSalarie/creation-sanction', exact: true, name: ' Création sanction disciplinaire', component: CreateSantionDisciplinaire }, 
  { path: '/salaries/modification/:id', exact: true, name: 'Modification d\'un salarié', component: UpdateSalarie },
  { path: '/salaries/updatePassword', exact: true, name: 'Modification du mot de passe', component: UpdatePassword },
  { path: '/salaries/vie-professionnelle/:id/ajout-conge', exact: true, name: 'Ajout d\'un congé', component: AddConges },
  { path: '/salaries/vie-professionnelle/:id/ajout-visite-medicale', exact: true, name: 'Ajout d\'une visite médicale', component: AddVisiteMedicale },
  { path: '/salaries/vie-professionnelle/:id/modifier-visite-medicale/:idVM', exact: true, name: 'Modifier une visite médicale', component: UpdateVisiteMedicale },

  //Création d'un salarié et son poste
  { path: '/salaries/salarie-poste',exact: true, name: 'Ajout d\'un salarié et son poste ', component: createdSalaryAndPost},

  // Adresse
  /*{ path: '/adresses', exact: true, component: AllAdresses },
  { path: '/adresses/liste',exact: true, name: 'Listes des adresses', component: AllAdresses },
  { path: '/adresses/modification/:id',exact: true, name: 'Modification adresse', component: Adresse },
  { path: '/adresses/creation',exact: true, name: 'Créer une adresse', component: CreateAdresse },*/

  // Entreprise
  { path: '/entreprises',exact: true, name: 'Entreprise', component: AllEntreprise },
  { path: '/entreprises/liste',exact: true, name: 'Listes des entreprises', component: AllEntreprise },
  { path: '/entreprises/modification/:id',exact: true, name: 'Modifier une entreprises', component: UpdateEntreprise },
  { path: '/entreprises/creation',exact: true, name: 'Créer une entreprises', component: CreateEntreprise },
  { path: '/entreprises/organigramme/:id',exact: true, name: 'Organigramme de l\'entreprise', component: OrganigrammeEntreprise },

  // Type de contrat
  { path: '/type-contrat', exact: true, name: 'Type de contrat', component: AllTypeContrat },
  { path: '/type-contrat/liste',exact: true, name: 'Liste des types de contrat', component: AllTypeContrat },
  { path: '/type-contrat/modification/:id',exact: true, name: 'Modifier un type de contrat', component: UpdateTypeContrat },
  { path: '/type-contrat/creation',exact: true, name: 'Créer un nouveau type de contrat', component: CreateTypeContrat },

  // Service
  { path: '/service', exact: true, name: 'Service', component: AllService },
  { path: '/service/liste',exact: true, name: 'Liste des services', component: AllService },
  { path: '/service/modification/:id',exact: true, name: 'Modification d\'un service', component: UpdateService },
  { path: '/service/creation',exact: true, name: 'Creation d\'un service', component: CreateService },

  // Role
  { path: '/role/creation',exact: true, name: 'Creation d\'un role', component: CreateRole },
  { path: '/role', exact: true, name: 'Rôle', component: AllRole },
  { path: '/role/liste',exact: true, name: 'Liste des rôles', component: AllRole },
  { path: '/role/modification/:id',exact: true, name: 'Modification d\'un rôle', component: UpdateRole },

  // Compétence
  { path: '/competence', exact: true, name: 'Compétences', component: AllCompetence },
  { path: '/competence/liste',exact: true, name: 'Liste des compétences', component: AllCompetence },
  { path: '/competence/creation',exact: true, name: 'Creation d\'une compétence', component: CreateCompetence },
  { path: '/competence/modification/:id',exact: true, name: 'Modification d\'une compétence', component: UpdateCompetence },
  { path: '/competence/organigramme',exact: true, name: 'Organigramme de la compétence', component: OrganigrammeCompetence },

  // Titre poste
  { path: '/titre-poste', exact: true, name: 'Intilulés de poste', component: AllTitrePoste },
  { path: '/titre-poste/liste',exact: true, name: 'Liste des intitulés de poste', component: AllTitrePoste },
  { path: '/titre-poste/creation',exact: true, name: 'Creation d\'un intitulé de poste', component: CreateTitrePoste },
  { path: '/titre-poste/modification/:id',exact: true, name: 'Modification d\'un intitulé de poste', component: UpdateTitrePoste },

  // Fiche de poste
  { path: '/titre-poste/fiche-poste',exact: true, name: 'Ajout et modification des fiches de poste', component: PosteFiches },

  // Formations
  { path: '/formations', exact: true, name: 'Formation'},
  { path: '/formations/liste', exact: true, name: 'Liste des formations', component: ListFormation},
  { path: '/formations/voir/:id', exact: true, name: 'Formation', component: Formation },
  { path: '/formations/creation',exact: true, name: 'Création d\'une formation', component: CreateFormation },
  { path: '/formations/inserer/:id',exact: true, name: 'Ajouter un salarie dans une formation', component: InsertSalarieFormation },
  { path: '/formations/modification/:id',exact: true, name: 'Modification d\'une formation', component: UpdateFormation },
  { path: '/formations/request',exact: true, name: 'Demander une formation', component: RequestFormation },
  { path: '/formations/validate-request',exact: true, name: 'Demande de formation en attente', component: ValidateRequestFormation },

  // Poste
  { path: '/poste', exact: true, name: 'Postes', component: AllPoste },
  { path: '/salaries/postes/liste',exact: true, name: 'Liste des postes', component: AllPoste },
  { path: '/salaries/dossiers-personnel/:id/poste/creation',exact: true, name: 'Création d\'un poste', component: CreatePoste },
  { path: '/salaries/dossiers-personnel/:id/poste/modification',exact: true, name: 'Modification un poste', component: UpdatePoste },
  { path: '/salaries/dossiers-personnel/:id/poste/detail', exact: true, name: 'Detail d\'un poste', component: DetailPoste },

  // Entretiens
  { path: '/entretiens', exact: true, name: 'Entretiens', component: AllEntretien },
  { path: '/entretiens/liste', exact: true, name: 'Liste des entretiens', component: AllEntretien },
  { path: '/entretiens/creation',exact: true, name: 'Creation d\'un entretien', component: CreateEntretien },
  { path: '/entretiens/modification/:id',exact: true, name: 'Modification un entretien', component: UpdateEntretien },
  { path: '/entretiens/salarie/list',exact: true, name: 'Liste des entretiens', component: AllEntretienSalarie },
  { path: '/entretiens/manager/list',exact: true, name: 'Liste des entretiens', component: AllEntretienManager },
  { path: '/entretiens/entretien',exact: true, name: 'Mon entretien', component: Entretien },

  // Type d'entretien
  { path: '/type-entretien/liste',exact: true, name: 'Liste des types d\'entretien', component: AllTypeEntretien },
  { path: '/type-entretien/creation',exact: true, name: 'Creation de type d\'entretien', component: CreateTypeEntretien },
  { path: '/type-entretien/modification/:id',exact: true, name: 'Modification un type d\'entretien', component: UpdateTypeEntretien },

  // Questionnaire
  { path: '/questionnaire',exact: true, name: 'Questionnaires', component: AllQuestionnaire },
  { path: '/questionnaire/liste',exact: true, name: 'Liste des questionnaires', component: AllQuestionnaire },
  { path: '/questionnaire/creation',exact: true, name: 'Creation d\'un questionnaires', component: CreateQuestionnaire },
  { path: '/questionnaire/modification/:id',exact: true, name: 'Modification un questionnaires', component: UpdateQuestionnaire },
  { path: '/questionnaire/liste-question/:id',exact: true, name: 'Liste des questions du questionnaire', component: InsertQuestions },

  // Question
  { path: '/question/creation',exact: true, name: 'Creation d\'une question', component: CreateQuestion },
  { path: '/question/liste',exact: true, name: 'Liste des questions', component: ListQuestion },
  { path: '/question',exact: true, name: 'Question', component: ListQuestion },
  { path: '/question/modification/:id',exact: true, name: 'Modification d\'une question', component: UpdateQuestion },

  // Compte-rendu
  //{ path: '/compterendu/',exact: true, name: 'Les compte-rendu',component: ReadCompteRendu },
  { path: '/compterendu/read',exact: true, name: 'Visualiser le compte-rendu',component: ReadCompteRendu },
  { path: '/compterendu/read/comment',exact: true, name: 'Gestion des commentaires',component: AddCommentReport },
  { path: '/compterendu/read/answer',exact: true, name: 'Répondre au questionnaire', component: AnswerInterview },
  
  // Route
  //{ path: '/route', exact: true, name: 'Routes', component: AllRoute },
  // { path: '/route/liste',exact: true, name: 'Liste des routes',redirectTo:'/role/liste', component: AllRoute },
  // { path: '/route/creation',exact: true, name: 'Creation d\'une route', component: CreateRoute },
  // { path: '/route/modification/:id',exact: true, name: 'Modification d\'une route', component: UpdateRoute },

  // Activité domaine
  { path: '/activite-domaine/liste',exact: true, name: 'Liste des domaines activités', component: AllActivityDomain },
  { path: '/activite-domaine/creation',exact: true, name: 'Creation d\'un domaine d\'activité', component: CreateActivityDomain },
  { path: '/activite-domaine/modification/:id',exact: true, name: 'Modification d\'un domaine d\'activité', component: UpdateActivityDomain },

  // Plan annuel
  { path: '/plan-annuel',exact: true, name: 'Mes plans activités', component: MyAllActivityPlan },
  { path: '/plan-annuel/ma-liste',exact: true, name: 'Mes plans activités', component: MyAllActivityPlan },
  { path: '/plan-annuel/liste',exact: true, name: 'Liste des plans activités', component: AllActivityPlan },
  { path: '/plan-annuel/creation',exact: true, name: 'Creation d\'un plan d\'activité', component: CreateActivityPlan },
  { path: '/plan-annuel/modification/:id',exact: true, name: 'Modification d\'un plan d\'activité', component: UpdateActivityPlan },
  { path: '/plan-annuel/voir/:id',exact: true, name: 'Voir un plan d\'activité', component: planActivity },
  { path: '/plan-annuel/comment',exact: true, name: 'Gestion des commentaires d\'un plan d\'activité', component: addComment },

  // Notification
  { path: '/notification',exact: true, name: 'Liste des notifications', component: allNotification },
  //Estimateur de cotissation (Calculator)
  { path: '/estimateur',exact: true, name: 'Estimateur de cotisation mensuel et annuel', component: calculator },
  //Création d'un salarié et son poste
  { path: '/creation/salarie-poste',exact: true, name: 'Ajout d\'un salarié et son poste ', component: createdSalaryAndPost},
 //Organisme de formation
  { path: '/formations/liste-organisme-de-formation',exact: true, name: 'Organismes des formations', component: listeOrganisme},

  { path: '/formations/creation/organisme-de-formation',exact: true, name: 'Création', component: organismeDeFormation},
  
  { path: '/organisme-formation/modification/:id',exact: true, name: 'Modification', component: updateOrganisme},

 { path: '/formations/detail/organisme-de-formation/:id', exact: true, name: "Information de l'organisme de formation", component: detailOrganisme},
  //Routes pour le MENU
  { path: '/salaries/convention-collective', exact: true, name: "Convention collective", component: ConventionCollective},
  { path: '/salaries/remuneration', exact: true, name: "Rémunération", component:Remuneration},
  //CSE
  { path: '/cse/archivages-cse', exact: true, name: "Archivages CSE", component: ArchivagesCSE},
  { path: '/cse/hacerlement&bonne-pratique', exact: true, name: "Harcèlement - bonnes pratiques", component: Harcelement},
  { path: '/cse/pv-dawan', exact: true, name: "PV Dawan", component: DawanPv},
  { path: '/cse/pv-jehann', exact: true, name: "PV Jehann", component: JehannPv},
  { path: '/cse/delegues-dawan', exact: true, name: "Vos délégués Dawan", component: DeleguesDawan},
  { path: '/cse/delegues-jehann', exact: true, name: "Vos délégués Jehann", component: DeleguesJehann},
   //dawan & vous
   { path: '/dawan&vous/fiche-poste', exact: true, name: "Ma fiche de poste", component: FichePoste},

   { path: '/dawan&vous/referent', exact: true, name: "Mes référents", component: referents},
   { path: '/dawan&vous/Organigrammes', exact: true, name: "Organigrammes", component: Organigrammes},
//intégration
{ path: '/integration/dossiers-recrutement', exact: true, name: "Dossiers du recrutement", component: DossierRecrutement},
{ path: '/integration/kit-acceuil-salarie', exact: true, name: "Mon kit d'accueil salarié", component:kitSalarie},
{ path: '/integration/kit-acceuil-apprenti', exact: true, name: "Mon kit d'accueil apprenti ", component: KitApprenti},
{ path: '/integration/questionnaire-integration', exact: true, name: "Mon questionnaire d'intégration", component: QuestionnaireIntegration},
{ path: '/integration/entretien-periode-essaie', exact: true, name: "Entretien période d'essai", component: periodeEssaie},
{ path: '/integration/livret-acceuil', exact: true, name: "Livret d'accueil", component: Livret},

// parcours d'évolution
{ path: '/parcours-evolution/people-review', exact: true, name: "People Review", component: Review},


//RSE

{ path: '/rse/rapport-rse', exact: true, name: "Développement RSE", component: RapportRse},
{ path: '/rse/developpement-rse', exact: true, name: "Rapport RSE", component: DeveloppementRse},





];



export default routes;
