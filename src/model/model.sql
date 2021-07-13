create database teachers;

create extension pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');

create table users (
    user_id serial not null primary key,
    first_name varchar(24) not null,
    last_name varchar(24) not null,
    email varchar(32) not null,
    role user_role,
    password varchar(64) not null,
    avatar varchar(64),
    subject varchar(24),
    score int default 0,
    created_at timestamptz default current_timestamp
);

insert into users (first_name, last_name, email, role, password, subject) values ('admin', 'admin', 'eustoz@admin.uz', 'admin', crypt('123', gen_salt('bf')), 'admin');




insert into users (first_name, last_name, email, role, password) values ('Alisher', 'Fayz', 'alish@.com', 'student', crypt('1234', gen_salt('bf')));


create table subjects (
    subject_id serial not null primary key,
    subject_name varchar(64)
);

insert into subjects (subject_name) values ('musiqa'), ('matematika'), ('fizika'), ('adabiyot');


create table messages (
    message_id serial not null primary key,
    author_name varchar(24),
    author_email varchar(64),
    message varchar,
    created_at timestamptz default current_timestamp
);

insert into messages (author_name, author_email, message ) values ('javlon', 'javlon@mc.com', 'Saytdan royhatdan ota olmayapman yordam bering pls.');

create table questions (
    question_id serial not null primary key,
    subject varchar(64),
    title varchar(64),
    content varchar,
    photo varchar(64),
    answer int default 0,
    author_id int not null references users(user_id),
    created_at timestamptz default current_timestamp
);

insert into questions (subject, title, content, author_id) values ('musiqa','jonli ijro haqida', 'ustoz xom tuxum yutishni jonli ijroga foydasi bor deyishadi, shu gap rostmi?', 2);

create table answers (
    answer_id serial not null primary key,
    content varchar,
    photo varchar(64),
    author_id int not null references users(user_id),
    question_id int not null references questions(question_id),
    confirm int default 0,
    created_at timestamptz default current_timestamp
);

insert into answers (content, author_id, question_id, confirm) values ('bekor gap yaxshisi qatiq ich', 1, 1,); 


-- mashq uchun querylar

-- select q.author_id, q.title, q.subject, q.content, q.photo, a.content, a.photo as answerphoto, a.author_id from questions as q left join answers as a on q.question_id = a.question_id;


--select q.author_id, q.title, q.subject, q.content, q.photo, a.content, a.photo as answerphoto, a.author_id, u.first_name, u.last_name from questions as q left join answers as a on q.question_id = a.question_id left join users as u on a.author_id = u.user_id;

--select q.author_id, q.title, q.subject, q.content, q.photo, to_char(q.created_at, 'YYYY-MM-DD') as questiondate, a.content, a.photo as answerphoto, to_char(a.created_at, 'YYYY-MM-DD') as answerdate, a.author_id, u.first_name, u.last_name from questions as q left join answers as a on q.question_id = a.question_id left join users as u on a.author_id = u.user_id;