import type { Gift, ReactionCategory, Room, Tier } from "@/lib/types";
import photos from "./gift-photos.json";

/** Foto de cada presente (opcional) com crédito da licença. Gerado por scripts/fotos-presentes. */
export interface GiftPhoto {
  src: string;
  title?: string;
  author: string;
  license: string;
  url: string;
}
export const giftPhotos = photos as Record<string, GiftPhoto>;

/**
 * Lista de presentes da Kawany (novembro de 2026).
 * Para trocar a lista, edite só este arquivo. Campos:
 *  - quantity: quantas pessoas podem escolher o item. "(2)" na lista original vira 2.
 *  - room/slot: onde o item aparece na casinha (slots em src/components/house/slots.ts).
 *  - iconKey: desenho line-art (src/components/icons). Sem ícone ou slot válido,
 *    o item entra como caixa de presente no primeiro lugar livre do cômodo.
 */
type Row = [
  id: string,
  title: string,
  description: string,
  room: Room,
  slot: string,
  iconKey: string,
  category: ReactionCategory,
  quantity?: number,
  searchQuery?: string,
  phrase?: string,
];

const ate50: Row[] = [
  ["kit-corte", "Kit Corte", "Descascador, ralador e cortador de pizza.", "cozinha", "trilho-1", "kit-corte", "utensilios", 1, "kit descascador ralador cortador de pizza"],
  ["kit-espatulas", "Kit Espátulas", "Espátula de silicone, espátula para bolo e fouet.", "cozinha", "trilho-2", "kit-espatulas", "utensilios", 1, "kit espátula silicone espátula bolo fouet"],
  ["kit-concha", "Kit Concha e Cia.", "Concha, escumadeira e pegador de macarrão.", "cozinha", "trilho-3", "kit-concha", "utensilios", 1, "kit concha escumadeira pegador de macarrão"],
  ["kit-arroz-sorvete", "Kit Arroz e Sorvete", "Colher de arroz, pegador de sorvete e descanso de panela.", "cozinha", "trilho-4", "kit-arroz-sorvete", "utensilios", 1, "colher de arroz pegador de sorvete descanso de panela"],
  ["kit-espremedores", "Kit Espremedores", "Espremedor de alho, espremedor de limão e abridor de latas e garrafas.", "cozinha", "trilho-5", "kit-espremedores", "utensilios", 1, "espremedor de alho espremedor de limão abridor de latas"],
  ["kit-temperos", "Kit Temperos", "Saleiro, açucareiro e porta-azeite (galheteiro).", "copa", "mesa-e", "kit-temperos", "louca", 1, "kit saleiro açucareiro galheteiro"],
  ["kit-panos", "Kit Panos", "Três panos de prato e um avental. A noiva pediu repetido: pano de prato nunca sobra.", "cozinha", "forno-alca", "kit-panos", "utensilios", 3, "kit panos de prato avental"],
  ["kit-mesa-posta", "Kit Mesa Posta", "Jogo americano e porta-guardanapo.", "copa", "mesa-base", "kit-mesa-posta", "louca", 2, "jogo americano porta guardanapo"],
  ["kit-forno", "Kit Forno", "Luva térmica e descanso de panela.", "cozinha", "trilho-6", "kit-forno", "utensilios", 1, "luva térmica descanso de panela"],
  ["kit-medidas", "Kit Medidas", "Jogo de medidores e peneira.", "cozinha", "trilho-7", "kit-medidas", "utensilios", 1, "jogo de medidores cozinha peneira"],
  ["kit-limpeza", "Kit Limpeza", "Rodo, balde e vassoura.", "servico", "chao-canto", "kit-limpeza", "limpeza", 1, "kit rodo balde vassoura"],
  ["kit-pia", "Kit Pia", "Organizador de pia, dispenser de detergente e escorredor pequeno.", "cozinha", "pia", "kit-pia", "organizacao", 1, "organizador de pia dispenser detergente escorredor"],
];

