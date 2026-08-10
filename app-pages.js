/* DESBRAVA+ — módulos privados e telas funcionais */
(function () {
    "use strict";

    const db = () => window.supabaseClient;
    const $ = (selector) => document.querySelector(selector);
    const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));

    async function contexto() {
        const session = await window.requireAuth?.();
        if (!session) return null;
        const { data: perfil, error } = await db().from("profiles")
            .select("id,nome,email,avatar,cargo,unidade_id,ativo")
            .eq("id", session.user.id)
            .maybeSingle();
        if (error || !perfil || perfil.ativo === false) {
            window.location.replace("login.html");
            return null;
        }
        return { session, perfil };
    }

    function layout(titulo, subtitulo, conteudo) {
        document.title = `${titulo} | Desbrava+`;
        document.body.innerHTML = `<div class="app"><main class="main" style="margin-left:0;max-width:1100px;margin-inline:auto;padding:32px 24px">
            <header class="header"><div><p class="date">DESBRAVA+</p><h2>${esc(titulo)}</h2><p>${esc(subtitulo)}</p></div><a class="primary-button" href="index.html">Voltar ao início</a></header>
            <section class="content">${conteudo}</section>
        </main></div>`;
    }

    async function perfilPage(ctx) {
        const { perfil } = ctx;
        const pontos = await db().from("points").select("amount").eq("user_id", perfil.id);
        const total = (pontos.data || []).reduce((s, p) => s + Number(p.amount || 0), 0);
        let unidade = null;
        if (perfil.unidade_id) unidade = (await db().from("units").select("nome,simbolo").eq("id", perfil.unidade_id).maybeSingle()).data;
        layout("Meu perfil", "Dados da sua conta e progresso no clube.", `<div class="main-grid">
          <article class="card"><span class="section-label orange">IDENTIDADE</span><h3>${esc(perfil.nome)}</h3><p>${esc(perfil.email)}</p><p><strong>Cargo:</strong> ${esc(perfil.cargo)}</p><p><strong>Unidade:</strong> ${unidade ? `${esc(unidade.simbolo)} ${esc(unidade.nome)}` : "Não definida"}</p></article>
          <article class="card"><span class="section-label orange">PROGRESSO</span><h3>${total.toLocaleString("pt-BR")} pontos</h3><p>Nível ${Math.max(1, Math.floor(total / 200) + 1)}</p><p>O cargo é administrado conforme as permissões do clube.</p></article>
        </div>`);
    }

    async function desafiosPage(ctx) {
        const { data, error } = await db().from("challenges").select("*").eq("ativo", true).order("created_at", { ascending: false });
        if (error) return layout("Desafios", "Não foi possível carregar os desafios.", `<article class="card"><p>${esc(error.message)}</p></article>`);
        const cards = (data || []).map((desafio) => `<article class="card"><span class="section-label orange">${Number(desafio.pontos || 0)} PONTOS</span><h3>${esc(desafio.titulo)}</h3><p>${esc(desafio.descricao || "Participe deste desafio do clube.")}</p><form class="challenge-form" data-challenge-id="${desafio.id}"><textarea name="descricao" placeholder="Conte como você participou" required></textarea><input name="imagem" type="url" placeholder="URL da evidência/foto (opcional)"><button class="primary-button" type="submit">Participar</button></form></article>`).join("") || `<article class="card"><p>Nenhum desafio ativo no momento.</p></article>`;
        layout("Desafios", "Participe, envie sua evidência e acompanhe a aprovação.", `<div class="main-grid">${cards}</div>`);
        document.querySelectorAll(".challenge-form").forEach((form) => form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const { error: insertError } = await db().from("challenge_submissions").insert({ challenge_id: form.dataset.challengeId, user_id: ctx.perfil.id, descricao: formData.get("descricao"), imagem: formData.get("imagem") || null });
            window.alert(insertError ? insertError.message : "Participação enviada para aprovação.");
            if (!insertError) form.reset();
        }));
    }

    async function rankingPage() {
        const [{ data: unidades, error: erroUnidades }, { data: usuarios, error: erroUsuarios }] = await Promise.all([
            db().rpc("get_unit_ranking"),
            db().rpc("get_user_ranking", { period_key: "all" })
        ]);
        const unitRows = (unidades || []).map((item, index) => `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><strong>#${index + 1} ${esc(item.unit_symbol || "👥")} ${esc(item.unit_name)}</strong><strong>${Number(item.total_points || 0).toLocaleString("pt-BR")} pts</strong></div>`).join("");
        const userRows = (usuarios || []).slice(0, 20).map((item, index) => `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><span><strong>#${index + 1} ${esc(item.user_name)}</strong><br><small>${esc(item.unit_name)}</small></span><strong>${Number(item.total_points || 0).toLocaleString("pt-BR")} pts</strong></div>`).join("");
        const erro = erroUnidades || erroUsuarios;
        layout("Ranking", "Pontuação real calculada pelo histórico de pontos do Supabase.", erro ? `<article class="card"><p>${esc(erro.message)}</p></article>` : `<h3>Por unidade</h3>${unitRows || `<article class="card"><p>Nenhuma unidade pontuou ainda.</p></article>`}<h3>Por usuário</h3>${userRows || `<article class="card"><p>Nenhum usuário pontuou ainda.</p></article>`}`);
    }

    async function unidadePage(ctx) {
        if (!ctx.perfil.unidade_id) return layout("Minha unidade", "Sua unidade ainda não foi definida.", `<article class="card"><p>Solicite ao administrador a vinculação da sua unidade.</p></article>`);
        const unidade = (await db().from("units").select("*").eq("id", ctx.perfil.unidade_id).maybeSingle()).data;
        const membros = (await db().from("profiles").select("nome,cargo").eq("unidade_id", ctx.perfil.unidade_id).eq("ativo", true)).data || [];
        layout("Minha unidade", "Membros e informações da sua unidade.", `<article class="card"><h3>${esc(unidade?.simbolo)} ${esc(unidade?.nome)}</h3><p>${esc(unidade?.descricao || "")}</p><h4>Membros</h4><ul>${membros.map((m) => `<li>${esc(m.nome)} — ${esc(m.cargo)}</li>`).join("") || "<li>Nenhum membro listado.</li>"}</ul></article>`);
    }

    async function conquistasPage(ctx) {
        const conquistas = (await db().from("achievements").select("*").eq("ativo", true)).data || [];
        const obtidas = (await db().from("user_achievements").select("achievement_id,created_at").eq("user_id", ctx.perfil.id)).data || [];
        const ids = new Map(obtidas.map((item) => [item.achievement_id, item.created_at]));
        layout("Conquistas", "Acompanhe suas conquistas e o que falta desbloquear.", `<div class="main-grid">${conquistas.map((item) => `<article class="card"><div style="font-size:32px">${esc(item.icone || "🏅")}</div><h3>${esc(item.titulo)}</h3><p>${esc(item.descricao || "")}</p><strong>${ids.has(item.id) ? `Desbloqueada em ${new Date(ids.get(item.id)).toLocaleDateString("pt-BR")}` : `${Number(item.pontos || 0)} pontos`}</strong></article>`).join("") || `<article class="card"><p>Nenhuma conquista cadastrada.</p></article>`}</div>`);
    }

    async function reunioesPage() {
        const { data } = await db().from("meetings").select("*").eq("ativo", true).order("data").order("hora");
        layout("Reuniões", "Agenda do clube.", `<div class="main-grid">${(data || []).map((item) => `<article class="card"><span class="section-label orange">${new Date(`${item.data}T00:00:00`).toLocaleDateString("pt-BR")}</span><h3>${esc(item.titulo)}</h3><p>${esc(item.descricao || "")}</p><p><strong>${esc(item.hora || "Horário não informado")}</strong> · ${esc(item.local || "Local não informado")}</p></article>`).join("") || `<article class="card"><p>Nenhuma reunião cadastrada.</p></article>`}</div>`);
    }

    async function suportePage(ctx) {
        layout("Suporte", "Envie dúvidas, problemas ou sugestões para a administração.", `<article class="card"><form id="supportForm"><label>Assunto<select name="assunto"><option>Dúvida</option><option>Problema</option><option>Sugestão</option><option>Outro</option></select></label><label>Mensagem<textarea name="mensagem" required placeholder="Descreva sua solicitação"></textarea></label><button class="primary-button" type="submit">Enviar chamado</button></form></article>`);
        $("#supportForm").addEventListener("submit", async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const { error } = await db().from("support_tickets").insert({ user_id: ctx.perfil.id, assunto: data.get("assunto"), mensagem: data.get("mensagem") }); window.alert(error ? error.message : "Chamado enviado."); if (!error) event.currentTarget.reset(); });
    }

    async function iniciar() {
        const page = document.body.dataset.page;
        if (!page) return;
        const ctx = await contexto();
        if (!ctx) return;
        if (page === "perfil") return perfilPage(ctx);
        if (page === "desafios") return desafiosPage(ctx);
        if (page === "ranking") return rankingPage(ctx);
        if (page === "unidade") return unidadePage(ctx);
        if (page === "conquistas") return conquistasPage(ctx);
        if (page === "reunioes") return reunioesPage(ctx);
        if (page === "suporte") return suportePage(ctx);
    }

    document.addEventListener("DOMContentLoaded", iniciar);
})();
