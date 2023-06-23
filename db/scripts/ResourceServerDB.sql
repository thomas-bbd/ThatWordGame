use master;
GO

CREATE DATABASE ResourceServerDB
GO

USE ResourceServerDB;
GO

CREATE TABLE [dbo].[test](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [description] [varchar](120) NOT NULL
);
GO
ALTER TABLE dbo.[test]
ADD CONSTRAINT [PK_test] PRIMARY KEY CLUSTERED ([id] ASC);
GO
INSERT INTO dbo.[test] (description) VALUES ('This is a dummy value');
