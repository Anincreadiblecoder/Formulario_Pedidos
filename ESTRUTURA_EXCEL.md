# Estrutura dos Arquivos Excel

## Visão Geral

O sistema utiliza 7 arquivos Excel para armazenar e processar dados. Cada arquivo tem uma estrutura específica que deve ser respeitada para o funcionamento correto do sistema.

## Localização dos Arquivos

Todos os arquivos devem estar na pasta:
```
backend_excel/data/
```

## Detalhamento dos Arquivos

### 1. B_Alunos.xlsx - Dados dos Alunos

**Propósito**: Armazena informações dos alunos para preenchimento automático.

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Nome do Estudante | Texto | ✅ | Nome completo do aluno | "João Silva Santos" |
| E-mail do Aluno | Email | ❌ | Email escolar do aluno | "joao.silva@escola.edu.br" |
| Série do Aluno | Texto | ❌ | Série/turma do aluno | "3º Ano A" |
| Número de Presença do Estudante | Número | ❌ | Número de chamada | 15 |
| Cep do Estudante | Texto | ❌ | CEP (8 dígitos) | "01234567" |
| Rua/Av do Estudante | Texto | ❌ | Nome da rua/avenida | "Rua das Flores" |
| Bairro do Estudante | Texto | ❌ | Nome do bairro | "Centro" |
| Número Endereço do Estudante | Texto | ❌ | Número da residência | "123" |
| Cidade do Estudante | Texto | ❌ | Nome da cidade | "São Paulo" |

**Exemplo de Dados:**
```
Nome do Estudante: Maria Silva
E-mail do Aluno: maria.silva@escola.edu.br
Série do Aluno: 2º Ano B
Número de Presença do Estudante: 8
Cep do Estudante: 01310100
Rua/Av do Estudante: Avenida Paulista
Bairro do Estudante: Bela Vista
Número Endereço do Estudante: 1000
Cidade do Estudante: São Paulo
```

### 2. Base_cadastros.xlsx - Cadastros Básicos

**Propósito**: Cadastros simples de clientes para busca rápida.

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Nome | Texto | ✅ | Nome completo do cliente | "Ana Costa Silva" |
| Email | Email | ❌ | Email do cliente | "ana.costa@email.com" |
| CPF | Texto | ❌ | CPF (apenas números) | "12345678901" |
| Telefone | Texto | ❌ | Telefone/WhatsApp | "11987654321" |

### 3. Base Clientes.xlsx - Dados Completos dos Clientes

**Propósito**: Informações detalhadas dos clientes para preenchimento automático.

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Nome | Texto | ✅ | Nome completo | "Carlos Ferreira" |
| Email | Email | ❌ | Email válido | "carlos@email.com" |
| CPF | Texto | ❌ | 11 dígitos numéricos | "98765432100" |
| Telefone | Texto | ❌ | Telefone com DDD | "11912345678" |
| Endereço | Texto | ❌ | Endereço completo | "Rua A, 123 - Bairro B" |

### 4. B_Lojas.xlsx - Lojas para Retirada

**Propósito**: Lista de lojas onde produtos podem ser retirados.

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Nome | Texto | ✅ | Nome da loja | "Mercado J&F - Centro" |
| Endereço | Texto | ❌ | Endereço completo | "Av. Central, 500 - Centro" |
| Telefone | Texto | ❌ | Telefone da loja | "1133334444" |

### 5. Base_Produtos.xlsx - Produtos Disponíveis

**Propósito**: Catálogo de produtos com informações básicas.

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Nome | Texto | ✅ | Nome do produto | "Hambúrguer Artesanal" |
| Código | Texto | ❌ | Código interno | "HAM001" |
| Peso | Texto | ❌ | Peso/tamanho | "200g" |
| Preço | Número | ❌ | Preço unitário | 25.90 |

### 6. B_Precos.xlsx - Preços dos Produtos

**Propósito**: Tabela de preços atualizada (pode ser separada para facilitar atualizações).

**Estrutura das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| Produto | Texto | ✅ | Nome exato do produto | "Pizza Margherita" |
| Preço | Número | ✅ | Preço atual | 32.50 |

### 7. Base_Vendas.xlsx - Registro de Pedidos

**Propósito**: Arquivo de destino onde pedidos são salvos automaticamente.

