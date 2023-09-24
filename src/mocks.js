const COMMITS_MOCK = {
  head: 14,
  commits: [
    {
      id: 1,
      message: "Primeiro commit",
      createdAt: "2023-09-19T10:00:00",
      branchId: "branch1",
    },
    {
      id: 2,
      message: "Adicionado arquivo de configuração",
      createdAt: "2023-09-20T14:30:00",
      branchId: "branch1",
    },
    {
      id: 3,
      message: "Correções de bugs no arquivo principal",
      createdAt: "2023-09-21T09:15:00",
      branchId: "branch1",
    },
    {
      id: 4,
      message: "Adicionada funcionalidade de login",
      createdAt: "2023-09-22T16:45:00",
      branchId: "branch1",
    },
    {
      id: 5,
      message: "Correção de estilo no arquivo de configuração",
      createdAt: "2023-09-22T17:30:00",
      branchId: "branch1",
    },
    {
      id: 6,
      message: "Adicionada funcionalidade de carrinho de compras",
      createdAt: "2023-09-23T11:20:00",
      branchId: "branch1",
    },
    {
      id: 7,
      message: "Primeiro commit da branch2",
      createdAt: "2023-09-20T11:00:00",
      branchId: "branch2",
    },
    {
      id: 8,
      message: "Correções na branch2",
      createdAt: "2023-09-21T14:45:00",
      branchId: "branch2",
    },
    {
      id: 9,
      message: "Funcionalidade adicional na branch2",
      createdAt: "2023-09-22T10:30:00",
      branchId: "branch2",
    },
    {
      id: 10,
      message: "Primeiro commit da branch3",
      createdAt: "2023-09-23T09:30:00",
      branchId: "branch3",
    },
    {
      id: 11,
      message: "Adicionado arquivo de configuração na branch3",
      createdAt: "2023-09-23T14:00:00",
      branchId: "branch3",
    },
    {
      id: 12,
      message: "Correções na branch3",
      createdAt: "2023-09-24T11:15:00",
      branchId: "branch3",
    },
    {
      id: 13,
      message: "Funcionalidade de pagamento na branch3",
      createdAt: "2023-09-25T15:30:00",
      branchId: "branch3",
    },
    {
      id: 14,
      message: "Funcionalidade de envio na branch3",
      createdAt: "2023-09-26T16:45:00",
      branchId: "branch3",
    },
  ],
};

module.exports = {
  COMMITS_MOCK,
};
