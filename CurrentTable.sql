create table exercise
(
    eid          integer not null
        constraint exercise_pk
            primary key,
    name         varchar,
    type         varchar,
    muscle_group varchar,
    popularity   integer,
    favorite     boolean
);

create table gym
(
    uid       uuid    not null
        constraint "gym_Users_uid_fk"
            references "Users",
    gid       integer not null,
    equipment varchar,
    constraint gym_pk
        primary key (uid, gid)
);

create table user_data
(
    uid  uuid    not null
        constraint user_data_pk
            primary key
        constraint "user_data_Users_uid_fk"
            references "Users",
    name varchar,
    gym  integer not null
);

create table "Users"
(
    uid   uuid default uuid_generate_v4() not null
        constraint "Users_pk"
            primary key,
    email citext                          not null
        constraint "Users_pk2"
            unique
        constraint email_regex
            check (email ~
                   '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'::citext)
);