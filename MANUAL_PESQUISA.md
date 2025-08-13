# 🔍 Manual da Funcionalidade de Pesquisa de Pedidos

## Visão Geral

A funcionalidade de pesquisa de pedidos permite localizar e visualizar pedidos realizados por alunos de forma rápida e eficiente. O sistema oferece filtros avançados, visualização detalhada e exportação de dados.

## Acesso à Funcionalidade

### Método 1: Pelo Formulário Principal
1. Abra o formulário de pedidos (`index.html`)
2. Clique no botão **"🔍 Pesquisar Pedidos"** no cabeçalho
3. Você será redirecionado para a página de pesquisa

### Método 2: Acesso Direto
1. Acesse diretamente `pesquisar_pedidos.html`
2. A página de pesquisa será carregada automaticamente

## Interface da Pesquisa

### Cabeçalho
- **Título**: "🔍 Pesquisar Pedidos"
- **Descrição**: "Encontre pedidos realizados por alunos usando os filtros abaixo"
- **Navegação**: 
  - "← Voltar ao Formulário" - Retorna ao formulário principal
  - "📊 Exportar Resultados" - Exporta todos os resultados

### Seção de Filtros

#### Filtros Disponíveis
1. **Nome do Aluno**
   - Campo de texto livre
   - Busca parcial (digite qualquer parte do nome)
   - Pesquisa em tempo real (após 2 caracteres)

2. **ID do Pedido**
   - Campo de texto para ID específico
   - Busca exata pelo identificador
   - Formato: `PED_AAAAMMDD_NNN`

3. **Data Início**
   - Seletor de data
   - Define o início do período de busca

4. **Data Fim**
   - Seletor de data
   - Define o fim do período de busca

#### Botões de Ação
- **🔍 Pesquisar**: Executa a busca com os filtros definidos
- **🗑️ Limpar Filtros**: Remove todos os filtros aplicados

#### Filtros Rápidos
- **Hoje**: Define período para o dia atual
- **Esta Semana**: Define período para a semana atual
- **Este Mês**: Define período para o mês atual

## Como Usar

### Pesquisa Básica
1. **Por Nome do Aluno**:
   - Digite parte do nome no campo "Nome do Aluno"
   - O sistema pesquisará automaticamente após 2 caracteres
   - Exemplo: Digite "João" para encontrar "João Silva Santos"

2. **Por ID do Pedido**:
   - Digite o ID completo ou parcial
   - Clique em "Pesquisar" ou pressione Enter
   - Exemplo: "PED_20250813_001"

### Pesquisa por Período
1. **Usando Filtros Rápidos**:
   - Clique em "Hoje", "Esta Semana" ou "Este Mês"
   - As datas serão preenchidas automaticamente
   - A pesquisa será executada imediatamente

2. **Definindo Período Personalizado**:
   - Selecione a "Data Início"
   - Selecione a "Data Fim"
   - Clique em "Pesquisar"

### Pesquisa Combinada
- Combine múltiplos filtros para refinar os resultados
- Exemplo: Nome do aluno + período específico

## Visualização dos Resultados

### Tabela de Resultados
A tabela exibe as seguintes colunas:
- **Data/Hora**: Quando o pedido foi realizado
- **ID Pedido**: Identificador único do pedido
- **Aluno**: Nome completo do aluno
- **Sala**: Sala/turma do aluno
- **Cliente**: Nome do cliente responsável
- **Valor Total**: Valor total do pedido
- **Pagamento**: Forma de pagamento escolhida
- **Ações**: Botão para ver detalhes completos

### Informações Adicionais
- **Contador de resultados**: Mostra quantos pedidos foram encontrados
- **Botão de exportação**: Permite baixar os resultados em Excel/CSV

## Detalhes do Pedido

### Acessando Detalhes
1. Clique no botão **"👁️ Ver Detalhes"** na linha do pedido desejado
2. Um modal será aberto com informações completas

### Informações Exibidas no Modal

