/**
 * Formulário de Pedidos - Versão com Integração API
 * Sistema completo de formulário com integração a bases de dados Excel via API REST
 */

// Configuração da API
const API_CONFIG = {
    baseUrl: 'http://localhost:5000/api/excel',
    timeout: 10000 // 10 segundos
};

// Cache local para melhorar performance
const localCache = {
    alunos: null,
    clientes: null,
    lojas: null,
    produtos: null,
    lastUpdate: null
};

// Estado global do formulário
let formState = {
    itens: [],
    itemCounter: 0,
    valorTotal: 0
};

// Utilitários para requisições API
const apiUtils = {
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseUrl}${endpoint}`;
        const config = {
            timeout: API_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw error;
        }
    },

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// Funções de carregamento de dados da API
const dataLoader = {
    async loadAlunos() {
        if (localCache.alunos && this.isCacheValid()) {
            return localCache.alunos;
        }

        try {
            const alunos = await apiUtils.get('/alunos');
            localCache.alunos = alunos;
            this.updateCacheTimestamp();
            return alunos;
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            return this.getFallbackAlunos();
        }
    },

    async loadClientes() {
        if (localCache.clientes && this.isCacheValid()) {
            return localCache.clientes;
        }

        try {
            const clientes = await apiUtils.get('/clientes');
            localCache.clientes = clientes;
            this.updateCacheTimestamp();
            return clientes;
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            return this.getFallbackClientes();
        }
    },

    async loadLojas() {
        if (localCache.lojas && this.isCacheValid()) {
            return localCache.lojas;
        }

        try {
            const lojas = await apiUtils.get('/lojas');
            localCache.lojas = lojas;
            this.updateCacheTimestamp();
            return lojas;
        } catch (error) {
            console.error('Erro ao carregar lojas:', error);
            return this.getFallbackLojas();
        }
    },

    async loadProdutos() {
        if (localCache.produtos && this.isCacheValid()) {
            return localCache.produtos;
        }

        try {
            const produtos = await apiUtils.get('/produtos');
            localCache.produtos = produtos;
            this.updateCacheTimestamp();
            return produtos;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return this.getFallbackProdutos();
        }
    },

    async buscarAluno(nome) {
        try {
            return await apiUtils.get(`/alunos/buscar?nome=${encodeURIComponent(nome)}`);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            return null;
        }
    },

    async buscarCliente(nome) {
        try {
            return await apiUtils.get(`/clientes/buscar?nome=${encodeURIComponent(nome)}`);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return null;
        }
    },

    async buscarProduto(nome) {
        try {
            return await apiUtils.get(`/produtos/buscar?nome=${encodeURIComponent(nome)}`);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    },

    async salvarPedido(dadosPedido) {
        try {
            return await apiUtils.post('/pedidos', dadosPedido);
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            throw error;
        }
    },

    isCacheValid() {
        if (!localCache.lastUpdate) return false;
        const now = new Date();
        const lastUpdate = new Date(localCache.lastUpdate);
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        return diffMinutes < 5; // Cache válido por 5 minutos
    },

    updateCacheTimestamp() {
        localCache.lastUpdate = new Date().toISOString();
    },

    // Dados de fallback caso a API não esteja disponível
    getFallbackAlunos() {
        return [
            { nome: 'João Silva', email: 'joao.silva@escola.edu.br', serie: '3A', numero: '01' },
            { nome: 'Maria Santos', email: 'maria.santos@escola.edu.br', serie: '3B', numero: '02' }
        ];
    },

    getFallbackClientes() {
        return [
            { nome: 'Ana Costa', email: 'ana.costa@email.com' },
            { nome: 'Carlos Ferreira', email: 'carlos.ferreira@email.com' }
        ];
    },

    getFallbackLojas() {
        return [
            { nome: 'Loja Shopping Center Norte' },
            { nome: 'Loja Shopping Ibirapuera' }
        ];
    },

    getFallbackProdutos() {
        return [
            { nome: 'Hambúrguer Artesanal', codigo: 'HAMB001', peso: '200g', preco: 25.90 },
            { nome: 'Pizza Margherita', codigo: 'PIZZA001', peso: '350g', preco: 32.50 },
            { nome: 'Batata Frita Especial', codigo: 'BAT001', peso: '150g', preco: 12.90 }
        ];
    }
};

// Sistema de mensagens
const messageSystem = {
    show(message, type = 'info', duration = 5000) {
        // Remove mensagens anteriores
        const existingMessages = document.querySelectorAll('.message-alert');
        existingMessages.forEach(msg => msg.remove());

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-alert message-${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 400px;
            word-wrap: break-word;
        `;

        // Cores por tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        // Remove automaticamente
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Inicialização do formulário
async function initializeForm() {
    try {
        messageSystem.info('Carregando dados...');
        
        // Tentar carregar dados da API com timeout curto
        const timeout = 3000; // 3 segundos
        const promises = [
            Promise.race([
                dataLoader.loadClientes(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]),
            Promise.race([
                dataLoader.loadLojas(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]),
            Promise.race([
                dataLoader.loadProdutos(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ])
        ];

        let clientes, lojas, produtos;
        
        try {
            [clientes, lojas, produtos] = await Promise.all(promises);
            messageSystem.success('Dados carregados da API com sucesso!');
        } catch (error) {
            console.warn('API não disponível, usando dados de exemplo:', error);
            messageSystem.warning('API não disponível. Usando dados de exemplo.');
            
            // Usar dados de fallback
            clientes = dataLoader.getFallbackClientes();
            lojas = dataLoader.getFallbackLojas();
            produtos = dataLoader.getFallbackProdutos();
        }

        // Popular dropdowns
        populateClientesDropdown(clientes);
        populateLojaDropdown(lojas);
        
        // Armazenar produtos para uso posterior
        window.produtosDisponiveis = produtos;
        
        // Configurar event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Erro na inicialização:', error);
        messageSystem.error('Erro ao inicializar formulário.');
        
        // Usar dados de fallback como último recurso
        populateClientesDropdown(dataLoader.getFallbackClientes());
        populateLojaDropdown(dataLoader.getFallbackLojas());
        window.produtosDisponiveis = dataLoader.getFallbackProdutos();
        
        setupEventListeners();
    }
}

// Popular dropdown de clientes
function populateClientesDropdown(clientes) {
    const select = document.getElementById('nomeCliente');
    if (!select) return;

    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    // Adicionar clientes
    clientes.forEach(cliente => {
        if (cliente.nome) {
            const option = document.createElement('option');
            option.value = cliente.nome;
            option.textContent = cliente.nome;
            select.appendChild(option);
        }
    });
}

// Popular dropdown de lojas
function populateLojaDropdown(lojas) {
    const select = document.getElementById('loja-retirada');
    if (!select) return;

    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    // Adicionar lojas
    lojas.forEach(loja => {
        if (loja.nome) {
            const option = document.createElement('option');
            option.value = loja.nome;
            option.textContent = loja.nome;
            select.appendChild(option);
        }
    });
}

// Popular dropdown de produtos em um item
function populateProdutoDropdown(selectElement, produtos) {
    // Limpar opções existentes (exceto a primeira)
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    // Adicionar produtos
    produtos.forEach(produto => {
        if (produto.nome) {
            const option = document.createElement('option');
            option.value = produto.nome;
            option.textContent = produto.nome;
            selectElement.appendChild(option);
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Busca de aluno
    const alunoNomeInput = document.getElementById('nomeAluno');
    if (alunoNomeInput) {
        let searchTimeout;
        alunoNomeInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.trim().length >= 2) {
                    buscarEPreencherAluno(this.value.trim());
                }
            }, 500);
        });
    }

    // Seleção de cliente
    const clienteSelect = document.getElementById('nomeCliente');
    if (clienteSelect) {
        clienteSelect.addEventListener('change', function() {
            if (this.value && this.value !== 'Selecione um cliente') {
                buscarEPreencherCliente(this.value);
            }
        });
    }

    // Tipo de entrega
    const tipoEntregaRadios = document.querySelectorAll('input[name="tipoEntrega"]');
    tipoEntregaRadios.forEach(radio => {
        radio.addEventListener('change', toggleEntregaFields);
    });

    // Botão adicionar item
    const addItemBtn = document.getElementById('adicionarItem');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', adicionarItem);
    }

    // Botões do formulário
    const limparBtn = document.getElementById('limparFormulario');
    const enviarBtn = document.getElementById('enviarPedido');
    
    if (limparBtn) {
        limparBtn.addEventListener('click', limparFormulario);
    }
    
    if (enviarBtn) {
        enviarBtn.addEventListener('click', enviarPedido);
    }
}

