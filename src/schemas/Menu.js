// This is just reference for me to look at later
const menuCategory = {
  id: String,
  listOrder: Number,
  name: String,
  description: String,
  belongsTo: String,
  isActive: Boolean,
  createdAt: Date, //Actually timestamp
  icon: String //Url
}

const menuItem = {
  id: String,
  ecommerceUrl: String,
  createdAt: Date, // Timestamp
  listOrder: Number,
  belongsTo: String, // Can belong to several, will probably do it comma separated
  title: String,
  description: String,
  modifiers: String, //Comma separated list
  number: Number,
  isActive: Number,
  variants: { // Used for drinks only
    amount: Number,
    unit: String,
    price: Number
  },
}

const menuModifier = {
  id: String,
  type: String,// Enum (Allergen|Additive|Info)
  shortName: String,
  longName: String,
  icon: String //URL
}

//Following will need to be added to the db later
const Info = [
  'Scharf',
  'Vegan',
  'Veggie',
  'Regional',
  'Bio'
]

const Additive = [
  'mit Farbstoff',
  'mit Konservierungsstoffen',
  'mit Antioxidationsmitteln',
  'mit Geschmacksverstärker',
  'geschwefelt',
  'geschwärzt',
  'mit Phosphat',
  'mit Süßungsmittel',
  'enthält eine Phenylalaninquelle',
  'gewachst',
  'mit Nitritpökelsalz',
  'Tartrazin',
  'koffeinhaltig',
  'chininhaltig',
  'genetisch verändert',
  'mit Milcheiweiß',
  'mit Taurin',
  'alkoholhaltig',
  'Laktose',
  'Säuerungsmittel',
  'Unter Schutzatmosphäre verpackt',
  'Zusatzstoffe',
  'mit Zucker und Süßungsmitteln'
]

const Allergen = [
  'glutenhaltiges Getreide',
  'Weizen',
  'Roggen',
  'Hafer',
  'Kamut oder Hybridstämme',
  'Krebstiere',
  'Eier und Eierzeugnisse',
  'Fisch und Fischerzeugnisse',
  'Erdnüsse und Erdnusserzeugnisse',
  'Sojabohnen und Sojabohnenerzeugnisse',
  'Milch und Milcherzeugnisse',
  'Schalenfrüchte und Schalenfruchterzeugnisse',
  'Mandeln',
  'Haselnüsse',
  'Walnüsse',
  'Cashewnüsse',
  'Pecanüsse',
  'Paranüsse',
  'Pistazien',
  'Macadamia - oder Queenslandnüsse',
  'Sellerie und Sellerieerzeugnisse',
  'Senf und Senferzeugnisse',
  'Sesamsamen und Sesamerzeugnisse',
  'Schwefeldioxid und Sulfite',
  'Lupinen und Lupinenerzeugnisse',
  'Weichtiere und Weichtiererzeugnisse',
  'Gerste'
]
