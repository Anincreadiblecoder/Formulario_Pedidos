"""
Módulo de validação de dados para detectar e tratar dados sujos nos arquivos Excel.
Fornece funcionalidades para validar, limpar e alertar sobre problemas nos dados.
"""

import re
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple

class DataValidator:
    """Classe para validação e limpeza de dados sujos."""
    
    def __init__(self):
        self.validation_errors = []
        self.warnings = []
        
    def clear_errors(self):
        """Limpa os erros e avisos acumulados."""
        self.validation_errors = []
        self.warnings = []
    
    def validate_email(self, email: str) -> bool:
        """Valida formato de email."""
        if not email or pd.isna(email):
            return False
        
        email = str(email).strip()
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def validate_cpf(self, cpf: str) -> bool:
        """Valida formato de CPF (apenas números, 11 dígitos)."""
        if not cpf or pd.isna(cpf):
            return False
        
        cpf = str(cpf).strip().replace('.', '').replace('-', '').replace(' ', '')
        return cpf.isdigit() and len(cpf) == 11
    
    def validate_phone(self, phone: str) -> bool:
        """Valida formato de telefone."""
        if not phone or pd.isna(phone):
            return False
        
        phone = str(phone).strip().replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        return phone.isdigit() and len(phone) >= 10
    
    def validate_cep(self, cep: str) -> bool:
        """Valida formato de CEP."""
        if not cep or pd.isna(cep):
            return False
        
        cep = str(cep).strip().replace('-', '').replace(' ', '')
        return cep.isdigit() and len(cep) == 8
    
    def clean_string(self, value: Any) -> str:
        """Limpa e padroniza strings."""
        if pd.isna(value) or value is None:
            return ""
        
        value = str(value).strip()
        # Remove caracteres especiais desnecessários
        value = re.sub(r'\s+', ' ', value)  # Múltiplos espaços -> um espaço
        return value
    
    def clean_numeric(self, value: Any) -> Optional[float]:
        """Limpa e converte valores numéricos."""
        if pd.isna(value) or value is None:
            return None
        
        try:
            # Remove caracteres não numéricos exceto ponto e vírgula
            value_str = str(value).replace(',', '.').strip()
            value_str = re.sub(r'[^\d.-]', '', value_str)
            return float(value_str) if value_str else None
        except (ValueError, TypeError):
            return None
    
    def validate_aluno_data(self, aluno_data: Dict) -> Tuple[Dict, List[str]]:
        """Valida e limpa dados de um aluno."""
        errors = []
        cleaned_data = {}
        
        # Nome (obrigatório)
        nome = self.clean_string(aluno_data.get('Nome do Estudante', ''))
        if not nome:
            errors.append("Nome do estudante é obrigatório")
        else:
            cleaned_data['nome'] = nome
        
        # Email
        email = self.clean_string(aluno_data.get('E-mail do Aluno', ''))
        if email and not self.validate_email(email):
            errors.append(f"Email inválido: {email}")
            email = ""  # Limpa email inválido
        cleaned_data['email'] = email
        
        # Série
        serie = self.clean_string(aluno_data.get('Série do Aluno', ''))
        cleaned_data['serie'] = serie
        
        # Número de presença
        numero = self.clean_string(aluno_data.get('Número de Presença do Estudante', ''))
        cleaned_data['numero'] = numero
        
        # CEP
        cep = self.clean_string(aluno_data.get('Cep do Estudante', ''))
        if cep and not self.validate_cep(cep):
            errors.append(f"CEP inválido: {cep}")
            cep = ""
        cleaned_data['cep'] = cep
        
        # Endereço
        cleaned_data['endereco'] = self.clean_string(aluno_data.get('Rua/Av do Estudante', ''))
        cleaned_data['bairro'] = self.clean_string(aluno_data.get('Bairro do Estudante', ''))
        cleaned_data['numero_endereco'] = self.clean_string(aluno_data.get('Número Endereço do Estudante', ''))
        cleaned_data['cidade'] = self.clean_string(aluno_data.get('Cidade do Estudante', ''))
        
        return cleaned_data, errors
    
    def validate_cliente_data(self, cliente_data: Dict) -> Tuple[Dict, List[str]]:
        """Valida e limpa dados de um cliente."""
        errors = []
        cleaned_data = {}
        
        # Nome (obrigatório)
        nome = self.clean_string(cliente_data.get('Nome', ''))
        if not nome:
            errors.append("Nome do cliente é obrigatório")
        else:
            cleaned_data['nome'] = nome
        
        # Email
        email = self.clean_string(cliente_data.get('Email', ''))
        if email and not self.validate_email(email):
            errors.append(f"Email inválido: {email}")
            email = ""
        cleaned_data['email'] = email
        
        # CPF
        cpf = self.clean_string(cliente_data.get('CPF', ''))
        if cpf and not self.validate_cpf(cpf):
            errors.append(f"CPF inválido: {cpf}")
            cpf = ""
        cleaned_data['cpf'] = cpf
        
        # Telefone
        telefone = self.clean_string(cliente_data.get('Telefone', ''))
        if telefone and not self.validate_phone(telefone):
            errors.append(f"Telefone inválido: {telefone}")
            telefone = ""
        cleaned_data['telefone'] = telefone
        
        return cleaned_data, errors
    
    def validate_produto_data(self, produto_data: Dict) -> Tuple[Dict, List[str]]:
        """Valida e limpa dados de um produto."""
        errors = []
        cleaned_data = {}
        
        # Nome (obrigatório)
        nome = self.clean_string(produto_data.get('Nome', ''))
        if not nome:
            errors.append("Nome do produto é obrigatório")
        else:
            cleaned_data['nome'] = nome
        
        # Código
        codigo = self.clean_string(produto_data.get('Código', ''))
        cleaned_data['codigo'] = codigo
        
        # Peso
        peso = self.clean_string(produto_data.get('Peso', ''))
        cleaned_data['peso'] = peso
        
        # Preço
        preco = self.clean_numeric(produto_data.get('Preço', 0))
        if preco is None or preco < 0:
            errors.append(f"Preço inválido para produto {nome}")
            preco = 0.0
        cleaned_data['preco'] = preco
        
        return cleaned_data, errors
    
    def validate_loja_data(self, loja_data: Dict) -> Tuple[Dict, List[str]]:
        """Valida e limpa dados de uma loja."""
        errors = []
        cleaned_data = {}
        
        # Nome (obrigatório)
        nome = self.clean_string(loja_data.get('Nome', ''))
        if not nome:
            errors.append("Nome da loja é obrigatório")
        else:
            cleaned_data['nome'] = nome
        
        # Endereço
        cleaned_data['endereco'] = self.clean_string(loja_data.get('Endereço', ''))
        
        # Telefone
        telefone = self.clean_string(loja_data.get('Telefone', ''))
        if telefone and not self.validate_phone(telefone):
            errors.append(f"Telefone inválido para loja {nome}: {telefone}")
            telefone = ""
        cleaned_data['telefone'] = telefone
        
        return cleaned_data, errors
    
    def validate_dataframe(self, df: pd.DataFrame, data_type: str) -> Tuple[List[Dict], List[str]]:
        """Valida um DataFrame completo baseado no tipo de dados."""
        if df is None or df.empty:
            return [], [f"DataFrame {data_type} está vazio ou nulo"]
        
        validated_data = []
        all_errors = []
        
        validation_methods = {
            'alunos': self.validate_aluno_data,
            'clientes': self.validate_cliente_data,
            'produtos': self.validate_produto_data,
            'lojas': self.validate_loja_data
        }
        
        validate_method = validation_methods.get(data_type)
        if not validate_method:
            return [], [f"Tipo de dados não suportado: {data_type}"]
        
        for index, row in df.iterrows():
            try:
                row_dict = row.to_dict()
                cleaned_data, errors = validate_method(row_dict)
                
                if errors:
                    error_msg = f"Linha {index + 2}: {'; '.join(errors)}"
                    all_errors.append(error_msg)
                
                # Adiciona dados mesmo com erros (campos válidos são mantidos)
                if cleaned_data.get('nome'):  # Pelo menos o nome deve estar presente
                    validated_data.append(cleaned_data)
                    
            except Exception as e:
                all_errors.append(f"Linha {index + 2}: Erro inesperado - {str(e)}")
        
        return validated_data, all_errors
    
    def get_data_quality_report(self, data_type: str, total_rows: int, valid_rows: int, errors: List[str]) -> Dict:
        """Gera um relatório de qualidade dos dados."""
        return {
            'data_type': data_type,
            'total_rows': total_rows,
            'valid_rows': valid_rows,
            'invalid_rows': total_rows - valid_rows,
            'success_rate': (valid_rows / total_rows * 100) if total_rows > 0 else 0,
            'errors': errors,
            'timestamp': pd.Timestamp.now().isoformat()
        }

