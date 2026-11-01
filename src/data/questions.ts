import { HouseId } from './houses';

export interface QuizOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  house: HouseId; // Secret scoring mapping
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  shortTitle: string;
  title: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    shortTitle: 'Pregunta 1 de 6',
    title: 'En una aventura, encontrás una puerta misteriosa ¿Qué hacés?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        text: 'La abro inmediatamente para descubrir qué hay detrás',
        iconName: 'DoorOpen'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        text: 'Busco pistas para entender adónde lleva',
        iconName: 'Search'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        text: 'Invito a mis amigos a explorarla conmigo',
        iconName: 'Users'
      },
      {
        letter: 'D',
        house: 'slytherin',
        text: 'Pienso, con tiempo, cómo abrirla sin correr riesgos innecesarios',
        iconName: 'Shield'
      }
    ]
  },
  {
    id: 2,
    shortTitle: 'Pregunta 2 de 6',
    title: 'Un compañero no sabe como resolver una actividad y se siente frustrado ¿Qué hacés?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        text: 'Lo animo a que lo intente, aunque tenga miedo de equivocarse',
        iconName: 'Flame'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        text: 'Le doy una pista para que pueda descubrir la respuesta por sí mismo',
        iconName: 'Sparkles'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        text: 'Me quedo a su lado y lo acompaño para que no se sienta solo',
        iconName: 'HeartHandshake'
      },
      {
        letter: 'D',
        house: 'slytherin',
        text: 'Busco otra manera de explicar la consigna para que pueda entenderla',
        iconName: 'BookOpen'
      }
    ]
  },
  {
    id: 3,
    shortTitle: 'Pregunta 3 de 6',
    title: 'Si pudieras crear una poción mágica, ¿Qué efecto tendría?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        text: 'Darle valentía a las personas para enfrentar sus miedos',
        iconName: 'Sword'
      },
      {
        letter: 'B',
        house: 'ravenclaw',
        text: 'Descubrir secretos y conocimientos ocultos',
        iconName: 'Scroll'
      },
      {
        letter: 'C',
        house: 'hufflepuff',
        text: 'Curar a las personas y hacer que se sientan mejor',
        iconName: 'Heart'
      },
      {
        letter: 'D',
        house: 'slytherin',
        text: 'Ayudar a las personas a alcanzar sus sueños más grandes',
        iconName: 'Crown'
      }
    ]
  },
  {
    id: 4,
    shortTitle: 'Pregunta 4 de 6',
    title: 'Tu equipo tiene que superar un desafío mágico ¿Qué harías vos?',
    options: [
      {
        letter: 'A',
        house: 'gryffindor',
        text: 'Probar un hechizo nuevo, aunque no sepas si va a funcionar',
        iconName: 'Wand2'
      },
      {
        letter: 'B',
        house: 'hufflepuff',
        text: 'Asegurarte de que todos puedan participar y aportar algo',
        iconName: 'Users'
      },
      {
        letter: 'C',
        house: 'ravenclaw',
        text: 'Pensar y probrar distintas maneras de resolver el desafío hasta encontrar la que funcione',
        iconName: 'Brain'
      },
      {
        letter: 'D',
        house: 'slytherin',
        text: 'Organizar un plan para alcanzar el objetivo',
        iconName: 'Compass'
      }
    ]
  },
  {
    id: 5,
    shortTitle: 'Pregunta 5 de 6',
    title: 'Descubrís que un compañero hizo trampa para ganar un desafío ¿Qué harías?',
    options: [
      {
        letter: 'A',
        house: 'ravenclaw',
        text: 'Hablaría con él en privado para entender por qué lo hizo',
        iconName: 'MessageSquare'
      },
      {
        letter: 'B',
        house: 'slytherin',
        text: 'Pensaría cómo evitar que vuelva a pasar en el próximo desafío',
        iconName: 'Eye'
      },
      {
        letter: 'C',
        house: 'gryffindor',
        text: 'Le diría que no me parece justo ganar haciendo trampa, aunque se enoje conmigo',
        iconName: 'Scale'
      },
      {
        letter: 'D',
        house: 'hufflepuff',
        text: 'Le propondría que reconociera lo que hizo y buscara una manera justa de resolverlo',
        iconName: 'CheckCircle'
      }
    ]
  },
  {
    id: 6,
    shortTitle: 'Pregunta 6 de 6',
    title: 'Encontrás un objeto mágico que nunca habías visto ¿Qué te gustaría hacer?',
    options: [
      {
        letter: 'A',
        house: 'slytherin',
        text: 'Guardarlo para usarlo en el momento en que más lo necesite',
        iconName: 'Gem'
      },
      {
        letter: 'B',
        house: 'hufflepuff',
        text: 'Averiguar si puede ser útil para ayudar o proteger a alguien',
        iconName: 'Shield'
      },
      {
        letter: 'C',
        house: 'ravenclaw',
        text: 'Investigar cómo funciona y descubrir qué lo hace especial',
        iconName: 'Search'
      },
      {
        letter: 'D',
        house: 'gryffindor',
        text: 'Probar qué poderes tiene, aunque no sepa exactamente qué va a pasar',
        iconName: 'Zap'
      }
    ]
  }
];
