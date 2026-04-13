export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category?: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  // Invitaciones
  {
    id: 1,
    name: "Invitación Boda Elegance",
    description: "Invitación de boda con acabados en foil dorado y papel texturizado premium.",
    price: 450,
    category: "Invitaciones",
    sub_category: "Boda",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6YN5iUDjeduv8PK7ymk8mfRP_tRYmyf1uhQ2aqOusQG6qArD_VMPFXc_ZA3CZv8olqc-1D60VjjACoIa2cPaLcgJgTaaKl8nGPbTR9cUri_otDaUJEvKUbCuegwT2gOGvoMn_aQPr3hLbNU7nT3WoxoKmccH65aWvAiE2KHJm0tazCTer7uXhgy-gLK31MoDbkrvELontcbny_hR9rJ4B92Yd_w4y4WOXY5U87uTLEQVHfWtlJ9xWvPbQcfPDW5ChcqbOJ6mvaw"
  },
  {
    id: 2,
    name: "Invitación XV Años Glitter",
    description: "Diseño moderno con detalles en glitter y corte láser de alta precisión.",
    price: 380,
    category: "Invitaciones",
    sub_category: "XV",
    image: "https://picsum.photos/seed/invitation-xv/800/1000"
  },
  {
    id: 3,
    name: "Invitación Infantil Safari",
    description: "Divertida invitación temática de safari con colores vibrantes para los más pequeños.",
    price: 250,
    category: "Invitaciones",
    sub_category: "Infantiles",
    image: "https://picsum.photos/seed/invitation-child/800/1000"
  },

  // Playeras
  {
    id: 4,
    name: "Playera Vinil Texturizado",
    description: "Playera de algodón con diseño en vinil textil de alta durabilidad y relieve.",
    price: 320,
    category: "Playeras",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACkFu3cu2VfvK5PD9haZQY6IS3Nje9tKvUBaEbUwE_KvCA7TtC41JBA2xyd52JxGPi_4MfhHNXjUIEXkW2WV0240B2ivXZwTsKbOWMkNZwdsZztFahD1BAPVulkW2R1NNn6b0kIq5ZtlSZ95eC36fX75EM8lCecjaihFj_b9nMie90OkTEvKHNc8J1rND1HwaoEPK2ZwQMK3MMnHTGwfqeMc9tbK3Vwz0rr--qnpRxZPadG5eITssyffo1DyWUB-JkAE7BkyBNQg"
  },
  {
    id: 5,
    name: "Playera Sublimación Full Color",
    description: "Playera de poliéster tacto algodón con impresión fotográfica que no se siente al tacto.",
    price: 280,
    category: "Playeras",
    image: "https://picsum.photos/seed/tshirt-sub/800/1200"
  },

  // Papelería Creativa
  {
    id: 6,
    name: "Set Papelería Creativa",
    description: "Incluye libretas personalizadas, separadores y stickers con diseños artísticos.",
    price: 285,
    category: "Papelería Creativa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd5nZWmsuoEBujZuQ6xzh6L6Ze8Jea9-uzqf32NQrO89bUeWsTLzN4ZQb0M4DtmfVGaduNSoW1c6TCA_iaLVU_Kfgy3O0sak6hH1_GyyEK90slozpI0FWod0mvs5wUeJAkDTOZzmzlp-7RE8hTlmmiiDas2Odo4BMMCQ_c0oBFO8f1yCyfa0s4jzRrYpMFasYgZMMmwLFU-HLy167uLo0qU9eOhfTGaezAH_EPHzI83g2_8kjuuCv7aEqp5lQ3FL6_4dVtbEUqiw"
  },
  {
    id: 7,
    name: "Sello Lacre Vintage",
    description: "Sello de lacre personalizado con mango de madera y diseño clásico.",
    price: 590,
    category: "Papelería Creativa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApSEQbzMjFCtQsZdNJ0_TSV-pDXAswJqdK4AIZVm6l_T9LDjsS8ai-JHs7FA0UGFYIe9ONspZzZlhId3lK1zr0S2pl_VQKMzvEkutT7QAscWjxaI-eXZmVvOmt5KGr9VVIJrp6BQleTFfr2Y8uTyuip3oUEs5Tos8N_JHCpamGgcL57AF7kq750fZvp9dbbNF8WB4_lNjEW5LJK12K8TsgxrqK9M_ZWH7_f3Rw8ivkZUecP15O72sL56Qj7XSK0cqt1e36GGuHag"
  },
  {
    id: 8,
    name: "Etiquetas Silk Ribbon",
    description: "Etiquetas de cartoncillo premium con listón de seda para regalos exclusivos.",
    price: 190,
    category: "Papelería Creativa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5Mf-k5cfgoiylxavEk6Sx3m--1ongF21d9iKQlhRnJnTUm83jQQ9TeESCl4OYrlcFWv3ZA4uv7aPOi0KgK8e5ju9u-qTkMI6b1jvrwcU8hv5tK6iEMAXwiZXUwhbX5uuZGgtKE0Zjiia1Shz1ENVmnUN3UMk9XVScl6GaVURC0qorLbnfhqW1P7wy_Xm6bCCuTbSKUDbDjvalxKMiVTNgbw2HxdvBqRrH_wx5lMQE7GgrVZdRWO4bPFtD_LwXQ0YcqO8sXNN9-Q"
  },
  {
    id: 9,
    name: "Etiqueta Termoadhesiva 55 pzas",
    description: "Etiqueta textil de 1.3 x 5.2 cm diseñada para identificación permanente en ropa mediante calor. Resistente a lavados.",
    price: 110,
    category: "Personalización",
    sub_category: "Etiquetas",
    image: "https://lh3.googleusercontent.com/pw/AP1GczO_Z7xPZk4x1T-_m_p0_FpYfV6g-m4k8E_k_uG_x_y-q-6Z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8z_u-q_z-8" 
  }
];