// Buscar e preencher dados do aluno
async function buscarEPreencherAluno(nome) {
    try {
        const aluno = await dataLoader.buscarAluno(nome);
        if (aluno) {
            const salaInput = document.getElementById('salaAluno');
            const emailInput = document.getElementById('emailAluno');
            
            if (salaInput) salaInput.value = aluno.serie || '';
            if (emailInput) emailInput.value = aluno.email || '';
            
            messageSystem.success('Dados do aluno preenchidos automaticamente!');
        } else {
            // Não encontrou correspondência - permitir entrada manual
            const emailInput = document.getElementById('emailAluno');
            if (emailInput) {
                emailInput.readOnly = false;
                emailInput.placeholder = 'Digite o email do aluno';
            }
            
            messageSystem.info('Aluno não encontrado na base. Você pode preencher os dados manualmente.');
        }
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        // Em caso de erro, permitir entrada manual
        const emailInput = document.getElementById('emailAluno');
        if (emailInput) {
            emailInput.readOnly = false;
            emailInput.placeholder = 'Digite o email do aluno';
        }
    }
}

// Buscar e preencher dados do cliente
async function buscarEPreencherCliente(nome) {
    try {
        const cliente = await dataLoader.buscarCliente(nome);
        if (cliente) {
            const emailInput = document.getElementById('emailCliente');
            const cpfInput = document.getElementById('cpfCliente');
            const telefoneInput = document.getElementById('telefoneCliente');
            
            if (emailInput && cliente.email) {
                emailInput.value = cliente.email;
                emailInput.readOnly = true;
            }
            if (cpfInput && cliente.cpf) {
                cpfInput.value = cliente.cpf;
                cpfInput.readOnly = true;
            }
            if (telefoneInput && cliente.telefone) {
                telefoneInput.value = cliente.telefone;
                telefoneInput.readOnly = true;
            }
            
            messageSystem.success('Dados do cliente preenchidos automaticamente!');
        } else {
            // Não encontrou correspondência - permitir entrada manual
            const emailInput = document.getElementById('emailCliente');
            const cpfInput = document.getElementById('cpfCliente');
            const telefoneInput = document.getElementById('telefoneCliente');
            
            if (emailInput) {
                emailInput.readOnly = false;
                emailInput.placeholder = 'Digite o email do cliente';
            }
            if (cpfInput) {
                cpfInput.readOnly = false;
                cpfInput.placeholder = 'Digite o CPF (apenas números)';
            }
            if (telefoneInput) {
                telefoneInput.readOnly = false;
                telefoneInput.placeholder = 'Digite o telefone/WhatsApp';
            }
            
            messageSystem.warning('Cliente não encontrado na base. Preencha os dados manualmente.');
        }
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        // Em caso de erro, permitir entrada manual
        const emailInput = document.getElementById('emailCliente');
        const cpfInput = document.getElementById('cpfCliente');
        const telefoneInput = document.getElementById('telefoneCliente');
        
        [emailInput, cpfInput, telefoneInput].forEach(input => {
            if (input) {
                input.readOnly = false;
                input.placeholder = 'Preencha manualmente';
            }
        });
        
        messageSystem.warning('Erro ao acessar base de dados. Preencha os dados manualmente.');
    }
}

