function removeWhiteSpaceAndSpecialCaracters(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '_');
  }
  export function getNewFilename(file: File) {
    const fileNameAndExtensions = file.name.split('.');
    const extension = fileNameAndExtensions[fileNameAndExtensions.length - 1];
    fileNameAndExtensions.pop();
    const newFileName = removeWhiteSpaceAndSpecialCaracters(fileNameAndExtensions.join('')) + '_' + new Date().getTime();
    return newFileName + '.' + extension;
  }

  export const FAQ_LIST: { question: string, answer: string }[] = [
    {
      question: 'A quelle heure se tient le Salon EM ?',
      answer: 'Le salon se tiendra de 9h à 17h sur les 3 jours prévus.'
    },
    {
      question: 'Comment accéder au site de l’IPD ?',
      answer: 'Vous pourrez accéder au site en présentant le QR code reçu lors de votre inscription en ligne par mail. Le site de pasteur se trouve au 36, rue Pasteur à Dakar à Dakar Plateau.'
    },
    {
      question: 'Quelle est la durée d’un entretien lors du salon ?',
      answer: 'L’entretien dure maximum 15 mn.'
    },
    {
      question: 'Qui vais-je rencontrer lors de mon entretien ?',
      answer: 'Vous allez rencontrer un manager RH et un manager expert du métier.'
    },
    {
      question: 'Y’ a-t-il des frais d’inscription au Salon ?',
      answer: 'Non, l’inscription est gratuite et se fait en ligne à travers le lien suivant :'
    },
    {
      question: 'Quelles sont les règles à respecter lors du Salon ?',
      answer: 'Vous devez vous munir de votre QR code pour accéder au site et respecter les consignes qui seront données par le service de réception.'
    },
    {
      question: 'Ai-je la possibilité de faire un entretien sur plusieurs métiers ?',
      answer: 'Oui, c’est possible. Il suffit de vous présenter directement sur le stand qui vous intéresse pour bénéficier d’un entretien. Vous ne pouvez pas participer sur plusieurs journées du salon.'
    },
    {
      question: 'Quelles sont les modalités pour accéder aux différents stands de métiers ?',
      answer: 'Vous devez juste vous présenter au stand de métier qui vous intéresse et faire le rang pour pouvoir bénéficier d’un entretien avec les experts de l’IPD. Un stand de coaching sera là pour vous orienter et vous aider à vous préparer à votre entretien.'
    },
    {
      question: 'Puis-je être accompagné avec une personne non inscrite sur la plateforme d’inscription ?',
      answer: 'Oui, uniquement si c’est un parent'
    },
    {
      question: 'Dois je déposer le CV en version papier ou électronique ?',
      answer: 'Seuls les CV électroniques seront acceptés lors du Salon, notamment lors de votre inscription en ligne.'
    },
    {
      question: 'Ai-je besoin d’imprimer mon CV pour venir au salon ?',
      answer: 'Non. Aucun CV papier ne sera accepté lors du salon.'
    },
    {
      question: 'Puis je amener mon ordinateur ou tablette lors du salon ?',
      answer: 'Non, les ordinateurs et tablettes sont en principe interdits. Seuls les téléphones seront acceptés à l’intérieur du site.'
    },
    {
      question: 'Quelle sera la suite qui sera donnée à ma candidature ?',
      answer: 'Seuls les candidats retenus lors des entretiens seront contactés pour la suite du processus de recrutement.'
    },
    {
      question: 'Est-il possible de venir au Salon, en étant pas inscrit en ligne ?',
      answer: 'L’inscription est obligatoire pour l’accès au salon. N’hésitez pas à nous contacter via le numéro inscrit sur le formulaire pour bénéficier d’une dérogation.'
    },
    {
      question: 'Comment puis-je rester en contact avec les experts rencontrés lors du salon ?',
      answer: 'Le salon est l’occasion de faire du networking entre vous et les experts présents. Vous aurez juste à en faire la demande.'
    },
    {
      question: 'Est-il possible de faire une candidature spontanée lors du Salon ?',
      answer: 'Oui, la candidature spontanée sera traitée en tenant compte de vos compétences et votre niveau d’expérience.'
    },
    {
      question: 'Y’a il déjeuner offert lors du salon ?',
      answer: 'Non. Le déjeuner n’est pas offert pour cet évènement.'
    },
    {
      question: 'Y’a-t-il d’autres entreprises ou organismes à part l’Institut Pasteur qui seront présents lors du Salon ?',
      answer: 'Non. Il s’agit d’un Salon emploi et métiers de l’IPD uniquement.'
    },
    {
      question: 'Y’a-t-il des places de parking dédiées aux visiteurs du Salon ?',
      answer: 'Oui des places de parking sont dédiées aux visiteurs du Salon, dans la limite des places disponibles.'
    },
    {
      question: 'Peut-on visiter les locaux et laboratoires de l’IPD lors du Salon ?',
      answer: 'Non. Les visiteurs n’ont accès qu’aux stands et espaces dédiés au Salon.'
    },
    {
      question: 'Est-il possible d’aller visiter le vaccinopole de Diamniadio ?',
      answer: 'Non. Les visites ne sont pas inclues.'
    },
    {
      question: 'Peut-on avoir une audience individuelle avec Dr Amadou Alpha SALL lors du Salon ?',
      answer: 'Oui. Vous avez la possibilité de le rencontrer en fonction de sa disponibilité.'
    },
    {
      question: 'Y’a-t-il des ressources en ligne disponibles pour ceux qui ne peuvent pas participer au Salon ?',
      answer: 'Oui. Vous pouvez nous appeler directement sur le numéro de téléphone mentionné sur le formulaire.'
    },
    {
      question: 'Existe-t-il un numéro de téléphone hotline pour l’évènement ?',
      answer: '...'
    },
    {
      question: 'Y’a-t-il une connexion Wifi gratuite sur les espaces du Salon ?',
      answer: '...'
    },
  ];

  export const LIST_METIER = [
    'Production', 'R&D', 'Maintenance', 'Qualité', 'HSE', 'Process Engineering', 'Génie de Procédé', 'PMO', 'Affaires Réglementaires', 'Qualification Validation', 'Immunologie', 'Bactériologie', 'Epidémiologie', 'Virologie', 'Entomologie', 'Biobanque', 'Innovation', 'Génie Informatique', 'Finances', 'Comptabilité', 'Supply Chain', 'Métrologie', 'Marketing', 'Capital Humain', 'Gestion de Projet'
  ]