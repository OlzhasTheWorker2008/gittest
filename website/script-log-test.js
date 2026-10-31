import { db } from "./script.js";

const testtext = document.getElementById("user-email");
async function testSupabaseConnection() {
    const {data: {session}, error} = await db.auth.getSession();
    if(!session){
        window.location.href = "index.html";
        console.log("Пользователь не авторизован. Пожалуйста, войдите в систему.");
        return;
    }
    try {
        const { data, error } = await db.from('users').select('*');
        if (error) {
            console.error("Ошибка при подключении к Supabase:", error);
            return;
        }
        console.log("Подключение к Supabase успешно. Данные из таблицы Users:", data);
        testtext.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        console.error("Произошла ошибка при тестировании подключения к Supabase:", err);
    }
}

testSupabaseConnection();