// Toggle campos de entrega
function toggleEntregaFields() {
    const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked')?.value;
    const lojaField = document.getElementById('loja-field');
    const enderecoField = document.getElementById('endereco-field');

    if (!lojaField || !enderecoField) return;

    if (tipoEntrega === 'retirada') {
        lojaField.style.display = 'block';
        enderecoField.style.display = 'none';
    } else if (tipoEntrega === 'entrega') {
        lojaField.style.display = 'none';
        enderecoField.style.display = 'block';
    } else {
        lojaField.style.display = 'none';
        enderecoField.style.display = 'none';
    }
}

// Adicionar item ao pedido
function adicionarItem() {
    formState.itemCounter++;
    const itemId = formState.itemCounter;
    
    const itemHtml = `
        <div class="item-pedido" id="item-${itemId}">
            <div class="item-header">
                <h4>Item ${itemId}</h4>
                <button type="button" class="btn-remover" onclick="removerItem(${itemId})">Remover Item</button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="produto-${itemId}">Nome do Produto: *</label>
                    <select id="produto-${itemId}" required>
                        <option value="">Selecione um produto</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Há promoção?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="promocao-${itemId}" value="sim"> Sim</label>
                        <label><input type="radio" name="promocao-${itemId}" value="nao" checked> Não</label>
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="quantidade-${itemId}">Quantidade: *</label>
                    <input type="number" id="quantidade-${itemId}" min="1" required>
                </div>
                
                <div class="form-group">
                    <label for="peso-${itemId}">Peso:</label>
                    <input type="text" id="peso-${itemId}" readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="preco-${itemId}">Preço Unitário:</label>
                    <input type="text" id="preco-${itemId}" readonly>
                </div>
                
                <div class="form-group">
                    <label for="valor-item-${itemId}">Valor Total do Item:</label>
                    <input type="text" id="valor-item-${itemId}" readonly>
                </div>
            </div>
        </div>
    `;
    
    const itensContainer = document.getElementById('itensContainer');
    if (itensContainer) {
        itensContainer.insertAdjacentHTML('beforeend', itemHtml);
        
        // Popular dropdown de produtos
        const produtoSelect = document.getElementById(`produto-${itemId}`);
        if (produtoSelect && window.produtosDisponiveis) {
            populateProdutoDropdown(produtoSelect, window.produtosDisponiveis);
        }
        
        // Configurar event listeners do item
        setupItemEventListeners(itemId);
        
        messageSystem.success(`Item ${itemId} adicionado ao pedido.`);
    }
}

