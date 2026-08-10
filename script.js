```javascript
/* =========================================================
   DESBRAVA+
   SCRIPT.JS
========================================================= */


/* =========================================================
   CONFIGURAÇÃO SUPABASE
========================================================= */

const SUPABASE_URL = "https://iibdvkxztgrlrwzqbfrg.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

let supabaseClient = null;

if (
    typeof window.supabase !== "undefined" &&
    SUPABASE_ANON_KEY !== "COLE_AQUI_SUA_CHAVE_ANON_DO_SUPABASE"
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const passwordToggle =
    document.getElementById("passwordToggle");


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        passwordToggle.textContent =
            isPassword ? "🙈" : "👁️";
    });

}


/* =========================================================
   FUNÇÃO DE MENSAGEM
========================================================= */

function showMessage(message, type = "error") {

    let messageBox =
        document.getElementById("loginMessage");

    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "loginMessage";

        messageBox.style.marginTop =
            "15px";

        messageBox.style.padding =
            "12px";

        messageBox.style.borderRadius =
            "10px";

        messageBox.style.fontSize =
            "11px";

        messageBox.style.fontWeight =
            "700";

        messageBox.style.textAlign =
            "center";

        if (loginForm) {
            loginForm.appendChild(messageBox);
        }
    }

    if (type === "success") {

        messageBox.style.background =
            "#dcfce7";

        messageBox.style.color =
            "#166534";

    } else {

        messageBox.style.background =
            "#fee2e2";

        messageBox.style.color =
            "#991b1b";
    }

    messageBox.textContent =
        message;
}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            emailInput?.value.trim();

        const password =
            passwordInput?.value;


        if (!email || !password) {

            showMessage(
                "Digite seu e-mail e sua senha."
            );

            return;
        }


        if (!supabaseClient) {

            showMessage(
                "O Supabase ainda não foi configurado."
            );

            return;
        }


        if (loginButton) {

            loginButton.disabled =
                true;

            loginButton.textContent =
                "Entrando...";
        }


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(
                    "Erro de login:",
                    error
                );

                showMessage(
                    "E-mail ou senha incorretos."
                );

                return;
            }


            if (!data?.user) {

                showMessage(
                    "Não foi possível iniciar sua sessão."
                );

                return;
            }


            showMessage(
                "Login realizado! Entrando...",
                "success"
            );


            /*
             * Pequeno atraso para mostrar
             * a mensagem de sucesso.
             */

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);

        }

        catch (error) {

            console.error(error);

            showMessage(
                "Ocorreu um erro. Tente novamente."
            );

        }

        finally {

            if (loginButton) {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Entrar";
            }
        }

    });

}


/* =========================================================
   VERIFICAR SESSÃO
========================================================= */

async function checkSession() {

    if (!supabaseClient) {
        return null;
    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return null;
    }


    return data.session;
}


/* =========================================================
   PROTEGER INDEX.HTML
========================================================= */

async function protectDashboard() {

    /*
     * Se não estivermos usando Supabase ainda,
     * não bloqueia a página.
     */

    if (!supabaseClient) {
        return;
    }


    const session =
        await checkSession();


    /*
     * Se não existe sessão,
     * manda para o login.
     */

    if (!session) {

        window.location.href =
            "login.html";

        return;
    }


    /*
     * Usuário está logado.
     */

    console.log(
        "Usuário conectado:",
        session.user.email
    );


    /*
     * Mostra o e-mail caso exista
     * algum elemento com esse ID.
     */

    const userEmail =
        document.getElementById("userEmail");

    if (userEmail) {

        userEmail.textContent =
            session.user.email;
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    if (!supabaseClient) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            showMessage(
                "Não foi possível sair da conta."
            );

            return;
        }


        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(error);

        window.location.href =
            "login.html";
    }
}


/* =========================================================
   BOTÃO SAIR
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );
}


/* =========================================================
   DETECTAR PÁGINA
========================================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


/*
 * Se estiver no painel,
 * verifica se o usuário está logado.
 */

if (
    currentPage === "index.html" ||
    currentPage === ""
) {

    protectDashboard();
}


/* =========================================================
   USUÁRIO ATUAL
========================================================= */

async function getCurrentUser() {

    if (!supabaseClient) {
        return null;
    }


    const {
        data
    } =
        await supabaseClient.auth.getUser();


    return data?.user || null;
}


/* =========================================================
   PREENCHER NOME DO USUÁRIO
========================================================= */

async function loadUserName() {

    const nameElement =
        document.getElementById("userName");


    if (!nameElement) {
        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {
        return;
    }


    /*
     * Primeiro tenta pegar o nome
     * salvo nos metadados do usuário.
     */

    const name =
        user.user_metadata?.nome ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Desbravador";


    nameElement.textContent =
        name;
}


loadUserName();


/* =========================================================
   OBSERVAR ALTERAÇÕES DE LOGIN
========================================================= */

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Estado da autenticação:",
                event
            );


            if (
                event === "SIGNED_OUT"
            ) {

                if (
                    currentPage !==
                    "login.html"
                ) {

                    window.location.href =
                        "login.html";
                }
            }

        }
    );
}


/* =========================================================
   EXPORTAR FUNÇÕES
========================================================= */

window.Desbrava = {

    logout,

    getCurrentUser,

    checkSession

};


console.log(
    "Desbrava+ iniciado."
);
```
