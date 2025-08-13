# Guia de Instalação - Sistema de Formulário de Pedidos

## Pré-requisitos

### Software Necessário

1. **Python 3.11 ou superior**
   - Download: https://www.python.org/downloads/
   - Verifique a instalação: `python --version`

2. **pip (gerenciador de pacotes Python)**
   - Geralmente incluído com Python
   - Verifique: `pip --version`

3. **Navegador Web Moderno**
   - Chrome, Firefox, Safari, Edge (versões recentes)

### Conhecimentos Recomendados

- Básico de linha de comando
- Conceitos básicos de arquivos Excel
- Navegação em pastas/diretórios

## Instalação Passo a Passo

### 1. Preparação do Ambiente

#### Windows:
```cmd
# Abrir Prompt de Comando como Administrador
# Navegar até a pasta do projeto
cd C:\caminho\para\formulario_pedidos
```

#### macOS/Linux:
```bash
# Abrir Terminal
# Navegar até a pasta do projeto
cd /caminho/para/formulario_pedidos
```

### 2. Instalação das Dependências Python

```bash
# Navegar para a pasta do backend
cd backend_excel

# Instalar dependências obrigatórias
pip install flask pandas openpyxl flask-cors

# Verificar instalação
pip list | grep -E "(flask|pandas|openpyxl)"
```

#### Dependências Instaladas:
- **Flask**: Servidor web Python
- **pandas**: Manipulação de dados Excel
- **openpyxl**: Leitura/escrita de arquivos Excel
- **flask-cors**: Suporte a requisições cross-origin

### 3. Configuração dos Arquivos Excel

#### 3.1. Estrutura de Pastas
Certifique-se de que existe a pasta:
```
backend_excel/data/
```

#### 3.2. Arquivos Excel Necessários

Coloque os seguintes arquivos na pasta `backend_excel/data/`:

**B_Alunos.xlsx** - Dados dos alunos
```
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
```

**Base_cadastros.xlsx** - Cadastros básicos
```
Colunas obrigatórias:
- Nome
- Email
- CPF
- Telefone
```

**Base Clientes.xlsx** - Dados completos dos clientes
```
Colunas obrigatórias:
- Nome
- Email
- CPF
- Telefone
- Endereço (opcional)
```

**B_Lojas.xlsx** - Lojas para retirada
```
Colunas obrigatórias:
- Nome
- Endereço
- Telefone
```

**Base_Produtos.xlsx** - Produtos disponíveis
```
Colunas obrigatórias:
- Nome
- Código
- Peso
- Preço
```

**B_Precos.xlsx** - Preços dos produtos
```
Colunas obrigatórias:
- Produto
- Preço
```

**Base_Vendas.xlsx** - Arquivo de destino (será criado automaticamente)

### 4. Configuração de Email (Opcional)

Para receber notificações de erro por email:

#### 4.1. Configurar Variáveis de Ambiente

**Windows:**
```cmd
set SENDER_EMAIL=seu-email@gmail.com
set SENDER_PASSWORD=sua-senha-de-app
```

**macOS/Linux:**
```bash
export SENDER_EMAIL="seu-email@gmail.com"
export SENDER_PASSWORD="sua-senha-de-app"
```

#### 4.2. Configurar Gmail (se usar Gmail)

1. Ativar autenticação de 2 fatores
2. Gerar senha de aplicativo
3. Usar a senha de aplicativo no `SENDER_PASSWORD`

### 5. Teste da Instalação

#### 5.1. Testar Backend

```bash
# Na pasta backend_excel
cd backend_excel
python src/main.py
```

**Saída esperada:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

#### 5.2. Testar API

Em outro terminal:
```bash
curl http://localhost:5000/api/excel/status
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "arquivos": {...},
  "cache": {...}
}
```

#### 5.3. Testar Frontend

1. Abrir `index.html` no navegador
2. Verificar se aparece: "API não disponível. Usando dados de exemplo"
3. Testar preenchimento de campos

### 6. Configuração para Produção

#### 6.1. Servidor Web

Para uso em produção, configure um servidor web:

**Opção 1: Nginx + Gunicorn**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

**Opção 2: Apache + mod_wsgi**
```bash
pip install mod_wsgi
# Configurar virtual host no Apache
```

#### 6.2. HTTPS

Configure certificado SSL para segurança:
```bash
# Usando Let's Encrypt
sudo certbot --nginx -d seu-dominio.com
```

#### 6.3. Backup Automático

Configure backup dos arquivos Excel:
```bash
# Crontab para backup diário
0 2 * * * cp -r /caminho/para/data /backup/$(date +\%Y\%m\%d)
```

### 7. Verificação da Instalação

#### Checklist de Verificação:

- [ ] Python 3.11+ instalado
- [ ] Dependências pip instaladas
- [ ] Pasta `backend_excel/data/` existe
- [ ] Arquivos Excel na pasta data
- [ ] Backend inicia sem erros
- [ ] API responde no localhost:5000
- [ ] Frontend abre no navegador
- [ ] Formulário carrega dados
- [ ] Cálculos funcionam
- [ ] Validações funcionam

#### Comandos de Verificação:

```bash
# Verificar Python
python --version

# Verificar dependências
pip list | grep -E "(flask|pandas|openpyxl)"

# Verificar arquivos Excel
ls -la backend_excel/data/

# Testar backend
cd backend_excel && python src/main.py &
curl http://localhost:5000/api/excel/status
```

### 8. Solução de Problemas

#### Problema: "ModuleNotFoundError"
**Solução:**
```bash
pip install --upgrade pip
pip install flask pandas openpyxl flask-cors
```

#### Problema: "Arquivo Excel não encontrado"
**Solução:**
1. Verificar se arquivos estão em `backend_excel/data/`
2. Verificar nomes exatos dos arquivos
3. Verificar permissões de leitura

#### Problema: "Port 5000 already in use"
**Solução:**
```bash
# Encontrar processo usando porta 5000
lsof -i :5000
# Matar processo
kill -9 PID_DO_PROCESSO
```

#### Problema: CORS errors no navegador
**Solução:**
1. Verificar se flask-cors está instalado
2. Usar servidor web local em vez de file://
3. Configurar CORS no backend

#### Problema: Dados não carregam
**Solução:**
1. Verificar estrutura das colunas Excel
2. Verificar se backend está rodando
3. Verificar logs do console do navegador

### 9. Manutenção

#### Atualizações Regulares:
```bash
# Atualizar dependências
pip install --upgrade flask pandas openpyxl flask-cors

# Verificar logs
tail -f backend_excel/logs/app.log
```

#### Monitoramento:
- Verificar endpoint `/api/excel/status` regularmente
- Monitorar uso de memória e CPU
- Fazer backup regular dos arquivos Excel

### 10. Desinstalação

Para remover completamente:
```bash
# Remover dependências Python
pip uninstall flask pandas openpyxl flask-cors

# Remover arquivos do projeto
rm -rf formulario_pedidos/

# Remover variáveis de ambiente
unset SENDER_EMAIL SENDER_PASSWORD
```

## Contato para Suporte

Para problemas de instalação:
**Email**: epav.2025@germinare.org.br

---

**📋 Nota**: Mantenha este guia para futuras reinstalações ou atualizações do sistema.

