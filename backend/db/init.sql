IF DB_ID(N'hazor') IS NULL
BEGIN
    CREATE DATABASE hazor;
END
GO

USE hazor;
GO

IF OBJECT_ID(N'dbo.Regioes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Regioes (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL
    );
END
GO

IF OBJECT_ID(N'dbo.Igrejas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Igrejas (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Nome NVARCHAR(150) NOT NULL,
        RegiaoId INT NOT NULL,
        CONSTRAINT FK_Igrejas_Regioes FOREIGN KEY (RegiaoId) REFERENCES dbo.Regioes(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Grupos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Grupos (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL
    );
END
GO

IF OBJECT_ID(N'dbo.Alunos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Alunos (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        NomeCompleto NVARCHAR(150) NOT NULL,
        IgrejaId INT NOT NULL,
        GrupoId INT NOT NULL,
        Ativo BIT NOT NULL CONSTRAINT DF_Alunos_Ativo DEFAULT (1),
        DataInativacao DATE NULL,
        CONSTRAINT FK_Alunos_Igrejas FOREIGN KEY (IgrejaId) REFERENCES dbo.Igrejas(Id),
        CONSTRAINT FK_Alunos_Grupos FOREIGN KEY (GrupoId) REFERENCES dbo.Grupos(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.AlunoGrupos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AlunoGrupos (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        AlunoId INT NOT NULL,
        GrupoId INT NOT NULL,
        DataIngresso DATE NOT NULL,
        DataFim DATE NULL,
        CONSTRAINT FK_AlunoGrupos_Alunos FOREIGN KEY (AlunoId) REFERENCES dbo.Alunos(Id),
        CONSTRAINT FK_AlunoGrupos_Grupos FOREIGN KEY (GrupoId) REFERENCES dbo.Grupos(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Temporadas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Temporadas (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Nome VARCHAR(100) NOT NULL,
        DataInicio DATE NOT NULL,
        DataFim DATE NULL,
        Ativa BIT NOT NULL CONSTRAINT DF_Temporadas_Ativa DEFAULT (0)
    );
END
GO

IF OBJECT_ID(N'dbo.Oficinas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Oficinas (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        TemporadaId INT NOT NULL,
        DepartamentoId INT NOT NULL,
        DataAula DATE NOT NULL,
        TeveAtividade BIT NOT NULL CONSTRAINT DF_Oficinas_TeveAtividade DEFAULT (0),
        CONSTRAINT FK_Oficinas_Temporadas FOREIGN KEY (TemporadaId) REFERENCES dbo.Temporadas(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Presencas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Presencas (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OficinaId INT NOT NULL,
        AlunoId INT NOT NULL,
        CONSTRAINT FK_Presencas_Oficinas FOREIGN KEY (OficinaId) REFERENCES dbo.Oficinas(Id),
        CONSTRAINT FK_Presencas_Alunos FOREIGN KEY (AlunoId) REFERENCES dbo.Alunos(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Atividades', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Atividades (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OficinaId INT NOT NULL,
        Encerrada BIT NOT NULL CONSTRAINT DF_Atividades_Encerrada DEFAULT (0),
        CONSTRAINT FK_Atividades_Oficinas FOREIGN KEY (OficinaId) REFERENCES dbo.Oficinas(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Entregas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Entregas (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        AtividadeId INT NOT NULL,
        AlunoId INT NOT NULL,
        CONSTRAINT FK_Entregas_Atividades FOREIGN KEY (AtividadeId) REFERENCES dbo.Atividades(Id),
        CONSTRAINT FK_Entregas_Alunos FOREIGN KEY (AlunoId) REFERENCES dbo.Alunos(Id)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Regioes)
BEGIN
    INSERT INTO dbo.Regioes (Nome) VALUES
        (N'Norte'),
        (N'Sul'),
        (N'Leste'),
        (N'Oeste');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Igrejas)
BEGIN
    INSERT INTO dbo.Igrejas (Nome, RegiaoId) VALUES
        (N'Igreja Centro', 1),
        (N'Igreja Norte', 1),
        (N'Igreja Sul', 2),
        (N'Igreja Leste', 3);
END
GO

-- Ids fixos usados no backend: Oficina = 1, CPM = 2, Mídia = 3
IF NOT EXISTS (SELECT 1 FROM dbo.Grupos)
BEGIN
    INSERT INTO dbo.Grupos (Nome) VALUES
        (N'Oficina'),
        (N'CPM'),
        (N'Mídia');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Alunos)
BEGIN
    INSERT INTO dbo.Alunos (NomeCompleto, IgrejaId, GrupoId, Ativo) VALUES
        (N'Tanjiro', 1, 1, 1),
        (N'Nezuko', 1, 1, 1),
        (N'Zenitsu', 2, 1, 1),
        (N'Inosuke', 2, 1, 1),
        (N'Giyu', 3, 2, 1),
        (N'Shinobu', 3, 2, 1),
        (N'Kyojuro', 4, 3, 1),
        (N'Tengen', 4, 3, 1);

    INSERT INTO dbo.AlunoGrupos (AlunoId, GrupoId, DataIngresso)
    SELECT Id, GrupoId, CAST(N'2026-03-01' AS DATE)
    FROM dbo.Alunos;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Temporadas)
BEGIN
    INSERT INTO dbo.Temporadas (Nome, DataInicio, DataFim, Ativa)
    VALUES (N'Temporada 2026.1', CAST(N'2026-03-01' AS DATE), CAST(N'2026-07-31' AS DATE), 1);
END
GO

-- DepartamentoId: 1 = Fotografia, 2 = Produção, 3 = Design
IF NOT EXISTS (SELECT 1 FROM dbo.Oficinas)
BEGIN
    DECLARE @temporadaId INT = (SELECT TOP 1 Id FROM dbo.Temporadas WHERE Ativa = 1);

    INSERT INTO dbo.Oficinas (TemporadaId, DepartamentoId, DataAula, TeveAtividade)
    VALUES
        (@temporadaId, 1, CAST(N'2026-07-10' AS DATE), 1),
        (@temporadaId, 2, CAST(N'2026-07-03' AS DATE), 1),
        (@temporadaId, 3, CAST(N'2026-06-26' AS DATE), 0);

    DECLARE @oficinaFotoId INT = (
        SELECT TOP 1 Id FROM dbo.Oficinas
        WHERE DepartamentoId = 1 AND DataAula = CAST(N'2026-07-10' AS DATE)
    );

    INSERT INTO dbo.Presencas (OficinaId, AlunoId)
    SELECT @oficinaFotoId, Id
    FROM dbo.Alunos
    WHERE NomeCompleto IN (N'Tanjiro', N'Nezuko', N'Zenitsu');

    INSERT INTO dbo.Atividades (OficinaId, Encerrada)
    VALUES (@oficinaFotoId, 0);
END
GO
