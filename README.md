# New Burguer Lanches — site do cardápio

Site estático, sem build e sem servidor. Feito pra ser aberto por QR code no celular,
na frente do trailer.

## Arquivos

- `index.html` — cardápio, informações e os dados estruturados. É aqui que você edita preços.
- `style.css` — estilos.
- `app.js` — busca, filtros e o aviso de aberto/fechado. O site funciona sem ele.
- `img/` — recorte do mapa, imagem de compartilhamento e ícones.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico` — SEO e instalação no celular.

## Abrindo no PC antes de publicar

Descompacte a pasta inteira e abra o `index.html` mantendo a estrutura. As imagens
ficam em `img/`; se você separar os arquivos, o HTML não acha nada. Duplo clique no
`index.html` já funciona — não precisa de servidor local.

## Antes de publicar: troque o domínio

O domínio `newburguerlanches.com.br` aparece como exemplo em quatro lugares.
Se você comprar outro, troque em todos, senão o Google indexa errado:

- `index.html` — `<link rel="canonical">`, as tags `og:url` e `og:image`, e os
  campos `@id`, `url` e `image` do bloco JSON-LD lá embaixo.
- `robots.txt` — a linha `Sitemap:`.
- `sitemap.xml` — a tag `<loc>`.

Busca por `newburguerlanches.com.br` e substitui tudo de uma vez.

## Como mudar um preço

Ache a linha do lanche e troque o número dentro de `<span class="preco">`.
O `R$` é colocado pelo CSS, então escreva só `27,00`.

```html
<li class="item" data-tags="hamburguer">
  <span class="nome">X Especial</span>
  <span class="ing">tomate, hambúrguer, batata, presunto e muçarela</span>
  <span class="preco">27,00</span>
</li>
```

**Mude também no JSON-LD**, no fim do `index.html`. São dois lugares porque um é
o que a pessoa lê e o outro é o que o Google lê. Preço divergente entre os dois
faz o Google desconfiar do site.

`data-tags` controla os filtros: `hamburguer`, `frango`, `bacon`, `sem-carne`,
`bebida`, `adicional`. Um item pode ter mais de uma, separadas por espaço.

A classe `destaque` no `<li>` põe o selo "mais pedido". Está em New Burguer,
X Tudo e Coreto — **chute meu**. Troque pelos que realmente saem mais.

## Imagens

- `img/local-prf.jpg` / `.webp` — a arte com o endereço e o mapa, na seção "Onde e quando".
- `img/maionese-dcasa.png` / `.webp` — logo da Maionese D'Casa, com fundo transparente.
- `img/og.jpg` — o que aparece quando alguém cola o link no WhatsApp ou no Instagram.
  Se mudar telefone, endereço ou a regra da maionese, essa imagem também precisa ser refeita.

O mapa do Google é um `<iframe>` com `output=embed`. Funciona sem chave de API, mas é
um endereço não documentado pelo Google e pode parar de funcionar sem aviso. Por isso
o link "Abrir no Google Maps" logo abaixo continua ali — ele é o caminho confiável.
Se o iframe quebrar, é só apagar a `<div class="gmaps">` inteira.

## Como mudar o horário

Dois lugares, e os dois precisam bater:

1. A lista visível, na seção "Onde e quando".
2. O objeto `TURNOS` no `app.js`, e o `openingHoursSpecification` no JSON-LD.

Em `TURNOS`, a chave é o dia (0 = domingo) e os valores são minutos desde a meia-noite
do dia em que o turno **começa**. Por isso 00h30 vira `1470` (24h30) e não `30`.
Dia sem chave é dia fechado.

## Publicar no GitHub Pages

1. Repositório novo, público, com esses arquivos na raiz.
2. Settings → Pages → Source: `Deploy from a branch`, branch `main`, pasta `/ (root)`.
3. Testa em `https://SEU-USUARIO.github.io/NOME-DO-REPO`.

## Domínio próprio

1. Compra no Registro.br (`.com.br` fica em torno de R$ 40/ano).
2. No DNS, cria um `CNAME` de `www` apontando pra `SEU-USUARIO.github.io`.
   Pro domínio sem `www`, cria registros `A` pros IPs do GitHub Pages — a documentação
   do Pages lista os quatro atuais, confere lá porque eles mudam.
3. Settings → Pages → Custom domain, e marca `Enforce HTTPS`.
4. Cria um arquivo `CNAME` na raiz do repositório com só o domínio dentro.

## SEO — o que já está feito

