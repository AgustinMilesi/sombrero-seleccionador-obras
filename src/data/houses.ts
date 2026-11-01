export type HouseId = 'gryffindor' | 'ravenclaw' | 'hufflepuff' | 'slytherin';

export interface HouseInfo {
  id: HouseId;
  name: string;
  crest: string;
  animal: string;
  element: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  bgGradient: string;
  traits: string[];
  kidDescription: string;
  obrasConnection: string;
  hatQuote: string;
  welcomeMessage: string;
}

export const HOUSES: Record<HouseId, HouseInfo> = {
  gryffindor: {
    id: 'gryffindor',
    name: 'Gryffindor',
    crest: './crests/gryffindor.webp',
    animal: 'León Dorado',
    element: 'Fuego',
    primaryColor: '#8a0303',
    secondaryColor: '#f1be32',
    accentGlow: 'rgba(238, 59, 59, 0.4)',
    bgGradient: 'from-red-950/80 via-amber-950/40 to-black',
    traits: ['Valentía', 'Coraje', 'Caballerosidad', 'Audacia'],
    kidDescription: '¡Tienes el corazón de un león! No le temes a los desafíos, siempre defiendes a los demás y das un paso al frente cuando otros dudan.',
    obrasConnection: 'En el Instituto Obras representas el coraje aurinegro, dejando el alma en cada cancha y en cada proyecto escolar.',
    hatQuote: '¡Donde habitan los valientes! Su osadía, temple y caballerosidad ponen a Gryffindor aparte...',
    welcomeMessage: '¡Bienvenido a la casa de los valientes de corazón!'
  },
  ravenclaw: {
    id: 'ravenclaw',
    name: 'Ravenclaw',
    crest: './crests/ravenclaw.webp',
    animal: 'Águila Sabia',
    element: 'Aire',
    primaryColor: '#0c2340',
    secondaryColor: '#9e7339',
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    bgGradient: 'from-blue-950/80 via-indigo-950/40 to-black',
    traits: ['Sabiduría', 'Creatividad', 'Curiosidad', 'Ingenio'],
    kidDescription: '¡Tu mente brilla como una constelación! Amas aprender cosas nuevas, hacerte preguntas curiosas y resolver los acertijos más difíciles.',
    obrasConnection: 'En el Instituto Obras encarnas el pensamiento crítico, la curiosidad científica y el amor por el conocimiento.',
    hatQuote: '¡O tal vez en la sabia y vieja Ravenclaw, donde los de mente aguda y listos siempre hallarán su hogar!',
    welcomeMessage: '¡Bienvenido a la casa de las mentes brillantes!'
  },
  hufflepuff: {
    id: 'hufflepuff',
    name: 'Hufflepuff',
    crest: './crests/hufflepuff.webp',
    animal: 'Tejón Noble',
    element: 'Tierra',
    primaryColor: '#e5a100',
    secondaryColor: '#121212',
    accentGlow: 'rgba(253, 185, 19, 0.5)',
    bgGradient: 'from-amber-950/80 via-yellow-950/30 to-black',
    traits: ['Lealtad', 'Esfuerzo', 'Compañerismo', 'Paciencia'],
    kidDescription: '¡Eres el amigo con el que todos sueñan contar! Trabajas con dedicación, eres justo con todos y tu lealtad nunca se rompe.',
    obrasConnection: '¡La casa de los colores Aurinegros por excelencia! Compartes con Obras el espíritu de equipo, la amistad y el orgullo por el trabajo duro.',
    hatQuote: '¡Puedes pertenecer a Hufflepuff, donde son justos y leales, pacientes y sin miedo al trabajo honrado!',
    welcomeMessage: '¡Bienvenido a la casa de la lealtad y el gran compañerismo!'
  },
  slytherin: {
    id: 'slytherin',
    name: 'Slytherin',
    crest: './crests/slytherin.webp',
    animal: 'Serpiente Astuta',
    element: 'Agua',
    primaryColor: '#1a472a',
    secondaryColor: '#a7a8aa',
    accentGlow: 'rgba(52, 211, 153, 0.4)',
    bgGradient: 'from-emerald-950/80 via-teal-950/30 to-black',
    traits: ['Astucia', 'Liderazgo', 'Determinación', 'Ambición'],
    kidDescription: '¡Tienes visión de líder! Siempre encuentras una forma ingeniosa de lograr tus metas, pensando tres pasos por delante de los demás.',
    obrasConnection: 'En el Instituto Obras representas el liderazgo estratégico, la perseverancia y la ambición positiva de superarse siempre.',
    hatQuote: '¡O tal vez en Slytherin harás tus verdaderos amigos, esa gente astuta utiliza cualquier medio para lograr sus fines!',
    welcomeMessage: '¡Bienvenido a la casa de los grandes líderes!'
  }
};
