-- Tabela de usuários
CREATE TABLE "user" (
    user_id              BIGSERIAL PRIMARY KEY,
    nome_completo        VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NOT NULL UNIQUE,
    cargo                VARCHAR(255),
    unidade_departamento VARCHAR(255),
    matricula            BIGINT,
    password             VARCHAR(255) NOT NULL,
    status               BOOLEAN DEFAULT TRUE
);

-- Tabela de experimentos
CREATE TABLE experimento (
    id                       BIGSERIAL PRIMARY KEY,
    user_id                  BIGINT NOT NULL,
    nome_experimento         VARCHAR(255) NOT NULL,
    unidade_gestora          VARCHAR(255) NOT NULL,
    proponente_nome          VARCHAR(255),
    proponente_matricula     VARCHAR(50),
    proponente_cgc           VARCHAR(50),
    desafio                  TEXT NOT NULL,
    descricao                TEXT NOT NULL,
    horizonte_inovacao       VARCHAR(100) NOT NULL,
    volume_impacto           VARCHAR(100) NOT NULL,
    hipoteses                TEXT,
    metricas_kpis            TEXT NOT NULL,
    baseline                 TEXT,
    resultados_esperados     TEXT,
    data_inicio              DATE,
    data_fim                 DATE,
    termos_recursos_unidade  BOOLEAN DEFAULT FALSE,
    termos_registro_perdas   BOOLEAN DEFAULT FALSE,
    termos_notificacao_geina BOOLEAN DEFAULT FALSE,
    termos_relatorios        BOOLEAN DEFAULT FALSE,
    aceito_termos            BOOLEAN NOT NULL,
    local_assinatura         VARCHAR(255),
    data_assinatura          DATE,
    gestor_unidade           VARCHAR(255),
    CONSTRAINT fk_experimento_user FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- Tabela de membros do time do experimento
CREATE TABLE time_experimento (
    id             BIGSERIAL PRIMARY KEY,
    experimento_id BIGINT NOT NULL,
    nome           VARCHAR(255),
    matricula      VARCHAR(50),
    CONSTRAINT fk_time_experimento FOREIGN KEY (experimento_id) REFERENCES experimento(id)
);

-- Tabela de riscos do experimento
CREATE TABLE riscos_experimento (
    id                   BIGSERIAL PRIMARY KEY,
    experimento_id       BIGINT NOT NULL,
    descricao_risco      TEXT,
    estrategia_mitigacao TEXT,
    CONSTRAINT fk_risco_experimento FOREIGN KEY (experimento_id) REFERENCES experimento(id)
);
