# Manual do Sistema de Combobox com Pesquisa Parcial

## 📋 Visão Geral

O sistema de combobox com pesquisa parcial (search-as-you-type) permite que os usuários encontrem rapidamente opções digitando parte do nome desejado. Esta funcionalidade está disponível em todos os campos de seleção baseados em dados Excel.

## 🔍 Campos com Pesquisa Parcial

### **1. Cliente**
- **Localização**: Seção "Informações do Cliente"
- **Funcionalidade**: Digite parte do nome do cliente
- **Exemplo**: Digite "ana" para encontrar "Ana Costa Silva"
- **Preenchimento automático**: Email, CPF e telefone são preenchidos automaticamente

### **2. Loja de Retirada**
- **Localização**: Seção "Informações de Entrega"
- **Funcionalidade**: Pesquise lojas por nome
- **Exemplo**: Digite "mercado" para encontrar "Mercado J&F"
- **Disponibilidade**: Aparece apenas quando tipo de entrega é "Retirada"

### **3. Produtos**
- **Localização**: Seção "Itens do Pedido" (em cada item)
- **Funcionalidade**: Busque produtos por nome parcial
- **Exemplo**: Digite "pão" para encontrar "Pão de Forma", "Pão Brioche", "Pão de Hambúrguer"
- **Preenchimento automático**: Peso e preço são preenchidos automaticamente

## 🎯 Como Usar

### **Passo 1: Clique no Campo**
1. Clique no campo de entrada (input)
2. O cursor aparecerá no campo
3. Uma lista de opções pode aparecer automaticamente

### **Passo 2: Digite para Pesquisar**
1. Digite parte do nome que você procura
2. A lista será filtrada em tempo real
3. Opções correspondentes aparecerão no dropdown

### **Passo 3: Selecione a Opção**
1. **Com o mouse**: Clique na opção desejada
2. **Com o teclado**: 
   - Use ↑ ↓ para navegar
   - Pressione Enter para selecionar
   - Pressione Tab para ir ao próximo campo

### **Passo 4: Preenchimento Automático**
1. Após selecionar, campos relacionados são preenchidos automaticamente
2. Para clientes: email, CPF, telefone
3. Para produtos: peso, preço unitário

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| ↓ (Seta para baixo) | Navegar para próxima opção |
| ↑ (Seta para cima) | Navegar para opção anterior |
| Enter | Selecionar opção destacada |
| Tab | Ir para próximo campo |
| Esc | Fechar dropdown |

## 🔧 Funcionalidades Avançadas

### **Pesquisa Inteligente**
- **Busca parcial**: Encontra correspondências em qualquer parte do nome
- **Ordenação por relevância**: Correspondências no início aparecem primeiro
- **Destaque visual**: Termos pesquisados são destacados na lista
- **Limite de resultados**: Máximo de 10 opções para melhor performance

### **Entrada Manual**
- **Quando não encontra**: Sistema permite digitação manual
- **Validação**: Dados manuais são validados antes do envio
- **Flexibilidade**: Funciona mesmo com dados não cadastrados

### **Tratamento de Erros**
- **Dados sujos**: Sistema detecta e trata dados inconsistentes
- **Fallback robusto**: Funciona mesmo se API estiver indisponível
- **Mensagens informativas**: Usuário recebe feedback claro

## 💡 Dicas de Uso

### **Para Encontrar Rapidamente**
1. **Digite poucas letras**: 2-3 caracteres são suficientes
2. **Use palavras-chave**: Digite a parte mais distintiva do nome
3. **Ignore acentos**: Sistema funciona com ou sem acentos

### **Exemplos Práticos**

#### **Busca de Cliente**
```
Digite: "ana" → Encontra: "Ana Costa Silva"
Digite: "carlos" → Encontra: "Carlos Ferreira"
Digite: "silva" → Encontra: "Ana Costa Silva", "João Silva"
```

#### **Busca de Produto**
```
Digite: "pão" → Encontra: "Pão de Forma", "Pão Brioche"
Digite: "hambur" → Encontra: "Hambúrguer Artesanal"
Digite: "refri" → Encontra: "Refrigerante Cola"
```

#### **Busca de Loja**
```
Digite: "mercado" → Encontra: "Mercado J&F"
Digite: "centro" → Encontra: "Loja Centro"
```

## 🚨 Solução de Problemas

### **Dropdown não aparece**
- Verifique se clicou no campo correto
- Tente digitar pelo menos 1 caractere
- Clique no botão ▼ ao lado do campo

### **Nenhum resultado encontrado**
- Verifique a ortografia
- Tente usar menos caracteres
- Use palavras-chave diferentes
- Sistema permite entrada manual neste caso

### **Preenchimento automático não funciona**
- Certifique-se de selecionar uma opção da lista
- Não digite diretamente, use a seleção
- Verifique se há dados disponíveis para preenchimento

### **Performance lenta**
- Sistema limita resultados para melhor performance
- Use termos mais específicos para reduzir opções
- Aguarde alguns segundos para carregamento inicial

## 🔄 Atualizações Automáticas

### **Dados Excel**
- Sistema verifica atualizações a cada 5 minutos
- Novos dados aparecem automaticamente
- Cache inteligente otimiza performance

### **Notificações**
- Desenvolvedores recebem alertas sobre problemas
- Usuários não são impactados por erros técnicos
- Sistema continua funcionando mesmo com problemas

## 📞 Suporte

Para problemas técnicos ou dúvidas:
- **Email**: epav.2025@germinare.org.br
- **Tipo**: Alertas automáticos são enviados para problemas
- **Resposta**: Desenvolvedores são notificados automaticamente

---

*Este manual cobre a funcionalidade de pesquisa parcial implementada no sistema de formulário de pedidos. Para outras funcionalidades, consulte o README.md principal.*

