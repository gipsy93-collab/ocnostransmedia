import type { Narrative, DeepDiveBox, Implicancias } from '../types/narrative';
import narrativaMultiliteracidad from './narrativas/multiliteracidad.json';
import narrativaApadrinamiento from './narrativas/apadrinamiento.json';
import narrativaPdae from './narrativas/pdae.json';
import narrativaLecturaCreacion from './narrativas/lectura_creacion.json';
import narrativaGeneroChile from './narrativas/genero_chile.json';
import narrativaComicHistoria from './narrativas/comic_historia.json';
import narrativaPreferenciasLectoras from './narrativas/preferencias_lectoras.json';
import narrativaDiversidadComics from './narrativas/diversidad_comics.json';
import narrativaIconograficos from './narrativas/iconograficos.json';
import narrativaHabitacionEllas from './narrativas/habitacion_ellas.json';
import narrativaEnsayoComic from './narrativas/ensayo_comic.json';
import narrativaBooktuber from './narrativas/booktuber.json';
import narrativaCompetenciaGlobal from './narrativas/competencia_global.json';
import narrativaComicSensibilizacion from './narrativas/comic_sensibilizacion.json';

export const NARRATIVAS: Narrative[] = [
  narrativaMultiliteracidad as Narrative,
  narrativaApadrinamiento as Narrative,
  narrativaPdae as Narrative,
  narrativaLecturaCreacion as Narrative,
  narrativaGeneroChile as Narrative,
  narrativaComicHistoria as Narrative,
  narrativaPreferenciasLectoras as Narrative,
  narrativaDiversidadComics as Narrative,
  narrativaIconograficos as Narrative,
  narrativaHabitacionEllas as Narrative,
  narrativaEnsayoComic as Narrative,
  narrativaBooktuber as Narrative,
  narrativaCompetenciaGlobal as Narrative,
  narrativaComicSensibilizacion as Narrative,
  {
    id: "manga",
    metadata: {
      title: "Educación literaria, diversidad cultural y manga",
      authors: "Jerónimo Méndez-Cabrera y Francesc Rodrigo-Segura",
      year: "2023",
      journal: "Ocnos 22(1)",
      doi: "10.18239/ocnos_22.1.335",
      gancho: "¿Alguna vez te preguntaste si un cómic japonés puede cambiar cómo tus estudiantes ven el mundo?",
      duration: "12-15 min",
      depth: "Profundización",
      color: "#88b04b",
      colorAlt: "#2a5a75",
      bg: "from-seaweed/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/manga/800/600"
    },
    blocks: {
      apertura: {
        personaje: "Prof. Jerónimo, investigador en educación literaria",
        gancho: "¿Alguna vez te preguntaste si un cómic japonés puede cambiar cómo tus estudiantes ven el mundo?",
        contexto: "Imagina un aula donde estudiantes de diferentes culturas se reúnen alrededor de una misma historia. No es una novela clásica occidental, sino 'Tomoji', un manga japonés que narra la vida de una líder espiritual budista. ¿Puede este medio, a menudo subestimado, convertirse en puente entre culturas y herramienta para formar lectores críticos?",
        deepDives: [
          {
            id: "manga-apertura-1",
            triggerLabel: "Contexto teórico: Educación literaria intercultural",
            type: "theory",
            content: "La educación literaria intercultural concibe la lectura como un diálogo capaz de asumir distintas realidades culturales de manera inclusiva. No se trata solo de 'traducir' textos, sino de crear espacios donde múltiples voces coexistan y se enriquezcan mutuamente."
          },
          {
            id: "manga-apertura-2",
            triggerLabel: "Antecedentes: Manga y narrativas transmedia",
            type: "theory",
            content: "Los personajes de manga fueron precedentes tempranos de las narrativas transmedia. El manga requiere que el lector complete lo que ocurre 'entre viñetas', fomentando una participación cognitiva activa similar a la que exigen las plataformas digitales contemporáneas."
          },
          {
            id: "manga-apertura-3",
            triggerLabel: "Brecha: ¿Por qué estudiar manga en la escuela?",
            type: "limitation",
            content: "Existe una resistencia histórica a considerar el manga como 'literatura seria'. Sin embargo, leer tebeos japoneses exige un nuevo aprendizaje: códigos visuales diferentes, sentido de lectura inverso (de derecha a izquierda), y convenciones emocionales propias de Japón. Esta complejidad es precisamente lo que lo convierte en herramienta pedagógica valiosa."
          }
        ]
      },
      conflicto: {
        problema: "El manga activa mecanismos de interpretación que afectan a los saberes culturales y enciclopédicos de manera específica. Leer tebeos japoneses exige códigos visuales diferentes, sentido de lectura inverso, y convenciones emocionales de Japón, ampliando la noción tradicional de texto.",
        porQueImporta: "En un mundo globalizado, formar lectores capaces de navegar múltiples sistemas semióticos no es opcional. El manga ofrece un espacio único donde lo visual, lo textual y lo cultural se entrelazan de manera inseparable.",
        dataPoints: [
          "El manga requiere que el lector complete lo que ocurre 'entre viñetas', fomentando participación cognitiva activa.",
          "Los personajes de manga funcionaron como precedentes de narrativas transmedia décadas antes del término."
        ],
        glossary: [
          { term: "Transmedia", definition: "Narrativa que se desarrolla a través de múltiples plataformas de manera complementaria." },
          { term: "Educación literaria intercultural", definition: "Modelo que concibe la lectura como diálogo capaz de asumir distintas realidades culturales de manera inclusiva." }
        ],
        deepDives: [
          {
            id: "manga-conflicto-1",
            triggerLabel: "Glosario ampliado: Conceptos clave",
            type: "method",
            content: "• Narratología: Estudio de las estructuras narrativas y sus componentes\n• Análisis intradiegético: Elementos que pertenecen al mundo de la historia (personajes, eventos, objetos)\n• Intertextualidad: Relación entre textos donde uno referencia o incorpora elementos del otro"
          },
          {
            id: "manga-conflicto-2",
            triggerLabel: "Estadísticas base: Recepción del manga en educación",
            type: "data",
            content: "Según Bermúdez (1995), leer manga exige un nuevo aprendizaje que amplía la noción tradicional de texto. Los estudiantes deben decodificar simultáneamente: (1) secuencia visual, (2) globos de diálogo, (3) onomatopeyas visuales, (4) convenciones emocionales japonesas (ej. líneas de velocidad, gotas de sudor)."
          },
          {
            id: "manga-conflicto-3",
            triggerLabel: "Controversia: ¿Manga como literatura?",
            type: "limitation",
            content: "El debate académico persiste: ¿debe el manga considerarse literatura o un medio distinto? Los autores argumentan que esta distinción es contraproducente. Lo relevante no es la categoría, sino la capacidad del manga para generar interpretación crítica y diálogo intercultural."
          }
        ]
      },
      viaje: {
        titulo: "Diseño del estudio: Lectura crítica y análisis narratológico",
        narrativa: "Así fue como investigamos esto: El Prof. Jerónimo se propuso analizar 'Tomoji' no como un objeto de consumo, sino como un caso de estudio único que podría fundamentar toda una propuesta didáctica. El procedimiento fue cualitativo, mediante lectura crítica y análisis textual narratológico.",
        detalles: [
          { label: "Dimensión analizada", value: "Núcleos temáticos, configuración de personajes, espacios, tiempo narrativo y elementos intradiegéticos (intertextos)." },
          { label: "Marco teórico", value: "Modelo de formación de lectores de Ballester (2015) + secuencias didácticas de Camps (2003)." },
          { label: "Obra de estudio", value: "'Tomoji' (2014), biografía ficcionada de Tomoji Uchida, ilustrada por Jirō Taniguchi." }
        ],
        limitaciones: [
          "El análisis se centra en una sola obra, limitando su generalización metodológica.",
          "La propuesta didáctica es exploratoria y requiere validación empírica en contextos de aula reales."
        ],
        reflexion: "¿Qué fortalezas y debilidades tiene analizar un solo caso para fundamentar toda una propuesta didáctica estructurada?",
        deepDives: [
          {
            id: "manga-viaje-1",
            triggerLabel: "Instrumentos: ¿Cómo se analiza un manga?",
            type: "method",
            content: "El análisis narratológico examina: (1) Estructura temporal (orden, duración, frecuencia), (2) Focalización (quién ve, quién habla), (3) Personajes (actantes, rasgos, evolución), (4) Espacios (físicos, simbólicos, sociales), (5) Intertextos (referencias a otros textos)."
          },
          {
            id: "manga-viaje-2",
            triggerLabel: "Muestra: ¿Por qué 'Tomoji'?",
            type: "method",
            content: "'Tomoji' fue seleccionada por: (1) Ser biografía ficcionada de figura espiritual real, (2) Integrar múltiples géneros (histórico, biográfico, filosófico), (3) Contener intertextos literarios y religiosos, (4) Abordar temas universales (naturaleza, género, memoria) desde perspectiva japonesa."
          },
          {
            id: "manga-viaje-3",
            triggerLabel: "Análisis: Dimensiones específicas",
            type: "method",
            content: "Dimensiones analizadas: (1) Núcleos temáticos (naturaleza, roles de género, memoria), (2) Configuración de personajes (Tomoji como líder femenina), (3) Espacios (templo, campo, ciudad), (4) Tiempo narrativo (lineal con flashbacks), (5) Intertextos (canciones populares, oraciones budistas, cuentos de Akutagawa)."
          }
        ]
      },
      revelacion: {
        titulo: "La Propuesta Didáctica: Claves metodológicas",
        narrativa: "Y aquí viene lo inesperado: El análisis reveló que 'Tomoji' no es solo una historia, sino un ecosistema pedagógico completo. La propuesta didáctica resultante se organiza en tres fases: planificación, desarrollo (con entrevistas y fichas) y evaluación formativa.",
        hallazgos: [
          { label: "Interculturalidad Crítica", value: "Fomento de ciudadanía activa abordando contraste campo-ciudad, roles de género históricos y diversidad social." },
          { label: "Fase de Desarrollo", value: "Incluye completar fichas de análisis formal del cómic, identificar géneros literarios insertados y realizar entrevistas intergeneracionales a familiares." }
        ],
        dataPoints: [
          "La evaluación propuesta es formativa, utilizando portafolios digitales y booktrailers en lugar de exámenes tradicionales.",
          "Promueve el pluralismo metodológico con talleres de creación literaria y metodologías activas."
        ],
        reflexion: "¿Qué desafío anticipas al implementar herramientas de evaluación metacognitiva (como el portafolio) en la educación literaria?",
        deepDives: [
          {
            id: "manga-revelacion-1",
            triggerLabel: "Tabla completa: Fases de la propuesta",
            type: "data",
            content: "FASE 1 - Planificación:\n• Definición de objetivos interculturales\n• Selección de fragmentos clave\n• Diseño de fichas de análisis\n\nFASE 2 - Desarrollo:\n• Lectura guiada\n• Entrevistas intergeneracionales\n• Talleres de creación\n\nFASE 3 - Evaluación:\n• Portafolio digital\n• Booktrailer\n• Autoevaluación metacognitiva"
          },
          {
            id: "manga-revelacion-2",
            triggerLabel: "Índices de evaluación formativa",
            type: "data",
            content: "Criterios de evaluación: (1) Comprensión de temas interculturales, (2) Capacidad de análisis formal del cómic, (3) Participación en entrevistas intergeneracionales, (4) Calidad reflexiva del portafolio, (5) Creatividad en el booktrailer."
          },
          {
            id: "manga-revelacion-3",
            triggerLabel: "Comparaciones: Evaluación tradicional vs. formativa",
            type: "data",
            content: "TRADICIONAL: Examen escrito, respuesta única, evaluación sumativa, rol pasivo del estudiante.\n\nFORMATIVA: Portafolio + booktrailer, múltiples respuestas, evaluación procesual, rol activo y metacognitivo del estudiante."
          }
        ]
      },
      marco: {
        titulo: "Análisis Narrativo de Tomoji: Temas e Intertextos",
        narrativa: "Para entender esto, necesitamos examinar los temas centrales de la obra. 'Tomoji' es una biografía ficcionada de Tomoji Uchida, primera líder espiritual del templo budista Shinnyo-en, ilustrada por Jirō Taniguchi.",
        detalles: [
          { label: "Temas centrales", value: "Naturaleza como trasfondo simbólico, camino vital de la mujer en el Japón tradicional, vínculos de familia y memoria." },
          { label: "Intertextos educativos", value: "Integración de canciones populares (tradición oral), oraciones budistas y cuentos literarios (ej. 'El hilo de la araña' de Akutagawa)." }
        ],
        reflexion: "¿Cómo facilita el contraste entre la filosofía oriental (taoísmo, budismo) y las tradiciones occidentales el debate en el aula?",
        deepDives: [
          {
            id: "manga-marco-1",
            triggerLabel: "Limitaciones: Una sola obra",
            type: "limitation",
            content: "El análisis se centra exclusivamente en 'Tomoji'. Si bien esta obra es paradigmática, su singularidad limita la generalización. Futuros estudios deberían analizar otras obras de manga con temática intercultural para validar los hallazgos."
          },
          {
            id: "manga-marco-2",
            triggerLabel: "Implicancias: Debate intercultural en el aula",
            type: "theory",
            content: "El contraste entre filosofía oriental (budismo, taoísmo) y tradiciones occidentales genera debates ricos sobre: (1) Conceptos de liderazgo femenino, (2) Relación humano-naturaleza, (3) Memoria intergeneracional, (4) Espiritualidad secularizada."
          },
          {
            id: "manga-marco-3",
            triggerLabel: "Futuras investigaciones: Validación empírica",
            type: "limitation",
            content: "Se requiere validación empírica en contextos de aula reales. Preguntas pendientes: ¿Cómo responden estudiantes de diferentes culturas? ¿Qué adaptaciones son necesarias según el contexto nacional? ¿Cómo medir el impacto en competencia intercultural?"
          }
        ]
      },
      nucleo: {
        pregunta: "¿Puede el manga constituir una propuesta viable de educación literaria intercultural para formar lectores críticos?",
        conclusion: "Sí. El manga presenta oportunidades únicas para una educación literaria intercultural, fomentando habilidades cognitivas y pragmáticas que optimizan la valoración de la diversidad cultural. 'Tomoji' es paradigmático al integrar literatura, historia y filosofía, facilitando la comprensión de significados compartidos entre Oriente y Occidente.",
        formalRef: "Méndez-Cabrera, J., & Rodrigo-Segura, F. (2023). Educación literaria, diversidad cultural y manga: una propuesta para la formación de lectores. Ocnos 22(1)."
      },
      juegos: [
        {
          juegoId: "snake",
          titulo: "Serpiente del Saber",
          descripcion: "Domina el artículo mientras juegas. Responde preguntas sobre Tomoji, interculturalidad y educación literaria.",
          instrucciones: "Come 3 tokens verdes para activar un token amarillo de pregunta. Responde correctamente la mayoría de preguntas amarillas de cada nivel para avanzar. 8 niveles, 3 vidas."
        },
        {
          juegoId: "quiz",
          titulo: "Quiz Retro",
          descripcion: "Pon a prueba tu conocimiento con preguntas rápidas sobre el artículo, combos y contrarreloj.",
          instrucciones: "Responde correctamente el mayor número de preguntas posible. Cada acierto suma combo y puntos. 5 rondas, ¡consigue la máxima puntuación!"
        },
        {
          juegoId: "piramide",
          titulo: "Tomoji Pyramid",
          descripcion: "Explora la pirámide de conceptos activando cubos respondiendo preguntas sobre Tomoji.",
          instrucciones: "Navega por la pirámide isométrica. Activa cada cubo respondiendo correctamente. 5 niveles de profundidad."
        }
      ],
      mapa: {
        titulo: "Mapa conceptual del artículo",
        descripcion: "Visualiza las conexiones entre los conceptos clave del estudio sobre manga y educación literaria intercultural.",
        nodos: [
          { id: "1", label: "Manga Tomoji", color: "#FFE66D" },
          { id: "2", label: "Educación literaria", color: "#66FCF1" },
          { id: "3", label: "Interculturalidad", color: "#4CAF50" },
          { id: "4", label: "Análisis temático", color: "#FF8C42" },
          { id: "5", label: "Lectura multimodal", color: "#A78BFA" },
          { id: "6", label: "Secuencia didáctica", color: "#F472B6" },
          { id: "7", label: "Narrativa visual", color: "#34D399" },
          { id: "8", label: "Competencia crítica", color: "#FF2E9A" },
        ],
        aristas: [
          { from: "1", to: "2", label: "vehículo para" },
          { from: "2", to: "3", label: "enfoque" },
          { from: "2", to: "4", label: "método" },
          { from: "2", to: "5", label: "exige" },
          { from: "2", to: "6", label: "se implementa vía" },
          { from: "1", to: "7", label: "es" },
          { from: "5", to: "7", label: "incluye" },
          { from: "3", to: "8", label: "desarrolla" },
          { from: "6", to: "8", label: "orientada a" },
        ]
      },
      reflexion: {
        questions: [
          { type: "choice", q: "¿Cuál de las siguientes NO es una clave metodológica de la propuesta didáctica presentada en el artículo?", options: ["Interculturalidad como herramienta ciudadana", "Competencia lectora multimodal", "Exclusión de soportes digitales tradicionales", "Pluralismo metodológico activo"], correct: 2 },
          { type: "open", q: "Imagina que un colega argumenta que 'el manga no es literatura seria'. Basándote en el estudio, defiende brevemente la inclusión de 'Tomoji' argumentando sobre la complejidad de su análisis temático y formal." }
        ]
      }
    }
  },
  {
    id: "pisa",
    metadata: {
      title: "Contexto sociofamiliar y rendimiento lector en PISA",
      authors: "Vázquez-Cano, De-la-Calle-Cabrera, Hervás-Gómez y López-Meneses",
      year: "2020",
      journal: "Ocnos 19(1)",
      doi: "10.18239/ocnos_2020.19.1.2122",
      gancho: "Imagina dos aulas: una en Chile, otra en Irlanda. Mismos ejercicios, resultados distintos. ¿Qué hay detrás?",
      duration: "12-15 min",
      depth: "Profundización",
      color: "#e88b8c",
      colorAlt: "#2a5a75",
      bg: "from-coral/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/pisa/800/600",
      tutor: {
        name: "Prof. Arthur Collie",
        role: "Tutor Analítico",
        image: "/assets/tutor_border_collie_1777918046770.png"
      }
    },
    tutorTexts: {
      apertura: { 
        text: "¡Saludos, investigador! Soy el Prof. Arthur. Aquí empezamos a desentrañar por qué dos aulas idénticas pueden tener resultados tan dispares. El entorno familiar oculta más secretos que un callejón londinense.",
        position: 'bottom-right'
      },
      conflicto: { 
        text: "Fíjate en estos datos. La controversia es evidente: ¿qué pesa más, el nivel económico, los libros en casa o el apoyo emocional? Es un verdadero rompecabezas.",
        position: 'bottom-left'
      },
      viaje: { 
        text: "Para resolver este misterio, el equipo examinó una muestra titánica de medio millón de estudiantes usando regresiones logísticas. Un análisis digno de los mejores sabuesos estadísticos.",
        position: 'top-right'
      },
      revelacion: { 
        text: "¡Ajá! Los resultados revelan algo curioso: el apoyo educativo formal en casa (revisar tareas) tiene un efecto inverso, mientras que el apoyo emocional es vital para los lectores óptimos.",
        position: 'bottom-right'
      },
      marco: { 
        text: "En conclusión, querido colega, las políticas educativas no pueden limitarse a la escuela. Necesitamos integrar a las familias para cerrar esta brecha estructural.",
        position: 'bottom-left'
      },
      nucleo: { 
        text: "Aquí tienes el corazón del hallazgo. No es solo qué leen los padres, sino cómo interactúan emocionalmente con sus hijos. ¡Acompáñame a la reflexión final!",
        position: 'top-left'
      },
      juego: { 
        text: "Es momento de poner a prueba tus dotes deductivas. ¡Demuestra lo que has aprendido en este desafío!",
        position: 'bottom-right'
      },
      mapa: { 
        text: "Un buen sabueso siempre mapea sus pistas. Observa cómo se conectan todas estas variables en el ecosistema del estudiante.",
        position: 'bottom-left'
      }
    },
    blocks: {
      apertura: {
        personaje: "Dra. Elena, investigadora UNED en análisis PISA",
        gancho: "Imagina dos aulas: una en Chile, otra en Irlanda. Mismos ejercicios, resultados distintos. ¿Qué hay detrás?",
        contexto: "La Dra. Elena recibe los resultados PISA 2015 y nota algo intrigante: estudiantes de 15 años de países angloparlantes superan consistentemente a sus pares hispanohablantes. Pero la verdadera pregunta no es 'quién gana', sino 'por qué'. ¿Es el idioma? ¿La economía? ¿O hay algo más profundo en el hogar que marca la diferencia?",
        deepDives: [
          {
            id: "pisa-apertura-1",
            triggerLabel: "Contexto teórico: Teoría ecológica de Bronfenbrenner",
            type: "theory",
            content: "La Teoría Ecológica de Urie Bronfenbrenner (1994) postula que el desarrollo humano está determinado por la interacción entre múltiples sistemas: microsistema (hogar, escuela), mesosistema (interacciones entre microsistemas), exosistema (contextos indirectos) y macrosistema (cultura, valores)."
          },
          {
            id: "pisa-apertura-2",
            triggerLabel: "Antecedentes: Contexto familiar y rendimiento",
            type: "theory",
            content: "Informes PISA previos indican que el contexto familiar explica más del 22% de las divergencias académicas entre países. En el caso específico de la lectura, el contexto explica una media del 13% de la varianza en los resultados (OCDE, 2010)."
          },
          {
            id: "pisa-apertura-3",
            triggerLabel: "Brecha: ¿Qué factor pesa más?",
            type: "limitation",
            content: "La literatura no coincide en qué factor del contexto pesa más: ¿los ingresos económicos? ¿El nivel educativo parental? ¿O el rol de apoyo emocional? Algunos estudios encuentran incidencia positiva, otros negativa, y algunos ninguna. Se necesita evidencia a gran escala que compare países con diferentes contextos socioculturales."
          }
        ]
      },
      conflicto: {
        problema: "La competencia lectora está fuertemente influenciada por el entorno en el que crece el estudiante. La literatura científica no coincide en qué factor del contexto sociofamiliar pesa más: los ingresos económicos, el nivel educativo parental o el rol de apoyo emocional.",
        porQueImporta: "Si podemos identificar qué aspectos del hogar realmente impactan el rendimiento lector, las políticas educativas pueden diseñarse para fortalecer esos factores, incluso en contextos de vulnerabilidad socioeconómica.",
        dataPoints: [
          "Informes PISA previos: contexto familiar explica >22% de divergencias académicas entre países.",
          "En lectura específicamente, contexto explica media del 13% de varianza en resultados."
        ],
        glossary: [
          { term: "SES (Socioeconomic Status)", definition: "Índice compuesto que resume nivel económico, educativo y ocupacional de una familia." },
          { term: "Regresión Logística Cuartílica", definition: "Técnica estadística para ver cómo variables afectan a distintos grupos de rendimiento (óptimos vs deficientes)." }
        ],
        deepDives: [
          {
            id: "pisa-conflicto-1",
            triggerLabel: "Glosario ampliado: Capital cultural y social",
            type: "theory",
            content: "• Capital Cultural (Bourdieu): Recursos simbólicos (libros, vocabulario, prácticas culturales) que las familias con mayor educación poseen y transfieren a los hijos.\n\n• Capital Social (Coleman): Redes de relaciones y normas de apoyo familiar que facilitan y catalizan el aprendizaje formal."
          },
          {
            id: "pisa-conflicto-2",
            triggerLabel: "Estadísticas base: Varianza explicada",
            type: "data",
            content: "Estudios previos reportan que el contexto sociofamiliar explica entre 14% y 33% de la varianza de los resultados académicos (Freeman y Viarengo, 2014). Esta amplia variación sugiere que el impacto del contexto depende de factores moderadores no identificados."
          },
          {
            id: "pisa-conflicto-3",
            triggerLabel: "Controversia: Resultados contradictorios",
            type: "limitation",
            content: "Algunas investigaciones encuentran incidencia positiva del SES (Hong y Ho, 2005), otras no encuentran mejora sustancial (Fan, 2001; O'Connell, 2019), y algunas incluso observan incidencia negativa (Coleman y McNeese, 2009). Casos contradictorios muestran que en familias con bajo SES, la implicación parental puede ser mayor y más positiva (Jeynes, 2007)."
          }
        ]
      },
      viaje: {
        titulo: "Diseño Cuantitativo Comparativo (PISA 2015)",
        narrativa: "Así fue como investigamos esto: La Dra. Elena y su equipo accedieron a la base de datos PISA 2015, seleccionando 30.000 estudiantes de seis países agrupados por idioma. El diseño fue cuantitativo, con modelos mixtos lineales y análisis discriminante para comparar habla hispana vs. habla inglesa.",
        detalles: [
          { label: "Muestra", value: "30.000 estudiantes (edad media = 15.92 años), seis países: España (493), Chile (447), Uruguay (435), EEUU (496), Irlanda (503), Reino Unido (509)." },
          { label: "Criterios OCDE", value: "Países miembros de OCDE y/o mayor rendimiento medio en PISA 2015." },
          { label: "Variables predictoras", value: "Nivel educativo (ISCED), Profesión (CIUO), Rol educativo parental (4 ítems: interés, apoyo esfuerzos, apoyo dificultades, animar confianza)." },
          { label: "Análisis", value: "Modelos mixtos lineales + Regresión logística cuartílica (Q1=óptimo, Q2=bueno, Q3=medio, Q4=deficiente)." }
        ],
        limitaciones: [
          "Uso exclusivo de datos secundarios, sin control sobre la recogida original.",
          "No se aborda cualitativamente el 'valor social subjetivo' que las familias otorgan a la educación (Sancho, Jornet y Perales, 2014)."
        ],
        reflexion: "¿Garantiza un instrumento estandarizado como PISA una comparación justa entre países con realidades tan diferentes como Uruguay e Irlanda?",
        deepDives: [
          {
            id: "pisa-viaje-1",
            triggerLabel: "Instrumentos: Prueba PISA 2015",
            type: "method",
            content: "PISA 2015 evaluó competencia lectora mediante 10 ítems de prueba. Las variables sociofamiliares se midieron mediante cuestionarios a estudiantes: (1) Nivel educativo parental (ISCED), (2) Profesión parental (CIUO), (3) Rol educativo (4 ítems tipo Likert recodificados a Sí/No)."
          },
          {
            id: "pisa-viaje-2",
            triggerLabel: "Muestra detallada: Distribución por país",
            type: "method",
            content: "Muestra equiparada por muestreo aleatorio (n=5000 por país). Agrupación por idioma:\n\nHABLA HISPANA: España, Chile, Uruguay\nHABLA INGLESA: EEUU, Irlanda, Reino Unido\n\nEdad media: 15.92 años (DE no reportada). 50.2% niñas."
          },
          {
            id: "pisa-viaje-3",
            triggerLabel: "Análisis estadístico: Multinivel + Cuartílica",
            type: "method",
            content: "Tres niveles de análisis:\n\n1. ANOVA: Comparación de medias por idioma\n2. Análisis discriminante: Ítems que clasifican por habla\n3. Análisis multinivel: Valor predictivo de variables sociofamiliares\n4. Regresión logística cuartílica: Predicción por perfil de rendimiento (Q1-Q4)"
          }
        ]
      },
      revelacion: {
        titulo: "Hallazgos de Rendimiento y Contexto",
        narrativa: "Y aquí viene lo inesperado: El alumnado de habla inglesa superó significativamente al hispanohablante (5.036 vs. 4.711 puntos en media). Pero la verdadera sorpresa fue que las variables socioeconómicas puras (ingresos/profesión) NO mostraron incidencia diferencial significativa. Lo que realmente pesa es el nivel educativo de los padres y su apoyo emocional.",
        hallazgos: [
          { label: "Diferencia de Idioma", value: "Habla inglesa superó a habla hispana (5.036 vs. 4.711 puntos, p=.0001)." },
          { label: "La Paradoja Económica", value: "Variables socioeconómicas puras (ingresos/profesión) NO mostraron incidencia diferencial significativa frente a nivel educativo y apoyo emocional." },
          { label: "Predicción por Contexto", value: "Contexto familiar predice ~20% del rendimiento en países hispanohablantes y ~15% en angloparlantes." }
        ],
        dataPoints: [
          "R² por cuartiles: Q1 (óptimo) español R²=.022-.032 | Q1 (óptimo) inglés R²=.077-.114",
          "Perfil de rendimiento óptimo (Q1) fuertemente ligado a niveles educativos medios-superiores y alto interés escolar parental."
        ],
        reflexion: "¿Por qué crees que el apoyo parental tiene más peso estadístico que los ingresos familiares netos?",
        deepDives: [
          {
            id: "pisa-revelacion-1",
            triggerLabel: "Tabla completa: Puntuaciones por país",
            type: "data",
            content: "PUNTUACIONES MEDIAS PISA 2015 (LECTURA):\n\nHabla Hispana:\n• España: 493\n• Chile: 447\n• Uruguay: 435\n\nHabla Inglesa:\n• EEUU: 496\n• Irlanda: 503\n• Reino Unido: 509\n\nDiferencia total: 5.036 (inglés) vs. 4.711 (español)"
          },
          {
            id: "pisa-revelacion-2",
            triggerLabel: "Índices de ajuste: Regresión por cuartiles",
            type: "data",
            content: "REGRESIÓN LOGÍSTICA CUARTÍLICA:\n\nHABLA HISPANA:\nQ1 (Óptimo): R² = .022 - .032\nQ2 (Bueno): R² = .006 - .010\nQ3 (Medio): R² = .003 - .004\nQ4 (Deficiente): R² = .010 - .015\n\nHABLA INGLESA:\nQ1 (Óptimo): R² = .077 - .114\nQ2 (Bueno): R² = .010 - .015\nQ3 (Medio): R² = .011 - .017\nQ4 (Deficiente): R² = .080 - .119"
          },
          {
            id: "pisa-revelacion-3",
            triggerLabel: "Comparaciones post-hoc: Perfiles por cuartil",
            type: "data",
            content: "PREDICTORES POR PERFIL:\n\nQ1 (Óptimo): Nivel educativo medio-superior + interés parental\nQ2 (Bueno): Nivel educativo elemental (español) + interés (inglés)\nQ3 (Medio): Solo rol educativo (español) + nivel superior madres (inglés)\nQ4 (Deficiente): Nivel educativo elemental + cualificación profesional alta (español)"
          }
        ]
      },
      marco: {
        titulo: "Marco Ecológico y Capital Cultural",
        narrativa: "Para entender esto, necesitamos el marco teórico. El estudio se sustenta en la Teoría Ecológica de Bronfenbrenner (1994) sobre cómo interactúan el microsistema (hogar) y el mesosistema (escuela), junto con los conceptos de capital cultural (Bourdieu) y capital social (Coleman).",
        detalles: [
          { label: "Capital Cultural (Bourdieu)", value: "Familias con mayor educación poseen recursos simbólicos (libros, vocabulario) que se transfieren a los hijos." },
          { label: "Capital Social (Coleman)", value: "Redes de relaciones y normas de apoyo familiar facilitan y catalizan el aprendizaje formal." },
          { label: "Implicancia de políticas", value: "Políticas deben centrarse en fomentar acompañamiento familiar en todos los estratos, no solo en transferencias económicas." }
        ],
        reflexion: "Dado que no podemos cambiar el nivel de estudios de los padres rápidamente, ¿cómo puede la escuela fomentar el capital social de familias vulnerables?",
        deepDives: [
          {
            id: "pisa-marco-1",
            triggerLabel: "Limitaciones: Valor social subjetivo no abordado",
            type: "limitation",
            content: "El estudio no abordó el 'valor social subjetivo de la educación': la percepción que alumnos, familias y profesorado tienen sobre la importancia de la educación como dimensión de desarrollo integral (Sancho, Jornet y Perales, 2014). Nuevos estudios deberían analizar cómo esta percepción intercede en la relación entre contexto y rendimiento."
          },
          {
            id: "pisa-marco-2",
            triggerLabel: "Implicancias: Políticas educativas",
            type: "theory",
            content: "Las políticas educativas deberían:\n(1) Fomentar acompañamiento familiar en todos los estratos socioeconómicos\n(2) Diseñar programas de involucramiento parental que no requieran alto nivel educativo\n(3) Reconocer que el apoyo emocional pesa más que los ingresos económicos\n(4) Considerar recursos escolares, gasto en educación y calidad del profesorado como variables complementarias"
          },
          {
            id: "pisa-marco-3",
            triggerLabel: "Futuras investigaciones: Variables pendientes",
            type: "limitation",
            content: "Se requiere ahondar en: (1) Recursos disponibles en la escuela, (2) Gasto en educación por país, (3) Número de estudiantes por clase, (4) Calidad del profesorado, (5) Valor social subjetivo de la educación. Estos factores podrían tener hondas repercusiones en el rendimiento académico."
          }
        ]
      },
      nucleo: {
        pregunta: "¿Existen diferencias en cómo incide el contexto sociofamiliar en el rendimiento lector entre países de habla inglesa y española?",
        conclusion: "El contexto sociofamiliar es un predictor robusto (15-20% de varianza). Crucialmente, la mayor incidencia proviene del nivel de estudios de los padres y del apoyo educativo explícito que brindan. Las variables estrictamente económicas no determinan diferencias significativas, indicando que las políticas deben centrarse en fomentar el acompañamiento familiar en todos los estratos.",
        formalRef: "Vázquez-Cano, E., et al. (2020). El contexto sociofamiliar y su incidencia en el rendimiento lector del estudiante en PISA. Ocnos 19(1)."
      },
      reflexion: {
        questions: [
          { type: "choice", q: "Según el estudio, ¿cuál fue el factor predictivo más fuerte y consistente del rendimiento lector en ambos grupos de países?", options: ["Nivel de ingresos familiares netos", "Profesión altamente cualificada", "Nivel educativo de los padres e implicación en el apoyo", "Número de ordenadores en el hogar"], correct: 2 },
          { type: "open", q: "Propón dos acciones concretas que un centro escolar de estrato socioeconómico bajo pueda realizar para aumentar la 'implicación y el apoyo' de las familias, sabiendo que esto impacta más que el ingreso económico." }
        ]
      }
    }
  },
  {
    id: "dislexia",
    metadata: {
      title: "Memoria de trabajo en escolares con dislexia",
      authors: "Quintero-López, Gil-Vera, Bolívar-Villamil et al.",
      year: "2022",
      journal: "Ocnos 21(2)",
      doi: "10.18239/ocnos_2022.21.1.2886",
      gancho: "Santiago tiene 9 años y se frustra cada vez que lee en voz alta. ¿Qué está pasando en su cerebro?",
      duration: "12-15 min",
      depth: "Profundización",
      color: "#9b82c3",
      colorAlt: "#2a5a75",
      bg: "from-purple-reef/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/dyslexia/800/600"
    },
    blocks: {
      apertura: {
        personaje: "Dr. Martín, neuropsicólogo clínico infantil",
        gancho: "Santiago tiene 9 años y se frustra cada vez que lee en voz alta. ¿Qué está pasando en su cerebro?",
        contexto: "El Dr. Martín recibe en su consulta a Santiago, un niño de 9 años diagnosticado con dislexia. Sus padres están desconcertados: 'Es inteligente, pero no puede retener lo que lee'. La evaluación neuropsicológica revela algo más profundo que un problema de lectura: la memoria de trabajo de Santiago falla en múltiples niveles. ¿Qué relación existe entre estos componentes de la memoria afectados?",
        deepDives: [
          {
            id: "dislexia-apertura-1",
            triggerLabel: "Contexto teórico: DSM-V y trastornos del neurodesarrollo",
            type: "theory",
            content: "Según el DSM-V (2013), los trastornos del neurodesarrollo son alteraciones clínicas de inicio temprano que se evidencian antes de la etapa escolar, afectando la esfera educativa, social y familiar. La dislexia es un trastorno específico del aprendizaje caracterizado por entorpecimiento en la adquisición de habilidades académicas en lectura."
          },
          {
            id: "dislexia-apertura-2",
            triggerLabel: "Antecedentes: Prevalencia de dislexia",
            type: "theory",
            content: "La dislexia tiene una prevalencia del 5% al 15% en la población escolar (De-La-Peña y Bernabéu, 2018; Carballal-Mariño et al., 2018). Las personas con este diagnóstico presentan inexactitud en la lectura de palabras, poca ligereza, escaso entendimiento de textos, problemas en la pronunciación y el procesamiento visual."
          },
          {
            id: "dislexia-apertura-3",
            triggerLabel: "Brecha: Escasa evidencia relacional entre componentes",
            type: "limitation",
            content: "Existe vasta gama de investigaciones que señalan alteraciones en componentes de la memoria en DLX (Brooks et al., 2011; Männel et al., 2015; Maehler et al., 2019). Sin embargo, es reducida la evidencia científica que analiza la relación existente entre estos componentes. Esta brecha motivó la pregunta de investigación."
          }
        ]
      },
      conflicto: {
        problema: "La dislexia (DLX) es un trastorno del neurodesarrollo que altera la adquisición de lectura. La memoria de trabajo (MT) es el sistema que retiene y manipula información. En DLX la MT falla, pero hay escasa evidencia científica empírica que analice las complejas relaciones estructurales entre los distintos componentes de la memoria afectados.",
        porQueImporta: "Si podemos identificar qué componentes de la memoria están relacionados entre sí en niños con dislexia, las intervenciones neuropsicológicas pueden diseñarse para estimular de manera coordinada los procesos más afectados.",
        dataPoints: [
          "Prevalencia de DLX: 5% al 15% en población escolar.",
          "Las fallas no se limitan a la lectura: también comprometen funciones ejecutivas superiores y habilidades sociales."
        ],
        glossary: [
          { term: "Memoria de Trabajo (MT)", definition: "Sistema cognitivo que permite almacenar y procesar información de forma simultánea a corto plazo." },
          { term: "Bucle articulatorio", definition: "Subcomponente de la MT que repite internamente códigos fonológicos (información verbal) para evitar que se olviden." }
        ],
        deepDives: [
          {
            id: "dislexia-conflicto-1",
            triggerLabel: "Glosario ampliado: Modelo de Baddeley",
            type: "theory",
            content: "El modelo de Baddeley postula que la MT está compuesta por:\n\n• Ejecutivo Central: Sistema atencional que controla procesos\n• Bucle Articulatorio: Mantiene información verbal mediante repetición subvocal\n• Agenda Visoespacial: Mantiene y manipula información visual y espacial\n\nEste modelo ha sido referente significativo en ámbito clínico y científico."
          },
          {
            id: "dislexia-conflicto-2",
            triggerLabel: "Estadísticas base: MT y DLX",
            type: "data",
            content: "Existe bajo rendimiento en pruebas neuropsicológicas que evalúan MT verbal en personas con DLX. Hallazgos investigativos han reportado alteraciones significativas en este proceso neurocognitivo (Wiseheart y Altmann, 2017; Canet-Juric et al., 2018)."
          },
          {
            id: "dislexia-conflicto-3",
            triggerLabel: "Controversia: Memoria viso/verbal en DLX",
            type: "limitation",
            content: "Investigaciones han concluido que los déficits en MT en pacientes con DLX se encuentran principalmente en la memoria verbal. Sin embargo, la afectación de la memoria viso/verbal es controvertida: algunos estudios la encuentran comprometida, otros no. Los autores reconocen que 'es baja la cantidad de investigaciones que validan esta afirmación' (Discusión, p. 8)."
          }
        ]
      },
      viaje: {
        titulo: "Modelado de Ecuaciones Estructurales (MEE)",
        narrativa: "Así fue como investigamos esto: El Dr. Martín y su equipo evaluaron a 130 escolares hispanohablantes con diagnóstico clínico de DLX en Medellín, Colombia. Construyeron un Modelo de Ecuaciones Estructurales (MEE) para identificar las relaciones entre MT, memoria verbal, memoria viso/verbal, nivel de conciencia, control mental y memoria semántica.",
        detalles: [
          { label: "Muestra", value: "130 escolares (82 hombres, 48 mujeres), edades 7-15 años (M=9.30), diagnóstico clínico de DLX." },
          { label: "Distribución de predisponentes", value: "17: riesgo neurológico + retrasos | 26: riesgo neurológico sin retrasos | 23: retrasos sin riesgo neurológico | 64: sin riesgo ni retrasos." },
          { label: "Instrumentos", value: "WISC-IV (dígitos y letras/números), Escala de Memoria Wechsler, Curva de Memoria Verbal (Ardila), Escala de Memoria Viso/Verbal (Ardila)." },
          { label: "Análisis", value: "MEE con librería LAVAAN en RCran 4.0.4. Pruebas de bondad de ajuste: Chi Cuadrado, CFI, TLI." }
        ],
        limitaciones: [
          "Ausencia de un grupo control neurotípico para comparar rendimientos.",
          "Limitación de generalización al provenir de un solo centro clínico en Colombia.",
          "Resultados limitados a personas con DLX de habla hispana."
        ],
        reflexion: "¿De qué sirve construir un Modelo de Ecuaciones Estructurales si no tenemos un grupo de niños sin dislexia para comparar?",
        deepDives: [
          {
            id: "dislexia-viaje-1",
            triggerLabel: "Instrumentos detallados: WISC-IV y Wechsler",
            type: "method",
            content: "WISC-IV:\n• Sucesión de letras/números: Almacena y combina varios tipos de información\n• Retención de dígitos: Examina destrezas secuenciales, organización, alerta y flexibilidad cognitiva\n\nEscala de Memoria Wechsler:\n• Información y orientación: Nivel de conciencia\n• Control Mental: Contar hacia atrás, repetir alfabeto, conteo de 3 en 3\n• Memoria lógica: Evocación inmediata de historias\n• Pares asociados: Memorizar pares de palabras"
          },
          {
            id: "dislexia-viaje-2",
            triggerLabel: "Muestra completa: Características demográficas",
            type: "method",
            content: "CARACTERÍSTICAS DE LA MUESTRA (N=130):\n\nSexo: 82 hombres (63%), 48 mujeres (37%)\nEdad: M=9.30, DE=2.18 (rango 7-15 años)\nLateralidad: 117 diestros (90%), 12 zurdos (9%), 1 ambidiestro (1%)\n\nRIESGO NEUROLÓGICO:\n• Con riesgo: 42 pacientes (32%)\n• Sin riesgo: 88 pacientes (68%)\n\nRETRASOS EN DESARROLLO:\n• Con retrasos: 39 pacientes (30%)\n• Sin retrasos: 91 pacientes (70%)"
          },
          {
            id: "dislexia-viaje-3",
            triggerLabel: "Análisis estadístico: MEE con LAVAAN",
            type: "method",
            content: "ANÁLISIS DE DATOS:\n\nSoftware: RCran 4.0.4 con librería LAVAAN\nConvergencia: 95 iteraciones\nGrados de libertad: 30\nChi-cuadrado: >503 (modelo adecuado)\n\nÍndices de ajuste:\n• CFI = 0.856 (>0.5 según autores)\n• TLI = 0.737 (>0.5 según autores)\n• Valor p de indicadores: significativo\n\nNota: Literatura espera ≥0.90 para 'buen ajuste'. Los autores usan umbral >0.5."
          }
        ]
      },
      revelacion: {
        titulo: "Evidencia Estadística Relacional",
        narrativa: "Y aquí viene lo inesperado: El MEE confirmó todas las hipótesis. La memoria de trabajo mostró una covarianza muy fuerte (0.72) con alteraciones en la memoria verbal. Pero también reveló algo más: el control mental covarió (0.55) con deficiencias en la memoria semántica, demostrando afectación ejecutiva generalizada.",
        hallazgos: [
          { label: "Covarianza MT→Memoria Verbal", value: "0.72 (p=.000). A menor funcionalidad de la MT, mayores alteraciones de la memoria verbal." },
          { label: "Covarianza MT→Memoria Viso/Verbal", value: "0.51 (p=.000). A menor funcionalidad de la MT, mayores deficiencias en la memoria viso/verbal." },
          { label: "Covarianza Conciencia→Control Mental", value: "0.55 (p=.000). A mayores alteraciones en el nivel de conciencia, menor funcionalidad en el control mental." },
          { label: "Covarianza Control→Memoria Semántica", value: "0.55 (p=.000). A menor control mental, mayores deficiencias en la memoria semántica." }
        ],
        dataPoints: [
          "Índices de ajuste del MEE: CFI=0.856, TLI=0.737 (autores usan umbral >0.5; literatura espera ≥0.90 para 'buen ajuste').",
          "Controversia viso/verbal: 'Es baja la cantidad de investigaciones que validan esta afirmación' (Discusión, p. 8)."
        ],
        reflexion: "Teniendo en cuenta que el déficit verbal correlaciona al 0.72, ¿cómo cambiarías tu forma de dar instrucciones en clase a un niño con dislexia?",
        deepDives: [
          {
            id: "dislexia-revelacion-1",
            triggerLabel: "Tabla completa: Hipótesis relacionales",
            type: "data",
            content: "HIPÓTESIS Y RESULTADOS:\n\nH1: Menor MT → Mayores alteraciones memoria verbal\n    Covarianza: 0.72 | p=0.000 | ACEPTADA\n\nH2: Menor MT → Mayores deficiencias memoria viso/verbal\n    Covarianza: 0.51 | p=0.000 | ACEPTADA\n\nH3: Mayores alteraciones conciencia → Menor control mental\n    Covarianza: 0.55 | p=0.000 | ACEPTADA\n\nH4: Menor control mental → Mayores deficiencias memoria semántica\n    Covarianza: 0.55 | p=0.000 | ACEPTADA"
          },
          {
            id: "dislexia-revelacion-2",
            triggerLabel: "Índices de ajuste: Interpretación",
            type: "data",
            content: "INTERPRETACIÓN DE ÍNDICES:\n\nCFI (Comparative Fit Index) = 0.856\n• Autores: >0.5 = pertinente\n• Literatura estándar: ≥0.90 = buen ajuste, ≥0.95 = excelente\n\nTLI (Tucker-Lewis Index) = 0.737\n• Autores: >0.5 = pertinente\n• Literatura estándar: ≥0.90 = buen ajuste\n\nChi-cuadrado = >503 (gl=30)\n• Valor alto indica modelo adecuado en este contexto\n\nTodos los valores de covarianza fueron positivos, aceptando las hipótesis planteadas."
          },
          {
            id: "dislexia-revelacion-3",
            triggerLabel: "Diagrama ASCII: Modelo de Ecuaciones Estructurales",
            type: "data",
            content: "┌──────────────────────────────────────────────┐\n│  MEE: Memoria de Trabajo en Dislexia         │\n├──────────────────────────────────────────────┤\n│  Memoria de Trabajo                          │\n│         ↓ (covarianza 0.72, p=.000)         │\n│  Memoria Verbal (Bucle Articulatorio)        │\n│         ↓ (covarianza 0.51, p=.000)         │\n│  Memoria Viso/Verbal                         │\n│                                              │\n│  Nivel de Conciencia                         │\n│         ↓ (covarianza 0.55, p=.000)         │\n│  Control Mental                              │\n│         ↓ (covarianza 0.55, p=.000)         │\n│  Memoria Semántica                           │\n└──────────────────────────────────────────────┘\nÍndices de ajuste: CFI=0.856, TLI=0.737"
          }
        ]
      },
      marco: {
        titulo: "El Modelo de Baddeley en el Aula",
        narrativa: "Para entender esto, necesitamos el marco teórico. El artículo se inscribe epistemológicamente en el Modelo de Memoria de Trabajo de Baddeley, diferenciando el Ejecutivo Central, la Agenda Visoespacial y el Bucle Articulatorio.",
        detalles: [
          { label: "Bucle Articulatorio", value: "Su disfunción explica la incapacidad del niño con DLX para retener la forma sonora de las palabras mientras decodifica." },
          { label: "Memoria Viso/Verbal", value: "Es el aspecto más controvertido; los autores encuentran afectación clínica, aunque la literatura internacional previa aún debate su grado de compromiso." },
          { label: "Control Mental", value: "Escolares con DLX presentan fallas en tareas que miden control mental, poseen menor capacidad para focalizar la atención y fallas en control inhibitorio." }
        ],
        reflexion: "¿Es adecuado seguir utilizando modelos cognitivos puros (como el de Baddeley de los años 70) para explicar trastornos neurobiológicos modernos?",
        deepDives: [
          {
            id: "dislexia-marco-1",
            triggerLabel: "Limitaciones: Solo habla hispana",
            type: "limitation",
            content: "Los resultados de esta investigación se limitan a personas con DLX de habla hispana. La generalización a otros idiomas y sistemas ortográficos requiere validación cruzada. El español tiene características fonológicas y ortográficas distintas al inglés que podrían moderar las relaciones encontradas."
          },
          {
            id: "dislexia-marco-2",
            triggerLabel: "Implicancias: Estimulación neuropsicológica",
            type: "theory",
            content: "Se concluye que las personas con DLX presentan deficiencias en diversos dominios de la memoria. La estimulación neuropsicológica de este proceso es fundamental para garantizar el progreso escolar de la población con este trastorno del neurodesarrollo. Intervenciones deberían targeting: (1) Bucle articulatorio, (2) Control inhibitorio, (3) Memoria semántica."
          },
          {
            id: "dislexia-marco-3",
            triggerLabel: "Futuras investigaciones: Memoria viso/verbal",
            type: "limitation",
            content: "Se sugiere realizar estudios que evalúen la memoria viso/verbal en las personas con DLX, ya que la evidencia científica no es contundente. También es importante que la psicología y neuropsicología sigan ahondando en la relación entre MT y DLX para favorecer los procesos de intervención especializados de esta población."
          }
        ]
      },
      nucleo: {
        pregunta: "¿Cuál es la relación estructural entre los componentes de la memoria en escolares hispanohablantes con dislexia?",
        conclusion: "El Modelo de Ecuaciones Estructurales confirma que la MT se encuentra significativamente afectada, determinando de forma directa un deterioro en la memoria verbal (bucle articulatorio) y en el control mental (ejecutivo central). Este déficit relacional generalizado provoca aprendizaje lento, problemas en retención de instrucciones y fallos crónicos en el acceso al léxico semántico.",
        formalRef: "Quintero-López, C., et al. (2022). Memoria de trabajo en escolares con dislexia. Un análisis relacional. Ocnos 21(2)."
      },
      reflexion: {
        questions: [
          { type: "choice", q: "Según el análisis relacional del estudio, la afectación de la memoria de trabajo en la dislexia recae de forma más contundente sobre:", options: ["La memoria motora y procedimental a largo plazo", "El bucle articulatorio (memoria verbal) y el control mental", "Exclusivamente la memoria visual periférica", "La atención sostenida pero no la memoria operativa"], correct: 1 },
          { type: "open", q: "Sabiendo que un niño con dislexia presentará problemas de 'bucle articulatorio', diseña una instrucción paso a paso para una tarea escolar de modo que NO sature su memoria de trabajo." }
        ]
      }
    }
  },
  {
    id: "multiliteracidad",
    metadata: {
      title: "Multiliteracidad en la asignatura de Lenguaje",
      authors: "Gabriela Báez-Bargellini & Alejandra Meneses-Arévalo",
      year: "2023",
      journal: "Ocnos 22(2)",
      doi: "10.18239/ocnos_2023.22.2.346",
      gancho: "Tus estudiantes crean memes increíbles, pero se bloquean con el ensayo. ¿La escuela está desconectada de su mundo?",
      duration: "12-15 min",
      depth: "Profundización",
      color: "#f4d068",
      colorAlt: "#2a5a75",
      bg: "from-sand/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/literacy/800/600"
    },
    blocks: {
      apertura: {
        personaje: "Profa. Gabriela, investigadora UC Chile en multiliteracidad",
        gancho: "Tus estudiantes crean memes increíbles, pero se bloquean con el ensayo. ¿La escuela está desconectada de su mundo?",
        contexto: "La Profa. Gabriela observa una escena cotidiana en aulas de Lenguaje: estudiantes que producen contenido multimodal complejo en sus dispositivos (memes, reels, TikToks) se bloquean cuando deben escribir un ensayo académico. ¿Es esto pereza? ¿Incapacidad? O, ¿la escuela está evaluando competencias que ya no corresponden al ecosistema comunicativo real de los jóvenes?",
        deepDives: [
          {
            id: "multiliteracidad-apertura-1",
            triggerLabel: "Contexto teórico: New London Group (1996)",
            type: "theory",
            content: "El manifiesto del New London Group (1996) estableció la imposibilidad de enseñar Lengua obviando la globalización y la revolución de las TIC. Postuló que la noción tradicional de 'alfabetización' debe ampliarse para incluir múltiples modos semióticos: textual, visual, de audio, espacial y gestual."
          },
          {
            id: "multiliteracidad-apertura-2",
            triggerLabel: "Antecedentes: Disonancia curricular",
            type: "theory",
            content: "Existe una evidente disonancia cognitiva y curricular: mientras la escuela evalúa competencias literarias monolingües, impresas y formales, los estudiantes habitan ecosistemas multilingües, multiculturales y profundamente multimodales."
          },
          {
            id: "multiliteracidad-apertura-3",
            triggerLabel: "Brecha: Teoría vs. evidencia empírica",
            type: "limitation",
            content: "A pesar del consenso teórico sobre la urgencia del cambio pedagógico, abundan las teorías pero escasean los estudios empíricos documentados en aulas de secundaria. ¿Cómo ha respondido la investigación educativa a esta brecha metodológica en 24 años de producción académica?"
          }
        ]
      },
      conflicto: {
        problema: "Existe una evidente disonancia cognitiva y curricular: mientras la escuela evalúa competencias literarias monolingües, impresas y formales, los estudiantes habitan ecosistemas multilingües, multiculturales y profundamente multimodales. ¿Cómo ha respondido la investigación educativa a esta brecha metodológica?",
        porQueImporta: "Si la investigación no documenta prácticas exitosas de multiliteracidad en aulas reales, los docentes no tienen evidencia para transformar sus prácticas. La teoría sola no cambia el aula.",
        dataPoints: [
          "A pesar del consenso teórico, abundan las teorías pero escasean los estudios empíricos en aulas de secundaria.",
          "Predominan inercias didácticas basadas en descifrar el código escrito verbal excluyendo lo visual y gestual."
        ],
        glossary: [
          { term: "Multiliteracidad", definition: "Concepto que amplía la noción tradicional de leer/escribir hacia la interpretación y producción simultánea de significados textuales, visuales, de audio, espaciales y gestuales." },
          { term: "Modo Semiótico", definition: "Sistema de recursos organizado culturalmente para crear significados (ej: lenguaje, imagen, música)." }
        ],
        deepDives: [
          {
            id: "multiliteracidad-conflicto-1",
            triggerLabel: "Glosario ampliado: Conceptos clave",
            type: "theory",
            content: "• Multimodalidad: Integración de múltiples modos semióticos en un texto\n• Agency (agencia): Capacidad del estudiante para actuar como productor crítico de significados\n• Literacidad oculta: Competencias comunicativas avanzadas que estudiantes con rezago escrito formal muestran en entornos multimodales\n• Metalenguaje multimodal: Conceptos técnicos de composición de imagen, peso visual y narrativa espacial"
          },
          {
            id: "multiliteracidad-conflicto-2",
            triggerLabel: "Estadísticas base: Producción académica",
            type: "data",
            content: "De 26 estudios empíricos analizados (1996-2020), el 73% (19 artículos) fue publicado después de 2015. Esto sugiere que la investigación empírica en multiliteracidad es un campo emergente, con aceleración reciente pero todavía incipiente en volumen absoluto."
          },
          {
            id: "multiliteracidad-conflicto-3",
            triggerLabel: "Controversia: ¿Multiliteracidad o tecnología?",
            type: "limitation",
            content: "Los filtros de búsqueda excluyeron estudios 'exclusivamente tecnológicos sin anclaje de Lenguaje'. Esta decisión es crucial: la multiliteracidad no es sobre usar dispositivos, sino sobre transformar la pedagogía del Lenguaje. Muchos estudios confundieron integración tecnológica con multiliteracidad."
          }
        ]
      },
      viaje: {
        titulo: "Revisión Sistemática de la Literatura (RSL)",
        narrativa: "Así fue como investigamos esto: La Profa. Gabriela realizó una Revisión Sistemática en Web of Science, focalizada exclusivamente en artículos empíricos ejecutados dentro del aula formal de educación básica y media, publicados en inglés entre 1996 y 2020. El objetivo: identificar qué se ha implementado realmente, no solo qué se ha teorizado.",
        detalles: [
          { label: "Filtros de búsqueda", value: "Uso explícito de 'multiliteracies', contexto escolar comprobable, rechazo de estudios exclusivamente tecnológicos sin anclaje de Lenguaje." },
          { label: "Muestra final", value: "26 estudios, con 73% (19 artículos) publicados después de 2015, centralizados en EEUU, Australia y Canadá." },
          { label: "Análisis", value: "Síntesis cualitativa identificando corrientes temáticas dominantes y lecciones empíricas transversales." }
        ],
        limitaciones: [
          "Exclusión de estudios publicados en idiomas diferentes al inglés o indexados fuera de WoS, invisibilizando el contexto latinoamericano.",
          "Carencia crítica de investigaciones con diseños experimentales y validación cuantitativa de impacto en el aprendizaje."
        ],
        reflexion: "La literatura global empírica sobre esto se produce casi exclusivamente en países anglosajones de altos ingresos. ¿Qué sesgos pedagógicos puede generar esto al adaptar sus modelos?",
        deepDives: [
          {
            id: "multiliteracidad-viaje-1",
            triggerLabel: "Instrumentos: Criterios de inclusión/exclusión",
            type: "method",
            content: "CRITERIOS DE INCLUSIÓN:\n• Uso explícito del término 'multiliteracies'\n• Contexto escolar comprobable (aula formal de educación básica/media)\n• Anclaje en asignatura de Lenguaje\n• Publicado en inglés entre 1996-2020\n\nCRITERIOS DE EXCLUSIÓN:\n• Estudios exclusivamente tecnológicos sin pedagogía de Lenguaje\n• Contextos no escolares (bibliotecas, museos, ONGs)\n• Publicados en otros idiomas\n• Indexados fuera de Web of Science"
          },
          {
            id: "multiliteracidad-viaje-2",
            triggerLabel: "Muestra detallada: Distribución geográfica y temporal",
            type: "method",
            content: "DISTRIBUCIÓN GEOGRÁFICA:\n• EEUU: Mayor concentración\n• Australia: Segunda posición\n• Canadá: Tercera posición\n• Otros países angloparlantes: Minoría\n• Latinoamérica: 0 estudios (excluidos por idioma/indexación)\n\nDISTRIBUCIÓN TEMPORAL:\n• 1996-2014: 7 estudios (27%)\n• 2015-2020: 19 estudios (73%)"
          },
          {
            id: "multiliteracidad-viaje-3",
            triggerLabel: "Análisis: Síntesis cualitativa de corrientes",
            type: "method",
            content: "ANÁLISIS DE DATOS:\n\n1. Codificación abierta de cada estudio\n2. Identificación de categorías emergentes\n3. Agrupación en corrientes temáticas\n4. Síntesis de lecciones empíricas transversales\n\nCORRIENTES IDENTIFICADAS:\n• Multimodalidad (69% de estudios)\n• Pedagogía de multiliteracidad\n• Diversidad cultural y empoderamiento identitario"
          }
        ]
      },
      revelacion: {
        titulo: "Síntesis Empírica: Tres Corrientes Dominantes",
        narrativa: "Y aquí viene lo inesperado: La revisión identificó tres bloques empíricos dominantes. El 69% de los estudios aborda la producción y consumo crítico de géneros multimodales. Pero lo más revelador fue el fenómeno de 'literacidad oculta': estudiantes con rezago escrito formal mostraban altísimas competencias investigativas en entornos multimodales.",
        hallazgos: [
          { label: "Hegemonía Multimodal (69%)", value: "La gran mayoría de estudios aborda producción y consumo crítico de géneros que exigen descifrar relaciones complejas imagen-texto-sonido." },
          { label: "Apalancamiento de la Diversidad", value: "El enfoque se ha utilizado exitosamente para visibilizar y empoderar identitariamente a minorías migrantes y estudiantes de bajo rendimiento." },
          { label: "Literacidad Oculta", value: "Estudiantes con rezago escrito formal mostraban altísimas competencias investigativas y deductivas en entornos multimodales." }
        ],
        dataPoints: [
          "La integración de formatos multimodales rompe jerarquías verticales del aula, generando liderazgos horizontales y aumentando dramáticamente la motivación ('agency').",
          "Se detectó fenómeno de 'literacidad oculta' donde estudiantes con rezago escrito formal mostraban competencias avanzadas en multimodalidad."
        ],
        reflexion: "Si la multiliteracidad redistribuye el poder y visibiliza competencias 'ocultas' del estudiante que fracasa en el sistema tradicional, ¿la resistencia docente actual es un problema técnico o político?",
        deepDives: [
          {
            id: "multiliteracidad-revelacion-1",
            triggerLabel: "Tabla completa: Tres corrientes empíricas",
            type: "data",
            content: "CORRIENTES EMPÍRICAS DOMINANTES:\n\n1. MULTIMODALIDAD (69% de estudios)\n   • Producción de géneros multimodales\n   • Consumo crítico de imagen-texto-sonido\n   • Metalenguaje de composición visual\n\n2. PEDAGOGÍA DE MULTILITERACIDAD\n   • Implementación de las 4 dimensiones del NLG\n   • Práctica situada, instrucción explícita, marco crítico, práctica transformadora\n\n3. DIVERSIDAD Y EMPODERAMIENTO\n   • Visibilización de minorías migrantes\n   • Estudiantes de bajo rendimiento\n   • Identidades culturales híbridas"
          },
          {
            id: "multiliteracidad-revelacion-2",
            triggerLabel: "Índices de impacto: Cambios en dinámica de aula",
            type: "data",
            content: "IMPACTO TRANSVERSAL REPORTADO:\n\n• Redistribución del poder en el aula\n• Emergencia de liderazgos horizontales\n• Aumento dramático de motivación y agency\n• Visibilización de competencias 'ocultas'\n• Ruptura de jerarquías verticales tradicionales\n\nNota: Ningún estudio reportó incremento en pruebas estandarizadas nacionales. El impacto se mide en dimensiones cualitativas, no cuantitativas estandarizadas."
          },
          {
            id: "multiliteracidad-revelacion-3",
            triggerLabel: "Comparaciones: Aula tradicional vs. multiliteracidad",
            type: "data",
            content: "AULA TRADICIONAL:\n• Jerarquía vertical (docente → estudiante)\n• Texto impreso como medio dominante\n• Competencia definida por norma escrita\n• Evaluación sumativa estandarizada\n\nAULA MULTILITERACIDAD:\n• Liderazgos horizontales\n• Múltiples modos semióticos\n• Competencia definida por eficacia comunicativa\n• Evaluación formativa y auténtica\n• Agency estudiantil aumentada"
          }
        ]
      },
      marco: {
        titulo: "El Nuevo Paradigma (New London Group)",
        narrativa: "Para entender esto, necesitamos el marco teórico. El andamiaje conceptual emana del manifiesto del New London Group (1996), que estableció la imposibilidad de enseñar Lengua obviando la globalización y la revolución de las TIC.",
        detalles: [
          { label: "Las Cuatro Dimensiones", value: "El modelo exige transitar secuencialmente por: 1) Práctica Situada, 2) Instrucción Explícita, 3) Marco Crítico Sociocultural, y 4) Práctica Transformadora." },
          { label: "Metalenguaje Multimodal", value: "Obliga al docente a enseñar a sus alumnos conceptos técnicos de composición de imagen, peso visual y narrativa espacial, no solo gramática y sintaxis." },
          { label: "Disrupción ecológica", value: "La adopción de prácticas de multiliteracidad disrumpe la ecología tradicional del aula, promoviendo espacios más democráticos, inclusivos y participativos." }
        ],
        reflexion: "¿Poseen hoy los profesores de Lengua de nuestra región el dominio disciplinar necesario sobre lenguaje audiovisual e interactivo para ejecutar este currículum?",
        deepDives: [
          {
            id: "multiliteracidad-marco-1",
            triggerLabel: "Limitaciones: Exclusión de Latinoamérica",
            type: "limitation",
            content: "La revisión excluyó estudios publicados en idiomas diferentes al inglés o indexados fuera de WoS. Esto invisibiliza completamente el contexto latinoamericano. No sabemos si hay investigación empírica en multiliteracidad en español, portugués o lenguas indígenas. Esta es una limitación geopolítica del campo."
          },
          {
            id: "multiliteracidad-marco-2",
            triggerLabel: "Implicancias: Formación docente",
            type: "theory",
            content: "Los profesores de Lengua requieren formación en:\n(1) Lenguaje audiovisual e interactivo\n(2) Composición de imagen y peso visual\n(3) Narrativa espacial y gestual\n(4) Metalenguaje multimodal\n\nSin este dominio disciplinar, no pueden ejecutar el currículum de multiliteracidad. La formación docente actual está desactualizada."
          },
          {
            id: "multiliteracidad-marco-3",
            triggerLabel: "Futuras investigaciones: Validación cuantitativa",
            type: "limitation",
            content: "Se detectó carencia crítica de investigaciones con diseños experimentales y validación cuantitativa de impacto en el aprendizaje. Futuros estudios deberían:\n(1) Incluir contextos latinoamericanos\n(2) Diseñar experimentos controlados\n(3) Validar impacto en aprendizaje medible\n(4) Explorar resistencia docente (¿técnica o política?)"
          }
        ]
      },
      nucleo: {
        pregunta: "¿Qué áreas de la multiliteracidad se han implementado empíricamente en aulas de Lenguaje y qué lecciones se han extraído globalmente?",
        conclusion: "La investigación se ha concentrado en tres ejes: la producción de géneros multimodales, el marco pedagógico como herramienta analítica, y el rescate de la diversidad cultural. La lección empírica más contundente es que la adopción de prácticas de multiliteracidad disrumpe la ecología tradicional del aula, promoviendo espacios profundamente más democráticos, inclusivos y participativos, donde los estudiantes asumen agencia crítica sobre su propio discurso identitario.",
        formalRef: "Báez-Bargellini, G., & Meneses-Arévalo, A. (2023). Multiliteracidad en la asignatura de Lenguaje. Revisión sistemática de la literatura entre 1996 y 2020. Ocnos 22(2)."
      },
      reflexion: {
        questions: [
          { type: "choice", q: "Según la revisión empírica sistematizada en el artículo, ¿qué impacto transversal provocó la adopción del marco de multiliteracidad en la dinámica de las aulas analizadas?", options: ["Incremento estadístico comprobado en pruebas estandarizadas nacionales", "Cambios en las dinámicas de poder, liderazgos horizontales y mayor motivación (agency)", "Rechazo de los estudiantes de minorías culturales por disonancia cognitiva", "Sustitución absoluta del texto impreso por dispositivos electrónicos"], correct: 1 },
          { type: "open", q: "Diseña un escenario evaluativo para el área de Lenguaje donde el producto final NO sea un texto escrito secuencial, pero que exija un altísimo grado de competencia comunicativa argumentativa." }
        ]
      }
    }
  },
  {
    id: "escritura",
    metadata: {
      title: "Procesos cognitivos y expresión escrita infantil",
      authors: "Cecilia B. Moreno, Celina Korzeniowski, Adriana Espósito",
      year: "2022",
      journal: "Ocnos 21(2)",
      doi: "10.18239/ocnos_2022.21.2.2839",
      gancho: "Dos niños, misma consigna. Uno escribe dos párrafos fluidos, el otro se atasca en la primera oración. ¿Qué los diferencia?",
      duration: "12-15 min",
      depth: "Profundización",
      color: "#88c9d4",
      colorAlt: "#2a5a75",
      bg: "from-ocean-light/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/writing/800/600"
    },
    blocks: {
      apertura: {
        personaje: "Cecilia, investigadora en neurocognición de escritura (Mendoza, Argentina)",
        gancho: "Dos niños, misma consigna. Uno escribe dos párrafos fluidos, el otro se atasca en la primera oración. ¿Qué los diferencia?",
        contexto: "Cecilia observa en las aulas de Mendoza una escena repetida: dos niños de la misma edad, misma escuela, misma consigna. Uno produce dos párrafos fluidos con ideas organizadas. El otro se atasca en la primera oración, borra, rehace, se frustra. ¿Es cuestión de 'talento'? ¿De práctica? Los datos revelan algo más profundo: funciones cerebrales específicas predicen estadísticamente la calidad del texto.",
        deepDives: [
          {
            id: "escritura-apertura-1",
            triggerLabel: "Contexto teórico: Crisis latinoamericana en escritura",
            type: "theory",
            content: "Latinoamérica atraviesa una profunda crisis en la producción de textos. En Argentina, el 50% de los niños presenta bajo desempeño constructivo textual (Ministerio de Educación de la Nación Argentina, 2018). Porcentajes similares se observan en otros países latinoamericanos."
          },
          {
            id: "escritura-apertura-2",
            triggerLabel: "Antecedentes: UNESCO y competencias escritoras",
            type: "theory",
            content: "UNESCO revela que la niñez latinoamericana exhibe niveles por debajo de la media mundial no solo en ortografía, sino críticamente en los procesos superiores: textualización, planificación y revisión sistémica (UNESCO, 2020)."
          },
          {
            id: "escritura-apertura-3",
            triggerLabel: "Brecha: Enfoque lingüístico vs. neurocognitivo",
            type: "limitation",
            content: "A nivel investigativo regional se asume la escritura casi siempre desde lo lingüístico o didáctico, soslayando la abrumadora complejidad ejecutiva e interdependiente que requiere a nivel neurocognitivo en el cerebro infantil. Esta brecha motivó el estudio."
          }
        ]
      },
      conflicto: {
        problema: "Latinoamérica atraviesa una profunda crisis en la producción de textos. En Argentina, el 50% de los niños presenta bajo desempeño constructivo textual. A nivel investigativo regional se asume la escritura casi siempre desde lo lingüístico o didáctico, soslayando la complejidad neurocognitiva que requiere.",
        porQueImporta: "Si podemos identificar qué procesos cognitivos predicen la expresión escrita, los programas de enseñanza pueden diseñarse para entrenar conjuntamente las habilidades escritoras específicas y fortalecer los recursos cognitivos de los aprendices.",
        dataPoints: [
          "UNESCO: niñez latinoamericana por debajo de media mundial en textualización, planificación y revisión.",
          "Escribir demanda altísimo reclutamiento de recursos de 'alto orden' que saturan los canales de procesamiento del aprendiz."
        ],
        glossary: [
          { term: "Funciones Ejecutivas (FE)", definition: "Complejo sistema de procesos neurocognitivos directivos que organizan y autorregulan el pensamiento, el foco atencional y el comportamiento estratégico." },
          { term: "Regresión Lineal Jerárquica", definition: "Técnica estadística predictiva que permite evaluar el impacto independiente de variables ingresándolas al modelo por pasos teóricamente sustentados." }
        ],
        deepDives: [
          {
            id: "escritura-conflicto-1",
            triggerLabel: "Glosario ampliado: Modelo de Flower y Hayes",
            type: "theory",
            content: "El modelo cognitivo de Flower y Hayes (1981) define la escritura como actividad en la que participan:\n\n• Planificación: Generar esquemas previos, establecer metas y organización\n• Transcripción: Traducir ideas en texto escrito (aspectos motrices, léxicos, sintácticos)\n• Revisión: Relectura y reescritura, identificando y corrigiendo errores\n\nEstos procesos compiten por un ancho de banda mental limitado."
          },
          {
            id: "escritura-conflicto-2",
            triggerLabel: "Estadísticas base: Crisis en Argentina",
            type: "data",
            content: "DATOS DE ARGENTINA:\n• 50% de niños de primaria: bajo desempeño constructivo textual (Ministerio de Educación, 2018)\n• 30%: baja competencia para utilizar convenciones y recursos lingüísticos (Ministerio de Educación, 2017)\n\nDATOS LATINOAMÉRICA:\n• Estudiantes por debajo de promedio mundial en ortografía, textualización, planificación y revisión (UNESCO, 2020)"
          },
          {
            id: "escritura-conflicto-3",
            triggerLabel: "Controversia: ¿Atención o percepción?",
            type: "limitation",
            content: "La teoría clásica postula que la atención es central para la escritura. Sin embargo, este estudio encontró que la eficacia atencional NO correlacionó con el desempeño escritor. En cambio, la percepción visoespacial sí fue predictora. Esto cuestiona cómo evaluamos el fenómeno."
          }
        ]
      },
      viaje: {
        titulo: "Modelado Predictivo y Evaluación Baterizada",
        narrativa: "Así fue como investigamos esto: Cecilia y su equipo evaluaron a 168 niños de 8 a 11 años de escuelas públicas de Mendoza, Argentina. Aplicaron una batería de pruebas cognitivas y de escritura, luego construyeron un modelo de regresión lineal jerárquica para identificar predictores.",
        detalles: [
          { label: "Muestra", value: "168 niños (84 varones, 84 mujeres), 8-11 años (M=9.65), 3ro-5to grado, escuelas públicas urbanas de Mendoza." },
          { label: "Batería de escritura", value: "Woodcock-Muñoz III: Muestras de Redacción (MtrRed) + Fluidez (FluEscr) → Cluster Expresión Escrita (ExpEscr)." },
          { label: "Tests cognitivos", value: "EMAV (atención), Porteus (planificación), Rey (percepción visoespacial), Woodcock-Muñoz (MT y MLP)." },
          { label: "Versiones EMAV", value: "EMAV-1: 6-9 años | EMAV-2: 10+ años | Consistencia: rho=0.89 (n=5779)." },
          { label: "Análisis", value: "Regresión lineal jerárquica por pasos: (1) Planificación, (2) MT, (3) MLP, (4) Percepción visoespacial." }
        ],
        limitaciones: [
          "Carencia de baremación local estrictamente validada, requiriendo uso de distribución intra-muestral.",
          "La variable 'planificación' se infirió a través de laberintos espaciales, no de una tarea directa de planificación argumental o léxica real."
        ],
        reflexion: "Evaluar la 'capacidad de planificar un texto' basándose en 'cómo resuelve un niño un laberinto en un papel' presenta problemas evidentes de validez ecológica. ¿Por qué crees que los investigadores optaron por esto?",
        deepDives: [
          {
            id: "escritura-viaje-1",
            triggerLabel: "Instrumentos detallados: Woodcock-Muñoz III",
            type: "method",
            content: "MUESTRAS DE REDACCIÓN (MtrRed):\n• 30 ítems de dificultad creciente\n• Estímulos: imágenes, conjunto de palabras, párrafo incompleto\n• Puntaje: 0-2 por ítem (total posible: 60)\n• Criterios: estructura sintáctica, coherencia, cohesión, calidad del texto\n\nFLUIDEZ EN ESCRITURA (FluEscr):\n• 40 ítems, 7 minutos\n• Escribir oración con 3 palabras dadas + imagen\n• Criterio: oraciones completas, claras, coherentes\n\nCLUSTER EXPRESIÓN ESCRITA (ExpEscr):\n• Combina MtrRed + FluEscr\n• Tipificado para comparar rendimiento"
          },
          {
            id: "escritura-viaje-2",
            triggerLabel: "Muestra completa: Distribución por grado",
            type: "method",
            content: "DISTRIBUCIÓN POR GRADO:\n\n3er Grado (n=56):\n• Edad: M=8.65 (estimado)\n• MtrRed: M=19.78, DE=5.44\n• FluEscr: M=7.05, DE=4.86\n\n4to Grado (n=59):\n• Edad: M=9.65 (estimado)\n• MtrRed: M=17.87, DE=5.46\n• FluEscr: M=10.20, DE=4.84\n\n5to Grado (n=53):\n• Edad: M=10.65 (estimado)\n• MtrRed: M=19.88, DE=6.03\n• FluEscr: M=11.70, DE=5.01"
          },
          {
            id: "escritura-viaje-3",
            triggerLabel: "Análisis estadístico: Regresión jerárquica",
            type: "method",
            content: "ANÁLISIS DE DATOS:\n\nSoftware: SPSS-IBM v25\n\nPasos de regresión:\n1. Planificación (TLP)\n2. Memoria de Trabajo (Woodcock-Muñoz)\n3. Memoria a Largo Plazo (Fluidez de Recuperación)\n4. Percepción Visoespacial (Rey)\n\nPruebas complementarias:\n• ANOVA: Diferencias por grado escolar\n• Correlaciones de Pearson y Spearman\n• Shapiro-Wilk: Normalidad de variables"
          }
        ]
      },
      revelacion: {
        titulo: "Resultados del Modelo Jerárquico",
        narrativa: "Y aquí viene lo inesperado: El modelo final retuvo tres predictores robustos: Memoria de Trabajo (β=.146*), Memoria a Largo Plazo (β=.191**) y, asombrosamente, Percepción Visoespacial (β=.220**). Contrario a la teoría clásica, la Eficacia Atencional y la Planificación (medida por laberintos) carecieron de poder predictivo significativo.",
        hallazgos: [
          { label: "Tríada Predictiva Consolidada", value: "MT (β=.146*), MLP (β=.191**), Percepción Visoespacial (β=.220**) como predictores robustos." },
          { label: "Variables Descartadas", value: "Eficacia Atencional y Planificación (laberintos) carecieron de poder predictivo significativo para Expresión Escrita." },
          { label: "Modelo Final", value: "R²=.182: el ensamblaje explica 18.2% de la varianza en rendimiento escrito." }
        ],
        dataPoints: [
          "ANOVA por grado: Fluidez F=12.86 (p<.001) | Expresión escrita F=4.39 (p=.014) | Redacción de oraciones F=2.30 (p=.103, no significativo).",
          "Modelo Final (R²=.182): MT β=.146* | MLP β=.191** | PViso β=.220** | Planif β=.115 (NS)."
        ],
        reflexion: "¿Por qué un componente aparentemente 'visual' como la percepción visoespacial resulta tener un peso predictivo superior en la expresión escrita que la propia memoria lingüística en niños de esta edad?",
        deepDives: [
          {
            id: "escritura-revelacion-1",
            triggerLabel: "Tabla completa: Regresión jerárquica por pasos",
            type: "data",
            content: "REGRESIÓN JERÁRQUICA DE PREDICCIÓN:\n\nPASO 1 (Planificación):\nR² = .046 (4% varianza)\nPlanif: β = .214**\n\nPASO 2 (+ MT):\nR² = .100 (10% varianza)\nPlanif: β = .183*\nMT: β = .236**\n\nPASO 3 (+ MLP):\nR² = .136 (13% varianza)\nPlanif: β = .158*\nMT: β = .169*\nMLP: β = .203**\n\nPASO 4 (+ PViso):\nR² = .182 (18% varianza)\nPlanif: β = .115 (NS)\nMT: β = .146*\nMLP: β = .191**\nPViso: β = .220**"
          },
          {
            id: "escritura-revelacion-2",
            triggerLabel: "Índices ANOVA: Diferencias por grado",
            type: "data",
            content: "ANOVA POR GRADO ESCOLAR:\n\nFLUIDEZ ESCRITORA:\nF = 12.86, p < .001\nPost-hoc: 5to > 4to > 3ro\n\nEXPRESIÓN ESCRITA:\nF = 4.39, p = .014\nPost-hoc: 5to > 3ro\n\nREDACCIÓN DE ORACIONES:\nF = 2.30, p = .103 (NO SIGNIFICATIVO)\n\nInterpretación: La fluidez y la expresión escrita mejoran con la escolaridad. La redacción de oraciones no muestra diferencias significativas por grado."
          },
          {
            id: "escritura-revelacion-3",
            triggerLabel: "Diagrama ASCII: Modelo de Regresión Jerárquica",
            type: "data",
            content: "┌──────────────────────────────────────────────┐\n│  Predicción de Expresión Escrita (R²=.182)   │\n├──────────────────────────────────────────────┤\n│  Paso 1: Planificación      → 4% varianza   │\n│  Paso 2: + Memoria Trabajo  → 10% varianza  │\n│  Paso 3: + Memoria L.P.     → 13% varianza  │\n│  Paso 4: + Percepción V.E.  → 18% varianza  │\n│                                              │\n│  Modelo Final (Betas):                       │\n│  MT: β=.146*  │  MLP: β=.191**              │\n│  PViso: β=.220**  │  Planif: β=.115 (NS)    │\n└──────────────────────────────────────────────┘\n*p<.05, **p<.01"
          }
        ]
      },
      marco: {
        titulo: "Neurocognición del Texto (Flower y Hayes)",
        narrativa: "Para entender esto, necesitamos el marco teórico. El anclaje es el modelo fundacional de Procesamiento Cognitivo de Flower y Hayes (1981), donde Transcripción, Planificación y Revisión compiten vorazmente por un ancho de banda mental limitado.",
        detalles: [
          { label: "El Cuello de Botella Transcripcional", value: "En niños, si la caligrafía y ortografía básica no están profundamente automatizadas, secuestran casi toda la Memoria de Trabajo, ahogando la capacidad para crear ideas o revisar." },
          { label: "La Huella Externa (Visoespacial)", value: "El trazo escrito sobre el papel sirve de 'memoria auxiliar externa', siendo fundamental la agudeza perceptiva para revisarla y detectar incongruencias discursivas o faltas ortográficas al vuelo." },
          { label: "Automatización y liberación cognitiva", value: "Si se automatiza la transcripción, se liberan recursos cognitivos permitiendo que procesos más complejos (planificación, revisión) mejoren la generación y calidad del texto." }
        ],
        reflexion: "Si la caligrafía lenta literalmente agota la energía mental para pensar ideas, ¿deberíamos permitir el uso masivo de computadoras en la escuela primaria para saltarnos el cuello de botella físico?",
        deepDives: [
          {
            id: "escritura-marco-1",
            triggerLabel: "Limitaciones: Planificación y atención",
            type: "limitation",
            content: "LIMITACIONES IDENTIFICADAS:\n\n1. PLANIFICACIÓN: El test utilizado (laberintos) mide planificación visoespacial, diferente de la planificación estratégica requerida en escritura. Esto puede explicar su falta de poder predictivo.\n\n2. ATENCIÓN: La EMAV demandó atención centrada en aspectos visuales y morfológicos. Para escribir, se necesita principalmente atención dirigida a procesos lingüísticos. El instrumento puede no ser adecuado."
          },
          {
            id: "escritura-marco-2",
            triggerLabel: "Implicancias educativas: Tareas concretas",
            type: "theory",
            content: "TAREAS PARA HABILIDADES ESCRITORAS:\n(a) Dictado de palabras → mejorar escritura manual, ortografía y automatización\n(b) Búsqueda de palabras desconocidas → incrementar almacén semántico\n(c) Escritura a partir de temas diversos → estimular contenido sintáctico y planificación\n\nTAREAS PARA PROCESOS COGNITIVOS:\n(a) Planificación: realizar plan mental de tareas sencillas; en escritura, exponer objetivos del texto antes de escribir\n(b) Memoria de trabajo: tareas de secuenciación directa e inversa de números o palabras"
          },
          {
            id: "escritura-marco-3",
            triggerLabel: "Futuras investigaciones: Variables pendientes",
            type: "limitation",
            content: "Futuros estudios deberían:\n(1) Incluir vocabulario como variable predictora\n(2) Incorporar método de enseñanza como variable moderadora\n(3) Evaluar planificación con tareas directas de planificación argumental/léxica\n(4) Incluir evaluación atencional acorde a procesos lingüísticos\n(5) Realizar estudios con grados escolares más altos (escritores más experimentados)"
          }
        ]
      },
      nucleo: {
        pregunta: "¿Cuáles son los predictores neurocognitivos y ejecutivos específicos que sostienen la capacidad de expresión escrita en escolares sudamericanos en etapa de automatización?",
        conclusion: "El desempeño en la producción de textos escritos infantiles está determinado significativamente (18.2% de varianza explicada) por la sinergia de tres funciones centrales: la capacidad de mantener esquemas lingüísticos online (Memoria de Trabajo), la velocidad de acceso al léxico y convenciones ortográficas (Memoria a Largo Plazo), y críticamente, la destreza para procesar y auditar la traza física visual del texto generado (Percepción Visoespacial). La falta de poder predictivo atencional replantea cómo evaluamos el fenómeno.",
        formalRef: "Moreno, C. B., Korzeniowski, C., & Espósito, A. (2022). Procesos cognitivos y ejecutivos asociados a la expresión escrita infantil. Ocnos 21(2)."
      },
      implicancias: {
        title: "Implicancias Educativas: Tareas Concretas para el Aula",
        tareasEscritura: [
          { nombre: "Dictado de palabras", objetivo: "Mejorar escritura manual, ortografía y automatización" },
          { nombre: "Búsqueda de palabras desconocidas", objetivo: "Incrementar almacén semántico" },
          { nombre: "Escritura a partir de temas diversos", objetivo: "Estimular contenido sintáctico y planificación" }
        ],
        tareasCognitivas: [
          { nombre: "Planificación mental", objetivo: "Realizar plan mental de tareas sencillas; en escritura, exponer objetivos del texto antes de escribir" },
          { nombre: "Secuenciación directa/inversa", objetivo: "Tareas de secuenciación de números o palabras para estimular memoria de trabajo" }
        ],
        ref: "[Implicancias educativas, p. 15]"
      },
      reflexion: {
        questions: [
          { type: "choice", q: "Según el modelo de regresión expuesto en el artículo, una de estas FE NO contribuyó significativamente a predecir la calidad de la expresión escrita, un hallazgo inesperado que cuestiona los instrumentos de medición:", options: ["Percepción visoespacial para auditar el texto", "Memoria de Trabajo (bucle fonológico)", "Memoria a largo plazo de acceso semántico", "Planificación visoespacial (Test de Laberintos)"], correct: 3 },
          { type: "open", q: "Menciona una estrategia metodológica y cognitiva que puedas usar en clase para liberar la 'memoria de trabajo' saturada de un niño de tercer grado que escribe muy lento." }
        ]
      }
    }
  },
  {
    id: "detectives",
    metadata: {
      title: "¿Qué leen realmente los madrileños? Análisis de préstamos bibliotecarios 2024",
      authors: "Ocnos Research Team",
      year: "2026",
      journal: "Ocnos 25(1)",
      doi: "https://doi.org/10.18239/ocnos_2026.25.1.632",
      gancho: "Más de 2.6 millones de préstamos analizados para descubrir los misterios de la lectura pública en Madrid.",
      duration: "15-20 min",
      depth: "Exploración",
      color: "#5b9eaa",
      colorAlt: "#2a5a75",
      bg: "from-ocean-base/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/detectives-portada/800/600"
    },
    blocks: {
      apertura: { personaje: "", gancho: "", contexto: "" },
      conflicto: { problema: "", porQueImporta: "", dataPoints: [], glossary: [] },
      viaje: { titulo: "", narrativa: "", detalles: [], limitaciones: [], reflexion: "" },
      revelacion: { titulo: "", narrativa: "", hallazgos: [], dataPoints: [], reflexion: "" },
      marco: { titulo: "", narrativa: "", convergencias: [], divergencias: [], puntosCiegos: [],
        tabla: { headers: [], rows: [], caption: "" },
        implicancias: [], reflexion: "" },
      nucleo: { titulo: "", premisa: "", hallazgos: [], recomendaciones: [], reflexion: "" },
      reflexion: { questions: [] }
    }
  },
  {
    id: "detectives",
    metadata: {
      title: "¿Qué leen realmente los madrileños?",
      authors: "Ocnos Research Team",
      year: "2026",
      journal: "Ocnos 25(1)",
      doi: "10.18239/ocnos_2026.25.1.632",
      gancho: "Más de 2.6 millones de préstamos analizados. Descubre los patrones de lectura pública en Madrid.",
      duration: "15-20 min",
      depth: "Aplicación",
      color: "#2a9d8f",
      colorAlt: "#264653",
      bg: "from-ocean-base/20 to-ocean-dark/20",
      image: "https://picsum.photos/seed/detectives-card/800/600"
    },
    blocks: {
      apertura: {
        personaje: "Investigador Ocnos",
        gancho: "¿Qué leen realmente los madrileños?",
        contexto: "Análisis masivo de datos sobre préstamos en bibliotecas públicas.",
        deepDives: []
      }
    }
  }
];
