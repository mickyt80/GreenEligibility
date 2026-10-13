// Every piece of text in the service, in English and Welsh.
//
// DRAFT WELSH: the Welsh below is a draft. It must be checked by a Welsh speaker, ideally a
// professional Welsh translator, before the service goes live.
//
// Saved answers stay in English (for example "England"), so they keep working whichever
// language is chosen. `answers` gives the Welsh shown for each English answer.

export const LANGUAGES = ['en', 'cy'];

const en = {
  serviceName: 'Check if you are eligible for a Green Home Grant',
  titleSuffix: '– GOV.UK',
  errorPrefix: 'Error:',

  // Page frame
  skipLink: 'Skip to main content',
  phaseTag: 'Alpha',
  phaseBefore: 'This is a new service – your ',
  phaseLink: 'feedback',
  phaseAfter: ' will help us improve it.',
  footerSupportLinks: 'Support links',
  footerAccessibility: 'Accessibility statement',
  footerLicenceBefore: 'All content is available under the ',
  footerLicenceLink: 'Open Government Licence v3.0',
  footerLicenceAfter: ', except where otherwise stated',
  footerCopyright: '© Crown copyright',

  // Language navigation. Each language's own name and description are written in that
  // language, whichever language the page is in.
  languageNavLabel: 'Language',

  // Cookie banner
  cookiesHeading: 'Cookies on Check if you are eligible for a Green Home Grant',
  cookiesEssential: 'We use some essential cookies to make this service work.',
  cookiesAnalytics:
    'We’d also like to use analytics cookies so we can understand how you use the service and make improvements.',
  cookiesAccept: 'Accept analytics cookies',
  cookiesReject: 'Reject analytics cookies',
  cookiesView: 'View cookies',
  cookiesAcceptedBefore: 'You’ve accepted analytics cookies. You can ',
  cookiesRejectedBefore: 'You’ve rejected analytics cookies. You can ',
  cookiesSettingsLink: 'change your cookie settings',
  cookiesConfirmAfter: ' at any time.',
  cookiesHide: 'Hide cookie message',

  // Shared question page parts
  back: 'Back',
  continue: 'Continue',
  errorSummaryTitle: 'There is a problem',
  or: 'or',

  // First page
  startDescription: 'The Green Home Grant is a government scheme that funds home insulation and heat pumps.',
  startButton: 'Check your eligibility',

  // Questions
  regionQuestion: 'In what region do you live?',
  regionError: 'Select the region where you live',
  ownershipQuestion: 'Do you own or rent your property?',
  ownershipError: 'Select if you own or rent your property',
  mainResidenceQuestion: 'Is this your main residence or a secondary home?',
  mainResidenceError: 'Select if this is your main residence or a secondary home',
  builtQuestion: 'Was your property built before the year 2000?',
  builtError: 'Select yes if your property was built before the year 2000',
  epcQuestion: "What is your home's EPC rating?",
  epcError: "Select your home's EPC rating, or select Not known",

  // Check answers
  checkHeading: 'Check your answers',
  change: 'Change',
  changeRegion: 'in what region do you live?',
  changeOwnership: 'whether you own or rent your property',
  changeMainResidence: 'whether this is your main residence or a secondary home',
  changeBuilt: 'whether your property was built before the year 2000',
  changeEpc: "your home's EPC rating",
  accept: 'Accept and continue',

  // Results
  eligibleHeading: 'You are eligible for a Green Home Grant',
  notEligibleHeading: 'You are not eligible for a Green Home Grant',
  reasonRegion: 'The Green Home Grant is only available to people who live in the UK.',
  reasonOwnership: 'The Green Home Grant is only available to people who own their home.',
  reasonMainResidence: 'The Green Home Grant is only available for your main residence.',
  reasonBuilt: 'The Green Home Grant is only available for properties built before the year 2000.',
  reasonEpc: 'The Green Home Grant is only available for properties with an EPC rating of D or below.',
  mayBeEligibleHeading: 'You may be eligible',
  mayBeEligibleReason: 'We cannot assess your eligibility without an EPC rating.',
  mayBeEligibleMoreBefore: "For more information on your property's EPC rating, see ",
  findEnergyCertificate: 'Find an energy certificate',
  mayBeEligibleMoreAfter: '.',

  // Accessibility statement
  accessibilityHeading: 'Accessibility statement',
  accessibilityHowAccessible: 'How accessible this service is',
  accessibilityFeedback: 'Feedback and contact information',
  accessibilityTechnical: 'Technical information',
  accessibilityCompliance: 'This service is partially compliant with WCAG 2.2 AA.',
  accessibilityTesting: 'How we tested this service',
  accessibilityImproving: 'What we are doing to improve',

  answers: {},
};

