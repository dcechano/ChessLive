use ChessLive;

create table PLAYER(
    ID binary(128) PRIMARY KEY NOT NULL,
    USERNAME VARCHAR(50) unique NOT NULL,
    PASSWORD varchar(100) NOT NULL,
    JOIN_DATE DATETIME
);

CREATE TABLE GAME (
    ID binary(128) PRIMARY KEY NOT NUll,
    WHITE binary(128),
    BLACK binary(128),
    `DATE` DATETIME not null,
    TIME_CONTROL VARCHAR(50) not null,
    PGN VARCHAR(200),
    RESULT VARCHAR(20),
    FOREIGN KEY(WHITE) REFERENCES PLAYER(ID),
    FOREIGN KEY(BLACK) REFERENCES PLAYER(ID)
);