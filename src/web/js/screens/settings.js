export class SettingsScreen {
    constructor(apiClient) {
        this.api = apiClient;
        this.settings = this.getDefaultSettings();
    }

    getDefaultSettings() {
        const saved = localStorage.getItem('sonus_settings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            startup: true,
            notifications: true,
            minimizeToTray: true,
            theme: 'dark',
            updateInterval: 1000,
            showSystemProcesses: false,
            defaultOutputDevice: null,
            defaultInputDevice: null
        };
    }

    saveSettings() {
        localStorage.setItem('sonus_settings', JSON.stringify(this.settings));
        console.log('Configurações salvas:', this.settings);
    }

    render() {
        return `
            <div class="settings-container">
                <div class="settings-section">
                    <h2 class="settings-section-title">
                        <i class="fas fa-power-off"></i>
                        Sistema
                    </h2>

                    <div class="settings-option">
                        <div class="settings-option-info">
                            <div class="settings-option-label">Iniciar com o Windows</div>
                            <div class="settings-option-description">Abre automaticamente quando o computador liga</div>
                        </div>
                        <div class="settings-option-control">
                            <label class="settings-toggle">
                                <input type="checkbox" id="setting-startup" ${this.settings.startup ? 'checked' : ''}>
                                <span class="settings-toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="settings-option">
                        <div class="settings-option-info">
                            <div class="settings-option-label">Minimizar para a bandeja</div>
                            <div class="settings-option-description">Fica em execução na área de notificação</div>
                        </div>
                        <div class="settings-option-control">
                            <label class="settings-toggle">
                                <input type="checkbox" id="setting-minimize-tray" ${this.settings.minimizeToTray ? 'checked' : ''}>
                                <span class="settings-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h2 class="settings-section-title">
                        <i class="fas fa-bell"></i>
                        Notificações
                    </h2>

                    <div class="settings-option">
                        <div class="settings-option-info">
                            <div class="settings-option-label">Ativar notificações</div>
                            <div class="settings-option-description">Receber alertas sobre mudanças de dispositivos</div>
                        </div>
                        <div class="settings-option-control">
                            <label class="settings-toggle">
                                <input type="checkbox" id="setting-notifications" ${this.settings.notifications ? 'checked' : ''}>
                                <span class="settings-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h2 class="settings-section-title">
                        <i class="fas fa-tachometer-alt"></i>
                        Performance
                    </h2>

                    <div class="settings-option">
                        <div class="settings-option-info">
                            <div class="settings-option-label">Intervalo de atualização</div>
                            <div class="settings-option-description">Frequência de verificação de novos apps (ms)</div>
                        </div>
                        <div class="settings-option-control">
                            <select class="settings-select" id="setting-update-interval">
                                <option value="500" ${this.settings.updateInterval === 500 ? 'selected' : ''}>500ms (Rápido)</option>
                                <option value="1000" ${this.settings.updateInterval === 1000 ? 'selected' : ''}>1000ms (Normal)</option>
                                <option value="2000" ${this.settings.updateInterval === 2000 ? 'selected' : ''}>2000ms (Econômico)</option>
                                <option value="5000" ${this.settings.updateInterval === 5000 ? 'selected' : ''}>5000ms (Lento)</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-option">
                        <div class="settings-option-info">
                            <div class="settings-option-label">Mostrar processos do sistema</div>
                            <div class="settings-option-description">Exibir processos como svchost e outros</div>
                        </div>
                        <div class="settings-option-control">
                            <label class="settings-toggle">
                                <input type="checkbox" id="setting-show-system" ${this.settings.showSystemProcesses ? 'checked' : ''}>
                                <span class="settings-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h2 class="settings-section-title">
                        <i class="fas fa-info-circle"></i>
                        Sobre
                    </h2>

                    <div class="settings-info-box">
                        <i class="fas fa-music"></i>
                        <span class="settings-info-text">
                            <strong>Sonus Mixer</strong> - Mixer de áudio profissional para Windows<br>
                            Versão: 1.0.0-beta<br>
                            Desenvolvido com Python + PyWebView
                        </span>
                    </div>

                    <div style="margin-top: 16px; display: flex; gap: 12px;">
                        <button class="settings-button" id="btn-export-settings">
                            <i class="fas fa-download"></i> Exportar Configurações
                        </button>
                        <button class="settings-button settings-button-secondary" id="btn-reset-settings">
                            <i class="fas fa-undo"></i> Restaurar Padrões
                        </button>
                    </div>
                </div>

                <div class="settings-version">
                    Sonus Mixer © 2024 | Made with ❤️
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const settingIds = [
            'startup',
            'minimize-tray',
            'notifications',
            'show-system',
            'update-interval'
        ];

        settingIds.forEach(id => {
            const element = document.getElementById(`setting-${id}`);
            if (element) {
                element.addEventListener('change', (e) => {
                    const settingKey = id.replace(/-/g, '');
                    if (settingKey === 'updateinterval') {
                        this.settings.updateInterval = parseInt(e.target.value);
                    } else {
                        this.settings[settingKey] = e.target.checked;
                    }
                    this.saveSettings();
                });
            }
        });

        const exportBtn = document.getElementById('btn-export-settings');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }

        const resetBtn = document.getElementById('btn-reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sonus-mixer-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        console.log('Configurações exportadas');
    }

    resetSettings() {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
            localStorage.removeItem('sonus_settings');
            this.settings = this.getDefaultSettings();
            location.reload();
        }
    }

    getSettings() {
        return this.settings;
    }
}
