# Análise e Planejamento para Campos de Aluno

## 1. Requisitos do Usuário

O usuário solicitou as seguintes modificações para os campos relacionados ao aluno:

-   **Campo 'Sala do Aluno'**: Deve ser transformado em um combobox com funcionalidade de pesquisa parcial (search-as-you-type), similar aos campos de cliente e produto.
-   **Campo 'Nome completo do aluno'**: Deve ser transformado em um combobox com funcionalidade de pesquisa parcial (search-as-you-type), similar aos campos de cliente e produto.
-   **Campo 'Email escolar do aluno'**: Deve ser preenchido automaticamente com base na seleção do aluno e **não deve ser editável** pelo usuário.

## 2. Análise da Estrutura de Dados (B_Alunos.xlsx)

Embora eu não possa ler diretamente o conteúdo do arquivo `B_Alunos.xlsx`, o backend já está configurado para processar este arquivo. Com base na funcionalidade atual e nos requisitos, presume-se que o arquivo `B_Alunos.xlsx` contém, no mínimo, as seguintes colunas para cada aluno:

-   `Nome do Aluno` (ou similar)
-   `Sala do Aluno` (ou similar)
-   `Email do Aluno` (ou similar)

O backend já expõe endpoints para buscar dados de alunos, que serão utilizados pelos novos comboboxes:
-   `/api/excel/alunos` (para listar todos os alunos)
-   `/api/excel/alunos/buscar?nome=` (para buscar aluno por nome)

## 3. Planejamento da Implementação

### 3.1. Modificações no HTML (`index.html`)

-   **Campo 'Sala do Aluno'**: O `<input>` atual será substituído por uma estrutura de combobox (`<div class=

