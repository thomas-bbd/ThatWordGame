USE ResourceServerDB;
GO

CREATE TABLE [dbo].[user] (
    [user_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [username] VARCHAR(15) NOT NULL,
    [name] VARCHAR(255) NOT NULL
);

CREATE TABLE [dbo].[federated_credentials] (
    [federated_credentials_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [user_id] BIGINT NOT NULL,
    [provider] VARCHAR(255) NOT NULL,
    [subject] VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[user] ([user_id])
);