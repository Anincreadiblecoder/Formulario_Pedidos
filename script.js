// Dados simulados das bases Excel (serão substituídos por integração real na próxima fase)
const dadosSimulados = {
    alunos: [
        { nome: "João Silva", email: "joao.silva@escola.edu.br", serie: "3A", numero: "01" },
        { nome: "Maria Santos", email: "maria.santos@escola.edu.br", serie: "3B", numero: "02" },
        { nome: "Pedro Oliveira", email: "pedro.oliveira@escola.edu.br", serie: "2A", numero: "03" }
    ],
    clientes: [
        { 
            nome: "Ana Costa", 
            email: "ana.costa@email.com", 
            cpf: "12345678901", 
            telefone: "11987654321", 
            endereco: "Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567" 
        },
        { 
            nome: "Carlos Ferreira", 
            email: "carlos.ferreira@email.com", 
            cpf: "98765432109", 
            telefone: "11876543210", 
            endereco: "Av. Paulista, 456 - Bela Vista - São Paulo/SP - CEP: 01310-100" 
        }
    ],
    lojas: [
        { nome: "Loja Shopping Center Norte" },
        { nome: "Loja Shopping Ibirapuera" },
        { nome: "Loja Shopping Eldorado" }
    ],
    produtos: [
        { 
            nome: "Hambúrguer Artesanal", 
            codigo: "HAMB001", 
            peso: "200g", 
            preco: 25.90 
        },
        { 
            nome: "Pizza Margherita", 
            codigo: "PIZZA001", 
            peso: "350g", 
            preco: 32.50 
        },
        { 
            nome: "Batata Frita Especial", 
            codigo: "BAT001", 
            peso: "150g", 
            preco: 12.90 
        }
    ]
};

// Variáveis globais
let contadorItens = 0;
let itensAdicionados = [];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarFormulario();
    configurarEventListeners();
    carregarDadosIniciais();
});

// Função principal de inicialização
function inicializarFormulario() {
    // Configurar data mínima para entrega (hoje)
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataEntrega').min = hoje;
    
    // Ocultar campo de loja para retirada inicialmente
    document.getElementById('lojaRetiradaGroup').style.display = 'none';
}

// Configurar todos os event listeners
function configurarEventListeners() {
    // Campos de aluno
    document.getElementById('nomeAluno').addEventListener('blur', buscarEmailAluno);
    
    // Campos de cliente
    document.getElementById('nomeCliente').addEventListener('change', buscarDadosCliente);
    
    // Campos de entrega
    document.getElementById('tipoEntrega').addEventListener('change', alterarTipoEntrega);
    
    // Botões principais
    document.getElementById('adicionarItem').addEventListener('click', adicionarItem);
    document.getElementById('limparForm').addEventListener('click', limparFormulario);
    document.getElementById('enviarPedido').addEventListener('click', enviarPedido);
    
    // Validação em tempo real
    document.getElementById('cpfCliente').addEventListener('input', validarCPF);
    document.getElementById('telefoneCliente').addEventListener('input', validarTelefone);
    document.getElementById('emailCliente').addEventListener('blur', validarEmail);
    document.getElementById('emailAluno').addEventListener('blur', validarEmail);
}

// Carregar dados iniciais nos selects
function carregarDadosIniciais() {
    carregarClientes();
    carregarLojas();
    carregarProdutos();
}

// Carregar lista de clientes
function carregarClientes() {
    const select = document.getElementById('nomeCliente');
    dadosSimulados.clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
}

// Carregar lista de lojas
function carregarLojas() {
    const select = document.getElementById('lojaRetirada');
    dadosSimulados.lojas.forEach(loja => {
        const option = document.createElement('option');
        option.value = loja.nome;
        option.textContent = loja.nome;
        select.appendChild(option);
    });
}

// Carregar produtos em todos os selects de produtos
function carregarProdutos() {
    const selects = document.querySelectorAll('.produto-select');
    selects.forEach(select => {
        // Limpar opções existentes (exceto a primeira)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        dadosSimulados.produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.nome;
            option.textContent = produto.nome;
            option.dataset.codigo = produto.codigo;
            option.dataset.peso = produto.peso;
            option.dataset.preco = produto.preco;
            select.appendChild(option);
        });
    });
}

