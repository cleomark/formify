DROP TABLE IF EXISTS f_admin;
DROP TABLE IF EXISTS f_agents;
DROP TABLE IF EXISTS f_messages;
DROP TABLE IF EXISTS f_forms;
DROP TABLE IF EXISTS f_tasks;

CREATE TABLE f_admin (
  ID varchar(32) NOT NULL,
  Username varchar(255) NOT NULL,
  Email varchar(100) NOT NULL,
  Password varchar(255) NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE f_agents (
  ID varchar(32) NOT NULL,
  Fullname varchar(255) NOT NULL,
  Username varchar(100) NOT NULL,
  Password varchar(255) NOT NULL,
  Email varchar(100) NOT NULL,
  Location varchar(255) DEFAULT NULL, 
  Profile varchar(255) DEFAULT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE f_messages (
  ID varchar(32) NOT NULL,
  RecipientID varchar(32) NOT NULL,
  SenderID varchar(32) NOT NULL,
  Message text NOT NULL,
  Seen boolean NOT NULL DEFAULT FALSE,
  Timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);

CREATE TABLE f_forms(
  ID varchar(32) NOT NULL,
  Index serial,
  File text NOT NULL,
  Timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);

CREATE TABLE f_formentry(
  Tag varchar(100) NOT NULL,
  Type varchar(32) NOT NULL,
  Label text NULL NULL,
  Options text DEFAULT NULL,
  ID serial,
  PRIMARY KEY (ID)
);

CREATE TABLE f_tasks(
  ID varchar(32) NOT NULL,
  FormID text NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE f_formentry_inputs(
  AgentID varchar(32) NOT NULL,
  EntryID int NOT NULL,
  Input varchar(255) NOT NULL,
  ID serial,
  PRIMARY KEY (ID)
);


INSERT INTO f_admin VALUES ('UmafIg2t3HdNNLmsragLgu8BHJiEFyMr','PCIC Admin' ,'pcic324@gmail.com','$2y$10$o65CIFnqKU6EOkOUEdBAYuZ.1MeXNIQ9ylyyli8YclzHFU996gROu');

INSERT INTO f_agents VALUES ('SDWUb3nrh4Anj8Z6AvX0tU8oC61sbytv','Kenneth Aycardo' ,'Agent 007','$2y$10$o5s.dvPYX4iBXIIcXBI4GOEuTOaLZLiNezrgo9sg5W.Vibel2ZETq', '
kennethjhonaycardo@gmail.com' ,'Daraga City');

INSERT INTO f_agents VALUES ('8Y2lJDoy86CFLZShEDhbrzqkB38w1G2G','Sean Palacay','Agent 008','$2y$10$Khj84br.ysCYJ0rLz4E3xOIA5OncNjvNPCxOuwx0Eh1zgsGsnvE2e', 'seanjethroaguallo.palacay@bicol-u.edu.ph' , 'Tabaco City');