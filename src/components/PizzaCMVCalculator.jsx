import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, ChefHat, Package, Cookie, Edit3, Save, AlertCircle, CheckCircle } from 'lucide-react';

const PizzaCMVCalculator = () => {
  const [ingredientes, setIngredientes] = useState([
    { id: 1, nome: 'Farinha de Trigo', custo: 4.50, unidade: 'kg' },
    { id: 2, nome: 'Açúcar', custo: 3.20, unidade: 'kg' },
    { id: 3, nome: 'Sal', custo: 2.80, unidade: 'kg' },
    { id: 4, nome: 'Óleo', custo: 5.50, unidade: 'kg' },
    { id: 5, nome: 'Fermento', custo: 12.00, unidade: 'kg' },
    { id: 6, nome: 'Molho de Tomate', custo: 8.00, unidade: 'kg' },
    { id: 7, nome: 'Mussarela', custo: 25.00, unidade: 'kg' },
    { id: 8, nome: 'Presunto', custo: 18.50, unidade: 'kg' },
    { id: 9, nome: 'Calabresa', custo: 16.20, unidade: 'kg' }
  ]);

  const [massas, setMassas] = useState([
    {
      id: 1,
      nome: 'Massa Tradicional',
      ingredientes: [
        { ingredienteId: 1, quantidade: 0.5 }, // 500g farinha
        { ingredienteId: 2, quantidade: 0.02 }, // 20g açúcar
        { ingredienteId: 3, quantidade: 0.01 }, // 10g sal
        { ingredienteId: 4, quantidade: 0.03 }, // 30ml óleo
        { ingredienteId: 5, quantidade: 0.01 }  // 10g fermento
      ],
      rendimento: 1 // kg de massa
    }
  ]);

  const [pizzas, setPizzas] = useState([
    {
      id: 1,
      nome: 'Margherita',
      massaId: 1,
      gramamassa: { medio: 280, grande: 380, familia: 450 },
      ingredientes: [
        { ingredienteId: 6, quantidade: { medio: 0.08, grande: 0.1, familia: 0.13 } }, // molho
        { ingredienteId: 7, quantidade: { medio: 0.12, grande: 0.15, familia: 0.2 } } // mussarela
      ]
    }
  ]);

  const [novoIngrediente, setNovoIngrediente] = useState({ nome: '', custo: '', unidade: 'kg' });
  const [novaMassa, setNovaMassa] = useState({ nome: '', ingredientes: [], rendimento: 1 });
  const [novaPizza, setNovaPizza] = useState({ 
    nome: '', 
    massaId: '', 
    gramamassa: { medio: 280, grande: 380, familia: 450 },
    ingredientes: [] 
  });
  const [abaSelecionada, setAbaSelecionada] = useState('ingredientes');
  const [editandoMassa, setEditandoMassa] = useState(null);
  const [editandoPizza, setEditandoPizza] = useState(null);
  const [notificacao, setNotificacao] = useState({ tipo: '', mensagem: '', visivel: false });

  const tamanhos = {
    medio: { nome: 'Médio (30cm)', fator: 1 },
    grande: { nome: 'Grande (35cm)', fator: 1.36 },
    familia: { nome: 'Família (40cm)', fator: 1.78 }
  };

  // Persistência de dados com localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('calculadora-cmv-dados');
    if (dadosSalvos) {
      try {
        const { ingredientes: ing, massas: mas, pizzas: piz } = JSON.parse(dadosSalvos);
        if (ing && ing.length > 0) setIngredientes(ing);
        if (mas && mas.length > 0) setMassas(mas);
        if (piz && piz.length > 0) setPizzas(piz);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dados = { ingredientes, massas, pizzas };
    localStorage.setItem('calculadora-cmv-dados', JSON.stringify(dados));
  }, [ingredientes, massas, pizzas]);

  // Função para mostrar notificações
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ tipo, mensagem, visivel: true });
    setTimeout(() => {
      setNotificacao({ tipo: '', mensagem: '', visivel: false });
    }, 3000);
  };

  // Função para calcular custo de ingrediente por quantidade
  const calcularCustoIngrediente = (ingredienteId, quantidade) => {
    const ingrediente = ingredientes.find(i => i.id === ingredienteId);
    return ingrediente ? ingrediente.custo * quantidade : 0;
  };

  // Função para calcular apenas o custo da massa por pizza
  const calcularCustoMassaPorPizza = (pizza, tamanho) => {
    const massa = massas.find(m => m.id === pizza.massaId);
    const custoMassaPorKg = massa ? calcularCustoMassa(massa) : 0;
    return custoMassaPorKg * (pizza.gramamassa[tamanho] / 1000);
  };

  const adicionarIngrediente = () => {
    if (!novoIngrediente.nome.trim()) {
      mostrarNotificacao('erro', 'Nome do ingrediente é obrigatório');
      return;
    }
    if (!novoIngrediente.custo || parseFloat(novoIngrediente.custo) <= 0) {
      mostrarNotificacao('erro', 'Custo deve ser maior que zero');
      return;
    }
    if (!novoIngrediente.unidade.trim()) {
      mostrarNotificacao('erro', 'Unidade é obrigatória');
      return;
    }
    
    const novoId = Math.max(...ingredientes.map(i => i.id), 0) + 1;
    setIngredientes([...ingredientes, {
      id: novoId,
      nome: novoIngrediente.nome.trim(),
      custo: parseFloat(novoIngrediente.custo),
      unidade: novoIngrediente.unidade.trim()
    }]);
    setNovoIngrediente({ nome: '', custo: '', unidade: 'kg' });
    mostrarNotificacao('sucesso', 'Ingrediente adicionado com sucesso!');
  };

  const removerIngrediente = (id) => {
    if (window.confirm('Tem certeza que deseja remover este ingrediente?')) {
      setIngredientes(ingredientes.filter(i => i.id !== id));
      mostrarNotificacao('sucesso', 'Ingrediente removido com sucesso!');
    }
  };

  // Funções para massa
  const adicionarIngredienteNaMassa = () => {
    setNovaMassa({
      ...novaMassa,
      ingredientes: [...novaMassa.ingredientes, { ingredienteId: '', quantidade: 0 }]
    });
  };

  const atualizarIngredienteMassa = (index, campo, valor) => {
    const novosIngredientes = [...novaMassa.ingredientes];
    if (campo === 'ingredienteId') {
      novosIngredientes[index].ingredienteId = parseInt(valor);
    } else {
      novosIngredientes[index].quantidade = parseFloat(valor) || 0;
    }
    setNovaMassa({ ...novaMassa, ingredientes: novosIngredientes });
  };

  const removerIngredienteMassa = (index) => {
    const novosIngredientes = novaMassa.ingredientes.filter((_, i) => i !== index);
    setNovaMassa({ ...novaMassa, ingredientes: novosIngredientes });
  };

  const salvarMassa = () => {
    if (!novaMassa.nome.trim()) {
      mostrarNotificacao('erro', 'Nome da massa é obrigatório');
      return;
    }
    if (novaMassa.ingredientes.length === 0) {
      mostrarNotificacao('erro', 'Adicione pelo menos um ingrediente');
      return;
    }
    if (novaMassa.rendimento <= 0) {
      mostrarNotificacao('erro', 'Rendimento deve ser maior que zero');
      return;
    }
    
    if (editandoMassa) {
      setMassas(massas.map(m => m.id === editandoMassa.id ? { ...novaMassa, id: editandoMassa.id } : m));
      setEditandoMassa(null);
      mostrarNotificacao('sucesso', 'Massa atualizada com sucesso!');
    } else {
      const novoId = Math.max(...massas.map(m => m.id), 0) + 1;
      setMassas([...massas, { ...novaMassa, id: novoId }]);
      mostrarNotificacao('sucesso', 'Massa criada com sucesso!');
    }
    setNovaMassa({ nome: '', ingredientes: [], rendimento: 1 });
  };

  const editarMassa = (massa) => {
    setNovaMassa({
      nome: massa.nome,
      ingredientes: [...massa.ingredientes],
      rendimento: massa.rendimento
    });
    setEditandoMassa(massa);
  };

  const cancelarEdicao = () => {
    setEditandoMassa(null);
    setNovaMassa({ nome: '', ingredientes: [], rendimento: 1 });
  };

  const removerMassa = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta massa? Esta ação não pode ser desfeita.')) {
      setMassas(massas.filter(m => m.id !== id));
      if (editandoMassa && editandoMassa.id === id) {
        cancelarEdicao();
      }
      mostrarNotificacao('sucesso', 'Massa removida com sucesso!');
    }
  };

  const calcularCustoMassa = (massa) => {
    const custoTotal = massa.ingredientes.reduce((total, item) => {
      const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
      return ingrediente ? total + (ingrediente.custo * item.quantidade) : total;
    }, 0);
    return custoTotal / massa.rendimento;
  };

  const adicionarIngredienteNaPizza = () => {
    setNovaPizza({
      ...novaPizza,
      ingredientes: [...novaPizza.ingredientes, {
        ingredienteId: '',
        quantidade: { medio: 0, grande: 0, familia: 0 }
      }]
    });
  };

  const atualizarIngredientePizza = (index, campo, valor) => {
    const novosIngredientes = [...novaPizza.ingredientes];
    if (campo === 'ingredienteId') {
      novosIngredientes[index].ingredienteId = parseInt(valor);
    } else {
      novosIngredientes[index].quantidade[campo] = parseFloat(valor) || 0;
    }
    setNovaPizza({ ...novaPizza, ingredientes: novosIngredientes });
  };

  const atualizarGramaMassa = (tamanho, valor) => {
    setNovaPizza({
      ...novaPizza,
      gramamassa: {
        ...novaPizza.gramamassa,
        [tamanho]: parseFloat(valor) || 0
      }
    });
  };

  const removerIngredientePizza = (index) => {
    const novosIngredientes = novaPizza.ingredientes.filter((_, i) => i !== index);
    setNovaPizza({ ...novaPizza, ingredientes: novosIngredientes });
  };

  const salvarPizza = () => {
    if (!novaPizza.nome.trim()) {
      mostrarNotificacao('erro', 'Nome da pizza é obrigatório');
      return;
    }
    if (!novaPizza.massaId) {
      mostrarNotificacao('erro', 'Selecione uma massa');
      return;
    }
    if (novaPizza.ingredientes.length === 0) {
      mostrarNotificacao('erro', 'Adicione pelo menos um ingrediente');
      return;
    }
    
    if (editandoPizza) {
      setPizzas(pizzas.map(p => p.id === editandoPizza.id ? { ...novaPizza, id: editandoPizza.id } : p));
      setEditandoPizza(null);
      mostrarNotificacao('sucesso', 'Pizza atualizada com sucesso!');
    } else {
      const novoId = Math.max(...pizzas.map(p => p.id), 0) + 1;
      setPizzas([...pizzas, { ...novaPizza, id: novoId }]);
      mostrarNotificacao('sucesso', 'Pizza criada com sucesso!');
    }
    setNovaPizza({ 
      nome: '', 
      massaId: '', 
      gramamassa: { medio: 0, grande: 0, familia: 0 },
      ingredientes: [] 
    });
  };

  const calcularCMVPizza = (pizza, tamanho) => {
    // Custo da massa
    const massa = massas.find(m => m.id === pizza.massaId);
    const custoMassaPorKg = massa ? calcularCustoMassa(massa) : 0;
    const custoMassa = custoMassaPorKg * (pizza.gramamassa[tamanho] / 1000);
    
    // Custo dos outros ingredientes
    const custoIngredientes = pizza.ingredientes.reduce((total, item) => {
      const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
      if (ingrediente) {
        return total + (ingrediente.custo * item.quantidade[tamanho]);
      }
      return total;
    }, 0);

    return custoMassa + custoIngredientes;
  };

  const editarPizza = (pizza) => {
    setNovaPizza({
      nome: pizza.nome,
      massaId: pizza.massaId,
      gramamassa: { ...pizza.gramamassa },
      ingredientes: [...pizza.ingredientes]
    });
    setEditandoPizza(pizza);
    setAbaSelecionada('nova-pizza');
  };

  const cancelarEdicaoPizza = () => {
    setEditandoPizza(null);
    setNovaPizza({ 
      nome: '', 
      massaId: '', 
      gramamassa: { medio: 0, grande: 0, familia: 0 },
      ingredientes: [] 
    });
  };

  const removerPizza = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta pizza?')) {
      setPizzas(pizzas.filter(p => p.id !== id));
      mostrarNotificacao('sucesso', 'Pizza removida com sucesso!');
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Notificação */}
        {notificacao.visivel && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notificacao.tipo === 'sucesso' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notificacao.tipo === 'sucesso' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notificacao.mensagem}
          </div>
        )}

        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="text-orange-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Calculadora de CMV - Pizzaria</h1>
          </div>
          <p className="text-gray-600">Gerencie ingredientes, massas e calcule o custo das suas pizzas</p>
        </header>

        <nav className="flex space-x-1 mb-6 overflow-x-auto">
          {[
            { id: 'ingredientes', nome: 'Ingredientes', icon: Package },
            { id: 'massa', nome: 'Massa', icon: Cookie },
            { id: 'pizzas', nome: 'Pizzas', icon: ChefHat },
            { id: 'nova-pizza', nome: editandoPizza ? 'Editar Pizza' : 'Nova Pizza', icon: Plus },
            { id: 'relatorio', nome: 'Relatório', icon: Calculator }
          ].map(({ id, nome, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaSelecionada(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                abaSelecionada === id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              <Icon size={18} />
              {nome}
            </button>
          ))}
        </nav>

        {abaSelecionada === 'ingredientes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Ingrediente</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nome do ingrediente"
                  value={novoIngrediente.nome}
                  onChange={(e) => setNovoIngrediente({...novoIngrediente, nome: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Custo (R$)"
                  value={novoIngrediente.custo}
                  onChange={(e) => setNovoIngrediente({...novoIngrediente, custo: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Unidade (ex: kg, litro, unidade)"
                  value={novoIngrediente.unidade}
                  onChange={(e) => setNovoIngrediente({...novoIngrediente, unidade: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={adicionarIngrediente}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Ingredientes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Ingrediente</th>
                      <th className="text-left py-3 px-4">Custo</th>
                      <th className="text-left py-3 px-4">Unidade</th>
                      <th className="text-center py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientes.map((ingrediente) => (
                      <tr key={ingrediente.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{ingrediente.nome}</td>
                        <td className="py-3 px-4">{formatarMoeda(ingrediente.custo)}</td>
                        <td className="py-3 px-4">{ingrediente.unidade}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => removerIngrediente(ingrediente.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'massa' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editandoMassa ? 'Editar Receita de Massa' : 'Criar Nova Receita de Massa'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Massa</label>
                  <input
                    type="text"
                    value={novaMassa.nome}
                    onChange={(e) => setNovaMassa({...novaMassa, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Massa Tradicional, Massa Integral..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rendimento (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={novaMassa.rendimento}
                    onChange={(e) => setNovaMassa({...novaMassa, rendimento: parseFloat(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Ingredientes da Massa</h3>
                  <button
                    onClick={adicionarIngredienteNaMassa}
                    className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Ingrediente
                  </button>
                </div>

                <div className="space-y-4">
                  {novaMassa.ingredientes.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ingrediente</label>
                          <select
                            value={item.ingredienteId}
                            onChange={(e) => atualizarIngredienteMassa(index, 'ingredienteId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Selecione...</option>
                            {ingredientes.map((ing) => (
                              <option key={ing.id} value={ing.id}>{ing.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (kg)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.quantidade}
                            onChange={(e) => atualizarIngredienteMassa(index, 'quantidade', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Custo</label>
                          <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                            {item.ingredienteId ? formatarMoeda(calcularCustoIngrediente(item.ingredienteId, item.quantidade)) : 'R$ 0,00'}
                          </div>
                        </div>
                        <button
                          onClick={() => removerIngredienteMassa(index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={salvarMassa}
                  disabled={!novaMassa.nome || novaMassa.ingredientes.length === 0}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editandoMassa ? 'Atualizar Receita' : 'Salvar Receita de Massa'}
                </button>
                {editandoMassa && (
                  <button
                    onClick={cancelarEdicao}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Receitas de Massa Cadastradas</h2>
              <div className="space-y-4">
                {massas.map((massa) => (
                  <div key={massa.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-800">{massa.nome}</h3>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Custo por kg</p>
                          <p className="text-xl font-bold text-orange-600">{formatarMoeda(calcularCustoMassa(massa))}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editarMassa(massa)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Editar massa"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => removerMassa(massa.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remover massa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</p>
                        <div className="space-y-1">
                          {massa.ingredientes.map((item, index) => {
                            const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
                            const custoIngrediente = calcularCustoIngrediente(item.ingredienteId, item.quantidade);
                            return ingrediente ? (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{ingrediente.nome}</span>
                                <div className="text-right">
                                  <span className="text-gray-600">{(item.quantidade * 1000).toFixed(0)}g</span>
                                  <span className="text-orange-600 font-medium ml-2">{formatarMoeda(custoIngrediente)}</span>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Rendimento: {massa.rendimento}kg</p>
                        <p className="text-sm text-gray-600">
                          Custo total: {formatarMoeda(massa.ingredientes.reduce((total, item) => {
                            return total + calcularCustoIngrediente(item.ingredienteId, item.quantidade);
                          }, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'nova-pizza' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editandoPizza ? 'Editar Pizza' : 'Criar Nova Pizza'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Pizza</label>
                <input
                  type="text"
                  value={novaPizza.nome}
                  onChange={(e) => setNovaPizza({...novaPizza, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Margherita, Calabresa..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Massa</label>
                <select
                  value={novaPizza.massaId}
                  onChange={(e) => setNovaPizza({...novaPizza, massaId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione uma massa...</option>
                  {massas.map((massa) => (
                    <option key={massa.id} value={massa.id}>{massa.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Quantidade de Massa por Tamanho (gramas)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pizza Média (30cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={novaPizza.gramamassa.medio}
                    onChange={(e) => atualizarGramaMassa('medio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="280"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pizza Grande (35cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={novaPizza.gramamassa.grande}
                    onChange={(e) => atualizarGramaMassa('grande', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="380"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pizza Família (40cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={novaPizza.gramamassa.familia}
                    onChange={(e) => atualizarGramaMassa('familia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="450"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Outros Ingredientes</h3>
                <button
                  onClick={adicionarIngredienteNaPizza}
                  className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar Ingrediente
                </button>
              </div>

              <div className="space-y-4">
                {novaPizza.ingredientes.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingrediente</label>
                        <select
                          value={item.ingredienteId}
                          onChange={(e) => atualizarIngredientePizza(index, 'ingredienteId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Selecione...</option>
                          {ingredientes.filter(ing => ing.id > 5).map((ing) => (
                            <option key={ing.id} value={ing.id}>{ing.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Médio (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantidade.medio}
                          onChange={(e) => atualizarIngredientePizza(index, 'medio', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Grande (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantidade.grande}
                          onChange={(e) => atualizarIngredientePizza(index, 'grande', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Família (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantidade.familia}
                          onChange={(e) => atualizarIngredientePizza(index, 'familia', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <button
                        onClick={() => removerIngredientePizza(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={salvarPizza}
                disabled={!novaPizza.nome || !novaPizza.massaId || novaPizza.ingredientes.length === 0}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {editandoPizza ? 'Atualizar Pizza' : 'Salvar Pizza'}
              </button>
              {editandoPizza && (
                <button
                  onClick={cancelarEdicaoPizza}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        {abaSelecionada === 'pizzas' && (
          <div className="space-y-6">
            {pizzas.map((pizza) => {
              const massa = massas.find(m => m.id === pizza.massaId);
              return (
                <div key={pizza.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{pizza.nome}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarPizza(pizza)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Editar pizza"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => removerPizza(pizza.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Remover pizza"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(tamanhos).map(([tamanho, info]) => {
                      const custoMassa = calcularCustoMassaPorPizza(pizza, tamanho);
                      const cmvTotal = calcularCMVPizza(pizza, tamanho);
                      const custoIngredientes = cmvTotal - custoMassa;
                      
                      return (
                        <div key={tamanho} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-2">{info.nome}</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-2xl font-bold text-orange-600">
                                {formatarMoeda(cmvTotal)}
                              </p>
                              <p className="text-sm text-gray-600">CMV Total</p>
                            </div>
                            <div className="border-t pt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Massa ({pizza.gramamassa[tamanho]}g):</span>
                                <span className="font-medium text-blue-600">{formatarMoeda(custoMassa)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Ingredientes:</span>
                                <span className="font-medium text-green-600">{formatarMoeda(custoIngredientes)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Massa Utilizada:</h4>
                        <p className="text-sm text-gray-600">{massa ? massa.nome : 'Massa não encontrada'}</p>
                        <p className="text-xs text-gray-500">
                          Custo por kg: {massa ? formatarMoeda(calcularCustoMassa(massa)) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Outros Ingredientes:</h4>
                        <div className="space-y-2">
                          {pizza.ingredientes.map((item, index) => {
                            const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
                            return ingrediente ? (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>{ingrediente.nome}</span>
                                <span className="text-gray-600">
                                  M: {(item.quantidade.medio * 1000).toFixed(0)}g | 
                                  G: {(item.quantidade.grande * 1000).toFixed(0)}g | 
                                  F: {(item.quantidade.familia * 1000).toFixed(0)}g
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {abaSelecionada === 'relatorio' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Relatório de CMV</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pizza</th>
                    <th className="text-center py-3 px-4">Médio (30cm)</th>
                    <th className="text-center py-3 px-4">Grande (35cm)</th>
                    <th className="text-center py-3 px-4">Família (40cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {pizzas.map((pizza) => (
                    <tr key={pizza.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{pizza.nome}</td>
                      <td className="py-3 px-4 text-center font-semibold text-orange-600">
                        {formatarMoeda(calcularCMVPizza(pizza, 'medio'))}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-orange-600">
                        {formatarMoeda(calcularCMVPizza(pizza, 'grande'))}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-orange-600">
                        {formatarMoeda(calcularCMVPizza(pizza, 'familia'))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pizzas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Análise Detalhada por Tamanho</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(tamanhos).map(([tamanho, info]) => {
                    const custoMedio = pizzas.reduce((acc, pizza) => acc + calcularCMVPizza(pizza, tamanho), 0) / pizzas.length;
                    const custoMinimo = Math.min(...pizzas.map(pizza => calcularCMVPizza(pizza, tamanho)));
                    const custoMaximo = Math.max(...pizzas.map(pizza => calcularCMVPizza(pizza, tamanho)));
                    
                    return (
                      <div key={tamanho} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-3">{info.nome}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>CMV Médio:</span>
                            <span className="font-semibold text-orange-600">{formatarMoeda(custoMedio)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Menor CMV:</span>
                            <span className="font-semibold text-green-600">{formatarMoeda(custoMinimo)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maior CMV:</span>
                            <span className="font-semibold text-red-600">{formatarMoeda(custoMaximo)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaCMVCalculator;