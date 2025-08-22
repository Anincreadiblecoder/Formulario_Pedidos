"""
Sistema de cache inteligente para dados Excel.
Monitora modificações nos arquivos e atualiza o cache automaticamente.
Inclui validação de dados sujos e notificação silenciosa de erros.
"""

import os
import json
import pandas as pd
from datetime import datetime, timedelta
from threading import Lock
import hashlib
from .data_validator import DataValidator
from .email_notifier import email_notifier

class ExcelCacheManager:
    def __init__(self, data_dir):
        self.data_dir = data_dir
        self.cache = {}
        self.file_timestamps = {}
        self.file_hashes = {}
        self.cache_lock = Lock()
        self.last_check = None
        self.check_interval = timedelta(minutes=5)  # Verificar a cada 5 minutos
        self.validator = DataValidator()
        
    def _get_file_hash(self, filepath):
        """Calcula o hash MD5 de um arquivo."""
        if not os.path.exists(filepath):
            return None
        
        try:
            hash_md5 = hashlib.md5()
            with open(filepath, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception as e:
            email_notifier.notify_file_access_error(os.path.basename(filepath), str(e))
            return None
    
    def _should_check_files(self):
        """Verifica se é hora de checar os arquivos novamente."""
        if self.last_check is None:
            return True
        
        now = datetime.now()
        return (now - self.last_check) > self.check_interval
    
    def _is_file_modified(self, filename):
        """Verifica se um arquivo foi modificado desde a última verificação."""
        filepath = os.path.join(self.data_dir, filename)
        
        if not os.path.exists(filepath):
            return False
        
        try:
            # Verificar timestamp
            current_mtime = os.path.getmtime(filepath)
            if filename not in self.file_timestamps:
                self.file_timestamps[filename] = current_mtime
                return True
            
            if current_mtime != self.file_timestamps[filename]:
                self.file_timestamps[filename] = current_mtime
                return True
            
            # Verificar hash como backup (mais confiável)
            current_hash = self._get_file_hash(filepath)
            if filename not in self.file_hashes:
                self.file_hashes[filename] = current_hash
                return True
            
            if current_hash != self.file_hashes[filename]:
                self.file_hashes[filename] = current_hash
                return True
            
            return False
        except Exception as e:
            email_notifier.notify_file_access_error(filename, str(e))
            return False
    
    def _load_excel_data(self, filename):
        """Carrega dados de um arquivo Excel com tratamento de erros."""
        try:
            filepath = os.path.join(self.data_dir, filename)
            if not os.path.exists(filepath):
                email_notifier.notify_file_access_error(filename, "Arquivo não encontrado")
                return None
            return pd.read_excel(filepath)
        except Exception as e:
            email_notifier.notify_file_access_error(filename, str(e))
            return None
    
    def _process_alunos_data(self, df):
        """Processa dados dos alunos com validação."""
        if df is None:
            return []
        
        try:
            # Validar dados
            validated_data, validation_errors = self.validator.validate_dataframe(df, 'alunos')
            
            # Notificar sobre erros de validação (silenciosamente)
            if validation_errors:
                email_notifier.notify_validation_errors('B_Alunos.xlsx', validation_errors)
            
            return validated_data
            
        except Exception as e:
            email_notifier.notify_data_corruption('B_Alunos.xlsx', str(e))
            return []
    
    def _process_clientes_data(self, df_cadastros, df_clientes):
        """Processa dados dos clientes combinando as duas bases."""
        clientes = {}
        
        # Processar cadastros
        if df_cadastros is not None:
            for _, row in df_cadastros.iterrows():
                nome = row['Digite o nome completo do cliente']
                clientes[nome] = {
                    'nome': nome,
                    'email': row['Digite o e-mail do cliente:'],
                    'cpf': None,
                    'telefone': None,
                    'endereco': None
                }
        
        # Adicionar dados da base de clientes
        if df_clientes is not None:
            for _, row in df_clientes.iterrows():
                nome = row['Digite o nome completo do cliente']
                if nome in clientes:
                    clientes[nome].update({
                        'cpf': row['CPF Cliente'],
                        'telefone': row['Telefone Cliente'],
                        'endereco': row['Endereço completo Cliente']
                    })
                else:
                    clientes[nome] = {
                        'nome': nome,
                        'email': None,
                        'cpf': row['CPF Cliente'],
                        'telefone': row['Telefone Cliente'],
                        'endereco': row['Endereço completo Cliente']
                    }
        
        return list(clientes.values())
    
    def _process_lojas_data(self, df):
        """Processa dados das lojas."""
        if df is None:
            return []
        
        lojas = []
        for _, row in df.iterrows():
            lojas.append({
                'COD': row.get('COD', ''),
                'nome': row.get('Nome oficial', ''),
                'ENDEREÇO': row.get('ENDEREÇO', ''),
                'CEP': row.get('CEP', ''),
                'Região IM': row.get('Região IM', ''),
                'NM_DIST': row.get('NM_DIST', ''),
                'NM_MUN': row.get('NM_MUN', ''),
                'NM_MESO': row.get('NM_MESO', ''),
                'SIGLA_UF': row.get('SIGLA_UF', ''),
                'Região_Geográfica': row.get('Região_Geográfica', ''),
                'LAT': row.get('LAT', ''),
                'LONG': row.get('LONG', '')
            })
        return lojas
    
    def _process_produtos_data(self, df_produtos, df_precos):
        """Processa dados dos produtos com preços."""
        if df_produtos is None:
            return []
        
        produtos = []
        for _, row in df_produtos.iterrows():
            codigo = row['_CodigoReferenciaProduto']
            preco = 0.0
            
            # Buscar preço
            if df_precos is not None:
                mask = df_precos['Cod Produto'] == codigo
                resultado = df_precos[mask]
                if not resultado.empty:
                    preco = resultado.iloc[0]['Preço Negócio - Atual']
            
            produtos.append({
                'nome': row['NomeProduto'],
                'codigo': codigo,
                'peso': row['RANGE MAX_1'],
                'preco': float(preco)
            })
        return produtos
    
    def _update_cache_if_needed(self):
        """Atualiza o cache se necessário."""
        with self.cache_lock:
            if not self._should_check_files():
                return
            
            self.last_check = datetime.now()
            
            # Lista de arquivos para monitorar
            files_to_check = [
                'B_Alunos.xlsx',
                'Base_cadastos.xlsx',
                'Base Clientes.xlsx',
                'B_Lojas.xlsx',
                'Base_Produtos.xlsx',
                'B_Precos.xlsx',
                'Base_Vendas.xlsx'
            ]
            
            # Verificar quais arquivos foram modificados
            modified_files = []
            for filename in files_to_check:
                if self._is_file_modified(filename):
                    modified_files.append(filename)
            
            if not modified_files and self.cache:
                return  # Nenhum arquivo modificado e cache já existe
            
            print(f"Atualizando cache. Arquivos modificados: {modified_files}")
            
            # Recarregar dados dos arquivos modificados ou todos se for primeira vez
            if 'B_Alunos.xlsx' in modified_files or 'alunos' not in self.cache:
                df_alunos = self._load_excel_data('B_Alunos.xlsx')
                self.cache['alunos'] = self._process_alunos_data(df_alunos)
            
            if any(f in modified_files for f in ['Base_cadastos.xlsx', 'Base Clientes.xlsx']) or 'clientes' not in self.cache:
                df_cadastros = self._load_excel_data('Base_cadastos.xlsx')
                df_clientes = self._load_excel_data('Base Clientes.xlsx')
                self.cache['clientes'] = self._process_clientes_data(df_cadastros, df_clientes)
            
            if 'B_Lojas.xlsx' in modified_files or 'lojas' not in self.cache:
                df_lojas = self._load_excel_data('B_Lojas.xlsx')
                self.cache['lojas'] = self._process_lojas_data(df_lojas)
            
            if any(f in modified_files for f in ['Base_Produtos.xlsx', 'B_Precos.xlsx']) or 'produtos' not in self.cache:
                df_produtos = self._load_excel_data('Base_Produtos.xlsx')
                df_precos = self._load_excel_data('B_Precos.xlsx')
                self.cache['produtos'] = self._process_produtos_data(df_produtos, df_precos)
            
            if 'Base_Vendas.xlsx' in modified_files or 'pedidos' not in self.cache:
                df_pedidos = self._load_excel_data('Base_Vendas.xlsx')
                self.cache['pedidos'] = df_pedidos if df_pedidos is not None else pd.DataFrame()
            
            # Atualizar timestamp da última atualização
            self.cache['last_updated'] = datetime.now().isoformat()
            
            print(f"Cache atualizado em {self.cache['last_updated']}")
    
    def get_alunos(self):
        """Retorna lista de alunos (com cache)."""
        self._update_cache_if_needed()
        return self.cache.get('alunos', [])
    
    def get_clientes(self):
        """Retorna lista de clientes (com cache)."""
        self._update_cache_if_needed()
        return self.cache.get('clientes', [])
    
    def get_lojas(self):
        """Retorna lista de lojas (com cache)."""
        self._update_cache_if_needed()
        return self.cache.get('lojas', [])
    
    def get_produtos(self):
        """Retorna lista de produtos (com cache)."""
        self._update_cache_if_needed()
        return self.cache.get('produtos', [])
    
    def buscar_aluno(self, nome):
        """Busca um aluno pelo nome."""
        alunos = self.get_alunos()
        for aluno in alunos:
            if nome.lower() in aluno['nome'].lower():
                return aluno
        return None
    
    def buscar_cliente(self, nome):
        """Busca um cliente pelo nome."""
        clientes = self.get_clientes()
        for cliente in clientes:
            if cliente['nome'] == nome:
                return cliente
        return None
    
    def buscar_produto(self, nome):
        """Busca um produto pelo nome."""
        produtos = self.get_produtos()
        for produto in produtos:
            if produto['nome'] == nome:
                return produto
        return None
    
    def get_pedidos(self):
        """Retorna dados de pedidos do arquivo Base_Vendas.xlsx."""
        try:
            self._check_and_update_cache()
            return self.cache.get('pedidos', pd.DataFrame())
        except Exception as e:
            logger.error(f"Erro ao obter pedidos: {str(e)}")
            if self.email_notifier:
                self.email_notifier.notify_data_corruption('Base_Vendas.xlsx', str(e))
            return pd.DataFrame()
    
    def force_refresh(self):
        """Força a atualização do cache."""
        with self.cache_lock:
            self.last_check = None
            self.file_timestamps.clear()
            self.file_hashes.clear()
            self.cache.clear()
        self._update_cache_if_needed()
    
    def get_cache_info(self):
        """Retorna informações sobre o cache."""
        return {
            'last_updated': self.cache.get('last_updated'),
            'last_check': self.last_check.isoformat() if self.last_check else None,
            'cached_items': {
                'alunos': len(self.cache.get('alunos', [])),
                'clientes': len(self.cache.get('clientes', [])),
                'lojas': len(self.cache.get('lojas', [])),
                'produtos': len(self.cache.get('produtos', [])),
                'pedidos': len(self.cache.get('pedidos', pd.DataFrame()))
            },
            'check_interval_minutes': self.check_interval.total_seconds() / 60
        }