const de50a150: Row[] = [
  ["jogo-de-facas", "Jogo de facas", "Um jogo de facas que corta de verdade.", "cozinha", "bancada-1", "jogo-de-facas", "utensilios", 1, "jogo de facas cozinha"],
  ["tabua-de-corte", "Tábua de corte de madeira", "Para o dia a dia. Duas, porque uma sempre está na pia.", "cozinha", "bancada-2", "tabua-de-corte", "utensilios", 2, "tábua de corte de madeira"],
  ["jogo-de-copos", "Jogo de copos", "Copos de vidro para o dia a dia. Copo nunca é demais.", "copa", "cristaleira-1", "jogo-de-copos", "louca", 3, "jogo de copos de vidro"],
  ["jogo-de-xicaras", "Jogo de xícaras de café", "Para o café da tarde, com pires.", "copa", "cristaleira-2", "jogo-de-xicaras", "louca", 2, "jogo de xícaras de café com pires"],
  ["jogo-de-tacas", "Jogo de taças", "Para os brindes que virão.", "copa", "cristaleira-3", "jogo-de-tacas", "louca", 2, "jogo de taças"],
  ["pratos-sobremesa", "Jogo de pratos de sobremesa", "Porque sobremesa merece prato próprio.", "copa", "cristaleira-4", "pratos-sobremesa", "louca", 2, "jogo de pratos de sobremesa"],
  ["jogo-de-bowls", "Jogo de bowls", "Para açaí, salada ou cereal à meia-noite.", "copa", "cristaleira-5", "jogo-de-bowls", "louca", 2, "jogo de bowls"],
  ["potes-de-vidro", "Jogo de potes de vidro", "Para guardar a comida de amanhã.", "despensa", "prateleira-1", "potes-de-vidro", "organizacao", 2, "jogo de potes de vidro"],
  ["potes-temperos", "Jogo de potes para temperos", "Cada tempero com seu nome.", "cozinha", "prateleira-1", "potes-temperos", "organizacao", 1, "jogo de potes para temperos"],
  ["travessa-grande", "Travessa grande", "Para a lasanha de domingo.", "despensa", "prateleira-5", "travessa-grande", "panelas", 1, "travessa grande refratária"],
  ["travessa-media", "Travessa média", "Para o arroz de forno de quarta.", "despensa", "prateleira-6", "travessa-media", "panelas", 1, "travessa média refratária"],
  ["frigideira", "Frigideira", "Antiaderente, de preferência.", "cozinha", "fogao-1", "frigideira", "panelas", 1, "frigideira antiaderente"],
  ["assadeira", "Assadeira retangular", "Para bolo, assado e tudo o que couber.", "despensa", "prateleira-7", "assadeira", "panelas", 2, "assadeira retangular"],
  ["jarra-de-vidro", "Jarra de vidro", "Para o suco ou a água com limão.", "copa", "mesa-c", "jarra-de-vidro", "louca", 1, "jarra de vidro"],
  ["bandeja", "Bandeja de servir", "Para servir com estilo ou levar o café na cama.", "copa", "parede-aparador", "bandeja", "louca", 1, "bandeja de servir"],
  ["lixeira", "Lixeira", "Uma para a cozinha e outra para o resto da casa.", "cozinha", "chao-canto", "lixeira", "limpeza", 2, "lixeira com pedal"],
  ["tapete-cozinha", "Tapete de cozinha", "Para ficar em frente à pia.", "cozinha", "chao-frente", "tapete-cozinha", "limpeza", 1, "tapete de cozinha"],
  ["garrafa-termica", "Garrafa térmica", "Café quente até a visita chegar.", "copa", "aparador-2", "garrafa-termica", "louca", 1, "garrafa térmica café"],
  ["bule", "Bule de chá", "Para o chá das cinco ou das nove.", "copa", "aparador-3", "bule", "louca", 1, "bule de chá"],
  ["leiteira", "Leiteira", "Para o leite não derramar. Pelo menos não sempre.", "cozinha", "fogao-2", "leiteira", "panelas", 1, "leiteira"],
  ["tabua-de-frios", "Tábua de frios", "Queijo, vinho e uma boa conversa.", "copa", "mesa-a", "tabua-de-frios", "louca", 1, "tábua de frios"],
  ["porta-mantimentos", "Porta-mantimentos", "Arroz, feijão, açúcar e café, todos à vista.", "despensa", "prateleira-2", "porta-mantimentos", "organizacao", 1, "porta mantimentos"],
  ["porta-pao", "Porta-pão", "Para o pão de amanhã continuar pão.", "despensa", "prateleira-3", "porta-pao", "organizacao", 1, "porta pão"],
  ["manteigueira", "Manteigueira", "Manteiga sempre no ponto.", "copa", "mesa-d", "manteigueira", "louca", 1, "manteigueira"],
  ["porta-frios", "Porta-frios", "Para o presunto e o queijo da semana.", "copa", "mesa-b", "porta-frios", "organizacao", 1, "porta frios"],
  ["jarra-medidora", "Jarra medidora", "Para a receita dar certo na primeira vez.", "cozinha", "prateleira-2", "jarra-medidora", "utensilios", 1, "jarra medidora"],
  ["mop", "Mop", "Para o chão brilhar sem esforço. Quase.", "servico", "chao-frente", "mop", "limpeza", 1, "mop giratório"],
];

