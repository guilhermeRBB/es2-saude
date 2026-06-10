const API_BASE = window.location.protocol === "file:" ? "http://localhost:8080" : "";

const categories = {
    MEDICO: "Médico",
    PSICOLOGO: "Psicólogo",
    FISIOTERAPEUTA: "Fisioterapeuta"
};

const categoryClass = {
    MEDICO: "medico",
    PSICOLOGO: "psicologo",
    FISIOTERAPEUTA: "fisioterapeuta"
};

const state = {
    profissionais: [],
    atendimentos: [],
    exames: [],
    profissionaisViewData: []
};

const titles = {
    dashboard: "Painel operacional",
    profissionais: "Profissionais de saúde",
    atendimentos: "Atendimentos",
    exames: "Exames laboratoriais"
};

const qs = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    setTodayAsDefault();
    loadData();
});

function bindEvents() {
    document.querySelectorAll("[data-view-link]").forEach((link) => {
        link.addEventListener("click", () => showView(link.dataset.viewLink));
    });

    document.body.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const id = button.dataset.id;

        const actions = {
            refresh: loadData,
            "search-profissionais": searchProfissionais,
            "clear-profissionais-search": clearProfissionaisSearch,
            "edit-profissional": () => editProfissional(id),
            "delete-profissional": () => deleteResource("profissionais", id, "Profissional excluído."),
            "edit-atendimento": () => editAtendimento(id),
            "delete-atendimento": () => deleteResource("atendimentos", id, "Atendimento excluído."),
            "delete-exame": () => deleteResource("exames", id, "Exame excluído."),
            "cancel-profissional-edit": resetProfissionalForm,
            "cancel-atendimento-edit": resetAtendimentoForm
        };

        if (actions[action]) {
            actions[action]();
        }
    });

    qs("#profissionalForm").addEventListener("submit", saveProfissional);
    qs("#atendimentoForm").addEventListener("submit", saveAtendimento);
    qs("#exameForm").addEventListener("submit", saveExame);
}

function showView(viewName) {
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("active", view.dataset.view === viewName);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.viewLink === viewName);
    });

    qs("#pageTitle").textContent = titles[viewName] || titles.dashboard;
    window.location.hash = viewName;
}

async function loadData() {
    setApiStatus("Sincronizando", "pending");
    setLoadingRows();

    try {
        const [profissionais, atendimentos, exames] = await Promise.all([
            request("/profissionais"),
            request("/atendimentos"),
            request("/exames")
        ]);

        state.profissionais = Array.isArray(profissionais) ? profissionais : [];
        state.atendimentos = Array.isArray(atendimentos) ? atendimentos : [];
        state.exames = Array.isArray(exames) ? exames : [];
        state.profissionaisViewData = state.profissionais;

        renderAll();
        setApiStatus("Online", "online");
    } catch (error) {
        renderAll();
        setApiStatus("Sem conexão", "offline");
        showToast(error.message || "Não foi possível conectar ao backend.", "error");
    }
}

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : response.text();
}

async function readError(response) {
    const fallback = `Erro ${response.status} ao comunicar com o servidor.`;
    const text = await response.text().catch(() => "");

    if (!text) {
        return fallback;
    }

    try {
        const body = JSON.parse(text);
        return body.message || body.detail || body.error || fallback;
    } catch {
        return text.length > 180 ? fallback : text;
    }
}

function renderAll() {
    renderDashboard();
    renderProfissionaisTable(state.profissionaisViewData.length ? state.profissionaisViewData : state.profissionais);
    renderAtendimentosTable();
    renderExamesTable();
    populateSelects();
}

function renderDashboard() {
    qs("#metricProfissionais").textContent = state.profissionais.length;
    qs("#metricAtendimentos").textContent = state.atendimentos.length;
    qs("#metricExames").textContent = state.exames.length;
    qs("#metricHoje").textContent = state.atendimentos.filter((item) => item.data === todayISO()).length;

    renderUpcoming();
    renderCategoryBars();
}

