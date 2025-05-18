export const faqItems = [
    {
        question: `Qu'est-ce que c’est l'application Predicting Infectious Diseases via Environment and Climate (PRIDE-C) ?`,
        answer: `
        L'application PRIDE-C prédit le nombre de cas et les taux d'incidence du paludisme, des maladies diarrhéiques \
        et des infections respiratoires aiguës à l'aide de modèles statistiques qui incluent des variables prédictives climatiques \
        et environnementales. PRIDE-C dessert actuellement le district d'Ifanadiana, Vatovavy, Madagascar. \
            
        <br>
        <br>
        
        PRIDE-C a été co-développée grâce à un partenariat avec le <a href="http://www.sante.gov.mg/ministere-sante-publique/"> Ministère de la Santé de Madagascar</a> \
        et <a href="https://www.pivotworks.org/">Pivot</a> à travers une série d'ateliers participatifs. \
        Son développement a été financé par un prix <a href="https://wellcome.org/grant-funding/schemes/digital-technology-development-awards-climate-sensitive-infectious-disease">
        Wellcome Trust Digital Technology Development Award in Climate Sensitive 
        Infectious Disease Modelling </a>) (Grant No. 226064/Z/22/Z).
        `,
    },
    {
        question: `Comment utiliser l'application ?`,
        answer: `
        Les prévisions sont classées par maladie. Vous pouvez sélectionner l'une des trois maladies (paludisme, \
        maladies diarrhéiques ou infections respiratoires aiguës) à l'aide de la barre de navigation située à gauche. \
        Sous chaque maladie se trouvent deux pages : \
        <br>
        <br>
        <ul>
            <li> 
                La page <b>Tendance</b> contient une série temporelle, une carte et un tableau de prévisions. \
                Vous pouvez choisir d'afficher les prévisions au niveau du district, de la commune, de la formatoin sanitaire ou du fokontany. \
                Les prévisions peuvent être téléchargées via le tableau de données en bas de la page. 
            </li>
            <br>
            <li>
                La page <b>Climat</b> contient les séries temporelles des variables environnementales et climatiques utilisées \
                dans les modèles prédictifs. Vous pouvez visualiser jusqu'à deux variables à la fois en plus de l'indicateur de \
                maladie de votre choix. Cela vous permet d'explorer la relation entre le climat et la santé. 
            </li>
        </ul>
        `,
    },
    {
        question: `Combien de mois à l’avance le modèle PRIDE-C prédit-il ?`,
        answer: `
        Le modèle PRIDE-C peut prédire jusqu’à trois mois à l’avance, \
        mais la précision de ces prévisions diminue au fur et à mesure que les prédictions sont faites dans le futur.
        `,
    },
    {
        question: `Quelles données sont utilisées dans l'application PRIDE-C ?`,
        answer: `
        PRIDE-C harmonise plusieurs source de données de santé pour créer des prévisions pour trois indicateurs de maladie d'enfant:\
        <br>
        <br>
        <ol>
            <li>
                <b>Le taux d'incidence des maladies symptomatiques</b>. Ces données sont basées sur les registres de santé numérisés collectés \
                auprès des centres de santé de base (CSB) par les équipes de recherche et de suivi-évaluation de Pivot. Ces données, \
                géoréférencées au niveau du fokontany, sont corrigées en fonction de l'accès aux soins afin de représenter l'incidence de \
                la maladie après avoir pris en compte les différentes barrières aux soins. Ces prévisions sont disponibles au niveau du \
                fokontany et au-delà.
            </li>
            <br>
            <li>
                <b>Nombre de cas signalés à la formation sanitaire. </b>Ces données sont basées sur le nombre de cas mensuels collectés régulièrement \
                et signalés dans le DHIS2. Elles représentent le nombre de cas qui devraient être observés à la formation sanitaire au cours des prochains mois. \
                Ces prévisions sont disponibles au niveau de centre de santé de base (CSB) et au-delà.
            </li>
            <br>
            <li>
                <b>Nombre de cas signalés au niveau du site de santé communautaire.</b> Ces données sont basées sur les cas mensuels collectés de manière routinière \
                signalés dans les sites de santé communautaire pour 88 fokontany du district. Elles représentent le nombre de cas attendus au niveau du site \
                de santé communautaire. Ces prévisions sont disponibles au niveau du fokontany et au-dessus, mais ne sont disponibles que pour les fokontany \
                qui disposent d'au moins trois ans de données historiques.
            </li>
        </ol>
        <br >
        PRIDE-C utilise 15 variables environnementales et climatiques dans les modèles prédictifs, basés sur des images satellite collectées via <a href="https://earthengine.google.com/">Google Earth Engine</a>.
        <br>
        <br>
        Pour le District d’Ifanadiana, des données supplémentaires liées aux caractéristiques sociodémographiques et comportementales sont incluses dans les modèles \
        prédictifs, grâce à une enquête longitudinale menée tous les deux ans <a href="https://doi.org/10.1080/16549716.2017.1329961">(Miller et al. 2017)</a>. Ces variables comprennent l’utilisation \
        de moustiquaires, le niveau socio-économique, le niveau d’éducation des ménages et la disponibilité d’infrastructures améliorées, entre autres.
        `,
    },
]