const cy = {
  serviceName: 'Gwirio a ydych yn gymwys i gael Grant Cartrefi Gwyrdd',
  titleSuffix: '– GOV.UK',
  errorPrefix: 'Gwall:',

  skipLink: 'Neidio i’r prif gynnwys',
  phaseTag: 'Alffa',
  phaseBefore: 'Mae hwn yn wasanaeth newydd – bydd eich ',
  phaseLink: 'adborth',
  phaseAfter: ' yn ein helpu i’w wella.',
  footerSupportLinks: 'Dolenni cymorth',
  footerAccessibility: 'Datganiad hygyrchedd',
  footerLicenceBefore: 'Mae’r holl gynnwys ar gael o dan y ',
  footerLicenceLink: 'Drwydded Llywodraeth Agored v3.0',
  footerLicenceAfter: ', oni nodir yn wahanol',
  footerCopyright: '© Hawlfraint y Goron',

  languageNavLabel: 'Iaith',

  cookiesHeading: 'Cwcis ar Gwirio a ydych yn gymwys i gael Grant Cartrefi Gwyrdd',
  cookiesEssential: 'Rydym yn defnyddio rhai cwcis hanfodol i wneud i’r gwasanaeth hwn weithio.',
  cookiesAnalytics:
    'Hoffem hefyd ddefnyddio cwcis dadansoddol er mwyn i ni ddeall sut rydych yn defnyddio’r gwasanaeth a gwneud gwelliannau.',
  cookiesAccept: 'Derbyn cwcis dadansoddol',
  cookiesReject: 'Gwrthod cwcis dadansoddol',
  cookiesView: 'Gweld cwcis',
  cookiesAcceptedBefore: 'Rydych wedi derbyn cwcis dadansoddol. Gallwch ',
  cookiesRejectedBefore: 'Rydych wedi gwrthod cwcis dadansoddol. Gallwch ',
  cookiesSettingsLink: 'newid eich gosodiadau cwcis',
  cookiesConfirmAfter: ' ar unrhyw adeg.',
  cookiesHide: 'Cuddio’r neges cwcis',

  back: 'Yn ôl',
  continue: 'Yn eich blaen',
  errorSummaryTitle: 'Mae problem wedi codi',
  or: 'neu',

  startDescription:
    'Mae’r Grant Cartrefi Gwyrdd yn gynllun gan y llywodraeth sy’n ariannu inswleiddio cartrefi a phympiau gwres.',
  startButton: 'Gwirio eich cymhwysedd',

  regionQuestion: 'Ym mha ranbarth ydych chi’n byw?',
  regionError: 'Dewiswch y rhanbarth lle rydych yn byw',
  ownershipQuestion: 'Ydych chi’n berchen ar eich eiddo neu’n ei rentu?',
  ownershipError: 'Dewiswch a ydych yn berchen ar eich eiddo neu’n ei rentu',
  mainResidenceQuestion: 'Ai hwn yw eich prif breswylfa neu ail gartref?',
  mainResidenceError: 'Dewiswch ai hwn yw eich prif breswylfa neu ail gartref',
  builtQuestion: 'A gafodd eich eiddo ei adeiladu cyn y flwyddyn 2000?',
  builtError: 'Dewiswch ‘Do’ os cafodd eich eiddo ei adeiladu cyn y flwyddyn 2000',
  epcQuestion: 'Beth yw sgôr EPC eich cartref?',
  epcError: 'Dewiswch sgôr EPC eich cartref, neu dewiswch ‘Ddim yn gwybod’',

  checkHeading: 'Gwirio eich atebion',
  change: 'Newid',
  changeRegion: 'ym mha ranbarth rydych chi’n byw',
  changeOwnership: 'a ydych yn berchen ar eich eiddo neu’n ei rentu',
  changeMainResidence: 'ai hwn yw eich prif breswylfa neu ail gartref',
  changeBuilt: 'a gafodd eich eiddo ei adeiladu cyn y flwyddyn 2000',
  changeEpc: 'sgôr EPC eich cartref',
  accept: 'Derbyn a pharhau',

  eligibleHeading: 'Rydych yn gymwys i gael Grant Cartrefi Gwyrdd',
  notEligibleHeading: 'Nid ydych yn gymwys i gael Grant Cartrefi Gwyrdd',
  reasonRegion: 'Dim ond i bobl sy’n byw yn y DU y mae’r Grant Cartrefi Gwyrdd ar gael.',
  reasonOwnership: 'Dim ond i bobl sy’n berchen ar eu cartref y mae’r Grant Cartrefi Gwyrdd ar gael.',
  reasonMainResidence: 'Dim ond ar gyfer eich prif breswylfa y mae’r Grant Cartrefi Gwyrdd ar gael.',
  reasonBuilt: 'Dim ond ar gyfer eiddo a adeiladwyd cyn y flwyddyn 2000 y mae’r Grant Cartrefi Gwyrdd ar gael.',
  reasonEpc: 'Dim ond ar gyfer eiddo sydd â sgôr EPC o D neu is y mae’r Grant Cartrefi Gwyrdd ar gael.',
  mayBeEligibleHeading: 'Efallai eich bod yn gymwys',
  mayBeEligibleReason: 'Ni allwn asesu eich cymhwysedd heb sgôr EPC.',
  mayBeEligibleMoreBefore: 'I gael rhagor o wybodaeth am sgôr EPC eich eiddo, gweler ',
  findEnergyCertificate: 'Dod o hyd i dystysgrif ynni',
  mayBeEligibleMoreAfter: '.',

  accessibilityHeading: 'Datganiad hygyrchedd',
  accessibilityHowAccessible: 'Pa mor hygyrch yw’r gwasanaeth hwn',
  accessibilityFeedback: 'Adborth a gwybodaeth gyswllt',
  accessibilityTechnical: 'Gwybodaeth dechnegol',
  accessibilityCompliance: 'Mae’r gwasanaeth hwn yn cydymffurfio’n rhannol â WCAG 2.2 AA.',
  accessibilityTesting: 'Sut y gwnaethom brofi’r gwasanaeth hwn',
  accessibilityImproving: 'Beth rydym yn ei wneud i wella',

  answers: {
    England: 'Lloegr',
    Scotland: 'Yr Alban',
    Wales: 'Cymru',
    'Northern Ireland': 'Gogledd Iwerddon',
    'Outside of the UK': 'Y tu allan i’r DU',
    'Own (with or without mortgage)': 'Yn berchen arno (gyda neu heb forgais)',
    'Rent from a private landlord': 'Rhentu gan landlord preifat',
    'Rent from a housing association': 'Rhentu gan gymdeithas dai',
    'Rent from the council': 'Rhentu gan y cyngor',
    'First home': 'Cartref cyntaf',
    'Secondary home': 'Ail gartref',
    Yes: 'Do',
    No: 'Naddo',
    'Not known': 'Ddim yn gwybod',
  },
};

export const translations = { en, cy };
