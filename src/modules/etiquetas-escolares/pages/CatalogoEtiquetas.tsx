import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalFooter } from '../../../components/common/GlobalFooter';

const BASE_URL = 'https://catalogo.imagineandstamp.site/';
const WHATSAPP_NUMBER = '525650469993'; // Replace with actual number

interface LabelDesign {
  id: string | number;
  name: string;
  folder: string;
  imageFile: string;
  category?: 'personajes' | 'siluetas';
}

const mockData: LabelDesign[] = [
  { id: 1, name: "101 Dalmatas", folder: "101 Dalmatas", imageFile: "Etiquetas_Escolares_131.png" },
  { id: 2, name: "Agnes", folder: "Agnes", imageFile: "Etiquetas_Escolares_244.png" },
  { id: 3, name: "Agumon", folder: "Agumon", imageFile: "Etiquetas_Escolares_100.png" },
  { id: 4, name: "Akatsuki", folder: "Akatsuki", imageFile: "Etiquetas_Escolares_252.png" },
  { id: 5, name: "Aladdin", folder: "Aladdin", imageFile: "Etiquetas_Escolares_135.png" },
  { id: 6, name: "Among Us", folder: "Among Us", imageFile: "Etiquetas_Escolares_280.png" },
  { id: 7, name: "Angela", folder: "Angela", imageFile: "Etiquetas_Escolares_36.png" },
  { id: 8, name: "Anna", folder: "Anna", imageFile: "Etiquetas_Escolares_211.png" },
  { id: 9, name: "Ariel", folder: "Ariel", imageFile: "Etiquetas_Escolares_146.png" },
  { id: 10, name: "Ariel 2", folder: "Ariel 2", imageFile: "Etiquetas_Escolares_147.png" },
  { id: 11, name: "Arlo", folder: "Arlo", imageFile: "Etiquetas_Escolares_127.png" },
  { id: 12, name: "Ash Y Pikachu", folder: "Ash Y Pikachu", imageFile: "Etiquetas_Escolares_277.png" },
  { id: 13, name: "Attack on Titan", folder: "Attack on Titan", imageFile: "Etiquetas_Escolares_85.png" },
  { id: 14, name: "Aurora", folder: "Aurora", imageFile: "Etiquetas_Escolares_141.png" },
  { id: 15, name: "Aurora 2", folder: "Aurora 2", imageFile: "Etiquetas_Escolares_142.png" },
  { id: 16, name: "Avatar", folder: "Avatar", imageFile: "Etiquetas_Escolares_111.png" },
  { id: 17, name: "Baby Shark", folder: "Baby Shark", imageFile: "Etiquetas_Escolares_159.png" },
  { id: 18, name: "Baby Shark 2", folder: "Baby Shark 2", imageFile: "Etiquetas_Escolares_160.png" },
  { id: 19, name: "Baby Yoda", folder: "Baby Yoda", imageFile: "Etiquetas_Escolares_192.png" },
  { id: 20, name: "Bad Bunny", folder: "Bad Bunny", imageFile: "Etiquetas_Escolares_188.png" },
  { id: 21, name: "Barbie", folder: "Barbie", imageFile: "Etiquetas_Escolares_143.png" },
  { id: 22, name: "Barbie 2", folder: "Barbie 2", imageFile: "Etiquetas_Escolares_144.png" },
  { id: 23, name: "Barbie 3", folder: "Barbie 3", imageFile: "Etiquetas_Escolares_203.png" },
  { id: 24, name: "Bart", folder: "Bart", imageFile: "Etiquetas_Escolares_11.png" },
  { id: 25, name: "Batman", folder: "Batman", imageFile: "Etiquetas_Escolares_214.png" },
  { id: 26, name: "Bebes Llorones", folder: "Bebes Llorones", imageFile: "Etiquetas_Escolares_225.png" },
  { id: 27, name: "Beli y beto", folder: "Beli y beto", imageFile: "Etiquetas_Escolares_119.png" },
  { id: 28, name: "Bella", folder: "Bella", imageFile: "Etiquetas_Escolares_139 (6).png" },
  { id: 29, name: "Bella 2", folder: "Bella 2", imageFile: "Etiquetas_Escolares_140.png" },
  { id: 30, name: "Bely y Beto 2", folder: "Bely y Beto 2", imageFile: "Etiquetas_Escolares_120 (6).png" },
  { id: 31, name: "Ben 10", folder: "Ben 10", imageFile: "Etiquetas_Escolares_236.png" },
  { id: 32, name: "Beyblade", folder: "Beyblade", imageFile: "Etiquetas_Escolares_102.png" },
  { id: 33, name: "Big City Greens", folder: "Big City Greens", imageFile: "Etiquetas_Escolares_247.png" },
  { id: 34, name: "Big Hero", folder: "Big Hero", imageFile: "Etiquetas_Escolares_110.png" },
  { id: 35, name: "Billie Eilish", folder: "Billie Eilish", imageFile: "Etiquetas_Escolares_184.png" },
  { id: 36, name: "Black Panther", folder: "Black Panther", imageFile: "Etiquetas_Escolares_58.png" },
  { id: 37, name: "Blancanieves", folder: "Blancanieves", imageFile: "Etiquetas_Escolares_137 (2).png" },
  { id: 38, name: "Blastoise", folder: "Blastoise", imageFile: "Etiquetas_Escolares_02_1.png" },
  { id: 39, name: "Blaze y los Monster Machines", folder: "Blaze y los Monster Machines", imageFile: "Etiquetas_Escolares_258.png" },
  { id: 40, name: "Bluey", folder: "Bluey", imageFile: "Etiquetas_Escolares_269.png" },
  { id: 41, name: "Bob El Constructor", folder: "Bob El Constructor", imageFile: "Etiquetas_Escolares_157.png" },
  { id: 42, name: "Bob Esponja", folder: "Bob Esponja", imageFile: "Etiquetas_Escolares_32 (6).png" },
  { id: 43, name: "Boss Baby", folder: "Boss Baby", imageFile: "Etiquetas_Escolares_121.png" },
  { id: 44, name: "Boss Baby 2", folder: "Boss Baby 2", imageFile: "Etiquetas_Escolares_122.png" },
  { id: 45, name: "Brawl Stars", folder: "Brawl Stars", imageFile: "Etiquetas_Escolares_01.png" },
  { id: 46, name: "Broly", folder: "Broly", imageFile: "Etiquetas_Escolares_91.png" },
  { id: 47, name: "BTS", folder: "BTS", imageFile: "Etiquetas_Escolares_193.png" },
  { id: 48, name: "BTS 2", folder: "BTS 2", imageFile: "Etiquetas_Escolares_194.png" },
  { id: 49, name: "Bulbasaur", folder: "Bulbasaur", imageFile: "Etiquetas_Escolares_279.png" },
  { id: 50, name: "Bumblebee", folder: "Bumblebee", imageFile: "Etiquetas_Escolares_53.png" },
  { id: 51, name: "Buzz Lightyear", folder: "Buzz Lightyear", imageFile: "Etiquetas_Escolares_114.png" },
  { id: 52, name: "Calamardo", folder: "Calamardo", imageFile: "Etiquetas_Escolares_29.png" },
  { id: 53, name: "Calamardo 2", folder: "Calamardo 2", imageFile: "Etiquetas_Escolares_31.png" },
  { id: 54, name: "Capibara", folder: "Capibara", imageFile: "Etiquetas_Escolares_34.png" },
  { id: 55, name: "Capitan America", folder: "Capitan America", imageFile: "Etiquetas_Escolares_50 (5).png" },
  { id: 56, name: "Care Bears", folder: "Care Bears", imageFile: "Etiquetas_Escolares_45 (6).png" },
  { id: 57, name: "Carl Fredricksen", folder: "Carl Fredricksen", imageFile: "Etiquetas_Escolares_125.png" },
  { id: 58, name: "Charizard", folder: "Charizard", imageFile: "Etiquetas_Escolares_04.png" },
  { id: 59, name: "Charmander", folder: "Charmander", imageFile: "Etiquetas_Escolares_05 (5).png" },
  { id: 60, name: "Chase", folder: "Chase", imageFile: "Etiquetas_Escolares_255.png" },
  { id: 61, name: "Chicas Super Poderosas", folder: "Chicas Super Poderosas", imageFile: "Etiquetas_Escolares_103.png" },
  { id: 62, name: "Chimuelo", folder: "Chimuelo", imageFile: "Etiquetas_Escolares_170.png" },
  { id: 63, name: "Cinnamoroll", folder: "Cinnamoroll", imageFile: "Etiquetas_Escolares_199.png" },
  { id: 64, name: "Clash Royale", folder: "Clash Royale", imageFile: "Etiquetas_Escolares_66.png" },
  { id: 65, name: "Coco", folder: "Coco", imageFile: "Etiquetas_Escolares_116.png" },
  { id: 66, name: "Cocomelon", folder: "Cocomelon", imageFile: "Etiquetas_Escolares_78.png" },
  { id: 67, name: "Cookie Monster", folder: "Cookie Monster", imageFile: "Etiquetas_Escolares_25.png" },
  { id: 68, name: "Crepusculo", folder: "Crepusculo", imageFile: "Etiquetas_Escolares_70.png" },
  { id: 69, name: "Cristiano Ronaldo", folder: "Cristiano Ronaldo", imageFile: "Etiquetas_Escolares_185.png" },
  { id: 70, name: "Cuphead", folder: "Cuphead", imageFile: "Etiquetas_Escolares_64.png" },
  { id: 71, name: "Cuphead 2", folder: "Cuphead 2", imageFile: "Etiquetas_Escolares_65.png" },
  { id: 72, name: "Curioso George", folder: "Curioso George", imageFile: "Etiquetas_Escolares_89 (6).png" },
  { id: 73, name: "Deadpool", folder: "Deadpool", imageFile: "Etiquetas_Escolares_59.png" },
  { id: 74, name: "Deadpool 2", folder: "Deadpool 2", imageFile: "Etiquetas_Escolares_60.png" },
  { id: 75, name: "Demon Slayer", folder: "Demon Slayer", imageFile: "Etiquetas_Escolares_73.png" },
  { id: 76, name: "Digital Circus", folder: "Digital Circus", imageFile: "Etiquetas_Escolares_180.png" },
  { id: 77, name: "Doctora Juguetes", folder: "Doctora Juguetes", imageFile: "Etiquetas_Escolares_112.png" },
  { id: 78, name: "Dora La Exploradora", folder: "Dora La Exploradora", imageFile: "Etiquetas_Escolares_123.png" },
  { id: 79, name: "Edward Elric", folder: "Edward Elric", imageFile: "Etiquetas_Escolares_86.png" },
  { id: 80, name: "El Juego Del Calamar", folder: "El Juego Del Calamar", imageFile: "Etiquetas_Escolares_189.png" },
  { id: 81, name: "Elmo", folder: "Elmo", imageFile: "Etiquetas_Escolares_24.png" },
  { id: 82, name: "Elsa", folder: "Elsa", imageFile: "Etiquetas_Escolares_212.png" },
  { id: 83, name: "Evangelion", folder: "Evangelion", imageFile: "Etiquetas_Escolares_87.png" },
  { id: 84, name: "Evangelion 2", folder: "Evangelion 2", imageFile: "Etiquetas_Escolares_88.png" },
  { id: 85, name: "EVE", folder: "EVE", imageFile: "Etiquetas_Escolares_118.png" },
  { id: 86, name: "Fallout", folder: "Fallout", imageFile: "Etiquetas_Escolares_182.png" },
  { id: 87, name: "Fiona", folder: "Fiona", imageFile: "Etiquetas_Escolares_165.png" },
  { id: 88, name: "Five Nights At Freddys", folder: "Five Nights At Freddys", imageFile: "Etiquetas_Escolares_207.png" },
  { id: 89, name: "Five Nights At Freddys 2", folder: "Five Nights At Freddys 2", imageFile: "Etiquetas_Escolares_208.png" },
  { id: 90, name: "Five Nights At Freddys 3", folder: "Five Nights At Freddys 3", imageFile: "Etiquetas_Escolares_209.png" },
  { id: 91, name: "Five Nights At Freddys 4", folder: "Five Nights At Freddys 4", imageFile: "Etiquetas_Escolares_210.png" },
  { id: 92, name: "Fortnite", folder: "Fortnite", imageFile: "Etiquetas_Escolares_205.png" },
  { id: 93, name: "Gengar", folder: "Gengar", imageFile: "Etiquetas_Escolares_03_1.png" },
  { id: 94, name: "Geometry Dash", folder: "Geometry Dash", imageFile: "Etiquetas_Escolares_181.png" },
  { id: 95, name: "Ghost", folder: "Ghost", imageFile: "Etiquetas_Escolares_12.png" },
  { id: 96, name: "Godzilla", folder: "Godzilla", imageFile: "Etiquetas_Escolares_151.png" },
  { id: 97, name: "Goku", folder: "Goku", imageFile: "Etiquetas_Escolares_94.png" },
  { id: 98, name: "Goku 2", folder: "Goku 2", imageFile: "Etiquetas_Escolares_94 (3).png" },
  { id: 99, name: "Goku 3", folder: "Goku 3", imageFile: "Etiquetas_Escolares_145.png" },
  { id: 100, name: "Goku 4", folder: "Goku 4", imageFile: "Etiquetas_Escolares_166.png" },
  { id: 101, name: "Goku 5", folder: "Goku 5", imageFile: "Etiquetas_Escolares_178 (6).png" },
  { id: 102, name: "Goku 6", folder: "Goku 6", imageFile: "Etiquetas_Escolares_156.png" },
  { id: 103, name: "Goku Black", folder: "Goku Black", imageFile: "Etiquetas_Escolares_134.png" },
  { id: 104, name: "Grand Theft Auto", folder: "Grand Theft Auto", imageFile: "Etiquetas_Escolares_174.png" },
  { id: 105, name: "Gravity Falls", folder: "Gravity Falls", imageFile: "Etiquetas_Escolares_108 (2).png" },
  { id: 106, name: "Gru", folder: "Gru", imageFile: "Etiquetas_Escolares_245.png" },
  { id: 107, name: "Guardianes de la Galaxia", folder: "Guardianes de la Galaxia", imageFile: "Etiquetas_Escolares_62.png" },
  { id: 108, name: "Gumball", folder: "Gumball", imageFile: "Etiquetas_Escolares_183.png" },
  { id: 109, name: "Halo", folder: "Halo", imageFile: "Etiquetas_Escolares_176.png" },
  { id: 110, name: "Harry Potter", folder: "Harry Potter", imageFile: "Etiquetas_Escolares_213.png" },
  { id: 111, name: "Hello Kitty", folder: "Hello Kitty", imageFile: "Etiquetas_Escolares_69.png" },
  { id: 112, name: "Hollow Knight", folder: "Hollow Knight", imageFile: "Etiquetas_Escolares_195.png" },
  { id: 113, name: "Hollow Knight 2", folder: "Hollow Knight 2", imageFile: "Etiquetas_Escolares_196.png" },
  { id: 114, name: "Homer", folder: "Homer", imageFile: "Etiquetas_Escolares_13.png" },
  { id: 115, name: "Hora De Aventura", folder: "Hora De Aventura", imageFile: "Etiquetas_Escolares_106.png" },
  { id: 116, name: "Hotel Transylvania", folder: "Hotel Transylvania", imageFile: "Etiquetas_Escolares_171.png" },
  { id: 117, name: "Hulk", folder: "Hulk", imageFile: "Etiquetas_Escolares_49.png" },
  { id: 118, name: "Hunter Hunter", folder: "Hunter Hunter", imageFile: "Etiquetas_Escolares_98.png" },
  { id: 119, name: "Igor", folder: "Igor", imageFile: "Etiquetas_Escolares_80.png" },
  { id: 120, name: "Intensamente", folder: "Intensamente", imageFile: "Etiquetas_Escolares_215.png" },
  { id: 121, name: "Iron Man", folder: "Iron Man", imageFile: "Etiquetas_Escolares_54.png" },
  { id: 122, name: "Isabela", folder: "Isabela", imageFile: "Etiquetas_Escolares_200.png" },
  { id: 123, name: "Jazmin", folder: "Jazmin", imageFile: "Etiquetas_Escolares_136 (2).png" },
  { id: 124, name: "Jessie", folder: "Jessie", imageFile: "Etiquetas_Escolares_113.png" },
  { id: 125, name: "Joker", folder: "Joker", imageFile: "Etiquetas_Escolares_152.png" },
  { id: 126, name: "Joker 2", folder: "Joker 2", imageFile: "Etiquetas_Escolares_153.png" },
  { id: 127, name: "Jurassic Park", folder: "Jurassic Park", imageFile: "Etiquetas_Escolares_217 (6).png" },
  { id: 128, name: "Jurassic World", folder: "Jurassic World", imageFile: "Etiquetas_Escolares_216.png" },
  { id: 129, name: "Kaonashi", folder: "Kaonashi", imageFile: "Etiquetas_Escolares_96.png" },
  { id: 130, name: "Keroppi", folder: "Keroppi", imageFile: "Etiquetas_Escolares_198.png" },
  { id: 131, name: "King Kong", folder: "King Kong", imageFile: "Etiquetas_Escolares_150.png" },
  { id: 132, name: "Kirby", folder: "Kirby", imageFile: "Etiquetas_Escolares_197.png" },
  { id: 133, name: "Kratos", folder: "Kratos", imageFile: "Etiquetas_Escolares_175.png" },
  { id: 134, name: "Kuromi", folder: "Kuromi", imageFile: "Etiquetas_Escolares_68.png" },
  { id: 135, name: "Labubus", folder: "Labubus", imageFile: "Etiquetas_Escolares_222.png" },
  { id: 136, name: "Labubus 2", folder: "Labubus 2", imageFile: "Etiquetas_Escolares_223.png" },
  { id: 137, name: "Labubus 3", folder: "Labubus 3", imageFile: "Etiquetas_Escolares_224.png" },
  { id: 138, name: "Labubus 4", folder: "Labubus 4", imageFile: "Etiquetas_Escolares_226 (6).png" },
  { id: 139, name: "Ladybug", folder: "Ladybug", imageFile: "Etiquetas_Escolares_227.png" },
  { id: 140, name: "Lego 2", folder: "Lego 2", imageFile: "Etiquetas_Escolares_219.png" },
  { id: 141, name: "Liga De La Justicia", folder: "Liga De La Justicia", imageFile: "Etiquetas_Escolares_154.png" },
  { id: 142, name: "Liga De La Justicia 2", folder: "Liga De La Justicia 2", imageFile: "Etiquetas_Escolares_155.png" },
  { id: 143, name: "Lionel Messi", folder: "Lionel Messi", imageFile: "Etiquetas_Escolares_186.png" },
  { id: 144, name: "Lisa", folder: "Lisa", imageFile: "Etiquetas_Escolares_15.png" },
  { id: 145, name: "LOL Surprise 2", folder: "LOL Surprise 2", imageFile: "Etiquetas_Escolares_221.png" },
  { id: 146, name: "Los Croods", folder: "Los Croods", imageFile: "Etiquetas_Escolares_172.png" },
  { id: 147, name: "Luffy", folder: "Luffy", imageFile: "Etiquetas_Escolares_254.png" },
  { id: 148, name: "Mabel", folder: "Mabel", imageFile: "Etiquetas_Escolares_109 (6).png" },
  { id: 149, name: "Madagascar", folder: "Madagascar", imageFile: "Etiquetas_Escolares_162.png" },
  { id: 150, name: "Marge", folder: "Marge", imageFile: "Etiquetas_Escolares_14 (6).png" },
  { id: 151, name: "Mario Bros", folder: "Mario Bros", imageFile: "Etiquetas_Escolares_228.png" },
  { id: 152, name: "Mario Bros 2", folder: "Mario Bros 2", imageFile: "Etiquetas_Escolares_229.png" },
  { id: 153, name: "Marshmello", folder: "Marshmello", imageFile: "Etiquetas_Escolares_206.png" },
  { id: 154, name: "Megamind", folder: "Megamind", imageFile: "Etiquetas_Escolares_173 (6).png" },
  { id: 155, name: "Merlina", folder: "Merlina", imageFile: "Etiquetas_Escolares_71.png" },
  { id: 156, name: "Minecraft 2", folder: "Minecraft 2", imageFile: "Etiquetas_Escolares_241.png" },
  { id: 157, name: "Minecraft 3", folder: "Minecraft 3", imageFile: "Etiquetas_Escolares_242.png" },
  { id: 158, name: "Minnie Mouse", folder: "Minnie Mouse", imageFile: "Etiquetas_Escolares_238.png" },
  { id: 159, name: "Minnie Mouse 2", folder: "Minnie Mouse 2", imageFile: "Etiquetas_Escolares_239.png" },
  { id: 160, name: "Mirabel", folder: "Mirabel", imageFile: "Etiquetas_Escolares_202.png" },
  { id: 161, name: "Mis Pastelitos", folder: "Mis Pastelitos", imageFile: "Etiquetas_Escolares_191.png" },
  { id: 162, name: "Moana", folder: "Moana", imageFile: "Etiquetas_Escolares_72.png" },
  { id: 's1', name: "Silueta Ejemplo", folder: "Siluetas", imageFile: "Silueta_1.png", category: "siluetas" }
];

