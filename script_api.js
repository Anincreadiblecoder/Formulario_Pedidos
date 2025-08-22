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
            { nome: 'João Silva Santos', email: 'joao.silva@escola.edu.br', sala: '3º Ano A' },
            { nome: 'Maria Silva', email: 'maria.silva@escola.edu.br', sala: '2º Ano B' },
            { nome: 'Pedro Costa', email: 'pedro.costa@escola.edu.br', sala: '3º Ano A' },
            { nome: 'Ana Oliveira', email: 'ana.oliveira@escola.edu.br', sala: '1º Ano C' }
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
                dataLoader.loadAlunos(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]),
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

        let alunos, clientes, lojas, produtos;
        
        try {
            [alunos, clientes, lojas, produtos] = await Promise.all(promises);
            messageSystem.success('Dados carregados da API com sucesso!');
        } catch (error) {
            console.warn('API não disponível, usando dados de exemplo:', error);
            messageSystem.warning('API não disponível. Usando dados de exemplo.');
            
            // Usar dados de fallback
            alunos = dataLoader.getFallbackAlunos();
            clientes = dataLoader.getFallbackClientes();
            lojas = dataLoader.getFallbackLojas();
            produtos = dataLoader.getFallbackProdutos();
        }

        // Popular dropdowns
        populateAlunosDropdown(alunos);
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
        populateAlunosDropdown(dataLoader.getFallbackAlunos());
        populateClientesDropdown(dataLoader.getFallbackClientes());
        populateLojaDropdown(dataLoader.getFallbackLojas());
        window.produtosDisponiveis = dataLoader.getFallbackProdutos();
        
        setupEventListeners();
    }
}

// Popular combobox de alunos
function populateAlunosDropdown(alunos) {
    // Extrair salas únicas
    const salasUnicas = [...new Set(alunos.map(aluno => aluno.sala))].map(sala => ({ sala: sala }));
    
    // Usar o novo sistema de combobox para sala do aluno
    window.ComboboxUtils.createSalaAlunoCombobox(salasUnicas);

    // Usar o novo sistema de combobox para nome do aluno
    window.ComboboxUtils.createNomeAlunoCombobox(alunos);
}

// Popular combobox de clientes
function populateClientesDropdown(clientes) {
    // Usar o novo sistema de combobox
    window.ComboboxUtils.createClienteCombobox(clientes);
}

// Popular combobox de lojas
function populateLojaDropdown(lojas) {
    // Usar o novo sistema de combobox
    window.ComboboxUtils.createLojaCombobox(lojas);
}

// Popular combobox de produtos em um item
function populateProdutoDropdown(container, produtos) {
    // Usar o novo sistema de combobox
    window.ComboboxUtils.createProdutoCombobox(container, produtos);
}

// Configurar event listeners
function setupEventListeners() {
    // Seleção de cliente - agora usando combobox
    const clienteInput = document.getElementById('nomeCliente');
    if (clienteInput) {
        clienteInput.addEventListener('change', function() {
            if (this.value && this.value !== 'Selecione um cliente') {
                buscarEPreencherCliente(this.value);
            }
        });
    }

    // Tipo de entrega
    const tipoEntregaSelect = document.getElementById('tipoEntrega');
    if (tipoEntregaSelect) {
        tipoEntregaSelect.addEventListener('change', toggleEntregaFields);
    }

    // Botão adicionar item
    const addItemBtn = document.getElementById('adicionarItem');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', adicionarItem);
    }

    // Botões do formulário
    const limparBtn = document.getElementById('limparForm');
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
            messageSystem.info("Aluno não encontrado na base. O email será preenchido automaticamente se um aluno válido for selecionado.");
        }
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        // Em caso de erro, permitir entrada manual
        messageSystem.info("Erro ao buscar aluno. O email será preenchido automaticamente se um aluno válido for selecionado.");
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
    const tipoEntregaSelect = document.getElementById('tipoEntrega');
    const lojaGroup = document.getElementById('lojaRetiradaGroup');
    
    if (!tipoEntregaSelect || !lojaGroup) return;
    
    const tipoEntrega = tipoEntregaSelect.value;
    
    if (tipoEntrega === 'retirada_outras_lojas' || tipoEntrega === 'retirada_mercado_jf') {
        lojaGroup.style.display = 'block';
    } else {
        lojaGroup.style.display = 'none';
    }
}

