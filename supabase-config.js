/* Configuração pública do Supabase para o frontend do DESBRAVA+. */
(function configurarSupabase() {
    const url = "https://iibdvkxztgrlrwzqbfrg.supabase.co";
    const chavePublica = "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
        console.error("O SDK do Supabase não foi carregado antes da configuração.");
        return;
    }

    window.supabaseClient = window.supabase.createClient(url, chavePublica);
})();
