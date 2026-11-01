export type HouseId = 'gryffindor' | 'ravenclaw' | 'hufflepuff' | 'slytherin';

export interface HouseCharacter {
  name: string;
  title: string;
  deed: string;
  avatarIcon: string;
}

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
  characters: HouseCharacter[];
}

export const HOUSES: Record<HouseId, HouseInfo> = {
  gryffindor: {
    id: 'gryffindor',
    name: 'Gryffindor',
    crest: './crests/gryffindor.webp',
    animal: 'León Dorado',
    element: 'Fuego',
    primaryColor: '#740001',
    secondaryColor: '#d3a625',
    accentGlow: 'rgba(211, 166, 37, 0.45)',
    bgGradient: 'from-amber-950/70 via-[#181310] to-[#0d0b0a]',
    traits: ['Valentía', 'Coraje', 'Caballerosidad', 'Honor'],
    kidDescription: '¡Tienes el corazón de un auténtico león! No le temes a los desafíos, siempre das la cara por tus amigos y defiendes lo justo con audacia.',
    obrasConnection: 'En el Instituto Obras representas la garra y el coraje aurinegro, dejando el alma en cada desafío deportivo y escolar.',
    hatQuote: '¡Donde habitan los valientes! Su osadía, temple y caballerosidad ponen a Gryffindor aparte...',
    welcomeMessage: '¡Bienvenido a la casa de los valientes de corazón!',
    characters: [
      {
        name: 'Harry Potter',
        title: 'El Niño que Sobrevivió',
        deed: 'Buscador legendario de Gryffindor y líder del Ejército de Dumbledore. Demostró que el amor y el valor vencen a la magia más oscura.',
        avatarIcon: '⚡'
      },
      {
        name: 'Hermione Granger',
        title: 'La Bruja más Brillante',
        deed: 'Con su inteligencia prodigiosa y su gran lealtad, demostró que los libros y el coraje salvan vidas en los momentos más difíciles.',
        avatarIcon: '📖'
      },
      {
        name: 'Albus Dumbledore',
        title: 'El Gran Director de Hogwarts',
        deed: 'Considerado el mago más sabio y poderoso del mundo moderno, guió a generaciones de jóvenes magos con justicia y compasión.',
        avatarIcon: '✨'
      }
    ]
  },
  ravenclaw: {
    id: 'ravenclaw',
    name: 'Ravenclaw',
    crest: './crests/ravenclaw.webp',
    animal: 'Águila Sabia',
    element: 'Aire',
    primaryColor: '#0e1a40',
    secondaryColor: '#946b2d',
    accentGlow: 'rgba(148, 107, 45, 0.45)',
    bgGradient: 'from-slate-950/80 via-[#12141c] to-[#0d0e14]',
    traits: ['Sabiduría', 'Creatividad', 'Curiosidad', 'Ingenio'],
    kidDescription: '¡Tu mente brilla con luz propia! Amas aprender, hacerte preguntas interesantes y encontrar soluciones originales que nadie más imaginó.',
    obrasConnection: 'En el Instituto Obras encarnas la curiosidad científica, la pasión por el aprendizaje y el pensamiento crítico.',
    hatQuote: '¡O tal vez en la sabia y vieja Ravenclaw, donde los de mente aguda y listos siempre hallarán su hogar!',
    welcomeMessage: '¡Bienvenido a la casa de las mentes brillantes!',
    characters: [
      {
        name: 'Luna Lovegood',
        title: 'Mente Creativa e Intuitiva',
        deed: 'Libre de prejuicios, extraordinariamente leal y valiente. Demostró que ser uno mismo y pensar distinto es un verdadero superpoder.',
        avatarIcon: '🌙'
      },
      {
        name: 'Garrick Ollivander',
        title: 'Maestro Fabricante de Varitas',
        deed: 'El mayor conocedor de la magia de las varitas en la historia. Su sabiduría milenaria unió el destino de magos y brujas.',
        avatarIcon: '🪄'
      },
      {
        name: 'Cho Chang',
        title: 'Buscadora de Quidditch',
        deed: 'Hábil voladora en su cometa, valiente defensora del castillo en la Batalla de Hogwarts y miembro leal del Ejército de Dumbledore.',
        avatarIcon: '🦅'
      }
    ]
  },
  hufflepuff: {
    id: 'hufflepuff',
    name: 'Hufflepuff',
    crest: './crests/hufflepuff.webp',
    animal: 'Tejón Noble',
    element: 'Tierra',
    primaryColor: '#ecb939',
    secondaryColor: '#121212',
    accentGlow: 'rgba(236, 185, 57, 0.5)',
    bgGradient: 'from-amber-950/70 via-[#181510] to-[#0d0c0a]',
    traits: ['Lealtad', 'Honestidad', 'Compañerismo', 'Esfuerzo'],
    kidDescription: '¡Eres el amigo incondicional que todos quisieran tener a su lado! Trabajas con dedicación, tratas a todos por igual y nunca traicionas tu palabra.',
    obrasConnection: '¡La casa de los colores Aurinegros por excelencia! Comparte con Obras el amor por el trabajo en equipo, la humildad y la amistad eterna.',
    hatQuote: '¡Puedes pertenecer a Hufflepuff, donde son justos y leales, pacientes y sin miedo al trabajo honrado!',
    welcomeMessage: '¡Bienvenido a la casa de la lealtad y el compañerismo!',
    characters: [
      {
        name: 'Cedric Diggory',
        title: 'Campeón de Hogwarts',
        deed: 'Buscador estrella y campeón del Torneo de los Tres Magos. Modelo insuperable de juego limpio, humildad y caballerosidad.',
        avatarIcon: '🏆'
      },
      {
        name: 'Newt Scamander',
        title: 'Célebre Magizoólogo',
        deed: 'Autor de "Animales Fantásticos", dedicó su vida a proteger y comprender a todas las criaturas mágicas con infinita bondad.',
        avatarIcon: '🐾'
      },
      {
        name: 'Nymphadora Tonks',
        title: 'Valiente Auror',
        deed: 'Metamorfomaga audaz, alegre y leal de la Orden del Fénix. Dio su vida con valentía defendiendo la libertad del mundo mágico.',
        avatarIcon: '⭐'
      }
    ]
  },
  slytherin: {
    id: 'slytherin',
    name: 'Slytherin',
    crest: './crests/slytherin.webp',
    animal: 'Serpiente Astuta',
    element: 'Agua',
    primaryColor: '#1a472a',
    secondaryColor: '#aaaaaa',
    accentGlow: 'rgba(170, 170, 170, 0.45)',
    bgGradient: 'from-emerald-950/70 via-[#101712] to-[#0a0d0b]',
    traits: ['Astucia', 'Liderazgo', 'Determinación', 'Grandeza'],
    kidDescription: '¡Tienes porte de gran líder! Siempre encuentras la forma inteligente de alcanzar tus metas, pensando dos pasos por delante y cuidando a los tuyos.',
    obrasConnection: 'En el Instituto Obras representas el liderazgo estratégico, la resiliencia y la determinación de no rendirte ante nada.',
    hatQuote: '¡O tal vez en Slytherin harás tus verdaderos amigos, esa gente astuta utiliza cualquier medio para lograr sus fines!',
    welcomeMessage: '¡Bienvenido a la casa de los grandes líderes!',
    characters: [
      {
        name: 'Severus Snape',
        title: 'Maestro de Pociones y Director',
        deed: 'Poseedor de un coraje y autocontrol inigualables, fue el espía más audaz de la historia mágica y salvó el destino de Hogwarts.',
        avatarIcon: '🧪'
      },
      {
        name: 'Merlín',
        title: 'El Mago de Magos',
        deed: 'El mago más famoso de todos los tiempos. Perteneció a Slytherin y promovió la paz y los derechos mágicos fundando la Orden de Merlín.',
        avatarIcon: '🔮'
      },
      {
        name: 'Draco Malfoy',
        title: 'Buscador de Slytherin',
        deed: 'Habilidoso en duelos y pociones, aprendió a elegir su propio camino y proteger a su familia por encima de la oscuridad.',
        avatarIcon: '🐍'
      }
    ]
  }
};
