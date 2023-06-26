use master;
GO

CREATE DATABASE ResourceServerDB
GO

USE ResourceServerDB;
GO

CREATE TABLE [History] (
    id INT NOT NULL PRIMARY KEY IDENTITY,
	complete BIT
)

GO

CREATE TABLE [PlayerHistoryElement](
	history_id INT,
    player_id INT NOT NULL,
    player_score INT NOT NULL,
	CONSTRAINT history_fk FOREIGN KEY (history_id) REFERENCES History (id)
)

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
