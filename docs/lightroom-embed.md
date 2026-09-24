# Lightroom Embed

O Magazine integra o Lightroom apenas por links compartilhados e códigos oficiais de embed. As fotografias continuam armazenadas e apresentadas pelo Lightroom; o Magazine salva somente os dados do bloco editorial.

## Fluxo

1. No Lightroom, crie ou abra um álbum compartilhado.
2. Use a opção oficial de compartilhar/embed e copie a URL ou o iframe fornecido pela Adobe.
3. No editor do Magazine, adicione o bloco `Lightroom`.
4. Cole a URL ou o código de embed, revise a prévia e salve a publicação.

O campo aceita apenas `https://lightroom.adobe.com`. Ao colar um iframe, o sistema extrai somente o atributo `src`; HTML arbitrário, cookies, tokens e credenciais não são armazenados nem renderizados.

## Limitações

- O bloco incorpora o álbum/recurso oficial como um iframe; ele não transforma o Lightroom em uma API de imagens.
- O Magazine não baixa, duplica ou descobre URLs individuais das fotografias.
- Não há OAuth, acesso ao catálogo, endpoints privados ou scraping.
- SEO, navegação, controles e aparência interna dependem do embed disponibilizado pelo Lightroom.
- O conteúdo é carregado de forma lazy e pode depender de conexão, permissões e disponibilidade do álbum compartilhado.
- A proporção do iframe é ajustável no editor e funciona em desktop, tablet e mobile, mas não edita crop ou imagens do Lightroom.

O bloco permanece conteúdo adicional da publicação. Título, linha fina, texto, capa e metadados continuam sendo renderizados pelo Magazine e devem carregar a informação editorial principal.
