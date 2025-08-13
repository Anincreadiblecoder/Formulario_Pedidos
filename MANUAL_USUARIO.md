# Manual do Usuário - Formulário de Pedidos

## Como Usar o Sistema

### 1. Acessando o Formulário

1. Abra o arquivo `index.html` no seu navegador
2. Aguarde o carregamento completo da página
3. Você verá a mensagem "API não disponível. Usando dados de exemplo" (isso é normal)

### 2. Preenchendo o Formulário

#### **Seção: Informações do Aluno**

- **Sala do Aluno**: Digite a sala/série do aluno
- **Nome completo do aluno**: Digite o nome completo
- **Email escolar**: Será preenchido automaticamente baseado no nome (ou digite manualmente)

#### **Seção: Informações do Cliente**

- **Nome completo do cliente**: Selecione da lista ou digite manualmente
  - Se selecionar da lista: dados serão preenchidos automaticamente
  - Se não encontrar: campos ficam editáveis para preenchimento manual
- **Email do cliente**: Preenchido automaticamente ou digite manualmente
- **CPF**: Preenchido automaticamente ou digite apenas números
- **Telefone/WhatsApp**: Preenchido automaticamente ou digite manualmente

#### **Seção: Informações de Entrega**

- **Entrega**: Selecione uma opção:
  - Entrega em Casa
  - Retirada - Outras Lojas
  - Retirada - Mercado J&F
- **Endereço completo**: Aparece apenas se selecionar "Entrega em Casa"
- **Data de entrega**: Selecione a data desejada
- **Condição de entrega/frete**: Informações adicionais sobre entrega

#### **Seção: Forma de Pagamento**

- Selecione uma das opções disponíveis:
  - Pix
  - Cartão de crédito
  - PicPay

### 3. Adicionando Itens ao Pedido

1. **Clique em "Adicionar Item"**
2. **Para cada item:**
   - **Nome do Produto**: Selecione da lista
   - **Há promoção**: Marque Sim ou Não
   - **Quantidade**: Digite a quantidade desejada
   - **Peso**: Preenchido automaticamente
   - **Preço Unitário**: Preenchido automaticamente
   - **Valor Total do Item**: Calculado automaticamente

3. **Adicione quantos itens precisar** clicando novamente em "Adicionar Item"
4. **Para remover um item**, clique em "Remover Item" no item desejado

### 4. Finalizando o Pedido

1. **Verifique o Valor Total do Pedido** (calculado automaticamente)
2. **Adicione observações** se necessário
3. **Clique em "Enviar Pedido"**

### 5. Validações Automáticas

O sistema verifica automaticamente:
- ✅ Campos obrigatórios preenchidos
- ✅ Formato correto de email
- ✅ CPF com 11 dígitos
- ✅ Pelo menos um item no pedido
- ✅ Forma de pagamento selecionada

Se algo estiver incorreto, uma mensagem vermelha aparecerá indicando o problema.

### 6. Mensagens do Sistema

**🟢 Verde**: Sucesso (dados preenchidos automaticamente)  
**🟡 Amarelo**: Aviso (dados não encontrados, preencha manualmente)  
**🔴 Vermelho**: Erro (corrija antes de continuar)  
**🔵 Azul**: Informação geral

### 7. Dicas Importantes

#### **Preenchimento Automático**
- Quando você seleciona um cliente da lista, email, CPF e telefone são preenchidos automaticamente
- Quando você seleciona um produto, peso e preço são preenchidos automaticamente
- Se os dados não forem encontrados, você pode digitar manualmente

#### **Cálculos Automáticos**
- O valor total de cada item é calculado automaticamente (quantidade × preço)
- O valor total do pedido soma todos os itens automaticamente
- Os cálculos são atualizados em tempo real conforme você digita

#### **Campos Obrigatórios**
Campos marcados com * são obrigatórios:
- Nome completo do cliente
- Email do cliente
- CPF do cliente
- Telefone/WhatsApp do cliente
- Tipo de entrega
- Forma de pagamento
- Pelo menos um item no pedido

#### **Responsividade**
- O formulário funciona em computadores, tablets e celulares
- Em telas menores, os campos se reorganizam automaticamente
- Todos os botões são otimizados para toque

### 8. Solução de Problemas

#### **"Cliente não encontrado na base"**
- **Solução**: Digite os dados manualmente nos campos que ficaram editáveis

#### **"Produto não encontrado"**
- **Solução**: Selecione outro produto da lista ou contate o administrador

#### **Campos não preenchem automaticamente**
- **Solução**: Digite os dados manualmente - o sistema continua funcionando normalmente

#### **Cálculos não aparecem**
- **Solução**: Verifique se digitou a quantidade corretamente e se o produto foi selecionado

#### **Erro ao enviar pedido**
- **Solução**: Verifique se todos os campos obrigatórios (*) estão preenchidos

### 9. Exemplo Prático

**Passo a passo para fazer um pedido:**

1. **Aluno**: 
   - Sala: "3º Ano A"
   - Nome: "Maria Silva"
   - Email: será preenchido automaticamente

2. **Cliente**:
   - Selecione "Ana Costa" da lista
   - Email, CPF e telefone serão preenchidos automaticamente

3. **Entrega**:
   - Selecione "Entrega em Casa"
   - Preencha o endereço
   - Data: selecione a data desejada

4. **Pagamento**:
   - Selecione "Pix"

5. **Itens**:
   - Clique "Adicionar Item"
   - Produto: "Hambúrguer Artesanal"
   - Quantidade: "2"
   - Peso e preço preenchidos automaticamente
   - Valor total: R$ 51,80

6. **Finalizar**:
   - Verifique valor total do pedido
   - Clique "Enviar Pedido"

### 10. Contato

Para dúvidas ou problemas técnicos:
**Email**: epav.2025@germinare.org.br

---

**💡 Dica**: Mantenha este manual próximo para consulta rápida durante o uso do sistema!

