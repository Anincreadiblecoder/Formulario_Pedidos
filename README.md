# Sistema de Formulário de Pedidos

## Visão Geral

Este é um sistema completo de formulário de pedidos desenvolvido para automatizar o processo de coleta e processamento de pedidos de alunos. O sistema integra-se com bases de dados Excel e oferece preenchimento automático, validações inteligentes e tratamento robusto de dados.

## Características Principais

### ✅ **Funcionalidades Implementadas**

- **Preenchimento Automático**: Dados de alunos, clientes, produtos e lojas preenchidos automaticamente
- **Validação Inteligente**: Campos obrigatórios, formatos de email, CPF, telefone
- **Cálculos Automáticos**: Valores totais calculados em tempo real
- **Interface Responsiva**: Adaptável para desktop e dispositivos móveis
- **Sistema de Mensagens**: Feedback visual para o usuário
- **Integração Excel**: Leitura e escrita em arquivos Excel
- **Cache Inteligente**: Atualização automática quando arquivos Excel são modificados
- **Tratamento de Dados Sujos**: Validação e limpeza automática de dados inconsistentes
- **Notificação de Erros**: Alertas automáticos por email para desenvolvedores
- **Fallback Robusto**: Funciona mesmo quando API não está disponível
- **🔍 NOVO: Pesquisa de Pedidos**: Sistema completo para pesquisar pedidos por aluno com filtros avançados

### 🔧 **Arquitetura do Sistema**

```
formulario_pedidos/
├── index.html              # Interface principal do formulário
├── pesquisar_pedidos.html  # NOVO: Página de pesquisa de pedidos
├── styles.css              # Estilos responsivos
├── pesquisa_styles.css     # NOVO: Estilos específicos para pesquisa
├── script_api.js           # Lógica JavaScript com integração API
├── pesquisa_pedidos.js     # NOVO: JavaScript para funcionalidade de pesquisa
├── backend_excel/          # Backend Flask para integração Excel
│   ├── src/
│   │   ├── main.py         # Servidor Flask principal
│   │   ├── routes/
│   │   │   └── excel_api.py # Rotas da API REST (ATUALIZADO com endpoints de pesquisa)
│   │   └── utils/
│   │       ├── cache_manager.py    # Gerenciador de cache inteligente (ATUALIZADO)
│   │       ├── data_validator.py   # Validador de dados sujos
│   │       └── email_notifier.py   # Sistema de notificação
│   └── data/               # Arquivos Excel
│       ├── B_Alunos.xlsx
│       ├── Base_cadastros.xlsx
│       ├── Base Clientes.xlsx
│       ├── B_Lojas.xlsx
│       ├── Base_Produtos.xlsx
│       ├── B_Precos.xlsx
│       └── Base_Vendas.xlsx    # ATUALIZADO: Agora inclui pedidos salvos
└── README.md               # Esta documentação
```

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Python 3.11, Flask
- **Dados**: Excel (xlsx), pandas
- **Cache**: Sistema próprio com verificação MD5
- **Notificações**: SMTP (configurável)
- **Validação**: Regex, pandas, validações customizadas

## Instalação e Configuração

### Pré-requisitos

- Python 3.11+
- pip (gerenciador de pacotes Python)
- Navegador web moderno

### Instalação

1. **Instalar dependências Python:**
```bash
cd formulario_pedidos/backend_excel
pip install flask pandas openpyxl flask-cors
```

2. **Configurar variáveis de ambiente (opcional):**
```bash
export SENDER_EMAIL="seu-email@gmail.com"
export SENDER_PASSWORD="sua-senha-app"
```

3. **Iniciar o servidor backend:**
```bash
cd backend_excel
python src/main.py
```

4. **Abrir o formulário:**
   - Abra `index.html` em um navegador web
   - Ou use um servidor web local para melhor experiência

### Configuração dos Arquivos Excel

O sistema espera os seguintes arquivos Excel na pasta `backend_excel/data/`:

#### B_Alunos.xlsx
Colunas obrigatórias:
- Nome do Estudante
- E-mail do Aluno
- Série do Aluno
- Número de Presença do Estudante
- Cep do Estudante
- Rua/Av do Estudante
- Bairro do Estudante
- Número Endereço do Estudante
- Cidade do Estudante

#### Base_cadastros.xlsx
Colunas obrigatórias:
- Nome
- Email
- CPF
- Telefone

#### Base Clientes.xlsx
Colunas obrigatórias:
- Nome
- Email
- CPF
- Telefone
- Endereço (opcional)

#### B_Lojas.xlsx
Colunas obrigatórias:
- Nome
- Endereço
- Telefone

#### Base_Produtos.xlsx
Colunas obrigatórias:
- Nome
- Código
- Peso
- Preço

#### B_Precos.xlsx
Colunas obrigatórias:
- Produto
- Preço

#### Base_Vendas.xlsx
Este arquivo é usado para salvar os pedidos. Será criado automaticamente se não existir.

## Como Usar o Sistema

### Para Usuários Finais

1. **Abrir o Formulário**: Acesse `index.html` no navegador
2. **Preencher Dados do Aluno**: Digite o nome do aluno (email será preenchido automaticamente)
3. **Selecionar Cliente**: Escolha um cliente da lista (dados serão preenchidos automaticamente)
4. **Configurar Entrega**: Selecione tipo de entrega e preencha detalhes
5. **Adicionar Itens**: Clique em "Adicionar Item" e selecione produtos
6. **Revisar Pedido**: Verifique valores calculados automaticamente
7. **Enviar**: Clique em "Enviar Pedido" para processar

### Funcionalidades Especiais