export default function CatalogoEtiquetas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'personajes' | 'siluetas'>('personajes');

  // Modal state
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const filteredDesigns = useMemo(() => {
    return mockData.filter(design => {
      const designCategory = design.category || 'personajes';
      const matchesCategory = designCategory === activeTab;
      const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeTab]);

  const handleOpenModal = (designName: string) => {
    setSelectedDesign(designName);
    setChildName('');
    setGrade('');
    setGroup('');
    setAdditionalInfo('');
  };

  const handleCloseModal = () => {
    setSelectedDesign(null);
  };

  const handleSendWhatsApp = () => {
    if (!selectedDesign) return;
    const text = `¡Hola Imagine & Stamp! Quiero hacer mi pedido de etiquetas escolares con el diseño de ${selectedDesign}.\n\nNombre del niño(a): ${childName}\nGrado escolar: ${grade}\nGrupo: ${group}\nDatos adicionales: ${additionalInfo}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    handleCloseModal();
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Section */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight">
            Catálogo de Etiquetas Escolares 2026
          </h1>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar diseño (ej. Among Us)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors shadow-sm outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('personajes')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-colors ${
                activeTab === 'personajes' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Personajes
            </button>
            <button
              onClick={() => setActiveTab('siluetas')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-colors ${
                activeTab === 'siluetas' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Siluetas de Nombres
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          {filteredDesigns.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-gray-500 text-lg"
            >
              No encontramos diseños que coincidan con tu búsqueda.
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredDesigns.map((design) => {
                  const imageUrl = encodeURI(`${BASE_URL}${design.folder}/${design.imageFile}`);
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      key={design.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col"
                    >
                      {/* Image container */}
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`Diseño ${design.name}`} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-4 flex-1">
                          {design.name}
                        </h3>
                        
                        <button
                          onClick={() => handleOpenModal(design.name)}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Pedir este diseño
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GlobalFooter />

      {/* Modal de Pedido */}
      <AnimatePresence>
        {selectedDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido: {selectedDesign}</h2>
              <p className="text-gray-600 mb-6">Por favor llena estos datos para agilizar tu pedido por WhatsApp.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del niño(a) *</label>
                  <input 
                    type="text" 
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                    <input 
                      type="text" 
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      placeholder="Ej. 2do Primaria"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <input 
                      type="text" 
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      placeholder="Ej. A"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datos adicionales (opcional)</label>
                  <textarea 
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                    rows={3}
                    placeholder="Materia, escuela, etc."
                  />
                </div>
                
                <button
                  onClick={handleSendWhatsApp}
                  disabled={!childName.trim()}
                  className="w-full mt-2 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
