"""
Rotas da API para integração com arquivos Excel.
Fornece endpoints para leitura e escrita de dados nas bases Excel com sistema de cache inteligente.
"""

from flask import Blueprint, jsonify, request
import pandas as pd
import os
import json
from datetime import datetime
import uuid
from src.utils.cache_manager import ExcelCacheManager

excel_bp = Blueprint('excel', __name__)

# Caminho base para os arquivos Excel
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

# Instância global do gerenciador de cache
cache_manager = ExcelCacheManager(DATA_DIR)

def save_excel_file(df, filename):
    """Salva um DataFrame em um arquivo Excel."""
    try:
        filepath = os.path.join(DATA_DIR, filename)
        df.to_excel(filepath, index=False)
        return True
    except Exception as e:
        print(f"Erro ao salvar {filename}: {str(e)}")
        return False

@excel_bp.route('/alunos', methods=['GET'])
def get_alunos():
    """Retorna a lista de alunos da base B_Alunos.xlsx (com cache)."""
    try:
        alunos = cache_manager.get_alunos()
        return jsonify(alunos)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar alunos: {str(e)}'}), 500

@excel_bp.route('/alunos/buscar', methods=['GET'])
def buscar_aluno():
    """Busca um aluno pelo nome (com cache)."""
    nome = request.args.get('nome', '').strip()
    if not nome:
        return jsonify({'error': 'Nome é obrigatório'}), 400
    
    try:
        aluno = cache_manager.buscar_aluno(nome)
        if not aluno:
            return jsonify({'error': 'Aluno não encontrado'}), 404
        
        return jsonify(aluno)
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar aluno: {str(e)}'}), 500

@excel_bp.route('/clientes', methods=['GET'])
def get_clientes():
    """Retorna a lista de clientes (com cache)."""
    try:
        clientes = cache_manager.get_clientes()
        # Retornar apenas nome e email para o dropdown
        clientes_dropdown = [{'nome': c['nome'], 'email': c['email']} for c in clientes if c['nome']]
        return jsonify(clientes_dropdown)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar clientes: {str(e)}'}), 500

@excel_bp.route('/clientes/buscar', methods=['GET'])
def buscar_cliente():
    """Busca dados completos de um cliente pelo nome (com cache)."""
    nome = request.args.get('nome', '').strip()
    if not nome:
        return jsonify({'error': 'Nome é obrigatório'}), 400
    
    try:
        cliente = cache_manager.buscar_cliente(nome)
        if not cliente:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        return jsonify(cliente)
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar cliente: {str(e)}'}), 500

@excel_bp.route('/lojas', methods=['GET'])
def get_lojas():
    """Retorna a lista de lojas (com cache)."""
    try:
        lojas = cache_manager.get_lojas()
        return jsonify(lojas)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar lojas: {str(e)}'}), 500

@excel_bp.route('/produtos', methods=['GET'])
def get_produtos():
    """Retorna a lista de produtos com preços (com cache)."""
    try:
        produtos = cache_manager.get_produtos()
        return jsonify(produtos)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar produtos: {str(e)}'}), 500

@excel_bp.route('/produtos/buscar', methods=['GET'])
def buscar_produto():
    """Busca um produto pelo nome (com cache)."""
    nome = request.args.get('nome', '').strip()
    if not nome:
        return jsonify({'error': 'Nome é obrigatório'}), 400
    
    try:
        produto = cache_manager.buscar_produto(nome)
        if not produto:
            return jsonify({'error': 'Produto não encontrado'}), 404
        
        return jsonify(produto)
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar produto: {str(e)}'}), 500

