export interface TipoBosque {
  nombre: string;
  descripcion: string;
}

export interface IniciativaReforestacion {
  entidad: string;
  sigla: string;
  nombreCompleto: string;
  url: string;
}

export interface CartaBienvenida {
  titulo: string;
  subtitulo: string;
  parrafos: string[];
  tiposBosques: {
    introduccion: string;
    items: string[];
    fuenteNombre: string;
    fuenteUrl: string;
  };
  reforestacion: {
    introduccion: string;
    iniciativas: IniciativaReforestacion[];
  };
  cierre: string;
}

export const CARTA_BIENVENIDA: CartaBienvenida = {
  titulo: '¡Bienvenidos!',
  subtitulo: 'Carta de bienvenida y propósito de Conocimiento de la Montaña',
  parrafos: [
    'Gracias por visitar este blog. Si alguna vez has estado en el bosque sabes de la energía tan poderosa que tiene la naturaleza, y como habitantes de nuestro planeta hemos olvidado lo esencial de esta para nuestras vidas. Si no tienes la fortuna de conocer esta experiencia, te invito a que la descubras a través de este proyecto.',
    'Si eres de los afortunados que frecuenta el bosque y la montaña, te invitamos a promover los buenos hábitos al visitarlo y cuidarlo.',
    'El agua y el oxígeno, elementos básicos para la vida, se generan en los bosques. Desafortunadamente son recursos que descuidamos y sobreexplotamos por los requerimientos comerciales y el incremento poblacional; muchas veces estos solo benefician a unos cuantos, mientras en distintos lugares del planeta ya padecemos escasez de agua y mala calidad del aire que afectan a un gran número de personas.',
    'Afortunadamente los bosques tienen su propio ciclo de renovación, aunque su tiempo de reposición es muy largo: entre 50 a 100 años dependiendo del tipo de árbol y tipo de bosque. En la actualidad, el rápido crecimiento mundial en todos los ámbitos NO permite la correcta renovación del bosque.',
    'El problema es que cada vez hay más sequía, incendios provocados por descuidos, tala controlada, tala clandestina y plagas. Si a esto le sumamos la erosión natural más las lluvias cada vez más atípicas, crean un desajuste en los ecosistemas que termina por cambiar el ciclo natural del agua.',
    'Conocimiento de la Montaña tiene como objetivo llevarte a través de fotografías y video a estos ecosistemas, aún existentes en la montaña Iztaccíhuatl (parte del eje volcánico mexicano), para dar a conocer a más personas el patrimonio natural de los mexicanos. Y así crear una conciencia colectiva de conservación y protección de estos recursos primordiales para la vida.'
  ],
  tiposBosques: {
    introduccion: 'La mayoría de bosques existentes en el mundo se catalogan en 4 tipos principales:',
    items: ['Tropicales', 'Subtropicales', 'Templados', 'Boreales'],
    fuenteNombre: 'World Wildlife Fund (worldwildlife.org)',
    fuenteUrl: 'https://www.worldwildlife.org'
  },
  reforestacion: {
    introduccion: 'En México existen diversos programas federales, estatales y comunitarios enfocados en la reforestación y restauración de ecosistemas:',
    iniciativas: [
      {
        entidad: 'Estado de México',
        sigla: 'CEPANAF',
        nombreCompleto: 'Comisión Estatal de Parques Naturales y de la Fauna',
        url: 'https://cepanaf.edomex.gob.mx/'
      },
      {
        entidad: 'A Nivel Federal',
        sigla: 'CONAFOR',
        nombreCompleto: 'Comisión Nacional Forestal',
        url: 'https://www.gob.mx/conafor'
      }
    ]
  },
  cierre: '¡Adelante! Te invitamos a conocer nuestro patrimonio natural único.'
};
