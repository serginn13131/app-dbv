/* DESBRAVA+ — operações administrativas protegidas por Supabase */
(function () {
    "use strict";
    const db = () => window.supabaseClient;
    const $ = (s) => document.querySelector(s);
    const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
    const roles = ["Administrador", "Diretor", "Diretor Associado", "Secretário", "Conselheiro", "Instrutor", "Desbravador"];

    async function contextoAdmin() {
        const session = await window.requireAuth?.();
        if (!session) return null;
        const { data: perfil } = await db().from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        if (!perfil || perfil.ativo === false || !["Administrador", "Diretor", "Diretor Associado"].includes(perfil.cargo)) {
            window.alert("Você não tem permissão para acessar a administração."); window.location.replace("index.html"); return null;
        }
        return { session, perfil };
    }

    function base(titulo, subtitulo, corpo) {
        document.body.innerHTML = `<div class="app"><main class="main" style="margin-left:0;max-width:1200px;margin-inline:auto;padding:32px 24px"><header class="header"><div><p class="date">ADMINISTRAÇÃO</p><h2>${esc(titulo)}</h2><p>${esc(subtitulo)}</p></div><a class="primary-button" href="index.html">Dashboard</a></header><section class="content">${corpo}</section></main></div>`;
    }

    async function usuarios() {
        const [{ data: users }, { data: units }] = await Promise.all([db().from("profiles").select("id,nome,email,cargo,unidade_id,ativo").order("nome"), db().from("units").select("id,nome,simbolo").eq("ativo", true).order("nome")]);
        base("Usuários", "Gerencie perfis, cargos e unidades.", `<article class="card"><div style="overflow:auto"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Unidade</th><th>Ativo</th><th>Ação</th></tr></thead><tbody>${(users || []).map((u) => `<tr data-user="${u.id}"><td>${esc(u.nome)}</td><td>${esc(u.email)}</td><td><select class="role">${roles.map((r) => `<option ${r === u.cargo ? "selected" : ""}>${r}</option>`).join("")}</select></td><td><select class="unit"><option value="">Sem unidade</option>${(units || []).map((x) => `<option value="${x.id}" ${x.id === u.unidade_id ? "selected" : ""}>${esc(x.simbolo)} ${esc(x.nome)}</option>`).join("")}</select></td><td><input class="active" type="checkbox" ${u.ativo ? "checked" : ""}></td><td><button class="primary-button save-user">Salvar</button></td></tr>`).join("")}</tbody></table></div></article>`);
        document.querySelectorAll(".save-user").forEach((button) => button.addEventListener("click", async () => { const row = button.closest("tr"); const { error } = await db().from("profiles").update({ cargo: row.querySelector(".role").value, unidade_id: row.querySelector(".unit").value || null, ativo: row.querySelector(".active").checked }).eq("id", row.dataset.user); window.alert(error ? error.message : "Usuário atualizado."); }));
    }

    async function unidades() {
        const { data } = await db().from("units").select("*").order("nome");
        base("Unidades", "Cadastre e mantenha as unidades do clube.", `<article class="card"><form id="unitForm"><input name="nome" placeholder="Nome da unidade" required><input name="simbolo" placeholder="Símbolo"><input name="descricao" placeholder="Descrição"><button class="primary-button">Criar unidade</button></form></article><div class="main-grid">${(data || []).map((u) => `<article class="card"><h3>${esc(u.simbolo)} ${esc(u.nome)}</h3><p>${esc(u.descricao || "")}</p><small>${u.ativo ? "Ativa" : "Inativa"}</small></article>`).join("")}</div>`);
        $("#unitForm").addEventListener("submit", async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const { error } = await db().from("units").insert({ nome: f.get("nome"), simbolo: f.get("simbolo"), descricao: f.get("descricao") }); window.alert(error ? error.message : "Unidade criada."); if (!error) unidades(); });
    }

    async function conteudo(tipo) {
        const tabela = { desafios: "challenges", reunioes: "meetings", conquistas: "achievements" }[tipo];
        const campos = { desafios: ["titulo", "descricao", "pontos"], reunioes: ["titulo", "descricao", "data", "hora", "local"], conquistas: ["titulo", "descricao", "icone", "pontos"] }[tipo];
        const { data } = await db().from(tabela).select("*").order("created_at", { ascending: false });
        const inputs = campos.map((c) => `<input name="${c}" ${c === "descricao" ? "placeholder='Descrição'" : `placeholder='${c}'`} ${["pontos"].includes(c) ? "type='number'" : ""} ${c === "data" ? "type='date'" : ""} required>`).join("");
        base(tipo[0].toUpperCase() + tipo.slice(1), "Gerencie conteúdo do clube.", `<article class="card"><form id="contentForm">${inputs}<button class="primary-button">Criar</button></form></article><div class="main-grid">${(data || []).map((x) => `<article class="card"><h3>${esc(x.titulo)}</h3><p>${esc(x.descricao || "")}</p><strong>${x.pontos !== undefined ? `${x.pontos} pontos` : esc(x.data || "")}</strong></article>`).join("")}</div>`);
        $("#contentForm").addEventListener("submit", async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const payload = Object.fromEntries(f.entries()); if (payload.pontos) payload.pontos = Number(payload.pontos); const { error } = await db().from(tabela).insert(payload); window.alert(error ? error.message : "Registro criado."); if (!error) conteudo(tipo); });
    }

    async function cargos() {
        const [{ data: permissions }, { data: mappings }] = await Promise.all([db().from("permissions").select("id,chave,descricao").order("chave"), db().from("role_permissions").select("cargo,permission_id")]);
        const assigned = new Set((mappings || []).map((item) => `${item.cargo}:${item.permission_id}`));
        base("Cargos e permissões", "A matriz abaixo é controlada pelo banco e protegida por RLS.", `<article class="card"><div style="overflow:auto"><table><thead><tr><th>Permissão</th>${roles.map((r) => `<th>${esc(r)}</th>`).join("")}</tr></thead><tbody>${(permissions || []).map((permission) => `<tr><td><strong>${esc(permission.chave)}</strong><br><small>${esc(permission.descricao)}</small></td>${roles.map((role) => `<td><input type="checkbox" disabled ${assigned.has(`${role}:${permission.id}`) ? "checked" : ""}></td>`).join("")}</tr>`).join("")}</tbody></table></div></article>`);
    }

    async function suporte() {
        const { data } = await db().from("support_tickets").select("id,assunto,mensagem,status,created_at,user_id").order("created_at", { ascending: false });
        base("Suporte", "Acompanhe e atualize os chamados enviados pelos membros.", `<div class="main-grid">${(data || []).map((ticket) => `<article class="card" data-ticket="${ticket.id}"><span class="section-label orange">${esc(ticket.assunto)}</span><p>${esc(ticket.mensagem)}</p><small>${new Date(ticket.created_at).toLocaleString("pt-BR")}</small><select class="ticket-status"><option ${ticket.status === "aberto" ? "selected" : ""}>aberto</option><option ${ticket.status === "em andamento" ? "selected" : ""}>em andamento</option><option ${ticket.status === "resolvido" ? "selected" : ""}>resolvido</option></select><button class="primary-button save-ticket">Salvar status</button></article>`).join("") || `<article class="card"><p>Nenhum chamado.</p></article>`}</div>`);
        document.querySelectorAll(".save-ticket").forEach((button) => button.addEventListener("click", async () => { const card = button.closest("[data-ticket]"); const { error } = await db().from("support_tickets").update({ status: card.querySelector(".ticket-status").value }).eq("id", card.dataset.ticket); window.alert(error ? error.message : "Status atualizado."); }));
    }

    async function iniciar() {
        const ctx = await contextoAdmin(); if (!ctx) return;
        const page = document.body.dataset.adminPage || "admin";
        if (page === "usuarios") return usuarios();
        if (page === "unidades") return unidades();
        if (page === "suporte") return suporte();
        if (page === "cargos") return cargos();
        if (["desafios", "reunioes", "conquistas"].includes(page)) return conteudo(page);
        base("Administração", `Olá, ${esc(ctx.perfil.nome)}. Escolha um módulo para gerenciar.`, `<div class="main-grid">${[["Usuários","admin-usuarios.html"],["Cargos e permissões","admin-cargos.html"],["Unidades","admin-unidades.html"],["Desafios","admin-desafios.html"],["Reuniões","admin-reunioes.html"],["Conquistas","admin-conquistas.html"],["Suporte","admin-suporte.html"]].map(([label, href]) => `<a class="card" href="${href}"><h3>${label}</h3><p>Gerenciar dados do clube.</p></a>`).join("")}</div>`);
    }
    document.addEventListener("DOMContentLoaded", iniciar);
})();
