// Este evento garante que o código só rode quando a ponte pywebview estiver pronta
window.addEventListener('pywebviewready', function() {
    // Chama a função para apps
    pywebview.api.get_audio_apps().then(update_app_list);
    // Chama a função para o volume master
    pywebview.api.get_master_state().then(setup_master_controls);
});

// Esta função vai receber a lista de apps do Python e atualizar o HTML
function update_app_list(apps) {
    console.log("Apps recebidos do Python:", apps);

    const contentBody = document.querySelector('.content-body');
    
    // Limpa a lista antes de adicionar os novos itens
    contentBody.innerHTML = '';
    
    if (apps.length === 0) {
        contentBody.innerHTML = '<p>Nenhum aplicativo com áudio foi detectado.</p>';
        return;
    }

    apps.forEach(app => {
        // Define o estado inicial com base nos dados recebidos
        const muted_class = app.is_muted ? 'fa-volume-mute' : 'fa-volume-up';
        const slider_disabled = app.is_muted ? 'disabled' : '';

        const audioCardHTML = `
            <div class="audio-card" data-app-name="${app.name}">
                ${app.icon ? `<img src="${app.icon}" class="app-icon">` : '<div class="app-icon-placeholder"></div>'}
                <span class="app-name">${app.name}</span>
                <div class="volume-control">
                    <button class="mute-btn" title="Mutar/Desmutar ${app.name}">
                        <i class="fas ${muted_class}"></i>
                    </button>
                    <input type="range" class="form-range" min="0" max="100" value="${app.volume}" title="${app.name}" ${slider_disabled}>
                    <span class="volume-percentage">${app.volume}%</span>
                </div>
            </div>
        `;
        contentBody.insertAdjacentHTML('beforeend', audioCardHTML);
    });

    // Adiciona os listeners para os sliders de volume
    document.querySelectorAll('.form-range').forEach(slider => {
        slider.addEventListener('input', function() {
            const appName = this.closest('.audio-card').dataset.appName;
            const volumeLevel = parseInt(this.value, 10);
            
            // Atualiza a porcentagem na tela
            const percentageSpan = this.nextElementSibling;
            percentageSpan.textContent = `${volumeLevel}%`;

            // Chama a API do Python para alterar o volume
            pywebview.api.set_app_volume(appName, volumeLevel);
        });
    });

    // Adiciona os listeners para os botões de mute
    document.querySelectorAll('.mute-btn').forEach(button => {
        button.addEventListener('click', function() {
            const appName = this.closest('.audio-card').dataset.appName;
            const icon = this.querySelector('i');
            const slider = this.closest('.volume-control').querySelector('.form-range');

            // Chama a API do Python e atualiza a UI com o retorno
            pywebview.api.toggle_app_mute(appName).then(isMuted => {
                if (isMuted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                    slider.disabled = true;
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                    slider.disabled = false;
                }
            });
        });
    });
}

// --- NOVA FUNÇÃO PARA O VOLUME MASTER ---
function setup_master_controls(state) {
    console.log("Estado do Master recebido:", state);
    const container = document.getElementById('master-volume-container');
    if (!container) return;

    const muted_class = state.is_muted ? 'fa-volume-mute' : 'fa-volume-up';
    const slider_disabled = state.is_muted ? 'disabled' : '';

    container.innerHTML = `
        <span class="master-label">Master</span>
        <div class="volume-control">
            <button id="master-mute-btn" class="mute-btn" title="Mutar/Desmutar Master">
                <i class="fas ${muted_class}"></i>
            </button>
            <input id="master-volume-slider" type="range" class="form-range" min="0" max="100" value="${state.volume}" ${slider_disabled}>
            <span id="master-volume-percentage" class="volume-percentage">${state.volume}%</span>
        </div>
    `;

    // Adicionar Listeners aos novos elementos
    const masterSlider = document.getElementById('master-volume-slider');
    const masterMuteBtn = document.getElementById('master-mute-btn');
    const masterPercentage = document.getElementById('master-volume-percentage');
    
    masterSlider.addEventListener('input', function() {
        const volumeLevel = parseInt(this.value, 10);
        masterPercentage.textContent = `${volumeLevel}%`;
        pywebview.api.set_master_volume(volumeLevel);
    });

    masterMuteBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        pywebview.api.toggle_master_mute().then(isMuted => {
            if (isMuted) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                masterSlider.disabled = true;
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                masterSlider.disabled = false;
            }
        });
    });
}

