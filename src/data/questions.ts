import { HouseId } from './houses';

export interface QuizOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  house: HouseId; // Hidden secret score mapping
  badgeLabel: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  shortTitle: string;
  title: string;
  loreIntro: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    shortTitle: '1. Puerta Misteriosa',
    title: 'La Puerta Misteriosa del Castillo',
    loreIntro: 'Explorando los rincones antiguos de la escuela para la gran feria, descubres cuatro puertas secretas sin cerradura visible. ¿Cuál decides abrir?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        badgeLabel: 'Camino del Roble',
        text: 'La puerta de roble macizo con aldaba de hierro: la empujo con decisión sin dudar, ¡listo para enfrentar lo que haya del otro lado!',
        iconName: 'DoorOpen'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        badgeLabel: 'Camino de las Runas',
        text: 'La puerta grabada con inscripciones misteriosas y un acertijo brillante: me detengo a descifrar el enigma antes de poner un dedo encima.',
        iconName: 'Scroll'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        badgeLabel: 'Camino del Hogar',
        text: 'La puerta cálida de madera suave que huele a leña y pan dulce recién horneado: invito a mis amigos para cruzarla juntos y cuidarnos entre todos.',
        iconName: 'HeartHandshake'
      },
      {
        letter: 'D',
        house: 'slytherin',
        badgeLabel: 'Camino del Sigilo',
        text: 'La puerta disimulada tras un tapiz oscuro: entro en silencio sabiendo que guarda un camino exclusivo que pocos se atreven a explorar.',
        iconName: 'Compass'
      }
    ]
  },
  {
    id: 2,
    shortTitle: '2. Compañero Frustrado',
    title: 'El Compañero Frustrado en Clase',
    loreIntro: 'En el taller de magia de la feria, a tu compañero se le complica un ejercicio con la varita y está a punto de rendirse muy triste. ¿Cómo actúas?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        badgeLabel: 'Impulso de Ánimo',
        text: 'Le doy una palmada con energía y una sonrisa: "¡Arriba ese ánimo, no te des por vencido jamás! ¡Vamos a intentarlo otra vez que vos podés!"',
        iconName: 'Flame'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        badgeLabel: 'Explicación Detallada',
        text: 'Le explico con paciencia la técnica exacta: "Fijate con atención en el ángulo de tu mano y el movimiento suave que necesitas hacer para que funcione."',
        iconName: 'BookOpen'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        badgeLabel: 'Acompañamiento Cercano',
        text: 'Me siento a su lado tranquilamente, le comparto una golosina y practicamos juntos paso a paso hasta que le salga sin apuros.',
        iconName: 'Smile'
      },
      {
        letter: 'D',
        house: 'slytherin',
        badgeLabel: 'Consejo Práctico',
        text: 'Le muestro un truco ingenioso y práctico que aprendí para resolverlo de inmediato y destacarse con una solución diferente.',
        iconName: 'Zap'
      }
    ]
  },
  {
    id: 3,
    shortTitle: '3. Poción Mágica',
    title: 'La Elección de la Poción Mágica',
    loreIntro: 'Sobre una mesa del laboratorio hay cuatro frascos con pócimas misteriosas que desprenden un vapor mágico. ¿Cuál te despierta más curiosidad probar?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        badgeLabel: 'Elixir Dorado Resplandeciente',
        text: 'El frasco dorado que chisporrotea con calor: sientes que al beberlo te llenará de una energía imparable para no tenerle miedo a nada.',
        iconName: 'Sparkles'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        badgeLabel: 'Elixir Azul Constelación',
        text: 'El frasco azul cielo con destellos que parecen estrellas flotantes: sientes que al beberlo tu mente comprenderá todos los misterios del universo.',
        iconName: 'Moon'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        badgeLabel: 'Elixir Meloso Suave',
        text: 'El frasco color miel con un aroma dulce a flores silvestres: sientes que al beberlo brindará alivio, bienestar y alegría a tus seres queridos.',
        iconName: 'Sun'
      },
      {
        letter: 'D',
        house: 'slytherin',
        badgeLabel: 'Elixir Esmeralda Espejado',
        text: 'El frasco verde brillante con reflejos plateados: sientes que al beberlo potenciará tu intuición y astucia para lograr cualquier meta que te propongas.',
        iconName: 'Crown'
      }
    ]
  },
  {
    id: 4,
    shortTitle: '4. Desafío Mágico',
    title: 'El Gran Desafío Escolar',
    loreIntro: 'Durante una búsqueda del tesoro en el patio escolar, tu equipo se topa con un laberinto lleno de acertijos y obstáculos. ¿Cuál es tu reacción?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        badgeLabel: 'Avanzar al Frente',
        text: 'Doy un paso al frente para guiar al grupo y avanzar con audacia sin frenarme ante ningún obstáculo que aparezca en el camino.',
        iconName: 'Shield'
      },
      {
        letter: 'B',
        house: 'hufflepuff',
        badgeLabel: 'Coordinar al Equipo',
        text: 'Reúno a todos mis compañeros: ¡con paciencia, esfuerzo compartido y unión lograremos que nadie quede atrás y lleguemos juntos a la meta!',
        iconName: 'Users'
      },
      {
        letter: 'C',
        house: 'ravenclaw',
        badgeLabel: 'Descifrar el Patrón',
        text: 'Me detengo a mirar el mapa del laberinto para encontrar el patrón de los caminos y resolver la ruta correcta usando la lógica.',
        iconName: 'Search'
      },
      {
        letter: 'D',
        house: 'slytherin',
        badgeLabel: 'Buscar la Delantera',
        text: 'Busco un atajo ingenioso e inesperado que tome por sorpresa al laberinto y nos asegure la victoria de manera rápida y efectiva.',
        iconName: 'Award'
      }
    ]
  },
  {
    id: 5,
    shortTitle: '5. Hizo Trampa',
    title: 'El Dilema del Examen',
    loreIntro: 'En una competencia de preguntas escolares, notas que un participante utilizó un truco escondido para ganar ventaja. ¿Qué piensas o haces?',
    options: [
      {
        letter: 'A',
        house: 'ravenclaw',
        badgeLabel: 'Valorar el Esfuerzo Propio',
        text: 'Me molesta que no use su propia cabeza: el verdadero mérito está en el aprendizaje real y lo que uno sabe por su propio estudio.',
        iconName: 'Book'
      },
      {
        letter: 'B',
        house: 'slytherin',
        badgeLabel: 'Observar la Situación',
        text: 'Observo con calma cómo lo hizo; si no lo descubren fue audaz, pero guardo el dato en silencio como una ventaja estratégica para mí.',
        iconName: 'Eye'
      },
      {
        letter: 'C',
        house: 'gryffindor',
        badgeLabel: 'Conversar de Frente',
        text: 'Me parece injusto para los que se esforzaron y voy a decírselo de frente con la verdad: en los juegos de la vida se compite con honor y juego limpio.',
        iconName: 'Scale'
      },
      {
        letter: 'D',
        house: 'hufflepuff',
        badgeLabel: 'Ofrecer Apoyo en Privado',
        text: 'Me acerco a hablar con él en privado para entender por qué sintió tanta presión, y le ofrezco practicar juntos para la próxima vez.',
        iconName: 'Heart'
      }
    ]
  },
  {
    id: 6,
    shortTitle: '6. Objeto Mágico',
    title: 'La Reliquia Legendaria',
    loreIntro: 'En una vitrina antigua de la feria escolar te permiten elegir un recuerdo mágico especial para conservar. ¿Cuál llama más tu atención?',
    options: [
      {
        letter: 'A',
        house: 'slytherin',
        badgeLabel: 'El Amuleto de Plata Antigua',
        text: 'Un amuleto antiguo con una joya brillante tallada que impone respeto y te recuerda que tienes la determinación para alcanzar grandes metas.',
        iconName: 'Gem'
      },
      {
        letter: 'B',
        house: 'hufflepuff',
        badgeLabel: 'El Cáliz de la Abundancia',
        text: 'Un cáliz dorado cálido que nunca se vacía, hecho para compartir una merienda o bebida con todos tus amigos en momentos de celebración.',
        iconName: 'Coffee'
      },
      {
        letter: 'C',
        house: 'ravenclaw',
        badgeLabel: 'El Libro de los Enigmas',
        text: 'Un libro encuadernado en cuero antiguo que contiene mapas celestes y acertijos fascinantes que nadie ha podido resolver por completo.',
        iconName: 'Feather'
      },
      {
        letter: 'D',
        house: 'gryffindor',
        badgeLabel: 'La Insignia de los Campeones',
        text: 'Una insignia forjada en plata con destellos de rubí que simboliza el valor para defender a los demás ante las dificultades.',
        iconName: 'Sparkle'
      }
    ]
  }
];
