/* Classe Principal da Aplicação */

import StateManager from './state-manager.js';
import PythonAPIClient from './python-api-client.js';

class SoundMixerApp {
    constructor() {
        this.currentScreen = 'apps';
        this.initialized = false;
        this.creatingChannel = false; // Flag para prevenir múltiplas criações

        // Inicializar dependências
        this.stateManager = new StateManager();
        this.apiClient = new PythonAPIClient(this.stateManager);

        // Compatibilidade: só criar se pywebview não existir (modo de desenvolvimento)
        if (!window.pywebview) {
            window.pywebview = { api: this.createCompatibilityAPI() };
        }

        // Bind methods
        this.showScreen = this.showScreen.bind(this);
        this.init = this.init.bind(this);
    }

    createCompatibilityAPI() {
        // Wrapper para manter compatibilidade com código existente
        return {
            get_audio_apps: () => this.apiClient.getAudioApps(),
            set_app_volume: (appName, volume) => this.apiClient.setAppVolume(appName, volume),
            toggle_app_mute: (appName) => this.apiClient.toggleAppMute(appName),
            toggle_app_solo: (appName) => this.apiClient.toggleAppSolo(appName),
            get_master_state: () => this.apiClient.getMasterState(),
            set_master_volume: (volume) => this.apiClient.setMasterVolume(volume),
            toggle_master_mute: () => this.apiClient.toggleMasterMute(),
            get_audio_devices: () => this.apiClient.getAudioDevices(),
            set_default_device: (deviceId, deviceType) => this.apiClient.setDefaultDevice(deviceId, deviceType),
            set_device_volume: (deviceId, deviceType, volume) => this.apiClient.setDeviceVolume(deviceId, deviceType, volume),
            toggle_device_mute: (deviceId, deviceType) => this.apiClient.toggleDeviceMute(deviceId, deviceType),
            get_audio_channels: () => this.apiClient.getAudioChannels(),
            set_channel_volume: (channelId, volume) => this.apiClient.setChannelVolume(channelId, volume),
            toggle_channel_mute: (channelId) => this.apiClient.toggleChannelMute(channelId),
            toggle_channel_solo: (channelId) => this.apiClient.toggleChannelSolo(channelId),
            create_channel: (channelName, channelType) => this.apiClient.createChannel(channelName, channelType),
            remove_channel: (channelId) => this.apiClient.removeChannel(channelId)
        };
    }

    async init() {
        if (this.initialized) return;

        try {
            console.log('🚀 Iniciando SoundMixer - Versão Profissional');

            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Configurar navegação
            this.setupNavigation();

            // Configurar perfil
            this.setupProfile();

            // Iniciar na tela de apps
            await this.showScreen('apps');

            this.initialized = true;
            console.log('✅ SoundMixer inicializado com sucesso');

        } catch (error) {
            console.error('❌ Erro ao inicializar SoundMixer:', error);
        }
    }