@excel_bp.route('/pedidos', methods=['POST'])
def salvar_pedido():
    """Salva um pedido na base Base_Vendas.xlsx."""
    try:
        dados = request.get_json()
        if not dados:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Carregar arquivo de vendas existente
        filepath = os.path.join(DATA_DIR, 'Base_Vendas.xlsx')
        if not os.path.exists(filepath):
            return jsonify({'error': 'Arquivo de vendas não encontrado'}), 404
        
        df_vendas = pd.read_excel(filepath)
        
        # Gerar ID único para o pedido
        id_pedido = str(uuid.uuid4())[:8].upper()
        
        # Preparar dados do pedido
        novo_pedido = {
            'ID_Pedido': id_pedido,
            'Data_Pedido': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'Sala_Aluno': dados.get('aluno', {}).get('sala', ''),
            'Nome_Aluno': dados.get('aluno', {}).get('nome', ''),
            'Email_Aluno': dados.get('aluno', {}).get('email', ''),
            'Nome_Cliente': dados.get('cliente', {}).get('nome', ''),
            'Email_Cliente': dados.get('cliente', {}).get('email', ''),
            'CPF_Cliente': dados.get('cliente', {}).get('cpf', ''),
            'Telefone_Cliente': dados.get('cliente', {}).get('telefone', ''),
            'Tipo_Entrega': dados.get('entrega', {}).get('tipo', ''),
            'Loja_Retirada': dados.get('entrega', {}).get('loja', ''),
            'Endereco_Loja_Retirada': '', # Será preenchido abaixo se for retirada em loja
            'Endereco_Completo': dados.get('entrega', {}).get('endereco', ''),
            'Data_Entrega': dados.get('entrega', {}).get('data', ''),
            'Condicao_Entrega': dados.get('entrega', {}).get('condicao', ''),
            'Forma_Pagamento': dados.get('pagamento', {}).get('forma', ''),
            'Itens_JSON': json.dumps(dados.get('itens', []), ensure_ascii=False),
            'Valor_Total': dados.get('valorTotal', ''),
            'Observacoes': dados.get('observacoes', '')
        }

        # Se for retirada em loja, buscar o endereço completo da loja
        if novo_pedido['Tipo_Entrega'] in ["retirada_outras_lojas", "retirada_mercado_jf"]:
            nome_loja = novo_pedido['Loja_Retirada']
            if nome_loja:
                lojas_disponiveis = cache_manager.get_lojas()
                loja_encontrada = next((l for l in lojas_disponiveis if l["nome"] == nome_loja), None)
                if loja_encontrada and loja_encontrada.get("ENDEREÇO"):
                    novo_pedido["Endereco_Loja_Retirada"] = loja_encontrada["ENDEREÇO"]
        
        # Adicionar novo pedido ao DataFrame
        df_vendas = pd.concat([df_vendas, pd.DataFrame([novo_pedido])], ignore_index=True)
        
        # Salvar arquivo
        if save_excel_file(df_vendas, 'Base_Vendas.xlsx'):
            return jsonify({
                'success': True,
                'message': 'Pedido salvo com sucesso!',
                'id_pedido': id_pedido
            })
        else:
            return jsonify({'error': 'Erro ao salvar pedido'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@excel_bp.route('/pedidos', methods=['GET'])
def get_pedidos():
    """Retorna a lista de pedidos salvos."""
    try:
        filepath = os.path.join(DATA_DIR, 'Base_Vendas.xlsx')
        if not os.path.exists(filepath):
            return jsonify({'error': 'Arquivo de vendas não encontrado'}), 404
        
        df = pd.read_excel(filepath)
        
        pedidos = []
        for _, row in df.iterrows():
            if pd.notna(row['ID_Pedido']) and row['ID_Pedido'] != '':
                try:
                    itens = json.loads(row['Itens_JSON']) if pd.notna(row['Itens_JSON']) else []
                except:
                    itens = []
                
                pedidos.append({
                    'id': row['ID_Pedido'],
                    'data': row['Data_Pedido'],
                    'cliente': row['Nome_Cliente'],
                    'valor_total': row['Valor_Total'],
                    'itens': itens,
                    'loja_retirada': row.get('Loja_Retirada', ''),
                    'endereco_loja_retirada': row.get('Endereco_Loja_Retirada', '')
                })
        
        return jsonify(pedidos)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar pedidos: {str(e)}'}), 500

@excel_bp.route('/cache/refresh', methods=['POST'])
def refresh_cache():
    """Força a atualização do cache."""
    try:
        cache_manager.force_refresh()
        return jsonify({
            'success': True,
            'message': 'Cache atualizado com sucesso!',
            'cache_info': cache_manager.get_cache_info()
        })
    except Exception as e:
        return jsonify({'error': f'Erro ao atualizar cache: {str(e)}'}), 500

@excel_bp.route('/cache/info', methods=['GET'])
def get_cache_info():
    """Retorna informações sobre o cache."""
    try:
        return jsonify(cache_manager.get_cache_info())
    except Exception as e:
        return jsonify({'error': f'Erro ao obter informações do cache: {str(e)}'}), 500

@excel_bp.route('/status', methods=['GET'])
def get_status():
    """Retorna o status da API e dos arquivos Excel."""
    arquivos = [
        'B_Alunos.xlsx',
        'Base_cadastos.xlsx',
        'Base Clientes.xlsx',
        'B_Lojas.xlsx',
        'Base_Produtos.xlsx',
        'B_Precos.xlsx',
        'Base_Vendas.xlsx'
    ]
    
    status = {
        'api_status': 'online',
        'data_dir': DATA_DIR,
        'cache_info': cache_manager.get_cache_info(),
        'arquivos': {}
    }
    
    for arquivo in arquivos:
        filepath = os.path.join(DATA_DIR, arquivo)
        status['arquivos'][arquivo] = {
            'existe': os.path.exists(filepath),
            'tamanho': os.path.getsize(filepath) if os.path.exists(filepath) else 0,
            'modificado': datetime.fromtimestamp(os.path.getmtime(filepath)).isoformat() if os.path.exists(filepath) else None
        }
    
    return jsonify(status)


@excel_bp.route('/pedidos/pesquisar', methods=['GET'])
def pesquisar_pedidos():
    """Pesquisa pedidos por critérios específicos."""
    try:
        # Parâmetros de pesquisa
        nome_aluno = request.args.get('nome_aluno', '').strip()
        data_inicio = request.args.get('data_inicio', '').strip()
        data_fim = request.args.get('data_fim', '').strip()
        id_pedido = request.args.get('id_pedido', '').strip()
        
        # Carregar dados de pedidos
        pedidos_df = cache_manager.get_pedidos()
        if pedidos_df is None or pedidos_df.empty:
            return jsonify([])
        
        # Aplicar filtros
        resultado = pedidos_df.copy()
        
        # Filtro por nome do aluno (busca parcial, case-insensitive)
        if nome_aluno:
            mask = resultado['Aluno_Nome'].str.contains(nome_aluno, case=False, na=False)
            resultado = resultado[mask]
        
        # Filtro por ID do pedido (busca exata)
        if id_pedido:
            mask = resultado['ID_Pedido'].str.contains(id_pedido, case=False, na=False)
            resultado = resultado[mask]
        
        # Filtro por data
        if data_inicio or data_fim:
            # Converter coluna de data para datetime se necessário
            if 'Data' in resultado.columns:
                resultado['Data'] = pd.to_datetime(resultado['Data'], errors='coerce')
                
                if data_inicio:
                    data_inicio_dt = pd.to_datetime(data_inicio, errors='coerce')
                    if not pd.isna(data_inicio_dt):
                        resultado = resultado[resultado['Data'] >= data_inicio_dt]
                
                if data_fim:
                    data_fim_dt = pd.to_datetime(data_fim, errors='coerce')
                    if not pd.isna(data_fim_dt):
                        # Incluir todo o dia final
                        data_fim_dt = data_fim_dt + pd.Timedelta(days=1) - pd.Timedelta(seconds=1)
                        resultado = resultado[resultado['Data'] <= data_fim_dt]
        
        # Ordenar por data (mais recentes primeiro)
        if 'Data' in resultado.columns:
            resultado = resultado.sort_values('Data', ascending=False)
        
        # Converter para lista de dicionários
        pedidos_list = []
        for _, row in resultado.iterrows():
            pedido = {
                'id_pedido': row.get('ID_Pedido', ''),
                'data': row.get('Data', '').strftime('%d/%m/%Y %H:%M') if pd.notna(row.get('Data')) else '',
                'aluno_nome': row.get('Aluno_Nome', ''),
                'aluno_sala': row.get('Aluno_Sala', ''),
                'cliente_nome': row.get('Cliente_Nome', ''),
                'cliente_email': row.get('Cliente_Email', ''),
                'cliente_cpf': row.get('Cliente_CPF', ''),
                'cliente_telefone': row.get('Cliente_Telefone', ''),
                'tipo_entrega': row.get('Tipo_Entrega', ''),
                'loja_retirada': row.get('Loja_Retirada', ''),
                'endereco_loja_retirada': row.get('Endereco_Loja_Retirada', ""),
                'endereco_entrega': row.get('Endereco_Entrega', ''),
                'data_entrega': row.get('Data_Entrega', ''),
                'forma_pagamento': row.get('Forma_Pagamento', ''),
                'valor_total': float(row.get('Valor_Total', 0)),
                'observacoes': row.get('Observacoes', ''),
                'itens': []
            }
            
            # Processar itens do pedido (se estiver em formato JSON)
            itens_str = row.get('Itens_JSON', '') # Alterado de 'Itens' para 'Itens_JSON'
            if itens_str:
                try:
                    itens = json.loads(itens_str) if isinstance(itens_str, str) else itens_str
                    if isinstance(itens, list):
                        pedido['itens'] = itens
                except:
                    # Se não conseguir fazer parse do JSON, deixar como string
                    pedido['itens_raw'] = itens_str
            
            pedidos_list.append(pedido)
        
        return jsonify(pedidos_list)
        
    except Exception as e:
        return jsonify({'error': f'Erro ao pesquisar pedidos: {str(e)}'}), 500

@excel_bp.route('/pedidos/exportar', methods=['POST'])
def exportar_pedidos():
    """Exporta pedidos filtrados para Excel."""
    try:
        # Receber critérios de pesquisa do corpo da requisição
        data = request.get_json() or {}
        nome_aluno = data.get('nome_aluno', '').strip()
        data_inicio = data.get('data_inicio', '').strip()
        data_fim = data.get('data_fim', '').strip()
        id_pedido = data.get('id_pedido', '').strip()
        
        # Usar a mesma lógica de pesquisa
        pedidos_df = cache_manager.get_pedidos()
        if pedidos_df is None or pedidos_df.empty:
            return jsonify({'error': 'Nenhum pedido encontrado'}), 404
        
        # Aplicar os mesmos filtros da pesquisa
        resultado = pedidos_df.copy()
        
        if nome_aluno:
            mask = resultado['Aluno_Nome'].str.contains(nome_aluno, case=False, na=False)
            resultado = resultado[mask]
        
        if id_pedido:
            mask = resultado['ID_Pedido'].str.contains(id_pedido, case=False, na=False)
            resultado = resultado[mask]
        
        if data_inicio or data_fim:
            if 'Data' in resultado.columns:
                resultado['Data'] = pd.to_datetime(resultado['Data'], errors='coerce')
                
                if data_inicio:
                    data_inicio_dt = pd.to_datetime(data_inicio, errors='coerce')
                    if not pd.isna(data_inicio_dt):
                        resultado = resultado[resultado['Data'] >= data_inicio_dt]
                
                if data_fim:
                    data_fim_dt = pd.to_datetime(data_fim, errors='coerce')
                    if not pd.isna(data_fim_dt):
                        data_fim_dt = data_fim_dt + pd.Timedelta(days=1) - pd.Timedelta(seconds=1)
                        resultado = resultado[resultado['Data'] <= data_fim_dt]
        
        if resultado.empty:
            return jsonify({'error': 'Nenhum pedido encontrado com os critérios especificados'}), 404
        
        # Criar arquivo Excel temporário
        import tempfile
        import os
        from datetime import datetime
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'pedidos_exportados_{timestamp}.xlsx'
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        
        # Salvar no Excel
        resultado.to_excel(temp_path, index=False)
        
        # Adicionar Endereco_Loja_Retirada ao DataFrame antes de exportar
        if 'Loja_Retirada' in resultado.columns and 'Endereco_Loja_Retirada' not in resultado.columns:
            lojas_disponiveis = cache_manager.get_lojas()
            endereco_map = {loja['nome']: loja.get('ENDEREÇO', '') for loja in lojas_disponiveis}
            resultado['Endereco_Loja_Retirada'] = resultado['Loja_Retirada'].map(endereco_map).fillna('')

        resultado.to_excel(temp_path, index=False)
        
        # Retornar informações sobre o arquivo
        return jsonify({
            'success': True,
            'filename': filename,
            'total_pedidos': len(resultado),
            'temp_path': temp_path,
            'message': f'Exportados {len(resultado)} pedidos para Excel'
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao exportar pedidos: {str(e)}'}), 500

@excel_bp.route('/pedidos/estatisticas', methods=['GET'])
def estatisticas_pedidos():
    """Retorna estatísticas gerais dos pedidos."""
    try:
        pedidos_df = cache_manager.get_pedidos()
        if pedidos_df is None or pedidos_df.empty:
            return jsonify({
                'total_pedidos': 0,
                'valor_total': 0,
                'pedidos_hoje': 0,
                'pedidos_semana': 0,
                'pedidos_mes': 0
            })
        
        # Converter data para datetime
        if 'Data' in pedidos_df.columns:
            pedidos_df['Data'] = pd.to_datetime(pedidos_df['Data'], errors='coerce')
        
        # Data atual
        hoje = pd.Timestamp.now().normalize()
        inicio_semana = hoje - pd.Timedelta(days=hoje.weekday())
        inicio_mes = hoje.replace(day=1)
        
        # Calcular estatísticas
        stats = {
            'total_pedidos': len(pedidos_df),
            'valor_total': float(pedidos_df.get('Valor_Total', 0).sum()),
            'pedidos_hoje': len(pedidos_df[pedidos_df['Data'].dt.normalize() == hoje]) if 'Data' in pedidos_df.columns else 0,
            'pedidos_semana': len(pedidos_df[pedidos_df['Data'] >= inicio_semana]) if 'Data' in pedidos_df.columns else 0,
            'pedidos_mes': len(pedidos_df[pedidos_df['Data'] >= inicio_mes]) if 'Data' in pedidos_df.columns else 0,
            'ultimo_pedido': pedidos_df['Data'].max().strftime('%d/%m/%Y %H:%M') if 'Data' in pedidos_df.columns and not pedidos_df['Data'].isna().all() else 'Nenhum'
        }
        
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({'error': f'Erro ao calcular estatísticas: {str(e)}'}), 500

