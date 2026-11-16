/** Textos do site, tirados do convite (CONVITE CHÁ DE PANELA.pdf). */
export const copy = {
  hero: {
    kicker: "de panela",
    title: "Chá dos Noivos",
    addressSoon: "endereço em breve",
    ctaGifts: "Ver a lista de presentes",
    ctaMessage: "Deixar um recado",
  },
  casar: {
    title: "Vamos casar!",
    body: "O nosso dia está chegando, e estamos cada vez mais felizes e ansiosos por esse momento! Gostaríamos muito de contar com você em mais um dia especial!",
    photoAlt: "Mãos do casal com a aliança de noivado, com montanhas ao fundo",
  },
  roteiro: {
    title: "Roteiro",
    items: [
      { text: "Comer, né? Que o cabra não é de ferro.", img: "/assets/convite/roteiro-1.webp" },
      { text: "Umas brincadeiras que a noiva inventou.", img: "/assets/convite/roteiro-2.webp" },
      { text: "Abertura dos presentes.", img: "/assets/convite/roteiro-3.webp" },
    ],
  },
  comoFazerParte: {
    title: "Como fazer parte?",
    body: "Você deverá acessar o link abaixo, escolher o presente que deseja oferecer e colocar seu nome.",
    cta: "Escolher meu presente",
    videoSoon: "Aqui dentro um vídeo explicativo",
    privacy: "Obs.: os noivos não verão quem escolheu cada presente.",
  },
  vamo: { word: "VAMO?", cta: "VAMOS?????" },
  agenda: { button: "Adicionar à agenda" },
  local: { label: "Onde vai ser", route: "Como chegar", waze: "Waze" },
  pix: {
    title: "Caso você queira contribuir de outra forma… $$$",
    label: "Nosso Pix",
    copy: "Toque para copiar",
    copied: "Copiado!",
    soon: "Chave Pix em breve",
    mark: {
      title: "Já fez o Pix?",
      lead: "Toque no valor que você enviou.",
      confirm: (v: string) => `Confirmar ${v}`,
      privacy:
        "É anônimo: não pedimos seu nome e ninguém fica sabendo quem mandou nem quanto. Serve só para a noiva saber o total que recebeu.",
      done: (v: string) => `Anotado: ${v}. Obrigado!`,
      undo: "Desfazer",
      another: "Mandou outro? Marque de novo.",
      error: "Não deu para anotar agora. Tente de novo em instantes.",
    },
  },
  paleta: {
    title: "Paleta dos utensílios",
    note: "A noiva escolheu estas cores para os utensílios da cozinha. Cabo de bambu também vale!",
    short: "Utensílios: branco, cinza ou preto. Cabo de bambu também vale.",
    colors: [
      { name: "Branco", hex: "#ffffff" },
      { name: "Cinza", hex: "#737373" },
      { name: "Preto", hex: "#000000" },
      { name: "Cabo de bambu", hex: "bambu" },
    ],
  },
  footer: "Kaw e Than",
};