    setupNavigation() {
        const menuLinks = document.querySelectorAll('.nav-link');

        if (menuLinks.length >= 3) {
            menuLinks[0].setAttribute('data-screen', 'apps');
            menuLinks[1].setAttribute('data-screen', 'channels');
            menuLinks[2].setAttribute('data-screen', 'devices');
        }

        // Event delegation para melhor performance
        document.querySelector('.nav-menu')?.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('.nav-link');
            if (link) {
                const screen = link.getAttribute('data-screen');
                if (screen) {
                    this.showScreen(screen);
                }
            }
        });
    }

    setupProfile() {
        // Event delegation para o perfil
        document.querySelector('.profile-section')?.addEventListener('click', (e) => {
            const profileCard = e.target.closest('#profile-card');
            const changeNickname = e.target.closest('#change-nickname');
            const changeAvatar = e.target.closest('#change-avatar');

            if (profileCard && !changeNickname && !changeAvatar) {
                this.toggleProfilePopup();
            } else if (changeNickname) {
                this.changeNickname();
            } else if (changeAvatar) {
                this.changeAvatar();
            }
        });

        // Toggle startup
        document.getElementById('startup-checkbox')?.addEventListener('change', (e) => {
            console.log(`Iniciar com sistema: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
        });

        // Fechar popup ao clicar fora
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('profile-popup');
            const profileCard = document.getElementById('profile-card');

            if (popup && profileCard &&
                !popup.contains(e.target) &&
                !profileCard.contains(e.target)) {
                this.closeProfilePopup();
            }
        });
    }

    toggleProfilePopup() {
        const popup = document.getElementById('profile-popup');
        const profileCard = document.getElementById('profile-card');

        if (popup && profileCard) {
            popup.classList.toggle('show');
            profileCard.classList.toggle('popup-open');
        }
    }

    closeProfilePopup() {
        const popup = document.getElementById('profile-popup');
        const profileCard = document.getElementById('profile-card');

        if (popup && profileCard) {
            popup.classList.remove('show');
            profileCard.classList.remove('popup-open');
        }
    }

    changeNickname() {
        const newName = prompt('Digite o novo nickname:', 'Vitor Pinho');
        if (newName && newName.trim()) {
            const nameElement = document.getElementById('profile-name');
            if (nameElement) {
                nameElement.textContent = newName.trim();
            }
            console.log(`Nickname alterado para: ${newName.trim()}`);
        }
        this.closeProfilePopup();
    }

    changeAvatar() {
        const avatarOptions = [
            "assets/profile-default.svg",
            "https://via.placeholder.com/48/FF6B6B/FFFFFF?text=VP",
            "https://via.placeholder.com/48/4ECDC4/FFFFFF?text=VP",
            "https://via.placeholder.com/48/45B7D1/FFFFFF?text=VP",
            "https://via.placeholder.com/48/96CEB4/FFFFFF?text=VP",
            "https://via.placeholder.com/48/FFEAA7/333333?text=VP"
        ];

        const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
        const avatarElement = document.getElementById('profile-avatar');

        if (avatarElement) {
            avatarElement.src = randomAvatar;
        }

        console.log('Avatar alterado!');
        this.closeProfilePopup();
    }

    clearEventListeners() {
        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        console.log('🧹 Iniciando limpeza completa de event listeners...');

        // Remover handlers de apps
        if (contentBody.__soundMixerHandler) {
            contentBody.removeEventListener('click', contentBody.__soundMixerHandler);
            contentBody.removeEventListener('input', contentBody.__soundMixerHandler);
            delete contentBody.__soundMixerHandler;
            console.log('✅ Handlers de apps removidos');
        }

        // Remover handlers de dispositivos
        if (contentBody.__deviceHandler) {
            contentBody.removeEventListener('click', contentBody.__deviceHandler);
            delete contentBody.__deviceHandler;
            console.log('✅ Handlers de dispositivos removidos');
        }
        if (contentBody.__deviceSliderHandler) {
            contentBody.removeEventListener('input', contentBody.__deviceSliderHandler);
            delete contentBody.__deviceSliderHandler;
        }

        // Remover handlers de canais
        if (contentBody.__channelHandler) {
            contentBody.removeEventListener('click', contentBody.__channelHandler);
            delete contentBody.__channelHandler;
            console.log('✅ Handlers de canais removidos');
        }
        if (contentBody.__channelSliderHandler) {
            contentBody.removeEventListener('input', contentBody.__channelSliderHandler);
            delete contentBody.__channelSliderHandler;
        }

        // Limpeza agressiva de drag & drop
        this.clearDragDropListeners();

        // Forçar garbage collection de listeners órfãos
        this.forceCleanupOrphanedListeners();

        console.log('🧹 Limpeza completa finalizada');
    }

    forceCleanupOrphanedListeners() {
        // Remover todos os listeners inline que possam ter sido perdidos
        document.querySelectorAll('.add-channel-section-btn').forEach(btn => {
            // Clonar elemento para remover todos os listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        console.log('🧹 Cleanup forçado de listeners órfãos executado');
    }

    clearDragDropListeners() {
        // Remover listeners de elementos draggable
        document.querySelectorAll('.draggable').forEach(element => {
            element.removeEventListener('dragstart', element.__dragStartHandler);
            element.removeEventListener('dragend', element.__dragEndHandler);
        });

        // Remover listeners de drop zones
        document.querySelectorAll('.apps-drop-zone').forEach(zone => {
            zone.removeEventListener('dragover', zone.__dragOverHandler);
            zone.removeEventListener('dragleave', zone.__dragLeaveHandler);
            zone.removeEventListener('drop', zone.__dropHandler);
        });
    }

    async showScreen(screenName) {
        try {
            this.currentScreen = screenName;

            // Limpar event listeners antigos para evitar conflitos
            this.clearEventListeners();

            // Atualizar menu ativo
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`[data-screen="${screenName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Mostrar tela específica
            switch (screenName) {
                case 'apps':
                    await this.showAppsScreen();
                    break;
                case 'channels':
                    await this.showChannelsScreen();
                    break;
                case 'devices':
                    await this.showDevicesScreen();
                    break;
                case 'routing':
                    await this.showRoutingScreen();
                    break;
                default:
                    console.warn(`Tela desconhecida: ${screenName}`);
            }

        } catch (error) {
            console.error(`Erro ao carregar tela ${screenName}:`, error);
        }
    }

    // Métodos de telas
    async showAppsScreen() {
        const header = document.querySelector('.content-header h1');
        const masterContainer = document.getElementById('master-volume-container');

        if (header) {
            header.innerHTML = '<i class="fas fa-sliders me-2"></i>Controle de Volume por Aplicativos';
        }

        if (masterContainer) {
            masterContainer.style.display = 'flex';
        }

        // Carregar dados
        const apps = await this.apiClient.getAudioApps();
        const masterState = await this.apiClient.getMasterState();

        this.renderApps(apps);
        this.setupMasterControls(masterState);
    }

    async showChannelsScreen() {
        const header = document.querySelector('.content-header h1');
        const masterContainer = document.getElementById('master-volume-container');

        if (header) {
            header.innerHTML = '<i class="fas fa-broadcast-tower me-2"></i>Controle de Faixas de Áudio';
        }

        if (masterContainer) {
            masterContainer.style.display = 'none';
        }

        // Carregar dados
        const channels = await this.apiClient.getAudioChannels();
        this.renderChannels(channels);
    }

    async showDevicesScreen() {
        const header = document.querySelector('.content-header h1');
        const masterContainer = document.getElementById('master-volume-container');

        if (header) {
            header.innerHTML = '<i class="fas fa-microphone me-2"></i>Controle de Dispositivos de Áudio';
        }

        if (masterContainer) {
            masterContainer.style.display = 'none';
        }

        // Carregar dados
        const devices = await this.apiClient.getAudioDevices();
        this.renderDevices(devices);
    }

    // Métodos de renderização
    renderApps(apps) {
        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        contentBody.innerHTML = '';

        if (apps.length === 0) {
            contentBody.innerHTML = '<p>Nenhum aplicativo com áudio foi detectado.</p>';
            return;
        }

        apps.forEach(app => {
            const muted_class = app.is_muted ? 'fa-volume-mute' : 'fa-volume-up';
            const slider_disabled = app.is_muted ? 'disabled' : '';
            const solo_class = app.is_solo ? 'solo-active' : '';
            const solo_icon = app.is_solo ? 'fa-star' : 'fa-headphones';

            const audioCardHTML = `
                <div class="audio-card ${solo_class}" data-app-name="${app.name}">
                    <div class="app-icon-placeholder"></div>
                    <span class="app-name">${app.name}</span>
                    <div class="volume-control">
                        <button class="solo-btn" title="Solo ${app.name}" data-app-name="${app.name}">
                            <i class="fas ${solo_icon}"></i>
                        </button>
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

        this.setupAppEventListeners();
    }

    setupAppEventListeners() {
        // Event delegation para melhor performance
        const contentBody = document.querySelector('.content-body');

        // Remover listeners antigos (prevenção de duplicação)
        const oldHandler = contentBody.__soundMixerHandler;
        if (oldHandler) {
            contentBody.removeEventListener('click', oldHandler);
            contentBody.removeEventListener('input', oldHandler);
        }

        // Handler único com delegation
        const eventHandler = async (e) => {
            if (e.target.closest('.solo-btn')) {
                const appName = e.target.closest('.solo-btn').dataset.appName;
                if (appName) {
                    await this.apiClient.toggleAppSolo(appName);
                    const apps = await this.apiClient.getAudioApps();
                    this.renderApps(apps);
                }
            } else if (e.target.closest('.mute-btn')) {
                const appName = e.target.closest('.audio-card').dataset.appName;
                if (appName) {
                    await this.apiClient.toggleAppMute(appName);
                    const apps = await this.apiClient.getAudioApps();
                    this.renderApps(apps);
                }
            } else if (e.target.classList.contains('form-range')) {
                const appCard = e.target.closest('.audio-card');
                if (appCard) {
                    const appName = appCard.dataset.appName;
                    const volume = parseInt(e.target.value, 10);

                    // Atualizar porcentagem imediatamente
                    const percentageSpan = e.target.nextElementSibling;
                    if (percentageSpan) {
                        percentageSpan.textContent = `${volume}%`;
                    }

                    // Atualizar gradiente
                    this.updateSliderGradient(e.target, volume);

                    // Chamar API
                    await this.apiClient.setAppVolume(appName, volume);
                }
            }
        };

        // Adicionar listeners
        contentBody.addEventListener('click', eventHandler);
        contentBody.addEventListener('input', eventHandler);

        // Salvar referência para cleanup
        contentBody.__soundMixerHandler = eventHandler;

        // Configurar gradientes iniciais
        this.setupSliderGradients();
    }

    setupMasterControls(state) {
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

        // Event listeners do master
        const masterSlider = document.getElementById('master-volume-slider');
        const masterMuteBtn = document.getElementById('master-mute-btn');

        if (masterSlider) {
            this.updateSliderGradient(masterSlider, state.volume);

            masterSlider.addEventListener('input', async (e) => {
                const volume = parseInt(e.target.value, 10);
                document.getElementById('master-volume-percentage').textContent = `${volume}%`;
                this.updateSliderGradient(e.target, volume);
                await this.apiClient.setMasterVolume(volume);
            });
        }

        if (masterMuteBtn) {
            masterMuteBtn.addEventListener('click', async () => {
                const isMuted = await this.apiClient.toggleMasterMute();
                const icon = masterMuteBtn.querySelector('i');

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
        }
    }

    updateSliderGradient(slider, value) {
        const percentage = value;
        const leftColor = '#2563eb';
        const rightColor = 'rgba(255,255,255,0.1)';
        const gradient = `linear-gradient(to right, ${leftColor} 0%, ${leftColor} ${percentage}%, ${rightColor} ${percentage}%, ${rightColor} 100%)`;
        slider.style.background = gradient;
    }

    setupSliderGradients() {
        document.querySelectorAll('.form-range').forEach(slider => {
            if (slider.closest('.audio-card') && !slider.classList.contains('device-volume-slider')) {
                this.updateSliderGradient(slider, slider.value);
            }
        });
    }

    renderChannels(channelsData) {
        console.log("Canais recebidos:", channelsData);

        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        // Garantir que apps não atribuídos fiquem na faixa principal
        this.ensureAppsInMainChannel(channelsData);

        // Renderizar seções
        const outputSection = this.createChannelsSection('output', channelsData.output_channels, 'Faixas de Saída (Alto-falantes)', 'fa-volume-up');
        const inputSection = this.createChannelsSection('input', channelsData.input_channels, 'Faixas de Entrada (Microfones)', 'fa-microphone');

        contentBody.innerHTML = outputSection + inputSection;

        // Configurar event listeners
        this.setupChannelEventListeners();
    }

    ensureAppsInMainChannel(channelsData) {
        const availableApps = ["Discord", "Spotify", "Chrome", "Steam", "OBS Studio"];
        const allConnectedApps = [...channelsData.output_channels, ...channelsData.input_channels].flatMap(c => c.connected_apps);
        const unassignedApps = availableApps.filter(app => !allConnectedApps.includes(app));

        const mainOutputChannel = channelsData.output_channels.find(c => c.is_main);
        if (mainOutputChannel && unassignedApps.length > 0) {
            unassignedApps.forEach(app => {
                if (!mainOutputChannel.connected_apps.includes(app)) {
                    mainOutputChannel.connected_apps.push(app);
                }
            });
        }
    }

    createChannelsSection(type, channels, title, icon) {
        return `
            <div class="channels-section">
                <h3 class="channels-section-title">
                    <i class="fas ${icon}"></i>
                    ${title}
                </h3>
                <div class="channels-list">
                    ${channels.map(channel => this.createChannelCard(channel)).join('')}
                </div>
                <button class="add-channel-section-btn" data-type="${type}">
                    <i class="fas fa-plus"></i> Adicionar Faixa de ${type === 'input' ? 'Microfone' : 'Saída'}
                </button>
            </div>
        `;
    }

    createChannelCard(channel) {
        const muteClass = channel.is_muted ? 'fa-volume-mute' : 'fa-volume-up';
        const sliderDisabled = channel.is_muted ? 'disabled' : '';
        const isMainChannel = channel.is_main;
        const soloClass = channel.is_solo ? 'solo-active' : '';
        const cardClass = `channel-card ${isMainChannel ? 'main-channel' : ''} ${soloClass}`.trim();

        let channelContent;
        if (channel.type === 'input') {
            channelContent = this.createMicChannelContent(channel);
        } else {
            channelContent = this.createOutputChannelContent(channel);
        }

        const removeButton = isMainChannel ? '' : `
            <button class="remove-channel-btn" data-channel-id="${channel.id}" title="Remover Canal">
                <i class="fas fa-times"></i>
            </button>
        `;

        const channelIcon = isMainChannel ? '🎯' : (channel.type === 'input' ? '🎤' : '📡');
        const channelBadge = isMainChannel ? '<span class="main-badge">Principal</span>' : '';

        return `
            <div class="${cardClass}" data-channel-id="${channel.id}">
                <div class="channel-header">
                    <div class="channel-info">
                        <div class="channel-icon" style="background-color: ${channel.color}">
                            ${channelIcon}
                        </div>
                        <div class="channel-details">
                            <div class="channel-name-row">
                                <span class="channel-name">${channel.name}</span>
                                ${channelBadge}
                            </div>
                            <span class="channel-status">${channel.is_muted ? '🔇 Mutado' : '🔊 Ativo'}</span>
                        </div>
                    </div>

                    <div class="header-volume-controls">
                        <button class="solo-btn channel-solo-btn" data-channel-id="${channel.id}" title="Solo ${channel.name}">
                            <i class="fas ${channel.is_solo ? 'fa-star' : 'fa-headphones'}"></i>
                        </button>
                        <button class="mute-btn channel-mute-btn" data-channel-id="${channel.id}">
                            <i class="fas ${muteClass}"></i>
                        </button>
                        <input type="range" class="form-range channel-volume-slider"
                               min="0" max="100" value="${channel.volume}"
                               data-channel-id="${channel.id}" ${sliderDisabled}>
                        <span class="volume-percentage">${channel.volume}%</span>
                    </div>

                    ${removeButton}
                </div>
                ${channelContent}
            </div>
        `;
    }

    createMicChannelContent(channel) {
        return `
            <div class="channel-content mic-channel">
                <div class="mic-info">
                    <span class="mic-description">
                        ${channel.is_main ? 'Canal principal para captura de microfone' : 'Canal adicional para captura de áudio'}
                    </span>
                </div>
                <div class="device-selector">
                    <span class="device-label">Dispositivo de entrada:</span>
                    <div class="device-dropdown" data-channel-id="${channel.id}">
                        <div class="device-selected" data-device-id="${channel.input_device}">
                            ${this.getSelectedInputDeviceName(channel.input_device)} <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createOutputChannelContent(channel) {
        return `
            <div class="channel-content">
                <div class="channel-apps-zone" data-channel-id="${channel.id}">
                    <span class="apps-zone-label">Apps nesta faixa:</span>
                    <div class="apps-drop-zone">
                        ${channel.connected_apps.length > 0 ?
                            channel.connected_apps.map(app => `
                                <div class="app-tag draggable" draggable="true" data-app="${app}" data-source-channel="${channel.id}">
                                    ${this.getAppIcon(app)} ${app}
                                </div>
                            `).join('') :
                            '<div class="empty-drop-zone">Arraste apps aqui</div>'
                        }
                    </div>
                </div>
                <div class="device-selector">
                    <span class="device-label">Dispositivo de saída:</span>
                    <div class="device-dropdown" data-channel-id="${channel.id}">
                        <div class="device-selected" data-device-id="${channel.output_device}">
                            ${this.getSelectedDeviceName(channel.output_device)} <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper functions
    getAppIcon(appName) {
        const icons = {
            "Discord": "🎮", "Spotify": "🎵", "Chrome": "🌐", "Steam": "🎯", "OBS Studio": "📹"
        };
        return icons[appName] || "📱";
    }

    getSelectedDeviceName(deviceId) {
        const device = this.stateManager.state.devices.output.find(d => d.id === deviceId);
        return device ? device.name : "Dispositivo não encontrado";
    }

    getSelectedInputDeviceName(deviceId) {
        const device = this.stateManager.state.devices.input.find(d => d.id === deviceId);
        return device ? device.name : "Dispositivo não encontrado";
    }

    setupChannelEventListeners() {
        const contentBody = document.querySelector('.content-body');

        // Verificar se já existe handler e remover
        if (contentBody.__channelHandler) {
            contentBody.removeEventListener('click', contentBody.__channelHandler);
            console.log('🧹 Handler anterior de canais removido');
        }

        if (contentBody.__channelSliderHandler) {
            contentBody.removeEventListener('input', contentBody.__channelSliderHandler);
            console.log('🧹 Handler de slider anterior removido');
        }

        const channelHandler = async (e) => {
            if (e.target.closest('.add-channel-section-btn')) {
                // Proteção global contra múltiplas execuções
                if (this.creatingChannel) {
                    console.log('⚠️ Criação já em andamento, ignorando clique');
                    return;
                }

                const btn = e.target.closest('.add-channel-section-btn');
                const type = btn.dataset.type;
                const typeText = type === 'input' ? 'Microfone' : 'Saída';

                // Evitar múltiplos cliques no mesmo botão
                if (btn.disabled) return;

                this.creatingChannel = true;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';

                try {
                    const channelName = prompt(`Nome da nova faixa de ${typeText.toLowerCase()}:`, `Canal ${typeText} ${Date.now().toString().slice(-3)}`);

                    if (channelName && channelName.trim()) {
                        console.log(`🚀 Iniciando criação de faixa: ${channelName} (${type})`);
                        await this.createChannelIncremental(channelName.trim(), type, btn);
                        console.log(`✅ Faixa criada com sucesso: ${channelName}`);
                    } else if (channelName === '') {
                        console.log('❌ Nome vazio, criação cancelada');
                    } else {
                        console.log('❌ Criação cancelada pelo usuário');
                    }
                } catch (error) {
                    console.error('💥 Erro ao criar faixa:', error);
                } finally {
                    // Restaurar botão e liberar flag
                    this.creatingChannel = false;
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fas fa-plus"></i> Adicionar Faixa de ${typeText}`;
                    console.log('🔓 Flag de criação liberada');
                }
            } else if (e.target.closest('.channel-solo-btn')) {
                const channelId = e.target.closest('.channel-solo-btn').dataset.channelId;
                const isSolo = await this.apiClient.toggleChannelSolo(channelId);

                // Atualizar interface sem recriar
                this.updateChannelSoloInterface(channelId, isSolo);
            } else if (e.target.closest('.channel-mute-btn')) {
                const channelId = e.target.closest('.channel-mute-btn').dataset.channelId;
                const isMuted = await this.apiClient.toggleChannelMute(channelId);

                // Atualizar interface sem recriar
                this.updateChannelMuteInterface(channelId, isMuted);
            } else if (e.target.closest('.remove-channel-btn')) {
                const channelId = e.target.closest('.remove-channel-btn').dataset.channelId;
                const allChannels = [...this.stateManager.state.channels.output, ...this.stateManager.state.channels.input];
                const channel = allChannels.find(c => c.id === channelId);

                if (channel && confirm(`Deseja remover o canal "${channel.name}"?`)) {
                    await this.apiClient.removeChannel(channelId);
                    const channels = await this.apiClient.getAudioChannels();
                    this.renderChannels(channels);
                }
            }
        };

        const sliderHandler = async (e) => {
            if (e.target.classList.contains('channel-volume-slider')) {
                const channelId = e.target.dataset.channelId;
                const volume = parseInt(e.target.value, 10);

                const percentageSpan = e.target.nextElementSibling;
                if (percentageSpan) {
                    percentageSpan.textContent = `${volume}%`;
                }

                this.updateSliderGradient(e.target, volume);
                await this.apiClient.setChannelVolume(channelId, volume);
            }
        };

        contentBody.addEventListener('click', channelHandler);
        contentBody.addEventListener('input', sliderHandler);

        // Salvar referência para cleanup
        contentBody.__channelHandler = channelHandler;
        contentBody.__channelSliderHandler = sliderHandler;

        this.setupChannelDragDrop();

        document.querySelectorAll('.channel-volume-slider').forEach(slider => {
            this.updateSliderGradient(slider, slider.value);
        });
    }

    setupChannelDragDrop() {
        let draggedApp = null;

        // Configurar elementos draggable
        document.querySelectorAll('.draggable').forEach(element => {
            const dragStartHandler = (e) => {
                draggedApp = e.target.dataset.app;
                e.target.style.opacity = '0.5';
                console.log(`🚀 Iniciando arraste de: ${draggedApp}`);
            };

            const dragEndHandler = (e) => {
                e.target.style.opacity = '1';
                console.log(`🏁 Finalizando arraste de: ${draggedApp}`);
                draggedApp = null;
            };

            element.addEventListener('dragstart', dragStartHandler);
            element.addEventListener('dragend', dragEndHandler);

            // Salvar referências para cleanup
            element.__dragStartHandler = dragStartHandler;
            element.__dragEndHandler = dragEndHandler;
        });

        // Configurar zonas de drop
        document.querySelectorAll('.apps-drop-zone').forEach(zone => {
            const dragOverHandler = (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            };

            const dragLeaveHandler = (e) => {
                zone.classList.remove('drag-over');
            };

            const dropHandler = async (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                if (!draggedApp) return;

                const targetChannelId = zone.closest('.channel-apps-zone')?.dataset.channelId;
                if (targetChannelId) {
                    console.log(`📥 Drop detectado: ${draggedApp} → ${targetChannelId}`);
                    await this.moveAppToChannel(draggedApp, targetChannelId);
                }
            };

            zone.addEventListener('dragover', dragOverHandler);
            zone.addEventListener('dragleave', dragLeaveHandler);
            zone.addEventListener('drop', dropHandler);

            // Salvar referências para cleanup
            zone.__dragOverHandler = dragOverHandler;
            zone.__dragLeaveHandler = dragLeaveHandler;
            zone.__dropHandler = dropHandler;
        });
    }

    async moveAppToChannel(appName, targetChannelId) {
        this.stateManager.state.channels.output.forEach(channel => {
            const index = channel.connected_apps.indexOf(appName);
            if (index > -1) {
                channel.connected_apps.splice(index, 1);
            }
        });

        const targetChannel = this.stateManager.state.channels.output.find(c => c.id === targetChannelId);
        if (targetChannel && !targetChannel.connected_apps.includes(appName)) {
            targetChannel.connected_apps.push(appName);
        }

        const channels = await this.apiClient.getAudioChannels();
        this.renderChannels(channels);
    }

    async createChannelIncremental(channelName, type, button) {
        try {
            // Criar canal via API
            const newChannel = await this.apiClient.createChannel(channelName, type);

            // Encontrar a seção correta para inserir o novo canal
            const section = button.closest('.channels-section');
            const channelsList = section?.querySelector('.channels-list');

            if (channelsList) {
                // Criar HTML do novo canal
                const newChannelHTML = this.createChannelCard(newChannel);

                // Inserir antes do botão "Adicionar"
                channelsList.insertAdjacentHTML('beforeend', newChannelHTML);

                // Configurar listeners apenas para o novo canal
                this.setupNewChannelListeners(newChannel.id);

                console.log(`✅ Faixa "${channelName}" adicionada incrementalmente`);
            } else {
                console.warn('Não foi possível encontrar lista de canais, recriando interface...');
                const channels = await this.apiClient.getAudioChannels();
                this.renderChannels(channels);
            }

        } catch (error) {
            console.error('Erro ao criar faixa incrementalmente:', error);

            // Fallback: recriar interface completa
            const channels = await this.apiClient.getAudioChannels();
            this.renderChannels(channels);
        }
    }

    setupNewChannelListeners(channelId) {
        const card = document.querySelector(`[data-channel-id="${channelId}"]`);
        if (!card) return;

        // Configurar slider do novo canal
        const slider = card.querySelector('.channel-volume-slider');
        if (slider) {
            this.updateSliderGradient(slider, slider.value);
        }

        // Configurar drag & drop apenas para novos elementos
        const newDraggables = card.querySelectorAll('.draggable');
        const newDropZone = card.querySelector('.apps-drop-zone');

        this.setupDragDropForElements(newDraggables, [newDropZone]);

        console.log(`🎛️ Listeners configurados para novo canal: ${channelId}`);
    }

    setupDragDropForElements(draggableElements, dropZones) {
        let draggedApp = null;

        // Configurar elementos draggable específicos
        draggableElements.forEach(element => {
            const dragStartHandler = (e) => {
                draggedApp = e.target.dataset.app;
                e.target.style.opacity = '0.5';
            };

            const dragEndHandler = (e) => {
                e.target.style.opacity = '1';
                draggedApp = null;
            };

            element.addEventListener('dragstart', dragStartHandler);
            element.addEventListener('dragend', dragEndHandler);

            element.__dragStartHandler = dragStartHandler;
            element.__dragEndHandler = dragEndHandler;
        });

        // Configurar drop zones específicas
        dropZones.forEach(zone => {
            if (!zone) return;

            const dragOverHandler = (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            };

            const dragLeaveHandler = (e) => {
                zone.classList.remove('drag-over');
            };

            const dropHandler = async (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                if (!draggedApp) return;

                const targetChannelId = zone.closest('.channel-apps-zone')?.dataset.channelId;
                if (targetChannelId) {
                    await this.moveAppToChannel(draggedApp, targetChannelId);
                }
            };

            zone.addEventListener('dragover', dragOverHandler);
            zone.addEventListener('dragleave', dragLeaveHandler);
            zone.addEventListener('drop', dropHandler);

            zone.__dragOverHandler = dragOverHandler;
            zone.__dragLeaveHandler = dragLeaveHandler;
            zone.__dropHandler = dropHandler;
        });
    }

    renderDevices(devices) {
        console.log("Dispositivos recebidos:", devices);

        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        // Layout em duas colunas
        const devicesLayout = `
            <div class="devices-container">
                <!-- Coluna de Saída -->
                <div class="device-column">
                    <div class="device-section">
                        <h3 class="device-section-title subtitle">
                            <i class="fas fa-volume-up"></i>
                            Dispositivos de Saída
                        </h3>
                        <p class="device-section-subtitle">Alto-falantes e Fones de Ouvido</p>
                        <div class="devices-grid">
                            ${devices.output.map(device => this.createDeviceCard(device, 'output')).join('')}
                        </div>
                    </div>
                </div>

                <!-- Coluna de Entrada -->
                <div class="device-column">
                    <div class="device-section">
                        <h3 class="device-section-title subtitle">
                            <i class="fas fa-microphone"></i>
                            Dispositivos de Entrada
                        </h3>
                        <p class="device-section-subtitle">Microfones e Dispositivos de Captura</p>
                        <div class="devices-grid">
                            ${devices.input.map(device => this.createDeviceCard(device, 'input')).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        contentBody.innerHTML = devicesLayout;
        this.setupDeviceEventListeners();
    }

    createDeviceCard(device, type) {
        const isDefault = device.is_default;
        const statusClass = isDefault ? 'device-active' : 'device-inactive';
        const buttonText = isDefault ? '✓ Padrão' : 'Selecionar';
        const buttonClass = isDefault ? 'btn-success' : 'btn-outline';
        const muteClass = device.is_muted ? 'fa-volume-mute' : 'fa-volume-up';
        const sliderDisabled = device.is_muted ? 'disabled' : '';

        return `
            <div class="device-card ${statusClass}" data-device-id="${device.id}">
                <!-- Header do dispositivo -->
                <div class="device-header">
                    <div class="device-info">
                        <div class="device-icon">
                            ${type === 'input' ? '🎤' : '🔊'}
                        </div>
                        <div class="device-details">
                            <span class="device-name">${device.name}</span>
                            <span class="device-status">${isDefault ? 'Dispositivo Padrão' : 'Disponível'}</span>
                        </div>
                    </div>

                    <button class="select-device-btn ${buttonClass}"
                            data-device-id="${device.id}"
                            data-device-type="${type}">
                        ${buttonText}
                    </button>
                </div>

                <!-- Controles de volume -->
                <div class="device-volume-controls">
                    <button class="mute-btn device-mute-btn" data-device-id="${device.id}" data-device-type="${type}">
                        <i class="fas ${muteClass}"></i>
                    </button>
                    <input type="range" class="form-range device-volume-slider"
                           min="0" max="100" value="${device.volume}"
                           data-device-id="${device.id}" data-device-type="${type}" ${sliderDisabled}>
                    <span class="volume-percentage">${device.volume}%</span>
                </div>
            </div>
        `;
    }

    setupDeviceEventListeners() {
        const contentBody = document.querySelector('.content-body');

        // Event delegation para dispositivos
        const deviceHandler = async (e) => {
            // Botão de seleção de dispositivo padrão
            if (e.target.closest('.select-device-btn')) {
                const btn = e.target.closest('.select-device-btn');
                const deviceId = btn.dataset.deviceId;
                const deviceType = btn.dataset.deviceType;

                await this.apiClient.setDefaultDevice(deviceId, deviceType);

                // Atualizar interface sem recriar (preservar event listeners)
                this.updateDeviceDefaultButtons(deviceType, deviceId);
            }
            // Botão de mute do dispositivo
            else if (e.target.closest('.device-mute-btn')) {
                const btn = e.target.closest('.device-mute-btn');
                const deviceId = btn.dataset.deviceId;
                const deviceType = btn.dataset.deviceType;

                const isMuted = await this.apiClient.toggleDeviceMute(deviceId, deviceType);

                // Atualizar interface sem recriar
                const icon = btn.querySelector('i');
                const slider = btn.closest('.device-volume-controls').querySelector('.device-volume-slider');

                if (isMuted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                    slider.disabled = true;
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                    slider.disabled = false;
                }
            }
        };

        // Volume sliders dos dispositivos
        const sliderHandler = async (e) => {
            if (e.target.classList.contains('device-volume-slider')) {
                const deviceId = e.target.dataset.deviceId;
                const deviceType = e.target.dataset.deviceType;
                const volume = parseInt(e.target.value, 10);

                // Atualizar porcentagem
                const percentageSpan = e.target.nextElementSibling;
                if (percentageSpan) {
                    percentageSpan.textContent = `${volume}%`;
                }

                // Atualizar gradiente
                this.updateSliderGradient(e.target, volume);

                // Chamar API
                await this.apiClient.setDeviceVolume(deviceId, deviceType, volume);
            }
        };

        // Adicionar listeners específicos para dispositivos
        contentBody.addEventListener('click', deviceHandler);
        contentBody.addEventListener('input', sliderHandler);

        // Salvar referência para cleanup
        contentBody.__deviceHandler = deviceHandler;
        contentBody.__deviceSliderHandler = sliderHandler;

        // Configurar gradientes iniciais
        document.querySelectorAll('.device-volume-slider').forEach(slider => {
            this.updateSliderGradient(slider, slider.value);
        });
    }

    updateDeviceDefaultButtons(deviceType, selectedDeviceId) {
        // Atualizar todos os botões do tipo de dispositivo
        document.querySelectorAll(`.select-device-btn[data-device-type="${deviceType}"]`).forEach(btn => {
            const deviceId = btn.dataset.deviceId;
            const card = btn.closest('.device-card');
            const statusSpan = card?.querySelector('.device-status');

            if (deviceId === selectedDeviceId) {
                // Dispositivo selecionado como padrão
                btn.textContent = '✓ Padrão';
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-success');

                if (card) {
                    card.classList.add('device-active');
                    card.classList.remove('device-inactive');
                }

                if (statusSpan) {
                    statusSpan.textContent = 'Dispositivo Padrão';
                }

                console.log(`✅ ${deviceType} padrão atualizado para: ${deviceId}`);
            } else {
                // Outros dispositivos
                btn.textContent = 'Selecionar';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline');

                if (card) {
                    card.classList.remove('device-active');
                    card.classList.add('device-inactive');
                }

                if (statusSpan) {
                    statusSpan.textContent = 'Disponível';
                }
            }
        });
    }

    updateChannelSoloInterface(channelId, isSolo) {
        // Consultar estado real do StateManager
        const allChannels = [...this.stateManager.state.channels.output, ...this.stateManager.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (!channel) return;

        const channelsOfSameType = channel.type === 'input' ?
            this.stateManager.state.channels.input :
            this.stateManager.state.channels.output;

        // Atualizar interface baseada no estado real
        channelsOfSameType.forEach(ch => {
            const card = document.querySelector(`[data-channel-id="${ch.id}"]`);
            if (!card) return;

            const soloBtn = card.querySelector('.channel-solo-btn');
            const soloIcon = soloBtn?.querySelector('i');
            const channelName = card.querySelector('.channel-name');

            // Usar estado real do StateManager
            if (ch.is_solo) {
                // Canal em solo
                card.classList.add('solo-active');
                if (soloIcon) {
                    soloIcon.classList.remove('fa-headphones');
                    soloIcon.classList.add('fa-star');
                }
                if (channelName) {
                    channelName.style.color = '#fbbf24';
                }
            } else {
                // Canal normal
                card.classList.remove('solo-active');
                if (soloIcon) {
                    soloIcon.classList.remove('fa-star');
                    soloIcon.classList.add('fa-headphones');
                }
                if (channelName) {
                    channelName.style.color = '';
                }
            }

            // Atualizar mute baseado no estado real
            this.updateChannelMuteInterface(ch.id, ch.is_muted);
        });
    }

    updateChannelMuteInterface(channelId, forceMuted = null) {
        const card = document.querySelector(`[data-channel-id="${channelId}"]`);
        if (!card) return;

        // Consultar estado real se não foi passado parâmetro
        const allChannels = [...this.stateManager.state.channels.output, ...this.stateManager.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (!channel) return;

        const isMuted = forceMuted !== null ? forceMuted : channel.is_muted;

        const muteBtn = card.querySelector('.channel-mute-btn');
        const muteIcon = muteBtn?.querySelector('i');
        const slider = card.querySelector('.channel-volume-slider');
        const statusSpan = card.querySelector('.channel-status');

        if (muteIcon && slider) {
            if (isMuted) {
                muteIcon.classList.remove('fa-volume-up');
                muteIcon.classList.add('fa-volume-mute');
                slider.disabled = true;
                if (statusSpan) {
                    statusSpan.textContent = '🔇 Mutado';
                }
            } else {
                muteIcon.classList.remove('fa-volume-mute');
                muteIcon.classList.add('fa-volume-up');
                slider.disabled = false;
                if (statusSpan) {
                    statusSpan.textContent = '🔊 Ativo';
                }
            }
        }
    }

    async showRoutingScreen() {
        const header = document.querySelector('.content-header h1');
        const masterContainer = document.getElementById('master-volume-container');

        if (header) {
            header.innerHTML = '<i class="fas fa-route me-2"></i>Roteamento de Áudio Virtual';
        }

        if (masterContainer) {
            masterContainer.style.display = 'none';
        }

        const apps = await this.apiClient.getAudioApps();
        const cables = await this.apiClient.getVirtualCables();

        this.renderRoutingScreen(apps, cables);
    }

    renderRoutingScreen(apps, cables) {
        const contentBody = document.querySelector('.content-body');
        if (!contentBody) return;

        const hasVirtualCables = cables.output.length > 0 || cables.input.length > 0;

        if (!hasVirtualCables) {
            contentBody.innerHTML = `
                <div class="routing-empty-state">
                    <i class="fas fa-plug" style="font-size: 4rem; color: #6b7280; margin-bottom: 1rem;"></i>
                    <h3>Nenhum Cabo Virtual Detectado</h3>
                    <p>Para usar o roteamento de áudio, você precisa instalar um software de cabo virtual como:</p>
                    <ul style="text-align: left; margin: 1.5rem auto; max-width: 500px;">
                        <li><strong>VB-Audio Virtual Cable</strong> - Gratuito</li>
                        <li><strong>Voicemeeter</strong> - Mixer de áudio virtual</li>
                        <li><strong>Virtual Audio Cable (VAC)</strong> - Pago</li>
                    </ul>
                    <a href="https://vb-audio.com/Cable/" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-download"></i> Baixar VB-Audio Cable
                    </a>
                </div>
            `;
            return;
        }

        const routingHTML = `
            <div class="routing-container">
                <div class="routing-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Rotear aplicativos para cabos virtuais permite controle avançado de áudio</span>
                </div>

                <div class="routing-apps-section">
                    <h3><i class="fas fa-sliders"></i> Aplicativos com Áudio</h3>
                    <div class="routing-apps-list">
                        ${apps.map(app => this.createRoutingAppCard(app, cables)).join('')}
                    </div>
                </div>

                <div class="routing-cables-section">
                    <h3><i class="fas fa-plug"></i> Cabos Virtuais Disponíveis</h3>
                    <div class="routing-cables-grid">
                        ${cables.output.map(cable => `
                            <div class="routing-cable-card">
                                <i class="fas fa-arrow-right"></i>
                                <span class="cable-name">${cable.name}</span>
                                <span class="cable-type">Saída</span>
                            </div>
                        `).join('')}
                        ${cables.input.map(cable => `
                            <div class="routing-cable-card">
                                <i class="fas fa-arrow-left"></i>
                                <span class="cable-name">${cable.name}</span>
                                <span class="cable-type">Entrada</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        contentBody.innerHTML = routingHTML;
        this.setupRoutingEventListeners(cables);
    }

    createRoutingAppCard(app, cables) {
        return `
            <div class="routing-app-card" data-app-name="${app.name}">
                <div class="routing-app-info">
                    <div class="app-icon-placeholder"></div>
                    <span class="app-name">${app.name}</span>
                </div>
                <div class="routing-app-controls">
                    <select class="routing-device-select" data-app-name="${app.name}">
                        <option value="default">Dispositivo Padrão</option>
                        ${cables.output.map(cable => `
                            <option value="${cable.id}">${cable.name}</option>
                        `).join('')}
                    </select>
                    <button class="btn-route" data-app-name="${app.name}" title="Aplicar Roteamento">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupRoutingEventListeners(cables) {
        const contentBody = document.querySelector('.content-body');

        const routeHandler = async (e) => {
            if (e.target.closest('.btn-route')) {
                const btn = e.target.closest('.btn-route');
                const appName = btn.dataset.appName;
                const select = document.querySelector(`.routing-device-select[data-app-name="${appName}"]`);
                const deviceId = select.value;

                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                if (deviceId === 'default') {
                    await this.apiClient.resetAppRouting(appName);
                } else {
                    await this.apiClient.routeAppToDevice(appName, deviceId);
                }

                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check"></i>';

                setTimeout(() => {
                    btn.classList.add('success-flash');
                    setTimeout(() => btn.classList.remove('success-flash'), 1000);
                }, 100);
            }
        };

        contentBody.addEventListener('click', routeHandler);
        contentBody.__routingHandler = routeHandler;
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error handling wrapper
    async safeExecute(operation, errorMessage) {
        try {
            return await operation();
        } catch (error) {
            console.error(errorMessage, error);
            return null;
        }
    }
}

export default SoundMixerApp;