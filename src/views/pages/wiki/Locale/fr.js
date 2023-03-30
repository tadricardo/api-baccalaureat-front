export const wikiData = [{
            title: "Non-connecté",
            role : 0,
            inProgress: false,
            faq: [
                /*{
                    issue : "Que faire en cas d'oubli du mot de passe ? ",
                    reply : "Lorsque que vous oubliez votre mot de passe, vous avez la possibilité d'en créer un nouveau. Il suffit de cliquer sur 'Mot de passe oublié ?' en dessous du formulaire de connexion."
                },
                {
                    issue : "Comment s'inscrire sur application ? ",
                    reply : "Veuillez contacter la partie RH ou demande a votre manager pour une inscription sur l'application. Quand cela sera effectué, vous recevrez un email avec les informations pour vous connecter."
                }*/
                {
                    issue : "Comment s'inscrire sur application ? ",
                    reply : "Il faut vous connecter avec un email 'jehan.fr' ou 'dawan.fr'."
                }
            ]
        },
        {
            title: "Salarié",
            role : 1,
            inProgress: true,
            faq: [
                {
                    issue : "",
                    reply : ""
                }
            ]
        },
        {
            title: "Manager",
            role : 2,
            inProgress: true,
            faq: [
                {
                    issue : "",
                    reply : ""
                }
            ]
        },
        {
            title: 'RH',
            role : 3,
            inProgress: false,
            faq: [
                {
                    issue : "Comment ajouter un salarié ? ",
                    reply : `
                    <p>
                        Pour ajouter, un salarie à l'application, veuillez-vous rendre sur la page :
                        <a target="_blank" href="/#/salaries/creation" title="création d'un salarie" > Création d'un salarie </a><br /><br />
                        Pour créer un salarié, veuillez ajouter à l'application au préalable ses informations :
                        <ul>
                            <li> Avoir créer une adresse qui sera rattache au salarie </li>
                            <li> Avoir au moins entreprise qui sera rattache au salarie  </li>
                            <li> Avoir au moins un service  </li>
                        </ul>
                    </p>
                    `
                },
                {
                    issue : "Comment ajouter un poste ? ",
                    reply :  `
                    <p>
                        Pour ajouter un poste à une salarie, veuillez-vous rendre sur le profil du salarie => Liste des postes.<br />
                        Sur cette page, vous apercevriez un bouton pour ajouter un contrat au salarié.<br />
                        Pour créer un contrat, veuillez ajouter à l'application au préalable ses informations : 
                        <ul>
                            <li> Avoir au moins un service  </li>
                            <li> Avoir au moins lieu de travail (entreprise)</li>
                            <li> Avoir au moins une compétence</li>
                            <li> Avoir au moins un type de contrat</li>
                        </ul>
                        <br />
                        Information : Si le salarié en cours à déjà un poste occupé actif, il sera automatique désactiver et remplacer par le nouveau contrat.
                    </p>
                    `
                }
            ]
        },
        {
            title: "Administrateur",
            role : 4,
            inProgress: true,
            faq: [
                {
                    issue : "",
                    reply : ""
                },
                {
                    issue : " ",
                    reply : ""
                }
            ]
}];