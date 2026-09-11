# Mapping Atelier · Narraiana Augusto

Aplicativo de visagismo e lash mapping em português, com identidade monocromática.

## Fluxo

1. Enviar a foto da cliente e identificar o atendimento.
2. Preencher formato, profundidade, posicionamento e eixo, consultando as referências fornecidas.
3. Escolher entre sete mappings originais em duas densidades; mover, redimensionar, girar, espelhar, desenhar, inserir textos e ajustar a ficha técnica.
4. Baixar um PDF com simulação, análise, ficha e comparação, ou compartilhar o arquivo pelos recursos do dispositivo.

As sugestões usam correspondências explícitas com o material fornecido. A foto não é analisada por IA. As numerações são sugestões editáveis. A profundidade inconsistente no exemplo Natural de Elevação não é usada como regra.

## Dados

O acesso usa a autenticação da plataforma Sites. Cada foto e atendimento pertence ao usuário autenticado. Os endpoints verificam a propriedade no servidor. Fotos ficam em R2 e registros em D1. A ficha salva automaticamente após incluir foto e nome; erros mantêm o trabalho na tela e oferecem nova tentativa.

## Desenvolvimento

- `npm run dev`: prévia local.
- `npm run build`: Worker e arquivos públicos.
- `npm run db:generate`: gerar novas migrações após alterar o esquema.
- `npx tsc --noEmit`: validação de tipos.

As migrações ficam em `drizzle/`. O manifesto `.openai/hosting.json` contém apenas a identidade do Site e os bindings lógicos. Não incluir fotos de clientes ou credenciais no repositório.

## Conteúdo

As referências de olhos, identidade e os cílios originais foram fornecidos pelo usuário, incluindo os dois documentos do Canva. A interface de compartilhamento abre o seletor do dispositivo quando disponível; nos demais navegadores baixa o PDF para anexar à conversa.