const eletro: Row[] = [
  ["sanduicheira", "Sanduicheira", "Para o misto-quente das noites sem vontade de cozinhar.", "cozinha", "bancada-5", "sanduicheira", "eletro", 1, "sanduicheira elétrica", "Misto-quente garantido."],
  ["chaleira-eletrica", "Chaleira elétrica", "Água quente em três minutos.", "copa", "aparador-4", "chaleira-eletrica", "eletro", 1, "chaleira elétrica"],
  ["mixer", "Mixer de mão", "Sopa, vitamina e molho sem lavar o liquidificador.", "cozinha", "bancada-6", "mixer", "eletro", 1, "mixer de mão"],
  ["cafeteira", "Cafeteira elétrica", "Para o café nunca faltar nesta casa.", "copa", "aparador-1", "cafeteira", "eletro", 1, "cafeteira elétrica", "Café nunca mais vai faltar."],
  ["batedeira", "Batedeira", "Para os bolos que a noiva promete fazer.", "cozinha", "bancada-4", "batedeira", "eletro", 1, "batedeira"],
];

const acima150: Row[] = [
  ["potes-hermeticos", "Jogo de potes herméticos de vidro", "Vidro com tampa que veda de verdade.", "despensa", "prateleira-4", "potes-hermeticos", "organizacao", 1, "jogo de potes herméticos de vidro"],
  ["jogo-de-pratos", "Jogo de pratos", "Pratos rasos e fundos, simples, para o dia a dia.", "copa", "cristaleira-6", "jogo-de-pratos", "louca", 2, "jogo de pratos raso e fundo"],
  ["jogo-de-talheres", "Jogo de talheres", "Garfo, faca e colher para a casa toda.", "copa", "mesa-f", "jogo-de-talheres", "louca", 2, "jogo de talheres inox"],
  ["faqueiro-servir", "Faqueiro para servir", "Talheres de servir, para quando tiver visita.", "copa", "mesa-g", "faqueiro-servir", "louca", 1, "faqueiro talheres de servir"],
  ["liquidificador", "Liquidificador", "Vitamina, suco e molho de tomate caseiro.", "cozinha", "bancada-3", "liquidificador", "eletro", 1, "liquidificador"],
  ["airfryer", "Air fryer", "A estrela da bancada.", "cozinha", "bancada-7", "airfryer", "eletro", 1, "air fryer", "Finalmente uma air fryer."],
];

const tiers: [Tier, Row[]][] = [
  ["ate-50", ate50],
  ["50-150", de50a150],
  ["eletro", eletro],
  ["acima-150", acima150],
];

let order = 0;
export const defaultGifts: Gift[] = tiers.flatMap(([tier, rows]) =>
  rows.map(([id, title, description, room, slot, iconKey, category, quantity = 1, searchQuery = title, phrase]) => ({
    id,
    title,
    description,
    room,
    slot,
    iconKey,
    category,
    quantity,
    searchQuery,
    phrase,
    featuredUrl: null,
    image: giftPhotos[id]?.src ?? null,
    order: order++,
    tier,
  })),
);
