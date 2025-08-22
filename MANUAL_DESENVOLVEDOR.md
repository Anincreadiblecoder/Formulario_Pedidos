# Manual do Desenvolvedor - Sistema de Formulário de Pedidos

## Arquitetura do Sistema

### Visão Geral
O sistema é composto por três camadas principais:
1. **Frontend**: HTML/CSS/JavaScript (interface do usuário)
2. **Backend**: Flask/Python (API REST e processamento)
3. **Dados**: Arquivos Excel (armazenamento e cache)

### Fluxo de Dados
```
[Excel Files] → [Cache Manager] → [Flask API] → [JavaScript Frontend] → [User Interface]
```

## Estrutura do Código

### Frontend (`/`)
```
index.html          # Interface principal
styles.css          # Estilos responsivos
script_api.js       # Lógica JavaScript principal
```

### Backend (`/backend_excel/`)
```
src/
├── main.py                    # Servidor Flask principal
├── routes/
│   └── excel_api.py          # Endpoints da API REST
└── utils/
    ├── cache_manager.py      # Gerenciamento de cache
    ├── data_validator.py     # Validação de dados
    └── email_notifier.py     # Sistema de notificações
```

## Componentes Principais

### 1. Cache Manager (`cache_manager.py`)

**Responsabilidades:**
- Monitorar modificações em arquivos Excel
- Manter cache em memória para performance
- Validar e limpar dados automaticamente
- Notificar sobre problemas de dados

**Métodos Principais:**
```python
class ExcelCacheManager:
    def get_alunos()           # Retorna lista de alunos
    def get_clientes()         # Retorna lista de clientes  
    def get_produtos()         # Retorna lista de produtos
    def buscar_aluno(nome)     # Busca aluno específico
    def buscar_cliente(nome)   # Busca cliente específico
    def _is_file_modified()    # Verifica modificações
    def _load_excel_data()     # Carrega dados do Excel
```

**Configurações:**
```python
check_interval = timedelta(minutes=5)  # Intervalo de verificação
```

### 2. Data Validator (`data_validator.py`)

**Responsabilidades:**
- Validar formatos de dados (email, CPF, telefone)
- Limpar dados sujos automaticamente
- Gerar relatórios de qualidade de dados

**Validações Implementadas:**
```python
def validate_email(email)      # Formato de email
def validate_cpf(cpf)          # CPF com 11 dígitos
def validate_phone(phone)      # Telefone mínimo 10 dígitos
def validate_cep(cep)          # CEP com 8 dígitos
def clean_string(value)        # Limpeza de strings
def clean_numeric(value)       # Limpeza de números
```

### 3. Email Notifier (`email_notifier.py`)

**Responsabilidades:**
- Enviar alertas silenciosos para desenvolvedores
- Controlar frequência de notificações (cooldown)
- Formatar mensagens técnicas detalhadas

**Tipos de Notificação:**
```python
def notify_data_corruption()    # Dados corrompidos
def notify_file_access_error()  # Erro de acesso a arquivo
def notify_validation_errors()  # Erros de validação
def notify_system_error()       # Erros gerais do sistema
```

### 4. API REST (`excel_api.py`)

**Endpoints Implementados:**
```python
GET  /api/excel/alunos                 # Lista alunos
GET  /api/excel/alunos/buscar?nome=X   # Busca aluno
GET  /api/excel/clientes               # Lista clientes
GET  /api/excel/clientes/buscar?nome=X # Busca cliente
GET  /api/excel/lojas                  # Lista lojas
GET  /api/excel/produtos               # Lista produtos
POST /api/excel/pedidos                # Salva pedido
GET  /api/excel/status                 # Status do sistema
POST /api/excel/cache/refresh          # Força atualização
GET  /api/excel/cache/info             # Info do cache
```

## Configurações do Sistema

### Variáveis de Ambiente
```bash
SENDER_EMAIL=email@dominio.com      # Email para notificações
SENDER_PASSWORD=senha-do-app        # Senha do email
```

### Configurações do Flask
```python
# main.py
app.config['DEBUG'] = False
app.config['TESTING'] = False
CORS(app)  # Habilitar CORS
```

### Configurações do Cache
```python
# cache_manager.py
check_interval = timedelta(minutes=5)    # Verificação a cada 5 min
notification_cooldown = 3600             # 1 hora entre emails
```

## Desenvolvimento e Debug

### Executar em Modo Debug
```bash
cd backend_excel
export FLASK_ENV=development
python src/main.py
```

### Logs e Monitoramento
```python
# Adicionar logs personalizados
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Operação realizada com sucesso")
logger.error("Erro detectado: %s", str(error))
```

### Testar API Manualmente
```bash
# Testar status
curl http://localhost:5000/api/excel/status

# Testar busca de cliente
curl "http://localhost:5000/api/excel/clientes/buscar?nome=Ana"

# Testar salvamento de pedido
curl -X POST http://localhost:5000/api/excel/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente": "Ana Costa", "total": 50.00}'
```

