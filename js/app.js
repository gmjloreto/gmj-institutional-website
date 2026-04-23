/**
 * GMJ Loreto - UI Controller (Version 2.4 - Calendar & Popup Fixed)
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyNav();
    initScrollReveal();
    
    // Identificação de Página
    if (document.getElementById('group-schedule')) loadHomeData();
    if (document.getElementById('calendar-grid')) initCalendar();
    if (document.getElementById('drive-link')) loadDriveLink();
    if (document.getElementById('admin-login-form')) initAdminPage();
});

/* --- CORE FUNCTIONS --- */
function initStickyNav() {
    const nav = document.querySelector('.navbar');
    if(!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- CALENDAR LOGIC (mission.html) --- */
let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();

async function initCalendar() {
    renderCalendar();
    const btnPrev = document.getElementById('prev-month');
    const btnNext = document.getElementById('next-month');
    if(btnPrev) btnPrev.onclick = () => { currMonth--; if(currMonth<0){currMonth=11; currYear--;} renderCalendar(); };
    if(btnNext) btnNext.onclick = () => { currMonth++; if(currMonth>11){currMonth=0; currYear++;} renderCalendar(); };
}

async function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const display = document.getElementById('current-month-display');
    if(!grid || !display) return;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    display.innerText = `${months[currMonth]} ${currYear}`;

    // Limpar dias mantendo apenas os headers (Dom, Seg...)
    const headers = Array.from(grid.querySelectorAll('.day-header'));
    grid.innerHTML = '';
    headers.forEach(h => grid.appendChild(h));

    // Datas limites corretas para o mês
    const firstDay = new Date(currYear, currMonth, 1).getDay();
    const daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    
    const startDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-01`;
    const endDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    
    // Buscar missões do mês
    const { data: events } = await window.supabaseClient
        .from('eventos')
        .select('*')
        .gte('dia', startDate)
        .lte('dia', endDate);

    // Espaços vazios antes do dia 1
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-cell';
        grid.appendChild(empty);
    }

    // Gerar dias do mês
    const listContainer = document.getElementById('missions-month-list');
    if(listContainer) listContainer.innerHTML = '';

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.innerText = day;
        
        const dateStr = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvt = events?.find(e => e.dia === dateStr);

        if (dayEvt) {
            cell.classList.add('has-event');
            cell.onclick = (e) => { e.stopPropagation(); openMissionPopup(dayEvt); };
            
            // Adicionar à lista lateral se estivermos na página de missões
            if(listContainer) {
                const item = document.createElement('div');
                item.className = 'mission-event-card';
                const [y, m, d] = dayEvt.dia.split('-');
                const monthsShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                item.innerHTML = `
                    <div class="event-date-badge">
                        <span class="day">${d}</span>
                        <span class="month">${monthsShort[parseInt(m)-1]}</span>
                    </div>
                    <div class="event-content">
                        <h4>${dayEvt.evento}</h4>
                        <p class="text-sm text-gray-500">${dayEvt.descricao || ''}</p>
                        <div class="event-footer-meta">
                            <span>🕒 ${dayEvt.horario || 'A definir'}</span>
                            <span>👤 ${dayEvt.responsavel || 'Equipe GMJ'}</span>
                        </div>
                    </div>
                `;
                item.onclick = () => openMissionPopup(dayEvt);
                item.style.cursor = 'pointer';
                listContainer.appendChild(item);
            }
        }
        
        // Marcar dia atual
        const today = new Date();
        if (day === today.getDate() && currMonth === today.getMonth() && currYear === today.getFullYear()) {
            cell.classList.add('today');
        }

        grid.appendChild(cell);
    }

    if(listContainer && listContainer.innerHTML === '') {
        listContainer.innerHTML = '<p class="text-gray-400 text-sm">Nenhuma missão programada para este mês ainda.</p>';
    }
}

function openMissionPopup(evt) {
    const modal = document.getElementById('mission-modal');
    if(!modal) return;
    
    document.getElementById('modal-title').innerText = evt.evento;
    // Formatar data para exibição BR
    const [y, m, d] = evt.dia.split('-');
    document.getElementById('modal-date').innerText = `${d}/${m}/${y}`;
    document.getElementById('modal-time').innerText = evt.horario || 'A definir';
    document.getElementById('modal-description').innerText = evt.descricao || 'Nenhuma descrição fornecida.';
    document.getElementById('modal-extra-times').innerText = evt.responsavel ? `Responsável: ${evt.responsavel}` : '';
    
    modal.classList.add('show');
}

window.closeMissionModal = () => {
    const modal = document.getElementById('mission-modal');
    if(modal) modal.classList.remove('show');
};

/* --- DATA LOADING --- */
async function loadHomeData() {
    const { data: configs } = await window.supabaseClient.from('site_config').select('*');
    if (configs) {
        configs.forEach(c => {
            const sch = document.getElementById('group-schedule');
            const loc = document.getElementById('group-location');
            if (c.id === 'horario_grupo' && sch) sch.innerText = c.value;
            if (c.id === 'local_grupo' && loc) loc.innerText = c.value;
        });
    }
    // Preview de próximas 3 missões a partir de hoje
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: evts } = await window.supabaseClient
        .from('eventos')
        .select('*')
        .gte('dia', todayStr)
        .order('dia', {ascending: true})
        .limit(3);

    const grid = document.getElementById('missions-preview-grid');
    if(grid && evts) {
        grid.innerHTML = '';
        evts.forEach(e => {
            const [y, m, d] = e.dia.split('-');
            const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            grid.innerHTML += `
                <div class="mission-event-card reveal active">
                    <div class="event-date-badge">
                        <span class="day">${d}</span>
                        <span class="month">${months[parseInt(m)-1]}</span>
                    </div>
                    <div class="event-content">
                        <h4>${e.evento}</h4>
                        <p class="text-sm text-gray-500">${e.descricao?.substring(0, 100) || ''}...</p>
                        <div class="event-footer-meta">
                            <span>🕒 ${e.horario || 'A definir'}</span>
                            <span>📍 ${e.responsavel ? 'Com: ' + e.responsavel : 'Loreto'}</span>
                        </div>
                    </div>
                </div>`;
        });
    }
}

async function loadDriveLink() {
    const { data: link } = await window.supabaseClient.from('site_config').select('value').eq('id', 'link_drive_fotos').maybeSingle();
    const driveBtn = document.getElementById('drive-link');
    if(link && driveBtn) driveBtn.href = link.value;
}

/* --- ADMIN PANEL --- */
async function initAdminPage() {
    const loginForm = document.getElementById('admin-login-form');
    const eventForm = document.getElementById('event-manager-form');
    const configForm = document.getElementById('config-manager-form');

    // Auto login
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (user) checkAdmin(user);

    if(loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) showToast(error.message, 'error');
            else checkAdmin(data.user);
        };
    }

    if(eventForm) {
        eventForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const payload = {
                dia: document.getElementById('ev-dia').value,
                horario: document.getElementById('ev-horario').value,
                evento: document.getElementById('ev-evento').value,
                descricao: document.getElementById('ev-descricao').value,
                responsavel: document.getElementById('ev-responsavel').value
            };
            
            let res;
            if(id) res = await window.supabaseClient.from('eventos').update(payload).eq('id', id);
            else res = await window.supabaseClient.from('eventos').insert([payload]);

            if(!res.error) {
                showToast('Missão salva com sucesso!');
                window.closeAdminModal();
                loadAdminEvents();
            } else {
                showToast('Erro ao salvar: ' + res.error.message, 'error');
            }
        };
    }

    if(configForm) {
        configForm.onsubmit = async (e) => {
            e.preventDefault();
            const inputs = document.querySelectorAll('.config-input-field');
            for(let input of inputs) {
                const cid = input.id.replace('conf-', '');
                await window.supabaseClient.from('site_config').update({ value: input.value }).eq('id', cid);
            }
            showToast('Configurações atualizadas!');
        };
    }
}

async function checkAdmin(user) {
    const { data } = await window.supabaseClient.from('admins').select('*').eq('id', user.id).maybeSingle();
    if (data) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('dashboard-hidden');
        document.getElementById('user-display').innerText = user.email;
        loadAdminEvents();
    } else {
        showToast('Acesso negado: Não é administrador.', 'error');
        await window.supabaseClient.auth.signOut();
    }
}

async function loadAdminEvents() {
    const list = document.getElementById('admin-events-list');
    if(!list) return;
    const { data } = await window.supabaseClient.from('eventos').select('*').order('dia', {ascending: false});
    if(data) {
        list.innerHTML = '';
        data.forEach(e => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${e.dia}</td>
                <td>${e.evento}</td>
                <td>${e.responsavel || '-'}</td>
                <td>
                    <button onclick="editEvt('${e.id}')" class="btn-outline" style="padding: 4px 10px; font-size: 12px; margin-right: 5px;">Editar</button>
                    <button onclick="deleteEvt('${e.id}')" class="btn-delete-simple">Excluir</button>
                </td>
            `;
            list.appendChild(tr);
        });
    }
}

