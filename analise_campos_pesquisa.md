# Análise dos Campos de Seleção para Pesquisa Parcial

## Campos Identificados no Formulário

### 1. **Nome do Cliente** (`#nomeCliente`)
- **Tipo atual**: `<select>` dropdown
- **Fonte de dados**: Excel - Base_cadastros.xlsx e Base Clientes.xlsx
- **Funcionalidade atual**: Seleção de cliente pré-definido
- **Necessidade**: Pesquisa parcial por nome (ex: "Ana" → "Ana Costa Silva")

### 2. **Loja para Retirada** (`#lojaRetirada`)
- **Tipo atual**: `<select>` dropdown
- **Fonte de dados**: Excel - B_Lojas.xlsx
- **Funcionalidade atual**: Seleção de loja pré-definida
- **Necessidade**: Pesquisa parcial por nome da loja (ex: "Shopping" → "Loja Shopping Center Norte")

### 3. **Produtos nos Itens** (`.produto-select`)
- **Tipo atual**: `<select>` dropdown (múltiplos, um por item)
- **Fonte de dados**: Excel - Base_Produtos.xlsx
- **Funcionalidade atual**: Seleção de produto pré-definido
- **Necessidade**: Pesquisa parcial por nome do produto (ex: "pão" → "Pão de Forma", "Pão de Hambúrguer", "Pão Brioche")

## Estratégia de Implementação

### Abordagem: Combobox Híbrido
Transformar os `<select>` em campos de input com dropdown de sugestões:

1. **Input de pesquisa** - Campo de texto onde o usuário digita
2. **Dropdown de sugestões** - Lista filtrada que aparece conforme a digitação
3. **Seleção por clique ou teclado** - Navegação intuitiva
4. **Fallback para entrada manual** - Permite digitar valores não encontrados

### Componentes Necessários

#### HTML
- Substituir `<select>` por estrutura de combobox
- Container para input + dropdown
- Lista de sugestões dinâmica

#### CSS
- Estilos para o combobox
- Animações de abertura/fechamento
- Estados de hover e seleção
- Responsividade

#### JavaScript
- Função de filtragem em tempo real
- Navegação por teclado (setas, Enter, Esc)
- Seleção por clique
- Integração com dados existentes

## Benefícios da Implementação

### Usabilidade
- **Pesquisa rápida**: Digite parte do nome e encontre rapidamente
- **Menos cliques**: Não precisa rolar longas listas
- **Flexibilidade**: Permite entrada manual quando necessário
- **Feedback visual**: Destaque dos termos encontrados

### Performance
- **Filtragem local**: Dados já carregados, filtragem instantânea
- **Cache inteligente**: Reutiliza dados já carregados
- **Lazy loading**: Carrega sugestões conforme necessário

### Acessibilidade
- **Navegação por teclado**: Suporte completo a teclas de navegação
- **Screen readers**: Compatível com leitores de tela
- **Contraste adequado**: Cores acessíveis para todos os usuários

## Casos de Uso Específicos

### Produtos
- **Cenário**: Usuário quer adicionar "Hambúrguer"
- **Ação**: Digite "hamb" no campo de produto
- **Resultado**: Mostra "Hambúrguer Artesanal", "Hambúrguer Vegano", etc.

### Clientes
- **Cenário**: Usuário procura cliente "Ana"
- **Ação**: Digite "ana" no campo de cliente
- **Resultado**: Mostra "Ana Costa Silva", "Ana Maria Santos", etc.

### Lojas
- **Cenário**: Usuário quer loja do "Shopping"
- **Ação**: Digite "shop" no campo de loja
- **Resultado**: Mostra "Loja Shopping Center Norte", "Loja Shopping Ibirapuera", etc.

## Requisitos Técnicos

### Funcionalidades Obrigatórias
1. **Pesquisa case-insensitive** - "ANA" encontra "Ana Costa"
2. **Busca parcial** - "cost" encontra "Ana Costa Silva"
3. **Múltiplas palavras** - "ana silva" encontra "Ana Silva Santos"
4. **Navegação por teclado** - Setas para navegar, Enter para selecionar
5. **Escape para fechar** - ESC fecha o dropdown
6. **Clique fora fecha** - Clique fora do componente fecha o dropdown

### Funcionalidades Opcionais
1. **Destaque do termo** - Realça a parte que corresponde à busca
2. **Ordenação inteligente** - Resultados mais relevantes primeiro
3. **Limite de resultados** - Mostra apenas os primeiros 10 resultados
4. **Mensagem "não encontrado"** - Quando não há resultados

## Compatibilidade

### Navegadores Suportados
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Dispositivos
- **Desktop**: Funcionalidade completa com mouse e teclado
- **Tablet**: Touch otimizado com teclado virtual
- **Mobile**: Interface adaptada para toque

## Implementação Faseada

### Fase 1: Cliente
- Implementar pesquisa parcial para campo de cliente
- Testar funcionalidade básica
- Validar UX/UI

### Fase 2: Produtos
- Implementar pesquisa parcial para produtos
- Adaptar para múltiplos itens
- Testar performance com muitos produtos

### Fase 3: Lojas
- Implementar pesquisa parcial para lojas
- Finalizar integração completa
- Testes finais e otimizações

Esta análise fornece a base para implementar uma funcionalidade de pesquisa parcial robusta e intuitiva em todos os campos de seleção baseados em dados Excel.

