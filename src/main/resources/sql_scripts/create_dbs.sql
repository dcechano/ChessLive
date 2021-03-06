create table PLAYER
(
	ID VARCHAR(100) not null primary key,
	USERNAME VARCHAR(50) unique not null,
    PASSWORD varchar(100) not null,
    JOIN_DATE DATETIME
);

CREATE TABLE GAME (
    ID VARCHAR(100) PRIMARY KEY NOT NUll,
    WHITE VARCHAR(100),
    BLACK VARCHAR(100),
    DATE DATETIME,
    TIME_CONTROL VARCHAR(50),
    PGN VARCHAR(200),
    RESULT VARCHAR(20),
    FOREIGN KEY(WHITE) REFERENCES PLAYER(ID),
    FOREIGN KEY(BLACK) REFERENCES PLAYER(ID)
);

CREATE TABLE WAIT_LIST(
    ID VARCHAR(100) PRIMARY KEY NOT NULL,
    PLAYER VARCHAR(100) NOT NULL,
    CREATED_AT DATETIME,
    TIME_CONTROL VARCHAR(50),
    FOREIGN KEY (PLAYER) REFERENCES PLAYER(ID)
);

CREATE TABLE PAIRED_PLAYERS(
    ID VARCHAR(100),
    WHITE VARCHAR(100),
    BLACK VARCHAR(100),
    FOREIGN KEY(WHITE) REFERENCES PLAYER(ID),
    FOREIGN KEY(BLACK) REFERENCES PLAYER(ID)
);