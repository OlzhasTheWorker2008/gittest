const { createClient } = supabase;
const SUPABASE_URL = "https://xbfupwgbkxybcnydbkmu.supabase.co";
const SUPABASE_KEY = "sb_publishable_PEYS1M0OAjPgweMjOCBgvQ_RhRoQlMH";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
export { db };

const regForm = document.getElementById("test-form");
const emailInput = document.getElementById("test-form-email");
const passwordInput = document.getElementById("test-form-password");
const regFormStatus = document.getElementById("reg-form-status");

const authForm = document.getElementById("auth-form");
const authFormEmail = document.getElementById("auth-form-email");
const authFormPassword = document.getElementById("auth-form-password");
const authFormStatus = document.getElementById("auth-form-status");

const logoutButton = document.getElementById("logout-btn");

document.addEventListener("DOMContentLoaded", async (event) => {
    const {data: sessionData} = await db.auth.getSession();
    if(!sessionData){
        if(window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
            window.location.href = "index.html";
        }
    }
    else{
        if(window.location.pathname === "/logged.html" || window.location.pathname === "/") {
            window.location.href = "logged.html";
        }
    }
})

if(logoutButton){
    logoutButton.addEventListener("click", async () => {
        logoutUser();
    })
}
if (regForm) {
    regForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await registerUser();
    });
}
if(authForm){
    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await authenticateUser();
    });
}


async function logoutUser(){
    const { error } = await db.auth.signOut();
    if (error) {
        console.error("ошибка:", error);
        return;
    }
    console.log("пользователь вышел");
    window.location.href = "index.html";
}
async function registerUser(){
    //Тут пихается авторизация в базовую таблицу Users, для прятанья пароля.
    //Плюс оно автоматически проверяет если такой пользователь уже есть.
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { data, error } = await db.auth.signUp({
        email: email,
        password: password
    })
    if (error) {
        console.error("ошибка:", error);
        regFormStatus.textContent = "Ошибка при регистрации";
        if(error.message.includes("already registered")){
            regFormStatus.textContent = "Пользователь с таким email уже зарегистрирован!";
        }
        return;
    }
    else{
        console.log("данные отправлены:", data);
        regFormStatus.textContent = "Регистрация прошла успешно";
    }

    //А тут уже пихаются данные в таблицу users привычным sql. Так проще будет работать, проверять и делать запросы.
    const {data: userData, error: userError} = await db.from("users").insert({
        id: data.user.id,
        email: data.user.email
    }).select();
    if (userError) {
        console.error("ошибка:", userError);
        return;
    }
    else{
        console.log("данные записаны в таблицу:", userData);
    }
}
async function authenticateUser(){
    const email = authFormEmail.value.trim();
    const password = authFormPassword.value;
    const { data, error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    })

    if(error){
        console.error("ошибка входа:", error);
        if(error.message.includes("Invalid login credentials")){
            authFormStatus.textContent = "Неверный email или пароль!";
        }
    }
    else{
        console.log("пользователь вошел:", data);
        window.location.href = "logged.html";
    }
}