import type { Asset, Issue, Publication } from "@clubi/domain";

const full = (colSpan = 12, extras: Partial<Publication["sections"][0]["blocks"][0]["layout"]["desktop"]> = {}) => ({
  desktop: { colStart: 1, colSpan, ...extras },
  mobile: { colStart: 1, colSpan: 4 },
});

const reading = {
  desktop: { colStart: 3, colSpan: 8 },
  mobile: { colStart: 1, colSpan: 4 },
};

/**
 * As imagens do ensaio "Configurações" vivem em apps/site/public/assets.
 *
 * As chapas SCRL_00**.jpeg sao composicoes fechadas na mesa de edicao, todas
 * em 4:5 (2160x2700): cada uma ja traz as duas leituras de cor da mesma pose
 * — o preto e branco e o tratamento amarelo/azul. Sem aspectRatio no layout o
 * bloco de imagem entra na proporcao natural (4:5), ou seja, chapa inteira e
 * sem crop; so a folha de contato recorta para 3:4, como o
 * .clubi-gallery--contact-sheet da direcao visual.
 *
 * IMG_7555.jpeg e o arquivo da chapa de contato: uma tira de ~3:1 sobre preto,
 * com as quatro variacoes lado a lado — o arquivo inteiro tem 1290x2190
 * (portanto o palco e preto, e nao um recorte 4:5).
 */
export const assets: Asset[] = [
  {
    id: "asset-scrl-0045",
    source: "upload",
    sourceRef: "SCRL_0045.jpeg",
    originalUrl: "/assets/SCRL_0045.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0046",
    source: "upload",
    sourceRef: "SCRL_0046.jpeg",
    originalUrl: "/assets/SCRL_0046.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0047",
    source: "upload",
    sourceRef: "SCRL_0047.jpeg",
    originalUrl: "/assets/SCRL_0047.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0048",
    source: "upload",
    sourceRef: "SCRL_0048.jpeg",
    originalUrl: "/assets/SCRL_0048.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0044",
    source: "upload",
    sourceRef: "SCRL_0044.jpeg",
    originalUrl: "/assets/SCRL_0044.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0043",
    source: "upload",
    sourceRef: "SCRL_0043.jpeg",
    originalUrl: "/assets/SCRL_0043.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-scrl-0042",
    source: "upload",
    sourceRef: "SCRL_0042.jpeg",
    originalUrl: "/assets/SCRL_0042.jpeg",
    width: 2160,
    height: 2700,
    metadata: { capturedAt: "2026-04-09" },
  },
  {
    id: "asset-img-7555",
    source: "upload",
    sourceRef: "IMG_7555.jpeg",
    originalUrl: "/assets/IMG_7555.jpeg",
    width: 1290,
    height: 2190,
    metadata: { capturedAt: "2026-04-09" },
  },
];