// Buscar email do aluno baseado no nome
function buscarEmailAluno() {
    const nomeAluno = document.getElementById('nomeAluno').value.trim();
    const emailField = document.getElementById('emailAluno');
    
    if (nomeAluno) {
        const aluno = dadosSimulados.alunos.find(a => 
            a.nome.toLowerCase().includes(nomeAluno.toLowerCase())
        );
        
        if (aluno) {
            emailField.value = aluno.email;
            mostrarMensagem('Email do aluno encontrado automaticamente.', 'success');
        } else {
            emailField.value = '';
            mostrarMensagem('Aluno não encontrado na base de dados.', 'warning');
        }
    }
}

// Buscar dados do cliente baseado no nome selecionado
function buscarDadosCliente() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    
    if (nomeCliente) {
        const cliente = dadosSimulados.clientes.find(c => c.nome === nomeCliente);
        
        if (cliente) {
            document.getElementById('emailCliente').value = cliente.email;
            document.getElementById('cpfCliente').value = cliente.cpf;
            document.getElementById('telefoneCliente').value = cliente.telefone;
            document.getElementById('enderecoCompleto').value = cliente.endereco;
            mostrarMensagem('Dados do cliente carregados automaticamente.', 'success');
        }
    } else {
        // Limpar campos se nenhum cliente for selecionado
        document.getElementById('emailCliente').value = '';
        document.getElementById('cpfCliente').value = '';
        document.getElementById('telefoneCliente').value = '';
        document.getElementById('enderecoCompleto').value = '';
    }
}

// Alterar tipo de entrega e mostrar/ocultar campos condicionais
function alterarTipoEntrega() {
    const tipoEntrega = document.getElementById('tipoEntrega').value;
    const lojaGroup = document.getElementById('lojaRetiradaGroup');
    const condicaoField = document.getElementById('condicaoEntrega');
    
    if (tipoEntrega === 'retirada_outras_lojas') {
        lojaGroup.style.display = 'block';
        document.getElementById('lojaRetirada').required = true;
        condicaoField.value = 'Frete Gratuito (Retirada)';
    } else {
        lojaGroup.style.display = 'none';
        document.getElementById('lojaRetirada').required = false;
        document.getElementById('lojaRetirada').value = '';
        
        if (tipoEntrega === 'entrega_casa') {
            condicaoField.value = 'Agendada - R$ 11,90';
        } else if (tipoEntrega === 'retirada_mercado_jf') {
            condicaoField.value = 'Frete Gratuito (Retirada)';
        } else {
            condicaoField.value = '';
        }
    }
}

// Adicionar novo item ao pedido
function adicionarItem() {
    contadorItens++;
    const template = document.getElementById('itemTemplate');
    const clone = template.content.cloneNode(true);
    
    // Configurar o número do item
    clone.querySelector('.item-numero').textContent = contadorItens;
    
    // Configurar IDs únicos para os campos
    const campos = clone.querySelectorAll('input, select');
    campos.forEach(campo => {
        if (campo.name === 'promocao') {
            campo.name = `promocao_${contadorItens}`;
        }
        campo.dataset.itemId = contadorItens;
    });
    
    // Configurar event listeners para o novo item
    const produtoSelect = clone.querySelector('.produto-select');
    const quantidadeInput = clone.querySelector('.quantidade-input');
    const removeBtn = clone.querySelector('.btn-remove');
    
    produtoSelect.addEventListener('change', function() {
        atualizarDadosProduto(this);
    });
    
    quantidadeInput.addEventListener('input', function() {
        calcularValorItem(this);
    });
    
    removeBtn.addEventListener('click', function() {
        removerItem(this);
    });
    
    // Carregar produtos no novo select
    carregarProdutosNoSelect(produtoSelect);
    
    // Adicionar ao container
    document.getElementById('itensContainer').appendChild(clone);
    
    // Adicionar à lista de itens
    itensAdicionados.push({
        id: contadorItens,
        produto: '',
        promocao: false,
        quantidade: 0,
        peso: '',
        preco: 0,
        valorTotal: 0
    });
    
    mostrarMensagem(`Item ${contadorItens} adicionado ao pedido.`, 'success');
}

// Carregar produtos em um select específico
function carregarProdutosNoSelect(select) {
    dadosSimulados.produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.nome;
        option.textContent = produto.nome;
        option.dataset.codigo = produto.codigo;
        option.dataset.peso = produto.peso;
        option.dataset.preco = produto.preco;
        select.appendChild(option);
    });
}

