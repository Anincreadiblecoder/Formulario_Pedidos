# Requisitos da Funcionalidade de Pesquisa de Pedidos

## Definições Assumidas (baseadas em práticas comuns)

### 1. Localização da Pesquisa
- **Nova seção no formulário principal**: Adicionar uma seção "Pesquisar Pedidos" no mesmo formulário
- **Fácil acesso**: Usuário pode alternar entre "Fazer Pedido" e "Pesquisar Pedidos"

### 2. Informações Exibidas nos Resultados
- Data e hora do pedido
- Nome do aluno
- Sala/série do aluno
- Nome do cliente
- Lista de itens (produto, quantidade, preço unitário)
- Valor total do pedido
- Forma de pagamento
- Status da entrega
- Observações (se houver)

### 3. Critérios de Pesquisa
- **Por nome do aluno** (busca parcial - permite digitar parte do nome)
- **Por data** (período específico ou data exata)
- **Por ID do pedido** (busca exata)
- **Combinação de critérios** (nome + data)

### 4. Apresentação dos Resultados
- **Tabela responsiva** com colunas organizadas
- **Paginação** para muitos resultados
- **Opção de exportar** para Excel
- **Detalhes expandíveis** para ver itens completos

### 5. Controle de Acesso
- **Acesso livre**: Qualquer usuário pode pesquisar todos os pedidos
- **Funcionalidade administrativa**: Para controle e acompanhamento

## Implementação Planejada

### Backend (API)
- Endpoint: `GET /api/excel/pedidos/pesquisar`
- Parâmetros: `nome_aluno`, `data_inicio`, `data_fim`, `id_pedido`
- Resposta: Lista de pedidos com todos os detalhes

### Frontend
- Nova seção no formulário principal
- Campos de pesquisa intuitivos
- Tabela de resultados responsiva
- Botão de exportação para Excel

### Funcionalidades Especiais
- Busca em tempo real (conforme usuário digita)
- Filtros rápidos (hoje, esta semana, este mês)
- Ordenação por data, aluno, valor
- Destaque visual para pedidos recentes

