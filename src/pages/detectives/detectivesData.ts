
import { AuthorStat, Flashcard } from './types';

// Data extracted from PDF: "Ocnos, 25(1) (2026). ISSN-e: 1885-446X"
// DOI: https://doi.org/10.18239/ocnos_2026.25.1.632

export const APP_NAME = "#LeeralosqueLeen";
export const DOI_LINK = "https://doi.org/10.18239/ocnos_2026.25.1.632";

export const GLOBAL_STATS = {
  loans2024: 2647176, // Total loans
  adultLoans: 1770833,
  childLoans: 876339,
  adultGini: 0.84,
  childGini: 0.88,
  thrillerPercentage: 42,
  maleAuthorsPercentage: 62,
  spanishAuthorsPercentage: 44,
};

export const TOP_AUTHORS_ADULT: AuthorStat[] = [
  { name: "Juan Gómez-Jurado", loans: 7201, gender: 'M', origin: "España", category: 'adulto' },
  { name: "Roberto Santiago", loans: 6926, gender: 'M', origin: "España", category: 'adulto' },
  { name: "Arturo Pérez-Reverte", loans: 6232, gender: 'M', origin: "España", category: 'adulto' },
  { name: "Geronimo Stilton", loans: 5976, gender: 'M', origin: "Italia", category: 'adulto' }, // Listed in adults table in PDF likely due to cross-over or categorization
  { name: "Pedro Mañas Romero", loans: 5938, gender: 'M', origin: "España", category: 'adulto' },
  { name: "Dav Pilkey", loans: 5425, gender: 'M', origin: "EE.UU", category: 'adulto' },
  { name: "Carmen Mola", loans: 5378, gender: 'F', origin: "España", category: 'adulto' }, // Female pseudonym/group
  { name: "Megan Maxwell", loans: 5286, gender: 'F', origin: "España", category: 'adulto' },
  { name: "F. Ibáñez", loans: 4984, gender: 'M', origin: "España", category: 'adulto' },
  { name: "Lorenzo Silva", loans: 4979, gender: 'M', origin: "España", category: 'adulto' },
];

export const TOP_AUTHORS_CHILD: AuthorStat[] = [
  { name: "Roberto Santiago", loans: 18943, gender: 'M', origin: "España", category: 'infantil' },
  { name: "Geronimo Stilton", loans: 18643, gender: 'M', origin: "Italia", category: 'infantil' },
  { name: "Pedro Mañas Romero", loans: 15537, gender: 'M', origin: "España", category: 'infantil' },
  { name: "Jeff Kinney", loans: 15513, gender: 'M', origin: "EE.UU", category: 'infantil' },
  { name: "Dav Pilkey", loans: 14023, gender: 'M', origin: "EE.UU", category: 'infantil' },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "¿Qué género literario dominó los préstamos adultos en Madrid 2024?",
    options: ["Novela Histórica", "Thriller", "Romántica", "Ciencia Ficción"],
    correctAnswer: 1,
    explanation: "El Thriller representó el 42% de los préstamos adultos."
  },
  {
    id: 2,
    question: "¿Cuál es el Índice de Gini para los autores adultos?",
    options: ["0.50", "0.65", "0.84", "0.92"],
    correctAnswer: 2,
    explanation: "Un Gini de 0.84 indica una altísima concentración: pocos autores acaparan la mayoría de lecturas."
  },
  {
    id: 3,
    question: "¿Qué porcentaje de autores prestados son hombres?",
    options: ["40%", "50%", "62%", "75%"],
    correctAnswer: 2,
    explanation: "Existe una brecha de género: el 62% de los libros prestados son escritos por hombres."
  }
];