function renderUpcoming() {
    const list = qs("#upcomingList");
    const nowKey = `${todayISO()}T00:00`;
    const upcoming = [...state.atendimentos]
        .filter((item) => appointmentKey(item) >= nowKey)
        .sort((a, b) => appointmentKey(a).localeCompare(appointmentKey(b)))
        .slice(0, 5);

    if (!upcoming.length) {
        list.innerHTML = `<div class="empty-state">Nenhum atendimento futuro cadastrado.</div>`;
        return;
    }

    list.innerHTML = upcoming.map((item) => `
        <article class="timeline-item">
            <div class="timeline-time">${escapeHtml(formatTime(item.horario))}</div>
            <div>
                <strong>${escapeHtml(formatDate(item.data))}</strong>
                <span>${escapeHtml(professionalName(item.profissional))}</span>
                <span>${escapeHtml(shortText(item.problemaTexto, 92))}</span>
            </div>
        </article>
    `).join("");
}

function renderCategoryBars() {
    const container = qs("#categoryBars");
    const total = state.profissionais.length || 1;
    const rows = Object.keys(categories).map((key, index) => {
        const count = state.profissionais.filter((item) => item.categoria === key).length;
        const percent = Math.round((count / total) * 100);
        const fillClass = index === 1 ? "success" : index === 2 ? "warning" : "";

        return `
            <div class="category-row">
                <header>
                    <span>${categories[key]}</span>
                    <span>${count}</span>
                </header>
                <div class="bar-track" aria-hidden="true">
                    <div class="bar-fill ${fillClass}" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = rows.join("");
}

function renderProfissionaisTable(items) {
    const tbody = qs("#profissionaisTable");

    if (!items.length) {
        tbody.innerHTML = emptyTableRow("Nenhum profissional encontrado.", 5);
        return;
    }

    tbody.innerHTML = items.map((item) => `
        <tr>
            <td data-label="Nome"><strong>${escapeHtml(item.nome)}</strong></td>
            <td data-label="Categoria">${categoryBadge(item.categoria)}</td>
            <td data-label="Telefone">${escapeHtml(item.telefone || "-")}</td>
            <td data-label="Endereço">${escapeHtml(item.endereco || "-")}</td>
            <td data-label="Ações" class="actions-cell">
                <button class="icon-button" type="button" title="Editar" aria-label="Editar profissional" data-action="edit-profissional" data-id="${item.id}">✎</button>
                <button class="icon-button danger" type="button" title="Excluir" aria-label="Excluir profissional" data-action="delete-profissional" data-id="${item.id}">×</button>
            </td>
        </tr>
    `).join("");
}

function renderAtendimentosTable() {
    const tbody = qs("#atendimentosTable");
    const items = [...state.atendimentos].sort((a, b) => appointmentKey(b).localeCompare(appointmentKey(a)));

    if (!items.length) {
        tbody.innerHTML = emptyTableRow("Nenhum atendimento cadastrado.", 6);
        return;
    }

    tbody.innerHTML = items.map((item) => `
        <tr>
            <td data-label="Data">${escapeHtml(formatDate(item.data))}</td>
            <td data-label="Horário">${escapeHtml(formatTime(item.horario))}</td>
            <td data-label="Profissional">${escapeHtml(professionalName(item.profissional))}</td>
            <td data-label="Problema">${escapeHtml(shortText(item.problemaTexto, 96))}</td>
            <td data-label="Receita">${escapeHtml(shortText(item.receitaSaude, 96))}</td>
            <td data-label="Ações" class="actions-cell">
                <button class="icon-button" type="button" title="Editar" aria-label="Editar atendimento" data-action="edit-atendimento" data-id="${item.id}">✎</button>
                <button class="icon-button danger" type="button" title="Excluir" aria-label="Excluir atendimento" data-action="delete-atendimento" data-id="${item.id}">×</button>
            </td>
        </tr>
    `).join("");
}

function renderExamesTable() {
    const tbody = qs("#examesTable");

    if (!state.exames.length) {
        tbody.innerHTML = emptyTableRow("Nenhum exame cadastrado.", 4);
        return;
    }

    tbody.innerHTML = state.exames.map((item) => {
        const atendimento = item.atendimento || {};
        return `
            <tr>
                <td data-label="Descrição"><strong>${escapeHtml(item.descricao)}</strong></td>
                <td data-label="Atendimento">${escapeHtml(formatAppointmentLabel(atendimento))}</td>
                <td data-label="Profissional">${escapeHtml(professionalName(atendimento.profissional))}</td>
                <td data-label="Ações" class="actions-cell">
                    <button class="icon-button danger" type="button" title="Excluir" aria-label="Excluir exame" data-action="delete-exame" data-id="${item.id}">×</button>
                </td>
            </tr>
        `;
    }).join("");
}

function populateSelects() {
    fillSelect(qs("#atendimentoProfissional"), state.profissionais, "Selecione um profissional", (item) => ({
        value: item.id,
        label: `${item.nome} - ${categories[item.categoria] || item.categoria || "Categoria"}`
    }));

    fillSelect(qs("#exameAtendimento"), state.atendimentos, "Selecione um atendimento", (item) => ({
        value: item.id,
        label: formatAppointmentLabel(item)
    }));
}

function fillSelect(select, items, placeholder, mapper) {
    const currentValue = select.value;
    const options = [`<option value="">${placeholder}</option>`]
        .concat(items.map((item) => {
            const mapped = mapper(item);
            return `<option value="${mapped.value}">${escapeHtml(mapped.label)}</option>`;
        }));

    select.innerHTML = options.join("");

    if ([...select.options].some((option) => option.value === currentValue)) {
        select.value = currentValue;
    }
}

async function saveProfissional(event) {
    event.preventDefault();

    const id = qs("#profissionalId").value;
    const payload = {
        nome: qs("#profissionalNome").value.trim(),
        telefone: qs("#profissionalTelefone").value.trim(),
        endereco: qs("#profissionalEndereco").value.trim(),
        categoria: qs("#profissionalCategoria").value
    };

    try {
        await request(id ? `/profissionais/${id}` : "/profissionais", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        resetProfissionalForm();
        await loadData();
        showToast("Profissional salvo com sucesso.");
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function saveAtendimento(event) {
    event.preventDefault();

    const id = qs("#atendimentoId").value;
    const profissionalId = qs("#atendimentoProfissional").value;

    const payload = {
        data: qs("#atendimentoData").value,
        horario: qs("#atendimentoHorario").value,
        problemaTexto: qs("#atendimentoProblema").value.trim(),
        receitaSaude: qs("#atendimentoReceita").value.trim(),
        profissional: { id: Number(profissionalId) }
    };

    try {
        await request(id ? `/atendimentos/${id}` : "/atendimentos", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        resetAtendimentoForm();
        await loadData();
        showToast("Atendimento salvo com sucesso.");
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function saveExame(event) {
    event.preventDefault();

    const payload = {
        descricao: qs("#exameDescricao").value.trim(),
        atendimento: { id: Number(qs("#exameAtendimento").value) }
    };

    try {
        await request("/exames", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        qs("#exameForm").reset();
        await loadData();
        showToast("Exame cadastrado com sucesso.");
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function searchProfissionais() {
    const nome = qs("#searchProfissionalNome").value.trim();
    const categoria = qs("#searchProfissionalCategoria").value;

    try {
        let items;

        if (nome) {
            items = await request(`/profissionais/buscar?nome=${encodeURIComponent(nome)}`);
            if (categoria) {
                items = items.filter((item) => item.categoria === categoria);
            }
        } else if (categoria) {
            items = await request(`/profissionais/categoria?categoria=${encodeURIComponent(categoria)}`);
        } else {
            items = state.profissionais;
        }

        state.profissionaisViewData = Array.isArray(items) ? items : [];
        renderProfissionaisTable(state.profissionaisViewData);
    } catch (error) {
        showToast(error.message, "error");
    }
}

function clearProfissionaisSearch() {
    qs("#searchProfissionalNome").value = "";
    qs("#searchProfissionalCategoria").value = "";
    state.profissionaisViewData = state.profissionais;
    renderProfissionaisTable(state.profissionais);
}

function editProfissional(id) {
    const item = state.profissionais.find((profissional) => String(profissional.id) === String(id));
    if (!item) {
        return;
    }

    qs("#profissionalId").value = item.id;
    qs("#profissionalNome").value = item.nome || "";
    qs("#profissionalTelefone").value = item.telefone || "";
    qs("#profissionalEndereco").value = item.endereco || "";
    qs("#profissionalCategoria").value = item.categoria || "";
    qs("[data-action='cancel-profissional-edit']").classList.remove("is-hidden");
    showView("profissionais");
    qs("#profissionalNome").focus();
}

function editAtendimento(id) {
    const item = state.atendimentos.find((atendimento) => String(atendimento.id) === String(id));
    if (!item) {
        return;
    }

    qs("#atendimentoId").value = item.id;
    qs("#atendimentoData").value = item.data || "";
    qs("#atendimentoHorario").value = item.horario ? item.horario.slice(0, 5) : "";
    qs("#atendimentoProfissional").value = item.profissional?.id || "";
    qs("#atendimentoProblema").value = item.problemaTexto || "";
    qs("#atendimentoReceita").value = item.receitaSaude || "";
    qs("[data-action='cancel-atendimento-edit']").classList.remove("is-hidden");
    showView("atendimentos");
    qs("#atendimentoData").focus();
}

async function deleteResource(resource, id, successMessage) {
    const labels = {
        profissionais: "este profissional",
        atendimentos: "este atendimento",
        exames: "este exame"
    };

    if (!window.confirm(`Deseja excluir ${labels[resource]}?`)) {
        return;
    }

    try {
        await request(`/${resource}/${id}`, { method: "DELETE" });
        await loadData();
        showToast(successMessage);
    } catch (error) {
        showToast(error.message, "error");
    }
}

function resetProfissionalForm() {
    qs("#profissionalForm").reset();
    qs("#profissionalId").value = "";
    qs("[data-action='cancel-profissional-edit']").classList.add("is-hidden");
}

function resetAtendimentoForm() {
    qs("#atendimentoForm").reset();
    qs("#atendimentoId").value = "";
    qs("[data-action='cancel-atendimento-edit']").classList.add("is-hidden");
    setTodayAsDefault();
}

function setTodayAsDefault() {
    const field = qs("#atendimentoData");
    if (field && !field.value) {
        field.value = todayISO();
    }
}

function setLoadingRows() {
    qs("#profissionaisTable").innerHTML = loadingRow(5);
    qs("#atendimentosTable").innerHTML = loadingRow(6);
    qs("#examesTable").innerHTML = loadingRow(4);
}

function setApiStatus(text, status) {
    qs("#apiStatus").textContent = text;
    const dot = qs("#statusDot");
    dot.classList.remove("online", "offline");

    if (status === "online") {
        dot.classList.add("online");
    }

    if (status === "offline") {
        dot.classList.add("offline");
    }
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.textContent = message;
    qs("#toastRegion").appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
}

function categoryBadge(category) {
    const label = categories[category] || category || "Sem categoria";
    const cssClass = categoryClass[category] || "";
    return `<span class="badge ${cssClass}">${escapeHtml(label)}</span>`;
}

function professionalName(profissional) {
    return profissional?.nome || "Profissional não informado";
}

function formatAppointmentLabel(item = {}) {
    const idLabel = item.id ? `#${item.id}` : "Atendimento";
    const dateLabel = formatDate(item.data);
    const timeLabel = formatTime(item.horario);
    const professional = professionalName(item.profissional);
    return `${idLabel} - ${dateLabel} às ${timeLabel} - ${professional}`;
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatTime(value) {
    return value ? value.slice(0, 5) : "--:--";
}

function appointmentKey(item) {
    return `${item.data || "0000-00-00"}T${formatTime(item.horario)}`;
}

function todayISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function shortText(value, maxLength) {
    const text = value || "-";
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function emptyTableRow(message, colspan) {
    return `<tr><td class="empty-state" colspan="${colspan}">${message}</td></tr>`;
}

function loadingRow(colspan) {
    return `<tr><td class="loading-row" colspan="${colspan}">Carregando dados...</td></tr>`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
