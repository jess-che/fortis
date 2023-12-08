create table public.users
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

comment on table public.users is 'Has users and their email';

comment on column public.users.uid is 'Unique User ID';

comment on constraint email_regex on public.users is 'checks if an email is really an email - regex from https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression';

alter table public.users
    owner to "default";

create table public.user_data
(
    uid     uuid                              not null
        constraint user_data_pk
            primary key
        constraint "user_data_Users_uid_fk"
            references public.users,
    name    citext default 'No Name'::citext  not null,
    age     integer,
    height  integer,
    weight  integer,
    gender  citext,
    unit    citext default 'Imperial'::citext not null,
    privacy citext default 'Private'::citext  not null,
    about   citext default '-'::citext
);

comment on table public.user_data is 'user inputted data';

alter table public.user_data
    owner to "default";

create table public.gym
(
    uid       uuid    not null
        constraint "gym_Users_uid_fk"
            references public.users,
    gid       integer not null,
    equipment citext,
    name      citext default 'Unnamed Gym'::citext,
    constraint gym_pk
        primary key (uid, gid)
);

comment on column public.gym.uid is 'User id, 0 for Brodie or Wilson';

comment on column public.gym.gid is 'Users can make their own gyms, 0 for Brodie and 1 for Wilson';

alter table public.gym
    owner to "default";

create trigger trigger_set_next_gid
    before insert
    on public.gym
    for each row
    when (new.gid IS NULL OR new.gid = 0)
execute procedure public.set_next_gid();

create table public.exercise
(
    eid          integer                                      not null
        constraint exercise_pk
            primary key,
    name         citext  default 'Unnamed'::character varying not null
        constraint exercise_pk2
            unique,
    type         citext  default 'Uncategorized'::character varying,
    muscle_group citext  default 'Uncategorized'::character varying,
    popularity   integer default 0,
    favorite     boolean default false,
    equipment    citext  default 'No Equipment'::character varying,
    description  citext  default 'No Description'::citext     not null,
    gym          citext
);

comment on column public.exercise.popularity is '0 if private';

alter table public.exercise
    owner to "default";

create trigger trigger_set_next_eid
    before insert
    on public.exercise
    for each row
    when (new.eid IS NULL OR new.eid = 0)
execute procedure public.set_next_eid();

create table public.activity
(
    "Activity_name" varchar   default 'No Name'::character varying not null,
    "Aid"           integer                                        not null,
    "Uid"           uuid                                           not null
        references public.users,
    "Date"          date      default CURRENT_DATE                 not null,
    "Start_time"    timestamp default CURRENT_TIMESTAMP            not null,
    "End_time"      timestamp,
    "Duration"      interval  default '00:00:00'::interval         not null,
    "Favorite"      integer   default 0                            not null,
    primary key ("Aid", "Uid")
);

alter table public.activity
    owner to "default";

create trigger assign_aid_before_insert
    before insert
    on public.activity
    for each row
    when (new."Aid" IS NULL OR new."Aid" = 0)
execute procedure public.assign_next_aid();

create table public.workouts
(
    "Uid"     uuid                       not null,
    "Aid"     integer                    not null,
    "Seq_num" integer                    not null,
    "Eid"     integer                    not null
        references public.exercise,
    "Weight"  double precision default 0 not null,
    "Rep"     integer          default 1 not null,
    "Set"     integer          default 1 not null,
    "Time"    citext,
    "Notes"   citext,
    primary key ("Uid", "Aid", "Seq_num"),
    foreign key ("Aid", "Uid") references public.activity
);

alter table public.workouts
    owner to "default";

create trigger trigger_set_next_seq_num
    before insert
    on public.workouts
    for each row
execute procedure public.set_next_seq_num();

create table public.matcher
(
    frequency          citext not null,
    "genderPreference" citext default 'Any'::citext,
    "workoutTypes"     citext not null,
    location           citext not null,
    "gymAvailability"  citext not null,
    "softPreferences"  citext,
    "Uid"              uuid   not null
        constraint matcher_pk
            unique
        constraint matcher_users_uid_fk
            references public.users
);

alter table public.matcher
    owner to "default";

create table public.friend
(
    "Sender"   uuid not null
        constraint friend_users_uid_fk2
            references public.users,
    "Receiver" uuid not null
        constraint friend_users_uid_fk
            references public.users,
    accepted   integer default 0
);

alter table public.friend
    owner to "default";