## Manutenção e Atualizações

### Atualizar Dependências
```bash
pip install --upgrade flask pandas openpyxl flask-cors
pip freeze > requirements.txt
```

### Backup de Dados
```bash
# Script de backup automático
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz backend_excel/data/
```

### Monitoramento de Performance
```python
# Adicionar métricas de performance
import time

def monitor_performance(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logger.info(f"{func.__name__} executado em {end_time - start_time:.2f}s")
        return result
    return wrapper
```

## Extensões e Customizações

### Adicionar Novo Endpoint
```python
# Em excel_api.py
@excel_bp.route('/novo-endpoint', methods=['GET'])
def novo_endpoint():
    try:
        # Lógica do endpoint
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Adicionar Nova Validação
```python
# Em data_validator.py
def validate_custom_field(value):
    """Validação customizada."""
    if not value or len(value) < 3:
        return False
    return True
```

### Adicionar Novo Tipo de Notificação
```python
# Em email_notifier.py
def notify_custom_event(details):
    """Notificação customizada."""
    subject = "Evento Customizado"
    body = f"Detalhes: {details}"
    self._send_email_async(subject, body)
```

## Segurança

### Validação de Entrada
```python
# Sempre validar dados de entrada
def validate_input(data):
    if not isinstance(data, dict):
        raise ValueError("Dados inválidos")
    
    required_fields = ['nome', 'email']
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Campo obrigatório: {field}")
```

### Sanitização de Dados
```python
import re

def sanitize_string(value):
    """Remove caracteres perigosos."""
    if not value:
        return ""
    
    # Remove tags HTML
    value = re.sub(r'<[^>]+>', '', str(value))
    
    # Remove caracteres especiais perigosos
    value = re.sub(r'[<>"\']', '', value)
    
    return value.strip()
```

### Rate Limiting
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@excel_bp.route('/api/excel/pedidos', methods=['POST'])
@limiter.limit("10 per minute")
def salvar_pedido():
    # Lógica do endpoint
    pass
```

## Testes

### Testes Unitários
```python
# test_validators.py
import unittest
from src.utils.data_validator import DataValidator

class TestDataValidator(unittest.TestCase):
    def setUp(self):
        self.validator = DataValidator()
    
    def test_validate_email(self):
        self.assertTrue(self.validator.validate_email("test@email.com"))
        self.assertFalse(self.validator.validate_email("email_inválido"))
    
    def test_validate_cpf(self):
        self.assertTrue(self.validator.validate_cpf("12345678901"))
        self.assertFalse(self.validator.validate_cpf("123.456.789-01"))

if __name__ == '__main__':
    unittest.main()
```

### Testes de Integração
```python
# test_api.py
import unittest
import json
from src.main import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_status_endpoint(self):
        response = self.app.get('/api/excel/status')
        self.assertEqual(response.status_code, 200)
        
    def test_buscar_cliente(self):
        response = self.app.get('/api/excel/clientes/buscar?nome=Ana')
        self.assertEqual(response.status_code, 200)
```

## Deploy e Produção

### Configuração para Produção
```python
# config.py
class ProductionConfig:
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'sua-chave-secreta-aqui'
    
class DevelopmentConfig:
    DEBUG = True
    TESTING = True
```

### Docker (Opcional)
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "src.main:app"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /static {
        alias /caminho/para/static/files;
    }
}
```

## Troubleshooting

### Problemas Comuns

**1. Cache não atualiza**
```python
# Forçar limpeza do cache
cache_manager.cache.clear()
cache_manager.file_timestamps.clear()
cache_manager.file_hashes.clear()
```

**2. Memória alta**
```python
# Monitorar uso de memória
import psutil
process = psutil.Process()
memory_usage = process.memory_info().rss / 1024 / 1024  # MB
logger.info(f"Uso de memória: {memory_usage:.2f} MB")
```

**3. Arquivos Excel corrompidos**
```python
# Verificar integridade
try:
    df = pd.read_excel(filepath)
    logger.info(f"Arquivo {filename} OK: {len(df)} registros")
except Exception as e:
    logger.error(f"Arquivo {filename} corrompido: {str(e)}")
    email_notifier.notify_file_access_error(filename, str(e))
```

## Contato e Suporte

Para questões técnicas de desenvolvimento:
**Email**: epav.2025@germinare.org.br

## Changelog

### Versão 1.0 (Agosto 2025)
- ✅ Sistema completo de formulário de pedidos
- ✅ Integração com arquivos Excel
- ✅ Cache inteligente com atualização automática
- ✅ Validação de dados sujos
- ✅ Sistema de notificações por email
- ✅ API REST completa
- ✅ Interface responsiva
- ✅ Documentação completa

---

**🔧 Nota para Desenvolvedores**: Este manual deve ser atualizado sempre que novas funcionalidades forem adicionadas ao sistema.

