CREATE TABLE TABELA_NUTRICAO (
    IDAlimento NUMBER PRIMARY KEY,
    NomeAlimento VARCHAR2(100),
    Categoria VARCHAR2(50),
    Calorias NUMBER,
    Proteinas NUMBER,
    Carboidratos NUMBER,
    Gorduras NUMBER,
    FibraAlimentar NUMBER,
    Açúcares NUMBER,
    DataCadastro DATE
);