// Configurar event listeners de um item
function setupItemEventListeners(itemId) {
    const produtoSelect = document.getElementById(`produto-${itemId}`);
    const quantidadeInput = document.getElementById(`quantidade-${itemId}`);
    
    if (produtoSelect) {
        produtoSelect.addEventListener('change', () => preencherDadosProduto(itemId));
    }
    
    if (quantidadeInput) {
        quantidadeInput.addEventListener('input', () => calcularValorItem(itemId));
    }
}

// Preencher dados do produto selecionado
async function preencherDadosProduto(itemId) {
    const produtoSelect = document.getElementById(`produto-${itemId}`);
    const pesoInput = document.getElementById(`peso-${itemId}`);
    const precoInput = document.getElementById(`preco-${itemId}`);
    
    if (!produtoSelect || !produtoSelect.value) return;
    
    try {
        const produto = await dataLoader.buscarProduto(produtoSelect.value);
        if (produto) {
            if (pesoInput) pesoInput.value = produto.peso || '';
            if (precoInput) precoInput.value = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
            
            // Recalcular valor do item
            calcularValorItem(itemId);
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

// Calcular valor total do item
function calcularValorItem(itemId) {
    const quantidadeInput = document.getElementById(`quantidade-${itemId}`);
    const precoInput = document.getElementById(`preco-${itemId}`);
    const valorItemInput = document.getElementById(`valor-item-${itemId}`);
    
    if (!quantidadeInput || !precoInput || !valorItemInput) return;
    
    const quantidade = parseInt(quantidadeInput.value) || 0;
    const precoText = precoInput.value.replace('R$ ', '').replace(',', '.');
    const preco = parseFloat(precoText) || 0;
    
    const valorTotal = quantidade * preco;
    valorItemInput.value = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    
    // Recalcular valor total do pedido
    calcularValorTotalPedido();
}

// Calcular valor total do pedido
function calcularValorTotalPedido() {
    let total = 0;
    const itens = document.querySelectorAll('.item-pedido');
    
    itens.forEach(item => {
        const valorItemInput = item.querySelector('[id^="valor-item-"]');
        if (valorItemInput && valorItemInput.value) {
            const valor = parseFloat(valorItemInput.value.replace('R$ ', '').replace(',', '.')) || 0;
            total += valor;
        }
    });
    
    const valorTotalInput = document.getElementById('valor-total');
    if (valorTotalInput) {
        valorTotalInput.value = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Remover item
function removerItem(itemId) {
    const itemElement = document.getElementById(`item-${itemId}`);
    if (itemElement) {
        itemElement.remove();
        calcularValorTotalPedido();
        messageSystem.info(`Item ${itemId} removido do pedido.`);
    }
}

// Limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
        document.getElementById('pedido-form').reset();
        
        // Limpar itens
        const itensContainer = document.getElementById('itens-container');
        if (itensContainer) {
            itensContainer.innerHTML = '';
        }
        
        // Resetar estado
        formState = {
            itens: [],
            itemCounter: 0,
            valorTotal: 0
        };
        
        // Resetar campos de entrega
        toggleEntregaFields();
        
        messageSystem.success('Formulário limpo com sucesso!');
    }
}

// Validar formulário
function validarFormulario() {
    const erros = [];
    
    // Validar campos obrigatórios
    const camposObrigatorios = [
        { id: 'cliente-nome', nome: 'Nome do cliente' },
        { id: 'cliente-email', nome: 'Email do cliente' },
        { id: 'cliente-cpf', nome: 'CPF do cliente' }
    ];
    
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento || !elemento.value || elemento.value === 'Selecione um cliente') {
            erros.push(`${campo.nome} é obrigatório.`);
        }
    });
    
    // Validar tipo de entrega
    const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked');
    if (!tipoEntrega) {
        erros.push('Tipo de entrega é obrigatório.');
    }
    
    // Validar forma de pagamento
    const formaPagamento = document.getElementById('forma-pagamento');
    if (!formaPagamento || !formaPagamento.value || formaPagamento.value === 'Selecione a forma de pagamento') {
        erros.push('Forma de pagamento é obrigatório.');
    }
    
    // Validar itens
    const itens = document.querySelectorAll('.item-pedido');
    if (itens.length === 0) {
        erros.push('Adicione pelo menos um item ao pedido.');
    }
    
    // Validar cada item
    itens.forEach((item, index) => {
        const produtoSelect = item.querySelector('[id^="produto-"]');
        const quantidadeInput = item.querySelector('[id^="quantidade-"]');
        
        if (!produtoSelect || !produtoSelect.value) {
            erros.push(`Item ${index + 1}: Selecione um produto.`);
        }
        
        if (!quantidadeInput || !quantidadeInput.value || quantidadeInput.value <= 0) {
            erros.push(`Item ${index + 1}: Quantidade deve ser maior que zero.`);
        }
    });
    
    return erros;
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    const dados = {
        aluno: {
            sala: document.getElementById('aluno-sala')?.value || '',
            nome: document.getElementById('aluno-nome')?.value || '',
            email: document.getElementById('aluno-email')?.value || ''
        },
        cliente: {
            nome: document.getElementById('cliente-nome')?.value || '',
            email: document.getElementById('cliente-email')?.value || '',
            cpf: document.getElementById('cliente-cpf')?.value || '',
            telefone: document.getElementById('cliente-telefone')?.value || ''
        },
        entrega: {
            tipo: document.querySelector('input[name="tipo-entrega"]:checked')?.value || '',
            loja: document.getElementById('loja-retirada')?.value || '',
            endereco: document.getElementById('endereco-completo')?.value || '',
            data: document.getElementById('data-entrega')?.value || '',
            condicao: document.getElementById('condicao-entrega')?.value || ''
        },
        pagamento: {
            forma: document.getElementById('forma-pagamento')?.value || ''
        },
        itens: [],
        valorTotal: document.getElementById('valor-total')?.value || '',
        observacoes: document.getElementById('observacoes')?.value || ''
    };
    
    // Coletar itens
    const itens = document.querySelectorAll('.item-pedido');
    itens.forEach(item => {
        const itemId = item.id.replace('item-', '');
        const itemData = {
            produto: document.getElementById(`produto-${itemId}`)?.value || '',
            promocao: document.querySelector(`input[name="promocao-${itemId}"]:checked`)?.value || '',
            quantidade: document.getElementById(`quantidade-${itemId}`)?.value || '',
            peso: document.getElementById(`peso-${itemId}`)?.value || '',
            preco: document.getElementById(`preco-${itemId}`)?.value || '',
            valorTotal: document.getElementById(`valor-item-${itemId}`)?.value || ''
        };
        dados.itens.push(itemData);
    });
    
    return dados;
}

// Enviar pedido
async function enviarPedido() {
    try {
        // Validar formulário
        const erros = validarFormulario();
        if (erros.length > 0) {
            messageSystem.error(`Corrija os seguintes erros: ${erros.join(' ')}`);
            return;
        }
        
        // Coletar dados
        const dadosPedido = coletarDadosFormulario();
        
        // Mostrar loading
        messageSystem.info('Enviando pedido...');
        
        // Enviar para API
        const resultado = await dataLoader.salvarPedido(dadosPedido);
        
        if (resultado.success) {
            messageSystem.success(`Pedido enviado com sucesso! ID: ${resultado.id_pedido}`);
            
            // Limpar formulário após sucesso
            setTimeout(() => {
                limparFormulario();
            }, 2000);
        } else {
            messageSystem.error('Erro ao enviar pedido. Tente novamente.');
        }
        
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        messageSystem.error(`Erro ao enviar pedido: ${error.message}`);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initializeForm);

// Expor funções globais necessárias
window.removerItem = removerItem;