// Atualizar dados do produto quando selecionado
function atualizarDadosProduto(select) {
    const itemId = select.dataset.itemId;
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        const peso = selectedOption.dataset.peso;
        const preco = parseFloat(selectedOption.dataset.preco);
        
        // Encontrar os campos relacionados
        const itemContainer = select.closest('.item-pedido');
        const pesoInput = itemContainer.querySelector('.peso-input');
        const precoInput = itemContainer.querySelector('.preco-input');
        
        pesoInput.value = peso;
        precoInput.value = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        
        // Atualizar dados do item
        const item = itensAdicionados.find(i => i.id == itemId);
        if (item) {
            item.produto = selectedOption.value;
            item.peso = peso;
            item.preco = preco;
        }
        
        // Recalcular valor se já houver quantidade
        const quantidadeInput = itemContainer.querySelector('.quantidade-input');
        if (quantidadeInput.value) {
            calcularValorItem(quantidadeInput);
        }
    }
}

// Calcular valor total do item
function calcularValorItem(quantidadeInput) {
    const itemId = quantidadeInput.dataset.itemId;
    const quantidade = parseInt(quantidadeInput.value) || 0;
    
    const itemContainer = quantidadeInput.closest('.item-pedido');
    const precoInput = itemContainer.querySelector('.preco-input');
    const valorTotalInput = itemContainer.querySelector('.valor-total-item');
    
    // Extrair preço do campo (remover R$ e vírgula)
    const precoText = precoInput.value.replace('R$ ', '').replace(',', '.');
    const preco = parseFloat(precoText) || 0;
    
    const valorTotal = quantidade * preco;
    valorTotalInput.value = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    
    // Atualizar dados do item
    const item = itensAdicionados.find(i => i.id == itemId);
    if (item) {
        item.quantidade = quantidade;
        item.valorTotal = valorTotal;
    }
    
    // Recalcular valor total do pedido
    calcularValorTotalPedido();
}

// Calcular valor total do pedido
function calcularValorTotalPedido() {
    const valorTotal = itensAdicionados.reduce((total, item) => total + item.valorTotal, 0);
    document.getElementById('valorTotalPedido').value = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

// Remover item do pedido
function removerItem(button) {
    const itemContainer = button.closest('.item-pedido');
    const itemId = button.dataset.itemId || 
                   itemContainer.querySelector('[data-item-id]').dataset.itemId;
    
    // Remover da lista de itens
    itensAdicionados = itensAdicionados.filter(item => item.id != itemId);
    
    // Remover do DOM
    itemContainer.remove();
    
    // Recalcular valor total
    calcularValorTotalPedido();
    
    mostrarMensagem('Item removido do pedido.', 'success');
}

// Validações
function validarCPF(event) {
    let cpf = event.target.value.replace(/\D/g, '');
    
    if (cpf.length > 11) {
        cpf = cpf.substring(0, 11);
    }
    
    event.target.value = cpf;
    
    if (cpf.length === 11) {
        if (validarCPFCompleto(cpf)) {
            event.target.classList.remove('invalid');
            event.target.classList.add('valid');
        } else {
            event.target.classList.remove('valid');
            event.target.classList.add('invalid');
            mostrarMensagem('CPF inválido.', 'error');
        }
    }
}

function validarCPFCompleto(cpf) {
    // Algoritmo básico de validação de CPF
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    if (parseInt(cpf.charAt(9)) !== digito1) {
        return false;
    }
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpf.charAt(10)) === digito2;
}

function validarTelefone(event) {
    let telefone = event.target.value.replace(/\D/g, '');
    
    if (telefone.length > 11) {
        telefone = telefone.substring(0, 11);
    }
    
    event.target.value = telefone;
    
    if (telefone.length >= 10) {
        event.target.classList.remove('invalid');
        event.target.classList.add('valid');
    } else if (telefone.length > 0) {
        event.target.classList.remove('valid');
        event.target.classList.add('invalid');
    }
}

function validarEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email)) {
        event.target.classList.remove('invalid');
        event.target.classList.add('valid');
    } else if (email) {
        event.target.classList.remove('valid');
        event.target.classList.add('invalid');
        mostrarMensagem('Formato de e-mail inválido.', 'error');
    }
}

// Limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
        document.getElementById('pedidoForm').reset();
        
        // Limpar itens adicionados
        document.getElementById('itensContainer').innerHTML = '';
        itensAdicionados = [];
        contadorItens = 0;
        
        // Resetar campos automáticos
        document.getElementById('emailAluno').value = '';
        document.getElementById('emailCliente').value = '';
        document.getElementById('cpfCliente').value = '';
        document.getElementById('telefoneCliente').value = '';
        document.getElementById('enderecoCompleto').value = '';
        document.getElementById('condicaoEntrega').value = '';
        document.getElementById('valorTotalPedido').value = '';
        
        // Ocultar campo de loja
        document.getElementById('lojaRetiradaGroup').style.display = 'none';
        
        // Limpar mensagens
        document.getElementById('mensagens').innerHTML = '';
        
        mostrarMensagem('Formulário limpo com sucesso.', 'success');
    }
}

// Enviar pedido
function enviarPedido(event) {
    event.preventDefault();
    
    if (validarFormulario()) {
        const dadosPedido = coletarDadosFormulario();
        
        // Simular envio (na próxima fase será implementada a integração real)
        console.log('Dados do pedido:', dadosPedido);
        
        mostrarMensagem('Pedido enviado com sucesso! (Simulação)', 'success');
        
        // Opcional: limpar formulário após envio
        setTimeout(() => {
            if (confirm('Pedido enviado! Deseja limpar o formulário para um novo pedido?')) {
                limparFormulario();
            }
        }, 2000);
    }
}

// Validar formulário completo
function validarFormulario() {
    const erros = [];
    
    // Campos obrigatórios
    const camposObrigatorios = [
        { id: 'nomeCliente', nome: 'Nome completo do cliente' },
        { id: 'cpfCliente', nome: 'CPF do cliente' },
        { id: 'emailCliente', nome: 'Email do cliente' },
        { id: 'telefoneCliente', nome: 'Telefone do cliente' },
        { id: 'tipoEntrega', nome: 'Tipo de entrega' },
        { id: 'formaPagamento', nome: 'Forma de pagamento' }
    ];
    
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento.value.trim()) {
            erros.push(`${campo.nome} é obrigatório.`);
            elemento.classList.add('invalid');
        } else {
            elemento.classList.remove('invalid');
        }
    });
    
    // Validar se há pelo menos um item
    if (itensAdicionados.length === 0) {
        erros.push('Adicione pelo menos um item ao pedido.');
    } else {
        // Validar se todos os itens têm dados completos
        itensAdicionados.forEach((item, index) => {
            if (!item.produto || item.quantidade <= 0) {
                erros.push(`Item ${index + 1}: Produto e quantidade são obrigatórios.`);
            }
        });
    }
    
    // Validar loja se necessário
    const tipoEntrega = document.getElementById('tipoEntrega').value;
    if (tipoEntrega === 'retirada_outras_lojas') {
        const loja = document.getElementById('lojaRetirada').value;
        if (!loja) {
            erros.push('Selecione uma loja para retirada.');
            document.getElementById('lojaRetirada').classList.add('invalid');
        }
    }
    
    if (erros.length > 0) {
        mostrarMensagem('Corrija os seguintes erros:\n' + erros.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    return {
        aluno: {
            sala: document.getElementById('salaAluno').value,
            nome: document.getElementById('nomeAluno').value,
            email: document.getElementById('emailAluno').value
        },
        cliente: {
            nome: document.getElementById('nomeCliente').value,
            email: document.getElementById('emailCliente').value,
            cpf: document.getElementById('cpfCliente').value,
            telefone: document.getElementById('telefoneCliente').value
        },
        entrega: {
            tipo: document.getElementById('tipoEntrega').value,
            loja: document.getElementById('lojaRetirada').value,
            endereco: document.getElementById('enderecoCompleto').value,
            data: document.getElementById('dataEntrega').value,
            condicao: document.getElementById('condicaoEntrega').value
        },
        pagamento: {
            forma: document.getElementById('formaPagamento').value
        },
        itens: itensAdicionados,
        valorTotal: document.getElementById('valorTotalPedido').value,
        observacoes: document.getElementById('observacoes').value,
        timestamp: new Date().toISOString()
    };
}

// Sistema de mensagens
function mostrarMensagem(texto, tipo = 'info') {
    const mensagensArea = document.getElementById('mensagens');
    const mensagem = document.createElement('div');
    mensagem.className = `message ${tipo}`;
    mensagem.textContent = texto;
    
    mensagensArea.appendChild(mensagem);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.parentNode.removeChild(mensagem);
        }
    }, 5000);
    
    // Scroll para a mensagem
    mensagem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Adicionar estilos CSS para validação
const style = document.createElement('style');
style.textContent = `
    .valid {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    }
    
    .invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
`;
document.head.appendChild(style);

