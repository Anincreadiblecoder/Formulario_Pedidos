#!/usr/bin/env python3
"""
Script para criar arquivos Excel de exemplo que simulam as bases de dados
especificadas nos requisitos do formulário de pedidos.
"""

import pandas as pd
import os

def create_sample_excel_files():
    """Cria os arquivos Excel de exemplo com dados simulados."""
    
    data_dir = "/home/ubuntu/formulario_pedidos/backend_excel/data"
    
    # 1. B_Alunos.xlsx
    alunos_data = {
        'Série do Aluno': ['3A', '3B', '2A', '2B', '1A'],
        'Número de Presença do Estudante': ['01', '02', '03', '04', '05'],
        'Nome do Estudante': [
            'João Silva',
            'Maria Santos', 
            'Pedro Oliveira',
            'Ana Costa',
            'Carlos Ferreira'
        ],
        'E-mail do Aluno': [
            'joao.silva@escola.edu.br',
            'maria.santos@escola.edu.br',
            'pedro.oliveira@escola.edu.br',
            'ana.costa@escola.edu.br',
            'carlos.ferreira@escola.edu.br'
        ],
        'Cep do Estudante': ['01234-567', '02345-678', '03456-789', '04567-890', '05678-901'],
        'Rua/Av do Estudante': [
            'Rua das Flores, 123',
            'Av. Paulista, 456',
            'Rua Augusta, 789',
            'Av. Faria Lima, 321',
            'Rua Oscar Freire, 654'
        ],
        'Bairro do Estudante': ['Centro', 'Bela Vista', 'Consolação', 'Itaim Bibi', 'Jardins'],
        'Número Endereço do Estudante': ['123', '456', '789', '321', '654'],
        'Cidade do Estudante': ['São Paulo', 'São Paulo', 'São Paulo', 'São Paulo', 'São Paulo']
    }
    
    df_alunos = pd.DataFrame(alunos_data)
    df_alunos.to_excel(os.path.join(data_dir, 'B_Alunos.xlsx'), index=False)
    
    # 2. Base_cadastos.xlsx
    cadastros_data = {
        'Data': ['2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18'],
        'Turma': ['3A', '3B', '2A', '2B'],
        'Aluno': ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa'],
        'Coloque o Bloco do cliente:': ['A', 'B', 'C', 'A'],
        'Coloque o Pavimento do cliente:': ['1º', '2º', '3º', '1º'],
        'Coloque a Estação do cliente:': ['Norte', 'Sul', 'Leste', 'Oeste'],
        'Digite o nome completo do cliente': [
            'Roberto Silva Santos',
            'Fernanda Costa Lima',
            'Marcos Oliveira Pereira',
            'Juliana Santos Rodrigues'
        ],
        'Digite o e-mail do cliente:': [
            'roberto.santos@email.com',
            'fernanda.lima@email.com',
            'marcos.pereira@email.com',
            'juliana.rodrigues@email.com'
        ],
        'Errou?': ['Não', 'Não', 'Não', 'Não'],
        'Data de Nascimento do Cliente:': ['1985-03-15', '1990-07-22', '1988-11-10', '1992-05-08'],
        'Negócio que o cliente trabalha:': ['Tecnologia', 'Educação', 'Saúde', 'Comércio'],
        'Tem alguma restrição alimentar:': ['Não', 'Vegetariano', 'Não', 'Lactose'],
        'Quantidade de pessoas que moram com o cliente:': [3, 2, 4, 1],
        'Quantidade de refeições que o cliente faz por dia:': [3, 4, 3, 2],
        'Proteína favorita para o dia a dia do cliente:': ['Frango', 'Peixe', 'Carne', 'Frango'],
        'O cliente consome algo especial rotineiramente? (Ex.: Dia da pizza, domingo do c': [
            'Pizza sexta-feira', 'Açaí domingo', 'Hambúrguer sábado', 'Sushi quinta-feira'
        ],
        'Frequência a qual o cliente consome algo especial:': ['Semanal', 'Semanal', 'Semanal', 'Quinzenal'],
        'O cliente já consome produtos Swift?': ['Sim', 'Não', 'Sim', 'Não'],
        'Insira informações/observações adicionais sobre o seu cliente (Opcional):': [
            'Cliente fiel', 'Primeira compra', 'Recomendado por amigo', 'Cliente corporativo'
        ],
        'Chave Estação': ['EST001', 'EST002', 'EST003', 'EST004']
    }
    
    df_cadastros = pd.DataFrame(cadastros_data)
    df_cadastros.to_excel(os.path.join(data_dir, 'Base_cadastos.xlsx'), index=False)
    
    # 3. Base Clientes.xlsx
    clientes_data = {
        'Digite o nome completo do cliente': [
            'Roberto Silva Santos',
            'Fernanda Costa Lima',
            'Marcos Oliveira Pereira',
            'Juliana Santos Rodrigues',
            'Ana Costa',
            'Carlos Ferreira'
        ],
        'CPF Cliente': ['12345678901', '98765432109', '11122233344', '55566677788', '99988877766', '44433322211'],
        'Telefone Cliente': ['11987654321', '11876543210', '11765432109', '11654321098', '11543210987', '11432109876'],
        'Endereço completo Cliente': [
            'Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567',
            'Av. Paulista, 456 - Bela Vista - São Paulo/SP - CEP: 01310-100',
            'Rua Augusta, 789 - Consolação - São Paulo/SP - CEP: 01305-000',
            'Av. Faria Lima, 321 - Itaim Bibi - São Paulo/SP - CEP: 04538-132',
            'Rua Oscar Freire, 654 - Jardins - São Paulo/SP - CEP: 01426-001',
            'Av. Rebouças, 987 - Pinheiros - São Paulo/SP - CEP: 05402-000'
        ]
    }
    
    df_clientes = pd.DataFrame(clientes_data)
    df_clientes.to_excel(os.path.join(data_dir, 'Base Clientes.xlsx'), index=False)
    
    # 4. B_Lojas.xlsx
    lojas_data = {
        'Nome oficial': [
            'Loja Shopping Center Norte',
            'Loja Shopping Ibirapuera',
            'Loja Shopping Eldorado',
            'Loja Shopping Morumbi',
            'Loja Shopping Anália Franco'
        ]
    }
    
    df_lojas = pd.DataFrame(lojas_data)
    df_lojas.to_excel(os.path.join(data_dir, 'B_Lojas.xlsx'), index=False)
    
    # 5. Base_Produtos.xlsx
    produtos_data = {
        'NomeProduto': [
            'Hambúrguer Artesanal',
            'Pizza Margherita',
            'Batata Frita Especial',
            'Sanduíche Natural',
            'Salada Caesar',
            'Refrigerante Lata',
            'Suco Natural',
            'Água Mineral'
        ],
        '_CodigoReferenciaProduto': ['HAMB001', 'PIZZA001', 'BAT001', 'SAND001', 'SAL001', 'REF001', 'SUC001', 'AGU001'],
        'RANGE MAX_1': ['200g', '350g', '150g', '180g', '250g', '350ml', '300ml', '500ml']
    }
    
    df_produtos = pd.DataFrame(produtos_data)
    df_produtos.to_excel(os.path.join(data_dir, 'Base_Produtos.xlsx'), index=False)
    
    # 6. B_Precos.xlsx
    precos_data = {
        'Cod Produto': ['HAMB001', 'PIZZA001', 'BAT001', 'SAND001', 'SAL001', 'REF001', 'SUC001', 'AGU001'],
        'Preço Negócio - Atual': [25.90, 32.50, 12.90, 18.50, 22.00, 5.50, 8.90, 3.50]
    }
    
    df_precos = pd.DataFrame(precos_data)
    df_precos.to_excel(os.path.join(data_dir, 'B_Precos.xlsx'), index=False)
    
    # 7. Base_Vendas.xlsx (arquivo de destino para salvar pedidos)
    vendas_data = {
        'ID_Pedido': [],
        'Data_Pedido': [],
        'Sala_Aluno': [],
        'Nome_Aluno': [],
        'Email_Aluno': [],
        'Nome_Cliente': [],
        'Email_Cliente': [],
        'CPF_Cliente': [],
        'Telefone_Cliente': [],
        'Tipo_Entrega': [],
        'Loja_Retirada': [],
        'Endereco_Completo': [],
        'Data_Entrega': [],
        'Condicao_Entrega': [],
        'Forma_Pagamento': [],
        'Itens_JSON': [],
        'Valor_Total': [],
        'Observacoes': []
    }
    
    df_vendas = pd.DataFrame(vendas_data)
    df_vendas.to_excel(os.path.join(data_dir, 'Base_Vendas.xlsx'), index=False)
    
    print("Arquivos Excel de exemplo criados com sucesso!")
    print(f"Arquivos salvos em: {data_dir}")
    
    # Listar arquivos criados
    for filename in os.listdir(data_dir):
        if filename.endswith('.xlsx'):
            print(f"- {filename}")

if __name__ == "__main__":
    create_sample_excel_files()