- **Preenchimento Automático**: Ao selecionar cliente ou produto, dados relacionados são preenchidos automaticamente
- **Entrada Manual**: Se dados não forem encontrados, campos ficam editáveis para entrada manual
- **Validação em Tempo Real**: Campos obrigatórios são validados antes do envio
- **Cálculos Automáticos**: Valores totais são calculados conforme itens são adicionados
- **Mensagens Informativas**: Sistema mostra feedback visual sobre ações realizadas

## Sistema de Validação de Dados

### Validações Implementadas

- **Email**: Formato válido (usuario@dominio.com)
- **CPF**: 11 dígitos numéricos
- **Telefone**: Mínimo 10 dígitos
- **CEP**: 8 dígitos numéricos
- **Preços**: Valores numéricos positivos
- **Campos Obrigatórios**: Nome não pode estar vazio

### Tratamento de Dados Sujos

O sistema detecta e trata automaticamente:
- Campos com valores nulos ou vazios
- Formatos incorretos de email, CPF, telefone
- Caracteres especiais desnecessários
- Espaços extras em strings
- Valores numéricos malformados

### Notificação de Erros

Quando dados sujos são detectados:
- **Para o usuário**: Sistema continua funcionando normalmente com fallback
- **Para desenvolvedores**: Email automático enviado para `epav.2025@germinare.org.br` com detalhes técnicos

## API REST

O backend oferece uma API REST completa:

### Endpoints Disponíveis

```
GET /api/excel/alunos                    # Lista todos os alunos
GET /api/excel/alunos/buscar?nome=X      # Busca aluno por nome
GET /api/excel/clientes                  # Lista todos os clientes  
GET /api/excel/clientes/buscar?nome=X    # Busca cliente por nome
GET /api/excel/lojas                     # Lista todas as lojas
GET /api/excel/produtos                  # Lista produtos com preços
GET /api/excel/produtos/buscar?nome=X    # Busca produto específico
POST /api/excel/pedidos                  # Salva novo pedido
GET /api/excel/pedidos                   # Lista pedidos salvos
GET /api/excel/status                    # Status da API e arquivos
POST /api/excel/cache/refresh            # Força atualização do cache
GET /api/excel/cache/info                # Informações sobre o cache
```

### Exemplo de Uso da API

```javascript
// Buscar cliente
const response = await fetch('/api/excel/clientes/buscar?nome=Ana Costa');
const cliente = await response.json();

// Salvar pedido
const pedido = {
    aluno: "João Silva",
    cliente: "Ana Costa",
    itens: [
        { produto: "Hambúrguer", quantidade: 2, preco: 25.90 }
    ],
    total: 51.80
};

await fetch('/api/excel/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
});
```

## Sistema de Cache Inteligente

### Como Funciona

1. **Verificação Automática**: A cada 5 minutos, verifica se arquivos Excel foram modificados
2. **Detecção de Mudanças**: Usa timestamp E hash MD5 para máxima confiabilidade
3. **Atualização Seletiva**: Recarrega apenas arquivos que realmente mudaram
4. **Thread-Safe**: Seguro para múltiplos acessos simultâneos

### Benefícios

- **Performance**: Dados em memória para acesso rápido
- **Atualização Automática**: Detecta mudanças nos Excel automaticamente
- **Confiabilidade**: Dupla verificação (timestamp + hash)
- **Eficiência**: Não recarrega dados desnecessariamente

## Manutenção e Monitoramento

### Logs do Sistema

O sistema gera logs detalhados:
- Erros de acesso a arquivos
- Problemas de validação de dados
- Status do cache
- Requisições da API

### Monitoramento de Saúde

Use o endpoint `/api/excel/status` para verificar:
- Status dos arquivos Excel
- Informações do cache
- Última atualização dos dados
- Erros recentes

### Atualizações dos Dados

Para atualizar dados:
1. **Automático**: Modifique os arquivos Excel - sistema detecta automaticamente
2. **Manual**: Use `POST /api/excel/cache/refresh` para forçar atualização
3. **Verificação**: Use `GET /api/excel/cache/info` para confirmar atualização

## Solução de Problemas

### Problemas Comuns

**1. Formulário não carrega dados**
- Verifique se o servidor Flask está rodando
- Confirme se arquivos Excel existem na pasta `data/`
- Verifique logs do console do navegador

**2. Dados não são preenchidos automaticamente**
- Verifique estrutura das colunas nos arquivos Excel
- Confirme se nomes correspondem exatamente
- Use entrada manual como alternativa

**3. Cálculos incorretos**
- Verifique formato dos preços nos arquivos Excel
- Confirme se valores são numéricos
- Recarregue a página para resetar estado

**4. Erros de validação**
- Verifique formato dos dados (email, CPF, telefone)
- Remova caracteres especiais desnecessários
- Use dados de exemplo como referência

### Contato para Suporte

Para problemas técnicos, o sistema envia automaticamente alertas para:
**Email**: epav.2025@germinare.org.br

## Segurança

### Medidas Implementadas

- **Validação de Entrada**: Todos os dados são validados antes do processamento
- **Sanitização**: Remoção de caracteres perigosos
- **CORS Configurado**: Controle de acesso entre domínios
- **Logs de Auditoria**: Registro de todas as operações

### Recomendações

- Mantenha arquivos Excel em local seguro
- Configure HTTPS em produção
- Monitore logs regularmente
- Atualize dependências periodicamente

## Licença e Créditos

Sistema desenvolvido para automatização de pedidos escolares.
Desenvolvido com tecnologias open-source.

---

**Versão**: 1.0  
**Data**: Agosto 2025  
**Desenvolvedor**: Sistema Manus  
**Contato**: epav.2025@germinare.org.br

#   F o r m u l a r i o _ P e d i d o s  
 