export const configuracoes: Publication = {
  id: "pub-configuracoes",
  slug: "configuracoes",
  title: "Configurações",
  dek: "Um corpo aprendendo, em tempo real, o que um arco de concreto tem para lhe dizer — o primeiro ensaio do clube, feito de improviso e referência.",
  status: "published",
  type: "essay",
  coverAssetId: "asset-scrl-0045",
  issueId: "issue-01",
  meta: {
    author: "Gabes",
    photographer: "Gabes",
    editor: "Vitor Dias",
    model: "Tawana",
    publishedAt: "2026-04-09",
    readingTime: 4,
    tags: ["ensaio", "encontro-01", "corpo"],
    kicker: "Encontro 01",
  },
  sections: [
    {
      id: "sec-opening",
      mode: "opening",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-opening-kicker",
          type: "caption",
          content: { text: "Ensaio fotográfico · Clube da Foto, encontro 01" },
          layout: {
            desktop: { colStart: 1, colSpan: 12 },
            mobile: { colStart: 1, colSpan: 4 },
          },
        },
        {
          id: "blk-opening-image",
          type: "image",
          content: {
            assetId: "asset-scrl-0045",
            alt: "Chapa 01 — o corpo no nicho arqueado em preto e branco, ao lado da mesma pose no recorte circular amarelo e azul.",
          },
          layout: {
            desktop: { colStart: 1, colSpan: 12, bleed: true },
            mobile: { colStart: 1, colSpan: 4, bleed: true },
          },
        },
        {
          id: "blk-opening-title",
          type: "heading",
          content: { text: "Configurações", level: 1 },
          layout: {
            desktop: { colStart: 1, colSpan: 12 },
            mobile: { colStart: 1, colSpan: 4 },
          },
        },
      ],
    },
    {
      id: "sec-lede",
      mode: "full",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-lede-1",
          type: "text",
          content: {
            text: "No dia 9 de abril de 2026, no primeiro encontro do Clube da Foto, esse ensaio saiu quase sem planejamento — um freestyle guiado pelo olhar de Gabes, que dirigiu a cena tendo como referência a série Body Configurations, de VALIE EXPORT: o corpo lido como mais uma linha na composição do espaço, negociando posição com colunas, arcos e vãos.",
          },
          layout: reading,
          style: { tokenRefs: { lead: "true" } },
        },
        {
          id: "blk-lede-2",
          type: "text",
          content: {
            text: "Tawana, que modelou o ensaio, entregou isso com sobra — cada pose parece resposta direta à arquitetura em volta, não uma performance para a câmera.",
          },
          layout: reading,
        },
      ],
    },
    {
      id: "sec-diptych",
      mode: "full",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-dip-label",
          type: "caption",
          content: { text: "Body configuration — variação 01" },
          layout: full(12),
          style: { tokenRefs: { variant: "label" } },
        },
        {
          id: "blk-dip",
          type: "gallery",
          content: {
            layout: "diptych",
            items: [
              {
                assetId: "asset-scrl-0044",
                alt: "O recorte circular em amarelo e azul, ao lado da mesma pose em preto e branco.",
              },
              {
                assetId: "asset-scrl-0043",
                alt: "O recorte circular em preto e branco, com as variações em cor na coluna ao lado.",
              },
            ],
          },
          layout: full(12),
        },
        {
          id: "blk-dip-cap",
          type: "caption",
          content: { text: "Duas leituras de cor, uma mesma configuração." },
          layout: full(12),
          style: { tokenRefs: { variant: "cap", note: "P&B · Cor" } },
        },
        {
          id: "blk-dip-text",
          type: "text",
          content: {
            text: "A escolha de tratar a mesma pose em duas paletas — o preto e branco seco e o amarelo quase artificial — não é indecisão: é deixar as duas versões coexistirem, como um contact sheet que se recusa a escolher só um quadro.",
          },
          layout: reading,
        },
      ],
    },
    {
      id: "sec-quote",
      mode: "full",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-quote",
          type: "quote",
          content: { text: "O nicho não é fundo. É o outro corpo na cena." },
          layout: reading,
          style: { tokenRefs: { cite: "Nota de direção — Gabes, encontro 01" } },
        },
      ],
    },
    {
      id: "sec-closing",
      mode: "full",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-closing-image",
          type: "image",
          content: {
            assetId: "asset-scrl-0046",
            alt: "O mesmo nicho em duas leituras: a parede amarela e a versão em preto e branco, lado a lado.",
          },
          // sem aspectRatio: o frame de encerramento entra inteiro, sem crop
          layout: full(12),
        },
        {
          id: "blk-closing-cap",
          type: "caption",
          content: {
            text: "Mesmo nicho, luz virada para o amarelo — o encerramento do ensaio.",
          },
          layout: full(12),
          style: { tokenRefs: { variant: "cap" } },
        },
        {
          id: "blk-closing-text",
          type: "text",
          content: {
            text: "Trabalho em conjunto é tudo: sem a direção de cena, a modelo entregando presença e a edição amarrando o ritmo entre as versões, esse freestyle de um único encontro não teria virado ensaio. Fica registrado como o primeiro do Clubi.",
          },
          layout: reading,
        },
      ],
    },
    {
      id: "sec-contact",
      mode: "full",
      columns: { desktop: 12, mobile: 4 },
      blocks: [
        {
          id: "blk-contact-label",
          type: "caption",
          content: { text: "Chapa de contato — as quatro variações" },
          layout: full(12),
          style: { tokenRefs: { variant: "label" } },
        },
        {
          id: "blk-contact",
          type: "gallery",
          content: {
            layout: "contact-sheet",
            items: [
              { assetId: "asset-scrl-0047", alt: "O nicho em amarelo fechado no detalhe, com a sequência em preto e branco ao lado." },
              { assetId: "asset-scrl-0042", alt: "Grade de recortes circulares em preto e branco e em azul." },
              { assetId: "asset-scrl-0048", alt: "Quatro quadros do corpo no nicho, alternando o amarelo e o preto e branco." },
              { assetId: "asset-img-7555", alt: "Chapa de contato — as quatro variações lado a lado, como saíram da mesa de edição." },
            ],
          },
          layout: full(12),
        },
        {
          id: "blk-contact-cap",
          type: "caption",
          content: {
            text: "As duas poses, as duas cores — lado a lado, como saíram da mesa de edição.",
          },
          layout: full(12),
          style: { tokenRefs: { variant: "cap" } },
        },
      ],
    },
  ],
};

export const issue01: Issue = {
  id: "issue-01",
  number: 1,
  title: "Edição 01",
  slug: "01",
  coverAssetId: "asset-scrl-0045",
  publicationIds: ["pub-configuracoes"],
  publishedAt: "2026-04-09",
};
