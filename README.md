# 🍕 Calculadora de CMV - Pizzaria

Uma aplicação web moderna para calcular o Custo da Mercadoria Vendida (CMV) de pizzas, desenvolvida em React.

## ✨ Funcionalidades

- **📦 Gestão de Ingredientes**: Adicione, edite e remova ingredientes com custos por unidade
- **🍞 Receitas de Massa**: Crie receitas personalizadas de massa com múltiplos ingredientes
- **🍕 Criação de Pizzas**: Configure pizzas com diferentes tamanhos (Médio, Grande, Família)
- **💰 Cálculo Automático**: CMV calculado automaticamente para cada tamanho de pizza
- **💾 Persistência de Dados**: Todos os dados são salvos automaticamente no navegador
- **📊 Relatórios**: Visualize relatórios detalhados de custos
- **✏️ Edição Completa**: Edite ingredientes, massas e pizzas facilmente

## 🚀 Tecnologias

- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **localStorage** - Persistência de dados

## 📱 Como Usar

1. **Adicione Ingredientes**: Configure os ingredientes com seus custos por unidade
2. **Crie Receitas de Massa**: Defina as receitas com os ingredientes necessários
3. **Configure Pizzas**: Crie pizzas com massas e ingredientes específicos
4. **Visualize CMV**: Veja o custo calculado para cada tamanho de pizza
5. **Gere Relatórios**: Acesse relatórios detalhados de custos

## 🛠️ Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/calculadora-cmv-pizzaria.git

# Entre no diretório
cd calculadora-cmv-pizzaria

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

## 🌐 Deploy

O projeto está configurado para deploy no EasyPanel com Docker.

### Arquivos de Deploy:
- `dockerfile.txt` - Configuração do Docker
- `nginx.conf.txt` - Configuração do Nginx

## 📋 Estrutura do Projeto

```
src/
├── components/
│   └── PizzaCMVCalculator.jsx  # Componente principal
├── App.js                      # App principal
└── index.js                    # Ponto de entrada
```

## 🎯 Funcionalidades Principais

### Gestão de Ingredientes
- Adicionar ingredientes com nome, custo e unidade
- Validação de campos obrigatórios
- Remoção com confirmação

### Receitas de Massa
- Criação de receitas personalizadas
- Cálculo automático de custo por kg
- Edição e remoção de receitas

### Pizzas
- Configuração de pizzas com diferentes tamanhos
- Cálculo de CMV por tamanho
- Edição completa de pizzas existentes

### Persistência
- Dados salvos automaticamente no localStorage
- Carregamento automático ao abrir a aplicação
- Sincronização em tempo real

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar o gerenciamento de custos em pizzarias.
