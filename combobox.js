/**
 * Combobox com Pesquisa Parcial
 * Módulo para transformar campos de seleção em comboboxes com funcionalidade de pesquisa
 */

class ComboboxManager {
    constructor() {
        this.instances = new Map();
        this.activeCombobox = null;
        this.setupGlobalListeners();
    }

    /**
     * Cria uma nova instância de combobox
     * @param {string} containerId - ID do container do combobox
     * @param {Array} data - Array de dados para popular o combobox
     * @param {Object} options - Opções de configuração
     */
    create(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} não encontrado`);
            return null;
        }

        const config = {
            searchProperty: 'nome', // Propriedade a ser pesquisada
            displayProperty: 'nome', // Propriedade a ser exibida
            placeholder: 'Digite para pesquisar...',
            noResultsText: 'Nenhum resultado encontrado',
            maxResults: 10,
            minSearchLength: 1,
            highlightMatch: true,
            allowCustomValue: true,
            onSelect: null,
            onInput: null,
            ...options
        };

        const instance = new ComboboxInstance(container, data, config);
        this.instances.set(containerId, instance);
        return instance;
    }

    /**
     * Atualiza os dados de um combobox existente
     */
    updateData(containerId, newData) {
        const instance = this.instances.get(containerId);
        if (instance) {
            instance.updateData(newData);
        }
    }

    /**
     * Remove um combobox
     */
    destroy(containerId) {
        const instance = this.instances.get(containerId);
        if (instance) {
            instance.destroy();
            this.instances.delete(containerId);
        }
    }

    /**
     * Configura listeners globais
     */
    setupGlobalListeners() {
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.activeCombobox && !this.activeCombobox.container.contains(e.target)) {
                this.activeCombobox.closeDropdown();
                this.activeCombobox = null;
            }
        });

        // Fechar dropdown com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeCombobox) {
                this.activeCombobox.closeDropdown();
                this.activeCombobox.input.focus();
                this.activeCombobox = null;
            }
        });
    }

    /**
     * Define o combobox ativo
     */
    setActive(instance) {
        if (this.activeCombobox && this.activeCombobox !== instance) {
            this.activeCombobox.closeDropdown();
        }
        this.activeCombobox = instance;
    }
}

class ComboboxInstance {
    constructor(container, data, config) {
        this.container = container;
        this.data = data || [];
        this.config = config;
        this.filteredData = [...this.data];
        this.selectedIndex = -1;
        this.isOpen = false;
        
        this.input = container.querySelector('.combobox-input');
        this.toggle = container.querySelector('.combobox-toggle');
        this.dropdown = container.querySelector('.combobox-dropdown');
        
        if (!this.input || !this.toggle || !this.dropdown) {
            console.error('Elementos do combobox não encontrados');
            return;
        }

        this.setupEventListeners();
        this.populateDropdown();
    }

    setupEventListeners() {
        // Input - pesquisa em tempo real
        this.input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        // Input - navegação por teclado
        this.input.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Input - foco
        this.input.addEventListener('focus', () => {
            this.openDropdown();
            window.comboboxManager.setActive(this);
        });

        // Toggle - mostrar/esconder dropdown
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.isOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
                this.input.focus();
            }
            
            window.comboboxManager.setActive(this);
        });

        // Dropdown - seleção por clique
        this.dropdown.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li && !li.classList.contains('no-results')) {
                const index = Array.from(this.dropdown.children).indexOf(li);
                this.selectItem(index);
            }
        });
    }

    handleInput(value) {
        this.filterData(value);
        this.populateDropdown();
        this.openDropdown();
        this.selectedIndex = -1;

        // Callback personalizado
        if (this.config.onInput) {
            this.config.onInput(value, this.filteredData);
        }
    }

    handleKeydown(e) {
        if (!this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            this.openDropdown();
            return;
        }

        if (!this.isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateUp();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectItem(this.selectedIndex);
                } else if (this.filteredData.length > 0) {
                    this.selectItem(0);
                }
                break;
            case 'Tab':
                this.closeDropdown();
                break;
        }
    }

    filterData(searchTerm) {
        if (!searchTerm || searchTerm.length < this.config.minSearchLength) {
            this.filteredData = [...this.data];
            return;
        }

        const term = searchTerm.toLowerCase().trim();
        this.filteredData = this.data.filter(item => {
            const searchValue = item[this.config.searchProperty];
            if (!searchValue) return false;
            
            return searchValue.toLowerCase().includes(term);
        });

        // Ordenar por relevância (correspondências no início primeiro)
        this.filteredData.sort((a, b) => {
            const aValue = a[this.config.searchProperty].toLowerCase();
            const bValue = b[this.config.searchProperty].toLowerCase();
            
            const aStartsWith = aValue.startsWith(term);
            const bStartsWith = bValue.startsWith(term);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            return aValue.localeCompare(bValue);
        });

        // Limitar resultados
        if (this.config.maxResults > 0) {
            this.filteredData = this.filteredData.slice(0, this.config.maxResults);
        }
    }

    populateDropdown() {
        this.dropdown.innerHTML = '';

        if (this.filteredData.length === 0) {
            const li = document.createElement('li');
            li.className = 'no-results';
            li.textContent = this.config.noResultsText;
            this.dropdown.appendChild(li);
            return;
        }

        this.filteredData.forEach((item, index) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.setAttribute('data-index', index);
            
            let displayText = item[this.config.displayProperty] || '';
            
            // Destacar termo pesquisado
            if (this.config.highlightMatch && this.input.value.trim()) {
                displayText = this.highlightMatch(displayText, this.input.value.trim());
            }
            
            li.innerHTML = displayText;
            this.dropdown.appendChild(li);
        });
    }

    highlightMatch(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    navigateDown() {
        const maxIndex = this.filteredData.length - 1;
        this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
        this.updateHighlight();
    }

    navigateUp() {
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateHighlight();
    }

    updateHighlight() {
        // Remover highlight anterior
        this.dropdown.querySelectorAll('li').forEach(li => {
            li.classList.remove('highlighted');
        });

        // Adicionar highlight atual
        if (this.selectedIndex >= 0) {
            const items = this.dropdown.querySelectorAll('li:not(.no-results)');
            if (items[this.selectedIndex]) {
                items[this.selectedIndex].classList.add('highlighted');
                items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }

    selectItem(index) {
        if (index < 0 || index >= this.filteredData.length) return;

        const selectedItem = this.filteredData[index];
        const displayValue = selectedItem[this.config.displayProperty];
        
        this.input.value = displayValue;
        this.closeDropdown();
        
        // Marcar como válido
        this.container.classList.add('valid');
        this.container.classList.remove('invalid');

        // Callback personalizado
        if (this.config.onSelect) {
            this.config.onSelect(selectedItem, index);
        }

        // Disparar evento de mudança
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    openDropdown() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.dropdown.classList.add('show');
        this.dropdown.setAttribute('aria-hidden', 'false');
        this.container.classList.add('open');
        
        // Reset seleção
        this.selectedIndex = -1;
        this.updateHighlight();
    }

    closeDropdown() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.dropdown.classList.remove('show');
        this.dropdown.setAttribute('aria-hidden', 'true');
        this.container.classList.remove('open');
        this.selectedIndex = -1;
    }

    updateData(newData) {
        this.data = newData || [];
        this.filteredData = [...this.data];
        this.populateDropdown();
    }

    getValue() {
        return this.input.value;
    }

    setValue(value) {
        this.input.value = value;
        
        // Verificar se o valor existe nos dados
        const exists = this.data.some(item => 
            item[this.config.displayProperty] === value
        );
        
        if (exists) {
            this.container.classList.add('valid');
            this.container.classList.remove('invalid');
        } else if (this.config.allowCustomValue) {
            this.container.classList.remove('valid', 'invalid');
        } else {
            this.container.classList.add('invalid');
            this.container.classList.remove('valid');
        }
    }

    clear() {
        this.input.value = '';
        this.filteredData = [...this.data];
        this.populateDropdown();
        this.closeDropdown();
        this.container.classList.remove('valid', 'invalid');
    }

    destroy() {
        // Remover event listeners seria ideal, mas como estamos usando
        // addEventListener sem referência, vamos apenas limpar o DOM
        this.closeDropdown();
    }
}

// Inicializar gerenciador global
window.comboboxManager = new ComboboxManager();

// Utilitários para integração com o formulário existente
window.ComboboxUtils = {
    /**
     * Cria combobox para clientes
     */
    createClienteCombobox(clientes) {
        return window.comboboxManager.create('clienteCombobox', clientes, {
            searchProperty: 'nome',
            displayProperty: 'nome',
            placeholder: 'Digite para pesquisar cliente...',
            onSelect: (cliente) => {
                // Integração com função existente
                if (window.buscarEPreencherCliente) {
                    window.buscarEPreencherCliente(cliente.nome);
                }
            }
        });
    },

    /**
     * Cria combobox para lojas
     */
    createLojaCombobox(lojas) {
        return window.comboboxManager.create('lojaCombobox', lojas, {
            searchProperty: 'nome',
            displayProperty: 'nome',
            placeholder: 'Digite para pesquisar loja...'
        });
    },

    /**
     * Cria combobox para produtos (usado em itens)
     */
    createProdutoCombobox(container, produtos) {
        const containerId = container.id || `produto-${Date.now()}`;
        container.id = containerId;
        
        return window.comboboxManager.create(containerId, produtos, {
            searchProperty: 'nome',
            displayProperty: 'nome',
            placeholder: 'Digite para pesquisar produto...',
            onSelect: (produto) => {
                // Preencher campos relacionados (peso, preço)
                const itemContainer = container.closest('.item-pedido');
                if (itemContainer) {
                    const pesoInput = itemContainer.querySelector('.peso-input');
                    const precoInput = itemContainer.querySelector('.preco-input');
                    
                    if (pesoInput && produto.peso) {
                        pesoInput.value = produto.peso;
                    }
                    if (precoInput && produto.preco) {
                        precoInput.value = `R$ ${produto.preco.toFixed(2)}`;
                    }
                    
                    // Recalcular valor total do item
                    const quantidadeInput = itemContainer.querySelector('.quantidade-input');
                    if (quantidadeInput && quantidadeInput.value) {
                        const quantidade = parseInt(quantidadeInput.value);
                        const valorTotal = quantidade * produto.preco;
                        const valorTotalInput = itemContainer.querySelector('.valor-total-item');
                        if (valorTotalInput) {
                            valorTotalInput.value = `R$ ${valorTotal.toFixed(2)}`;
                        }
                        
                        // Atualizar valor total do pedido
                        if (window.calcularValorTotal) {
                            window.calcularValorTotal();
                        }
                    }
                }
            }
        });
    }
};



    /**
     * Cria combobox para salas de aluno
     */
    createSalaAlunoCombobox(salas) {
        return window.comboboxManager.create("salaAlunoCombobox", salas, {
            searchProperty: "sala",
            displayProperty: "sala",
            placeholder: "Digite para pesquisar sala...",
            allowCustomValue: false,
            onSelect: (sala) => {
                // Pode adicionar lógica de preenchimento automático aqui se necessário
            }
        });
    },

    /**
     * Cria combobox para nomes de aluno
     */
    createNomeAlunoCombobox(alunos) {
        return window.comboboxManager.create("nomeAlunoCombobox", alunos, {
            searchProperty: "nome",
            displayProperty: "nome",
            placeholder: "Digite para pesquisar aluno...",
            allowCustomValue: false,
            onSelect: (aluno) => {
                const emailAlunoInput = document.getElementById("emailAluno");
                if (emailAlunoInput) {
                    emailAlunoInput.value = aluno.email || "";
                }
            }
        });
    }