- `title` e `description` escritos pra quem busca "lanche em Pouso Alegre", não pra robô.
- `<link rel="canonical">` — evita o Google indexar o mesmo site em dois endereços
  (com e sem `www`, `github.io` e domínio próprio).
- **JSON-LD `Restaurant` com o cardápio inteiro.** É o item mais pesado da lista.
  É o que permite o Google mostrar horário, telefone, faixa de preço e o cardápio
  direto no resultado da busca.
- `openingHoursSpecification` com o turno que vira a madrugada, declarado direito.
- Open Graph e Twitter Card, com imagem 1200×630 em `img/og.jpg` — é o que aparece
  quando alguém cola o link no WhatsApp ou no Instagram.
- Um `<h1>` só, `<h2>` por seção, HTML semântico. O cardápio é texto de verdade,
  não imagem, então o Google consegue ler item por item.
- Imagens com `width`/`height` (evita a página pular ao carregar), `loading="lazy"`,
  `alt` descritivo e versão `.webp`.
- `robots.txt`, `sitemap.xml` e `site.webmanifest`.
- `lang="pt-BR"`, fonte com `display=swap`, `preconnect` pro Google Fonts.

## SEO — o que falta, e não é código

Site bem feito não ranqueia sozinho para busca local. Por ordem de impacto:

1. **Google Business Profile.** Isso vale mais que o site inteiro pra aparecer no
   mapa e no "perto de mim". É de graça, leva 10 minutos, e exige verificação por
   carta ou telefone. Põe o link do site no perfil.
2. **NAP consistente.** Nome, endereço e telefone escritos exatamente igual no site,
   no Google, no Instagram e no Facebook. Divergência derruba a confiança do Google.
3. **Avaliações no Google.** Peça. Um QR code na comanda pedindo avaliação funciona.
4. **Latitude e longitude no JSON-LD.** Não incluí porque não tenho as coordenadas
   exatas. Depois da mudança, pega no Google Maps e adiciona um bloco `geo` com
   `latitude` e `longitude` dentro do `Restaurant`.
5. **Fotos reais.** Hoje o site não tem nenhuma foto do trailer nem dos lanches. Isso
   converte mais do que qualquer meta tag, e alimenta o Google Business Profile também.
6. **Search Console.** Cadastra o domínio, envia o `sitemap.xml`, e usa o teste de
   resultados aprimorados pra conferir se o JSON-LD passou.

## QR code

Só gere depois do domínio no ar. QR apontando pro endereço do `github.io` obriga a
reimprimir adesivo depois.

- Gere em **SVG**, não PNG — imprime em qualquer tamanho sem borrar.
- Nível de correção de erro **H**, que continua legível com o adesivo sujo ou riscado.
- No adesivo, escreva o domínio embaixo do código. Quem não quiser escanear digita.
- Teste com um celular ruim, de longe e à noite, antes de mandar imprimir os 50.

## Pendências

- Confirmar o horário: entendi terça a quinta até 23h, sexta a domingo até 00h30.
- Confirmar quais lanches são realmente os mais pedidos.
- **Confirmar o WhatsApp.** Você passou `9981-9093`, que tem 8 dígitos. Interpretei
  como `9 9981-9093`, ou seja `+55 35 99981-9093` (link `wa.me/5535999819093`).
  Clica no botão depois de subir e confirma que abre a conversa certa.
- O WhatsApp no site é o número pessoal do seu pai. Colado num adesivo público, ele
  passa a receber mensagem de qualquer um, a qualquer hora. Vale um chip do trailer.

## Onde ficam as informações que mais mudam

- **Maionese grátis e 120 gramas**: no `<ul class="selos">` do cabeçalho, no bloco
  `nota-maionese` da seção de lanches, na `<meta name="description">`, no `og:description`,
  no campo `description` do JSON-LD e na imagem `img/og.jpg`. Se o seu pai trocar de
  marca de maionese ou mudar a regra, são seis lugares.
- **Telefone fixo**: no botão "Ligar" da barra fixa, no bloco `tel-destaque`, e no
  campo `telephone` do JSON-LD.

## Sobre o logo da maionese

A Maionese D'Casa é marca de terceiro. Usar o logo pra dizer qual produto vocês servem
é uso normal e comum no comércio, mas não é o mesmo que ter autorização da marca.
Duas coisas que evitam problema: não redesenhar nem distorcer o logo, e não dar a
entender que a New Burguer é parceira, patrocinada ou distribuidora da D'Casa.
Do jeito que está no site — logo ao lado da frase que diz o que vem no lanche — está
dentro disso. Se algum dia quiserem usar a marca em fachada ou material de campanha,
aí vale falar com o fabricante antes.