#### 📋 Informações Gerais
- ID do Pedido
- Data e Hora
- Valor Total
- Forma de Pagamento

#### 🎓 Informações do Aluno
- Nome completo
- Sala/Turma

#### 👤 Informações do Cliente
- Nome completo
- Email
- CPF (formatado)
- Telefone (formatado)

#### 🚚 Informações de Entrega
- Tipo de entrega
- Data de entrega
- Endereço (se aplicável)

#### 🛒 Itens do Pedido
- Lista detalhada de todos os itens
- Produto, quantidade, preço unitário e total por item

#### 📝 Observações
- Observações adicionais do pedido (se houver)

### Fechando o Modal
- Clique no "×" no canto superior direito
- Clique no botão "Fechar" na parte inferior
- Clique fora do modal

## Exportação de Dados

### Exportar Resultados Atuais
1. Realize uma pesquisa
2. Clique em **"📊 Exportar para Excel"**
3. Um arquivo CSV será baixado automaticamente

### Formato do Arquivo Exportado
- **Nome do arquivo**: `pedidos_AAAA-MM-DD.csv`
- **Colunas incluídas**: Data, ID Pedido, Aluno, Sala, Cliente, Valor Total, Pagamento
- **Codificação**: UTF-8 (suporta acentos)

## Mensagens do Sistema

### Tipos de Mensagens
- **Sucesso** (verde): Operações realizadas com êxito
- **Informação** (azul): Informações gerais do sistema
- **Erro** (vermelho): Problemas ou falhas

### Mensagens Comuns
- "Sistema carregado. Use os filtros para pesquisar pedidos."
- "Usando dados de exemplo. X pedidos encontrados."
- "Arquivo CSV baixado com sucesso!"
- "Filtros limpos."

## Responsividade

### Desktop
- Interface completa com todos os recursos
- Tabela com todas as colunas visíveis
- Modal de detalhes em tamanho otimizado

### Tablet
- Layout adaptado para telas médias
- Filtros organizados em grid responsivo
- Tabela com scroll horizontal se necessário

### Mobile
- Interface otimizada para toque
- Filtros empilhados verticalmente
- Tabela compacta com informações essenciais
- Modal ocupando quase toda a tela

## Solução de Problemas

### Nenhum Resultado Encontrado
- Verifique se os filtros estão corretos
- Tente usar filtros menos específicos
- Verifique se há pedidos no período selecionado

### Dados Não Carregam
- O sistema usa dados de exemplo quando a API não está disponível
- Verifique se o backend Flask está rodando (se aplicável)
- Atualize a página para tentar novamente

### Exportação Não Funciona
- Verifique se há resultados para exportar
- Tente realizar uma nova pesquisa
- O sistema fará download automático do CSV como fallback

### Modal Não Abre
- Clique diretamente no botão "Ver Detalhes"
- Atualize a página se necessário
- Verifique se não há bloqueadores de popup

## Dicas de Uso

### Para Melhor Performance
- Use filtros específicos para reduzir o número de resultados
- Evite deixar todos os filtros vazios em bases de dados grandes
- Use os filtros rápidos para buscas comuns

### Para Pesquisas Eficientes
- Use busca parcial por nome (não precisa digitar o nome completo)
- Combine filtros para refinar resultados
- Use períodos específicos para localizar pedidos recentes

### Para Exportação
- Realize a pesquisa desejada antes de exportar
- O arquivo exportado conterá apenas os resultados filtrados
- Use nomes descritivos ao salvar o arquivo baixado

## Integração com Sistema Principal

### Navegação
- A pesquisa é uma funcionalidade complementar ao formulário
- Navegação fluida entre as duas páginas
- Dados compartilhados da mesma base Excel

### Dados Sincronizados
- Pedidos criados no formulário aparecem na pesquisa
- Atualizações automáticas quando arquivos Excel são modificados
- Cache inteligente mantém dados sempre atualizados

Esta funcionalidade torna o sistema completo, permitindo não apenas criar pedidos, mas também consultar e analisar o histórico de forma eficiente.