export const STUDY_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    question: "Muestra del Estudio",
    answer: "2.64 Millones de Préstamos",
    citation: "Metodología",
    detail: "Análisis de datos abiertos 2024: 1.77M adultos + 0.87M infantiles. Se analizaron 515 autores con >500 préstamos."
  },
  {
    id: 2,
    question: "Top 1 Adultos vs Infantil",
    answer: "Gómez-Jurado vs R. Santiago",
    citation: "Tablas 2 y 3",
    detail: "Adultos: Gómez-Jurado (7,201 préstamos). Infantil: Roberto Santiago (18,943). Nótese el volumen masivo en infantil."
  },
  {
    id: 3,
    question: "Concentración (Índice Gini)",
    answer: "0.84 (Adultos) / 0.88 (Infantil)",
    citation: "Tabla 1",
    detail: "Extrema concentración. La biblioteca pública refuerza el efecto 'Bestseller' en lugar de promover la 'Long Tail'."
  },
  {
    id: 4,
    question: "Brecha de Género (Datos)",
    answer: "61% Autores Hombres",
    citation: "Resultados: Género",
    detail: "Aunque las mujeres leen más, consumen autores hombres: 62% de los préstamos totales corresponden a autores masculinos."
  },
  {
    id: 5,
    question: "Hegemonía del Thriller",
    answer: "42% de los Títulos Top",
    citation: "Resultados: Género Literario",
    detail: "El thriller y la novela negra dominan la ficción adulta, desplazando a la novela histórica o romántica."
  },
  {
    id: 6,
    question: "Top 3 Autoras (Mujeres)",
    answer: "Mola, Maxwell, Läckberg",
    citation: "Tabla 2 (Ranking)",
    detail: "Carmen Mola (#7, 5378), Megan Maxwell (#8, 5286), Camilla Läckberg (#12, 4690). Isabel Allende aparece en el #15."
  },
  {
    id: 7,
    question: "Origen Geográfico",
    answer: "44% España / 29% Anglo",
    citation: "Resultados: Nacionalidad",
    detail: "Predominio local, seguido fuertemente por literatura anglosajona traducida. Francia (6%) y Japón (3%) siguen."
  },
  {
    id: 8,
    question: "Fenómeno Carmen Mola",
    answer: "Posición #7 (Pseudónimo)",
    citation: "Análisis cualitativo",
    detail: "Contabilizada estadísticamente como mujer, aunque son tres hombres. Su éxito refuerza el dominio del Thriller."
  },
  {
    id: 9,
    question: "Literatura Infantil",
    answer: "Dominio de Sagas",
    citation: "Tabla 3",
    detail: "Los Futbolísimos (Santiago), Geronimo Stilton y Diario de Greg (Kinney) acaparan el mercado masivamente."
  },
  {
    id: 10,
    question: "Concentración Títulos Adultos",
    answer: "Gini 0.72",
    citation: "Tabla 1",
    detail: "Menor que la concentración por autores (0.84), indicando que los lectores buscan 'autores marca' más que libros sueltos."
  },
  {
    id: 11,
    question: "Auge del Manga",
    answer: "Japón (3% del total)",
    citation: "Resultados",
    detail: "Aunque parece bajo, es la única procedencia no occidental significativa, impulsada por público juvenil."
  },
  {
    id: 12,
    question: "Autores con más Títulos",
    answer: "Enid Blyton (171 títulos)",
    citation: "Tabla 3",
    detail: "En infantil, el fondo de catálogo es vital. Tea Stilton tiene 160 y Geronimo Stilton 170 títulos activos."
  },
  {
    id: 13,
    question: "Comparativa Préstamos Top 1",
    answer: "Infantil duplica a Adulto",
    citation: "Tablas 2 y 3",
    detail: "El top infantil (18.9k) tiene más del doble de préstamos que el top adulto (7.2k), mostrando mayor intensidad lectora."
  },
  {
    id: 14,
    question: "Megan Maxwell",
    answer: "Líder Novela Romántica",
    citation: "Posición #8 Global",
    detail: "Única representante pura del género romántico en el Top 10, compitiendo en un mar de thrillers."
  },
  {
    id: 15,
    question: "Conclusión Principal",
    answer: "Bibliotecas = Escaparate",
    citation: "Discusión",
    detail: "Las bibliotecas no diversifican el consumo; replican y amplifican los éxitos comerciales de las librerías."
  }
];