window.editEvt = async (id) => {
    const { data: ev } = await window.supabaseClient.from('eventos').select('*').eq('id', id).single();
    if(ev) {
        document.getElementById('edit-id').value = ev.id;
        document.getElementById('ev-dia').value = ev.dia;
        document.getElementById('ev-horario').value = ev.horario || '';
        document.getElementById('ev-evento').value = ev.evento;
        document.getElementById('ev-descricao').value = ev.descricao || '';
        document.getElementById('ev-responsavel').value = ev.responsavel || '';
        document.getElementById('form-title').innerText = 'Editar Missão';
        document.getElementById('admin-event-modal').classList.add('show');
    }
};

window.loadAdminConfigs = async () => {
    const container = document.getElementById('config-inputs-list');
    if(!container) return;
    const { data: configs } = await window.supabaseClient.from('site_config').select('*');
    if(configs) {
        container.innerHTML = '';
        configs.forEach(c => {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `<label>${c.id.replace(/_/g, ' ').toUpperCase()}</label>
                               <input type="text" id="conf-${c.id}" class="config-input-field" value="${c.value}">`;
            container.appendChild(group);
        });
    }
};

window.deleteEvt = async (id) => {
    if(confirm('Excluir missão?')) {
        const { error } = await window.supabaseClient.from('eventos').delete().eq('id', id);
        if(!error) { showToast('Excluído!'); loadAdminEvents(); }
    }
};

window.handleLogout = async () => {
    await window.supabaseClient.auth.signOut();
    location.reload();
};

window.closeAdminModal = () => {
    document.getElementById('admin-event-modal').classList.remove('show');
};

/* --- TOAST --- */
function showToast(msg, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