// Adicionar item ao pedido
function adicionarItem() {
    formState.itemCounter++;
    const itemId = formState.itemCounter;
    
    // Usar o template HTML
    const template = document.getElementById('itemTemplate');
    if (!template) {
        console.error('Template de item não encontrado');
        return;
    }
    
    const itemElement = template.content.cloneNode(true);
    
    // Atualizar número do item
    const itemNumero = itemElement.querySelector('.item-numero');
    if (itemNumero) {
        itemNumero.textContent = itemId;
    }
    
    // Configurar IDs únicos
    const itemDiv = itemElement.querySelector('.item-pedido');
    if (itemDiv) {
        itemDiv.id = `item-${itemId}`;
    }
    
    // Configurar combobox de produto
    const produtoCombobox = itemElement.querySelector('.produto-combobox');
    if (produtoCombobox) {
        produtoCombobox.id = `produto-combobox-${itemId}`;
    }
    
    // Configurar inputs com IDs únicos
    const inputs = itemElement.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.name === 'promocao') {
            input.name = `promocao-${itemId}`;
        }
    });
    
    // Adicionar ao container
    const itensContainer = document.getElementById('itensContainer');
    if (itensContainer) {
        itensContainer.appendChild(itemElement);
        
        // Configurar combobox de produtos após adicionar ao DOM
        if (window.produtosDisponiveis && produtoCombobox) {
            populateProdutoDropdown(produtoCombobox, window.produtosDisponiveis);
        }
        
        // Configurar event listeners do item
        setupItemEventListeners(itemId);
    }
    
    messageSystem.success(`Item ${itemId} adicionado com sucesso!`);
}

// Configurar event listeners para um item específico
function setupItemEventListeners(itemId) {
    const itemContainer = document.getElementById(`item-${itemId}`);
    if (!itemContainer) return;
    
    // Botão remover item
    const removeBtn = itemContainer.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removerItem(itemId));
    }
    
    // Input de quantidade - calcular valor total
    const quantidadeInput = itemContainer.querySelector('.quantidade-input');
    if (quantidadeInput) {
        quantidadeInput.addEventListener('input', () => {
            calcularValorTotalItem(itemId);
        });
    }
}

// Remover item do pedido
function removerItem(itemId) {
    const itemElement = document.getElementById(`item-${itemId}`);
    if (itemElement) {
        itemElement.remove();
        
        // Remover do array de itens
        formState.itens = formState.itens.filter(item => item.id !== itemId);
        
        // Recalcular valor total
        calcularValorTotal();
        
        messageSystem.success(`Item ${itemId} removido com sucesso!`);
    }
}

// Calcular valor total de um item específico
function calcularValorTotalItem(itemId) {
    const itemContainer = document.getElementById(`item-${itemId}`);
    if (!itemContainer) return;
    
    const quantidadeInput = itemContainer.querySelector('.quantidade-input');
    const precoInput = itemContainer.querySelector('.preco-input');
    const valorTotalInput = itemContainer.querySelector('.valor-total-item');
    
    if (!quantidadeInput || !precoInput || !valorTotalInput) return;
    
    const quantidade = parseInt(quantidadeInput.value) || 0;
    const precoText = precoInput.value.replace('R$', '').replace(',', '.').trim();
    const preco = parseFloat(precoText) || 0;
    
    const valorTotal = quantidade * preco;
    valorTotalInput.value = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    
    // Recalcular valor total do pedido
    calcularValorTotal();
}

// Calcular valor total do pedido
function calcularValorTotal() {
    let valorTotal = 0;
    
    const itens = document.querySelectorAll('.item-pedido');
    itens.forEach(item => {
        const valorTotalInput = item.querySelector('.valor-total-item');
        if (valorTotalInput && valorTotalInput.value) {
            const valor = parseFloat(
                valorTotalInput.value
                    .replace('R$', '')
                    .replace(',', '.')
                    .trim()
            ) || 0;
            valorTotal += valor;
        }
    });
    
    const valorTotalPedidoInput = document.getElementById('valorTotalPedido');
    if (valorTotalPedidoInput) {
        valorTotalPedidoInput.value = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
    
    formState.valorTotal = valorTotal;
}

// Limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todo o formulário?')) {
        document.getElementById('pedidoForm').reset();
        
        // Limpar itens
        const itensContainer = document.getElementById('itensContainer');
        if (itensContainer) {
            itensContainer.innerHTML = '';
        }
        
        // Limpar comboboxes
        const clienteCombobox = window.comboboxManager.instances.get('clienteCombobox');
        if (clienteCombobox) {
            clienteCombobox.clear();
        }
        
        const lojaCombobox = window.comboboxManager.instances.get('lojaCombobox');
        if (lojaCombobox) {
            lojaCombobox.clear();
        }
        
        // Reset estado
        formState.itens = [];
        formState.itemCounter = 0;
        formState.valorTotal = 0;
        
        messageSystem.success('Formulário limpo com sucesso!');
    }
}