**Estrutura das Colunas (criadas automaticamente):**

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| Data | Data/Hora | Data e hora do pedido | "2025-08-13 14:30:00" |
| ID_Pedido | Texto | Identificador único | "PED_20250813_001" |
| Aluno_Nome | Texto | Nome do aluno | "João Silva" |
| Aluno_Sala | Texto | Sala do aluno | "3º Ano A" |
| Cliente_Nome | Texto | Nome do cliente | "Ana Costa" |
| Cliente_Email | Email | Email do cliente | "ana@email.com" |
| Cliente_CPF | Texto | CPF do cliente | "12345678901" |
| Cliente_Telefone | Texto | Telefone do cliente | "11987654321" |
| Tipo_Entrega | Texto | Tipo de entrega | "Entrega em Casa" |
| Endereco_Entrega | Texto | Endereço de entrega | "Rua A, 123" |
| Data_Entrega | Data | Data de entrega | "2025-08-15" |
| Forma_Pagamento | Texto | Forma de pagamento | "Pix" |
| Itens | Texto | Lista de itens (JSON) | "[{produto: 'Hambúrguer', qtd: 2}]" |
| Valor_Total | Número | Valor total do pedido | 51.80 |
| Observacoes | Texto | Observações adicionais | "Entregar após 18h" |

## Regras de Formatação

### Dados de Texto
- **Sem espaços extras** no início ou fim
- **Primeira letra maiúscula** para nomes próprios
- **Caracteres especiais** permitidos: acentos, hífen, apóstrofo

### Dados Numéricos
- **CPF**: Apenas números, 11 dígitos
- **Telefone**: Números com DDD, mínimo 10 dígitos
- **CEP**: Apenas números, 8 dígitos
- **Preços**: Formato decimal com ponto (25.90)

### Dados de Email
- **Formato válido**: usuario@dominio.com
- **Sem espaços** em branco
- **Letras minúsculas** recomendadas

## Validações Automáticas

O sistema aplica as seguintes validações:

### ✅ Validações que Passam
```
Email: "usuario@dominio.com"
CPF: "12345678901"
Telefone: "11987654321"
CEP: "01234567"
Preço: 25.90
Nome: "João Silva"
```

### ❌ Validações que Falham
```
Email: "email_inválido"
CPF: "123.456.789-01" (com pontuação)
Telefone: "123456" (muito curto)
CEP: "12345-678" (com hífen)
Preço: "R$ 25,90" (com texto)
Nome: "" (vazio)
```

## Tratamento de Dados Sujos

### Limpeza Automática
O sistema limpa automaticamente:
- **Espaços extras** no início e fim
- **Múltiplos espaços** entre palavras
- **Caracteres especiais** desnecessários em números
- **Formatação** de moeda em preços

### Exemplo de Limpeza
```
Entrada: "  João   Silva  "
Saída: "João Silva"

Entrada: "R$ 25,90"
Saída: 25.90

Entrada: "123.456.789-01"
Saída: "12345678901"
```

## Backup e Versionamento

### Recomendações
1. **Backup diário** dos arquivos Excel
2. **Versionamento** com data: `Base_Produtos_20250813.xlsx`
3. **Teste** em ambiente separado antes de atualizar produção

### Script de Backup (exemplo)
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
cp -r backend_excel/data/ backup/data_$DATE/
```

## Solução de Problemas

### Arquivo não é lido
**Possíveis causas:**
- Nome do arquivo incorreto
- Colunas com nomes diferentes
- Arquivo corrompido
- Permissões de acesso

**Soluções:**
1. Verificar nome exato do arquivo
2. Verificar nomes das colunas
3. Recriar arquivo se corrompido
4. Ajustar permissões de leitura

### Dados não aparecem no formulário
**Possíveis causas:**
- Dados em formato incorreto
- Células vazias em campos obrigatórios
- Caracteres especiais problemáticos

**Soluções:**
1. Verificar formato dos dados
2. Preencher campos obrigatórios
3. Remover caracteres especiais

### Cálculos incorretos
**Possíveis causas:**
- Preços em formato texto
- Valores com vírgula em vez de ponto
- Células com fórmulas em vez de valores

**Soluções:**
1. Converter preços para número
2. Usar ponto decimal (25.90)
3. Colar valores em vez de fórmulas

## Modelos de Exemplo

Para facilitar a criação dos arquivos, modelos de exemplo estão disponíveis na pasta `backend_excel/data/` após a instalação.

## Contato

Para dúvidas sobre estrutura dos arquivos:
**Email**: epav.2025@germinare.org.br

---

**📊 Importante**: Mantenha sempre backup dos arquivos Excel antes de fazer alterações!

