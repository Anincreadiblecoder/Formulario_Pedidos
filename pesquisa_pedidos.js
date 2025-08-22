// JavaScript para funcionalidade de pesquisa de pedidos

class PesquisaPedidos {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api/excel';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentResults = [];
        this.currentFilters = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadStatistics();
        this.showMessage('Sistema carregado. Use os filtros para pesquisar pedidos.', 'info');
    }
    
    bindEvents() {
        // Botões de pesquisa
        document.getElementById('btn-pesquisar').addEventListener('click', () => this.pesquisarPedidos());
        document.getElementById('btn-limpar-filtros').addEventListener('click', () => this.limparFiltros());
        
        // Filtros rápidos
        document.querySelectorAll('.btn-quick').forEach(btn => {
            btn.addEventListener('click', (e) => this.aplicarFiltroRapido(e.target.dataset.periodo));
        });
        
        // Pesquisa em tempo real no nome do aluno
        const filtroNome = document.getElementById('filtro-nome-aluno');
        let timeoutId;
        filtroNome.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (filtroNome.value.length >= 2 || filtroNome.value.length === 0) {
                    this.pesquisarPedidos();
                }
            }, 500);
        });
        
        // Enter nos campos de filtro
        document.querySelectorAll('.search-filters input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.pesquisarPedidos();
                }
            });
        });
        
        // Exportação
        document.getElementById('btn-exportar-resultados').addEventListener('click', () => this.exportarResultados());
        
        // Modal
        document.getElementById('btn-fechar-modal').addEventListener('click', () => this.fecharModal());
        document.getElementById('btn-fechar-modal-footer').addEventListener('click', () => this.fecharModal());
        document.getElementById('modal-detalhes').addEventListener('click', (e) => {
            if (e.target.id === 'modal-detalhes') {
                this.fecharModal();
            }
        });
        
        // Paginação
        document.getElementById('btn-prev-page').addEventListener('click', () => this.previousPage());
        document.getElementById('btn-next-page').addEventListener('click', () => this.nextPage());
    }
    
    async loadStatistics() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/pedidos/estatisticas`);
            if (response.ok) {
                const stats = await response.json();
                this.updateStatistics(stats);
                document.getElementById('stats-section').style.display = 'block';
            }
        } catch (error) {
            console.log('Erro ao carregar estatísticas:', error);
            // Usar dados de exemplo se API não estiver disponível
            this.updateStatistics({
                total_pedidos: 0,
                valor_total: 0,
                pedidos_hoje: 0,
                pedidos_semana: 0,
                pedidos_mes: 0,
                ultimo_pedido: 'Nenhum'
            });
        }
    }
    
    updateStatistics(stats) {
        document.getElementById('stat-total-pedidos').textContent = stats.total_pedidos;
        document.getElementById('stat-valor-total').textContent = this.formatCurrency(stats.valor_total);
        document.getElementById('stat-pedidos-hoje').textContent = stats.pedidos_hoje;
        document.getElementById('stat-ultimo-pedido').textContent = stats.ultimo_pedido;
    }
    
    aplicarFiltroRapido(periodo) {
        // Remover classe active de todos os botões
        document.querySelectorAll('.btn-quick').forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        event.target.classList.add('active');
        
        const hoje = new Date();
        let dataInicio;
        
        switch (periodo) {
            case 'hoje':
                dataInicio = new Date(hoje);
                break;
            case 'semana':
                dataInicio = new Date(hoje);
                dataInicio.setDate(hoje.getDate() - hoje.getDay()); // Início da semana
                break;
            case 'mes':
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1); // Início do mês
                break;
        }
        
        if (dataInicio) {
            document.getElementById('filtro-data-inicio').value = this.formatDateForInput(dataInicio);
            document.getElementById('filtro-data-fim').value = this.formatDateForInput(hoje);
            this.pesquisarPedidos();
        }
    }
    
    limparFiltros() {
        document.getElementById('filtro-nome-aluno').value = '';
        document.getElementById('filtro-id-pedido').value = '';
        document.getElementById('filtro-data-inicio').value = '';
        document.getElementById('filtro-data-fim').value = '';
        
        // Remover classe active dos filtros rápidos
        document.querySelectorAll('.btn-quick').forEach(btn => btn.classList.remove('active'));
        
        // Limpar resultados
        document.getElementById('search-results').style.display = 'none';
        this.currentResults = [];
        this.currentFilters = {};
        
        this.showMessage('Filtros limpos.', 'info');
    }
    
    async pesquisarPedidos() {
        const filtros = this.getFilters();
        this.currentFilters = filtros;
        
        // Mostrar loading
        document.getElementById('loading').style.display = 'block';
        document.getElementById('search-results').style.display = 'block';
        
        try {
            const queryParams = new URLSearchParams();
            if (filtros.nomeAluno) queryParams.append('nome_aluno', filtros.nomeAluno);
            if (filtros.idPedido) queryParams.append('id_pedido', filtros.idPedido);
            if (filtros.dataInicio) queryParams.append('data_inicio', filtros.dataInicio);
            if (filtros.dataFim) queryParams.append('data_fim', filtros.dataFim);
            
            const response = await fetch(`${this.apiBaseUrl}/pedidos/pesquisar?${queryParams}`);
            
            if (response.ok) {
                const pedidos = await response.json();
                this.currentResults = pedidos;
                this.displayResults(pedidos);
                this.showMessage(`${pedidos.length} pedidos encontrados.`, 'success');
            } else {
                throw new Error('Erro na pesquisa');
            }
        } catch (error) {
            console.log('Erro ao pesquisar pedidos:', error);
            // Usar dados de exemplo se API não estiver disponível
            this.currentResults = this.getDadosExemplo(filtros);
            this.displayResults(this.currentResults);
            this.showMessage(`Usando dados de exemplo. ${this.currentResults.length} pedidos encontrados.`, 'info');
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }
    
    getFilters() {
        return {
            nomeAluno: document.getElementById('filtro-nome-aluno').value.trim(),
            idPedido: document.getElementById('filtro-id-pedido').value.trim(),
            dataInicio: document.getElementById('filtro-data-inicio').value,
            dataFim: document.getElementById('filtro-data-fim').value
        };
    }
    
    getDadosExemplo(filtros) {
        // Dados de exemplo para quando a API não estiver disponível
        const pedidosExemplo = [
            {
                id_pedido: 'PED_20250813_001',
                data: '13/08/2025 14:30',
                aluno_nome: 'João Silva Santos',
                aluno_sala: '3º Ano A',
                cliente_nome: 'Ana Costa Silva',
                cliente_email: 'ana.costa@email.com',
                cliente_cpf: '12345678901',
                cliente_telefone: '11987654321',
                tipo_entrega: 'Entrega em Casa',
                loja_retirada: '',
                endereco_loja_retirada: '',
                endereco_entrega: 'Rua das Flores, 123 - Centro',
                data_entrega: '15/08/2025',
                forma_pagamento: 'Pix',
                valor_total: 51.80,
                observacoes: 'Entregar após 18h',
                itens: [
                    { produto: 'Hambúrguer Artesanal', quantidade: 2, preco: 25.90, total: 51.80 }
                ]
            },
            {
                id_pedido: 'PED_20250813_002',
                data: '13/08/2025 15:45',
                aluno_nome: 'Maria Silva',
                aluno_sala: '2º Ano B',
                cliente_nome: 'Carlos Ferreira',
                cliente_email: 'carlos@email.com',
                cliente_cpf: '98765432100',
                cliente_telefone: '11912345678',
                tipo_entrega: 'Retirada - Mercado J&F',
                loja_retirada: 'Mercado J&F',
                endereco_loja_retirada: 'Rua Principal, 456 - Centro',
                endereco_entrega: '',
                data_entrega: '14/08/2025',
                forma_pagamento: 'Cartão de Crédito',
                valor_total: 32.50,
                observacoes: '',
                itens: [
                    { produto: 'Pizza Margherita', quantidade: 1, preco: 32.50, total: 32.50 }
                ]
            }
        ];
        
        // Aplicar filtros aos dados de exemplo
        let resultados = pedidosExemplo;
        
        if (filtros.nomeAluno) {
            resultados = resultados.filter(p => 
                p.aluno_nome.toLowerCase().includes(filtros.nomeAluno.toLowerCase())
            );
        }
        
        if (filtros.idPedido) {
            resultados = resultados.filter(p => 
                p.id_pedido.toLowerCase().includes(filtros.idPedido.toLowerCase())
            );
        }
        
        return resultados;
    }
    
    displayResults(pedidos) {
        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = '';
        
        if (pedidos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: #6b7280;">
                        Nenhum pedido encontrado com os critérios especificados.
                    </td>
                </tr>
            `;
            document.getElementById('results-count').textContent = '0 pedidos encontrados';
            return;
        }
        
        // Paginação
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedResults = pedidos.slice(startIndex, endIndex);
        
        paginatedResults.forEach(pedido => {
            const row = this.createResultRow(pedido);
            tbody.appendChild(row);
        });
        
        // Atualizar contador e paginação
        document.getElementById('results-count').textContent = `${pedidos.length} pedidos encontrados`;
        this.updatePagination(pedidos.length);
    }
    
    createResultRow(pedido) {
        const template = document.getElementById('row-template');
        const row = template.content.cloneNode(true);
        
        row.querySelector('.data-pedido').textContent = pedido.data;
        row.querySelector('.id-pedido').textContent = pedido.id_pedido;
        row.querySelector('.nome-aluno').textContent = pedido.aluno_nome;
        row.querySelector('.sala-aluno').textContent = pedido.aluno_sala;
        row.querySelector('.nome-cliente').textContent = pedido.cliente_nome;
        row.querySelector(".valor-total").textContent = this.formatCurrency(pedido.valor_total);
        row.querySelector(".forma-pagamento").textContent = pedido.forma_pagamento;
        row.querySelector(".loja-retirada").textContent = pedido.loja_retirada;
        
        const btnDetalhes = row.querySelector('.btn-detalhes');
        btnDetalhes.dataset.pedidoId = pedido.id_pedido;
        btnDetalhes.addEventListener('click', () => this.mostrarDetalhes(pedido));
        
        return row;
    }
    
    mostrarDetalhes(pedido) {
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div class="pedido-detalhes">
                <div class="detalhe-secao">
                    <h4>📋 Informações Gerais</h4>
                    <div class="detalhe-grid">
                        <div class="detalhe-item">
                            <span class="detalhe-label">ID do Pedido:</span>
                            <span class="detalhe-valor">${pedido.id_pedido}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Data/Hora:</span>
                            <span class="detalhe-valor">${pedido.data}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Valor Total:</span>
                            <span class="detalhe-valor">${this.formatCurrency(pedido.valor_total)}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Forma de Pagamento:</span>
                            <span class="detalhe-valor">${pedido.forma_pagamento}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detalhe-secao">
                    <h4>🎓 Informações do Aluno</h4>
                    <div class="detalhe-grid">
                        <div class="detalhe-item">
                            <span class="detalhe-label">Nome:</span>
                            <span class="detalhe-valor">${pedido.aluno_nome}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Sala:</span>
                            <span class="detalhe-valor">${pedido.aluno_sala}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detalhe-secao">
                    <h4>👤 Informações do Cliente</h4>
                    <div class="detalhe-grid">
                        <div class="detalhe-item">
                            <span class="detalhe-label">Nome:</span>
                            <span class="detalhe-valor">${pedido.cliente_nome}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Email:</span>
                            <span class="detalhe-valor">${pedido.cliente_email}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">CPF:</span>
                            <span class="detalhe-valor">${this.formatCPF(pedido.cliente_cpf)}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Telefone:</span>
                            <span class="detalhe-valor">${this.formatPhone(pedido.cliente_telefone)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detalhe-secao">
                    <h4>🚚 Informações de Entrega</h4>
                    <div class="detalhe-grid">
                        <div class="detalhe-item">
                            <span class="detalhe-label">Tipo:</span>
                            <span class="detalhe-valor">${pedido.tipo_entrega}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Data de Entrega:</span>
                            <span class="detalhe-valor">${pedido.data_entrega}</span>
                        </div>                        ${pedido.endereco_entrega ? `
                        <div class="detalhe-item" style="grid-column: 1 / -1;">
                            <span class="detalhe-label">Endereço de Entrega:</span>
                            <span class="detalhe-valor">${pedido.endereco_entrega}</span>
                        </div>
                        ` : ''}
                        ${pedido.loja_retirada ? `
                        <div class="detalhe-item">
                            <span class="detalhe-label">Loja de Retirada:</span>
                            <span class="detalhe-valor">${pedido.loja_retirada}</span>
                        </div>
                        ` : ''}
                        ${pedido.endereco_loja_retirada ? `
                        <div class="detalhe-item" style="grid-column: 1 / -1;">
                            <span class="detalhe-label">Endereço da Loja:</span>
                            <span class="detalhe-valor">${pedido.endereco_loja_retirada}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detalhe-secao">
                    <h4>📦 Itens do Pedido</h4>
                    <div class="itens-lista">
                        ${pedido.itens && pedido.itens.length > 0 ? 
                            pedido.itens.map(item => `
                                <li class="item-pedido">
                                    <span class="item-nome">${item.produto}</span>
                                    <span class="item-quantidade">Qtd: ${item.quantidade}</span>
                                    <span class="item-preco">Unit: ${this.formatCurrency(item.preco)}</span>
                                    <span class="item-total">Total: ${this.formatCurrency(item.total)}</span>
                                </li>
                            `).join('') : 
                            '<li style="text-align: center; color: #6b7280;">Nenhum item detalhado disponível</li>'
                        }
                    </ul>
                </div>
                
                ${pedido.observacoes ? `
                <div class="detalhe-secao">
                    <h4>📝 Observações</h4>
                    <p style="margin: 0; padding: 1rem; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
                        ${pedido.observacoes}
                    </p>
                </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('modal-detalhes').style.display = 'flex';
    }
    
    fecharModal() {
        document.getElementById('modal-detalhes').style.display = 'none';
    }
    
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationDiv = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            paginationDiv.style.display = 'none';
            return;
        }
        
        paginationDiv.style.display = 'flex';
        document.getElementById('page-info').textContent = `Página ${this.currentPage} de ${totalPages}`;
        
        const btnPrev = document.getElementById('btn-prev-page');
        const btnNext = document.getElementById('btn-next-page');
        
        btnPrev.disabled = this.currentPage === 1;
        btnNext.disabled = this.currentPage === totalPages;
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayResults(this.currentResults);
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.currentResults.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayResults(this.currentResults);
        }
    }
    
    async exportarResultados() {
        if (this.currentResults.length === 0) {
            this.showMessage('Nenhum resultado para exportar.', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/pedidos/exportar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentFilters)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showMessage(`${result.message}`, 'success');
            } else {
                throw new Error('Erro na exportação');
            }
        } catch (error) {
            console.log('Erro ao exportar:', error);
            // Fallback: criar CSV simples
            this.exportarCSV();
        }
    }
    
    exportarCSV() {
        const headers = ['Data', 'ID Pedido', 'Aluno', 'Sala', 'Cliente', 'Valor Total', 'Pagamento'];
        const csvContent = [
            headers.join(','),
            ...this.currentResults.map(pedido => [
                pedido.data,
                pedido.id_pedido,
                `"${pedido.aluno_nome}"`,
                `"${pedido.aluno_sala}"`,
                `"${pedido.cliente_nome}"`,
                pedido.valor_total,
                `"${pedido.forma_pagamento}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Arquivo CSV baixado com sucesso!', 'success');
    }
    
    // Utilitários de formatação
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }
    
    formatCPF(cpf) {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    formatPhone(phone) {
        if (!phone) return '';
        return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    showMessage(text, type = 'info') {
        const container = document.getElementById('message-container');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        container.appendChild(message);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PesquisaPedidos();
});