// Enviar pedido
async function enviarPedido(e) {
    e.preventDefault();
    
    try {
        // Validar formulário
        if (!validarFormulario()) {
            return;
        }
        
        // Coletar dados do formulário
        const dadosPedido = coletarDadosFormulario();
        
        // Tentar salvar via API
        try {
            const resultado = await dataLoader.salvarPedido(dadosPedido);
            messageSystem.success('Pedido enviado com sucesso!');
            
            // Limpar formulário após sucesso
            setTimeout(() => {
                limparFormulario();
            }, 2000);
            
        } catch (apiError) {
            console.warn('Erro ao salvar via API, salvando localmente:', apiError);
            
            // Fallback: salvar no localStorage
            const pedidosLocais = JSON.parse(localStorage.getItem('pedidos') || '[]');
            dadosPedido.id = `PED_${Date.now()}`;
            dadosPedido.dataHora = new Date().toISOString();
            pedidosLocais.push(dadosPedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidosLocais));
            
            messageSystem.warning('Pedido salvo localmente. Será sincronizado quando a conexão for restabelecida.');
        }
        
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        messageSystem.error('Erro ao enviar pedido. Tente novamente.');
    }
}

// Validar formulário
function validarFormulario() {
    const camposObrigatorios = [
        { id: 'nomeCliente', nome: 'Nome do cliente' },
        { id: 'emailCliente', nome: 'Email do cliente' },
        { id: 'cpfCliente', nome: 'CPF do cliente' },
        { id: 'telefoneCliente', nome: 'Telefone do cliente' },
        { id: 'tipoEntrega', nome: 'Tipo de entrega' },
        { id: 'formaPagamento', nome: 'Forma de pagamento' }
    ];
    
    for (const campo of camposObrigatorios) {
        const elemento = document.getElementById(campo.id);
        if (!elemento || !elemento.value.trim()) {
            messageSystem.error(`Campo obrigatório não preenchido: ${campo.nome}`);
            elemento?.focus();
            return false;
        }
    }
    
    // Validar se há pelo menos um item
    const itens = document.querySelectorAll('.item-pedido');
    if (itens.length === 0) {
        messageSystem.error('Adicione pelo menos um item ao pedido.');
        return false;
    }
    
    // Validar itens
    for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const produtoInput = item.querySelector('.produto-input');
        const quantidadeInput = item.querySelector('.quantidade-input');
        
        if (!produtoInput?.value.trim()) {
            messageSystem.error(`Selecione um produto para o item ${i + 1}.`);
            produtoInput?.focus();
            return false;
        }
        
        if (!quantidadeInput?.value || parseInt(quantidadeInput.value) < 1) {
            messageSystem.error(`Informe uma quantidade válida para o item ${i + 1}.`);
            quantidadeInput?.focus();
            return false;
        }
    }
    
    return true;
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    const dados = {
        // Dados do aluno
        aluno: {
            sala: document.getElementById('salaAluno')?.value || '',
            nome: document.getElementById('nomeAluno')?.value || '',
            email: document.getElementById('emailAluno')?.value || ''
        },
        
        // Dados do cliente
        cliente: {
            nome: document.getElementById('nomeCliente')?.value || '',
            email: document.getElementById('emailCliente')?.value || '',
            cpf: document.getElementById('cpfCliente')?.value || '',
            telefone: document.getElementById('telefoneCliente')?.value || ''
        },
        
        // Dados de entrega
        entrega: {
            tipo: document.getElementById('tipoEntrega')?.value || '',
            loja: document.getElementById('lojaRetirada')?.value || '',
            endereco: document.getElementById('enderecoCompleto')?.value || '',
            data: document.getElementById('dataEntrega')?.value || '',
            condicao: document.getElementById('condicaoEntrega')?.value || ''
        },
        
        // Forma de pagamento
        pagamento: document.getElementById('formaPagamento')?.value || '',
        
        // Itens do pedido
        itens: [],
        
        // Observações
        observacoes: document.getElementById('observacoes')?.value || '',
        
        // Valor total
        valorTotal: formState.valorTotal
    };
    
    // Coletar itens
    const itensElements = document.querySelectorAll('.item-pedido');
    itensElements.forEach((itemElement, index) => {
        const item = {
            numero: index + 1,
            produto: itemElement.querySelector('.produto-input')?.value || '',
            promocao: itemElement.querySelector('input[name^="promocao"]:checked')?.value || 'nao',
            quantidade: parseInt(itemElement.querySelector('.quantidade-input')?.value) || 0,
            peso: itemElement.querySelector('.peso-input')?.value || '',
            precoUnitario: itemElement.querySelector('.preco-input')?.value || '',
            valorTotal: itemElement.querySelector('.valor-total-item')?.value || ''
        };
        dados.itens.push(item);
    });
    
    return dados;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeForm);

