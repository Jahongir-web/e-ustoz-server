
const CHECK_EMAIL = `
    select email from users where email = $1
`

const SIGNUP = `
    insert into users (first_name, last_name, email, password, role, subject, avatar) values ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6, $7) returning user_id, role as userRole, first_name as username;
`

const LOGIN =`
    select 
        user_id, role as userRole, first_name as username 
    from 
        users 
    where 
        email = $1 and password = crypt($2, password)
`

const QUESTION = `
    insert into questions (subject, title, content, author_id, photo) values ($1, $2, $3, $4, $5) returning *
`

const QUESTIONS = `
    select q.question_id, q.author_id as student_id, q.title, q.subject, q.content as question_content, q.photo, to_char(q.created_at, 'YYYY-MM-DD') as question_date, a.content as answer_content, a.answer_id, a.photo as answer_photo, to_char(a.created_at, 'YYYY-MM-DD') as answer_date, a.author_id as teacher_id, u.first_name, u.last_name from questions as q left join answers as a on q.question_id = a.question_id left join users as u on a.author_id = u.user_id where q.author_id = $1 
`

const CHANGE_SCORE = `
    update answers set confirm = 1 where ansver_id = $1
`

const COUNT_QUESTIONS = `
    select subject, count(title) from questions where answer = 0 group by subject
`

const QUESTION_BY_SUBJECT = `
    select question_id, title, content, photo, author_id, to_char(created_at, 'YYYY-MM-DD') as date from questions where subject = $1 and answer = 0
`

const ANSWER = `
    insert into answers (content, photo, author_id, question_id) values ($1, $2, $3, $4) returning * 
`

const CONFIRM_ANSWER = `
    update questions set answer = 1 where question_id = $1
`

const DEL_ANSWER = `
    delete from answers where question_id = $1
`

const DEL_CONFIRM = `
    update questions set answer = 0 where question_id = $1;
`

const TEACHERS = `
    select u.user_id, u.first_name, u.subject, u.role, u.avatar, sum(a.confirm) as score from users as u left join answers as a on u.user_id = a.author_id where role = 'teacher' group by user_id
`

const DELETE_ANSWER_WITH_USER = `
    delete from answers where author_id = $1
`

const DEL_USER = `
    delete from users where user_id = $1
`

const STUDENTS = `
    select u.user_id, u.first_name, u.last_name, u.email, u.role, u.avatar, count(q.answer) as score from users as u left join questions as q on u.user_id = q.author_id where role = 'student' group by user_id
`

const DEL_QUESTION = `
    delete from questions where author_id = $1
`

const ADD_MESSAGE = `
    insert into messages (author_name, author_email, message ) values ($1, $2, $3) returning *
`

const GET_MESSAGES = `
    select message_id, author_name, author_email, message, to_char(created_at, 'YYYY-MM-DD') as date from messages
`

const DEL_MESSAGE = `
    delete from messages where message_id = $1
`


module.exports = {
    CHECK_EMAIL,
    SIGNUP,
    LOGIN,
    QUESTION,
    QUESTIONS,
    CHANGE_SCORE,
    COUNT_QUESTIONS,
    QUESTION_BY_SUBJECT,
    ANSWER,
    CONFIRM_ANSWER,
    DEL_ANSWER,
    DEL_CONFIRM,
    TEACHERS,
    DEL_USER,
    DELETE_ANSWER_WITH_USER,
    STUDENTS,
    DEL_QUESTION,
    ADD_MESSAGE,
    GET_MESSAGES,
    DEL_MESSAGE,
}