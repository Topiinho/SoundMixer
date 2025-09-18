// SoundMixer - JavaScript Nativo Funcional

class MixerNativo {
    constructor() {
        this.channels = new Map();
        this.activityLog = [];
        this.isNative = typeof pywebview !== 'undefined';
        
        console.log(`🎛️ Mixer Nativo iniciando... (${this.isNative ? 'PyWebView' : 'Navegador'})`);
        this.init();
    }
    
    async init() {
        try {
            this.setupSpectrumAnalyzer();
            await this.loadChannels();
            this.startAnimations();
            this.logActivity('Sistema iniciado');
            
            console.log('✅ Mixer Nativo inicializado');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }
    
    async callPython(method, ...args) {
        try {
            if (this.isNative && pywebview.api) {
                return await pywebview.api[method](...args);
            } else {
                console.log(`📞 Demo: ${method}(${args.join(', ')})`);
                return this.simulateCall(method, ...args);
            }
        } catch (error) {
            console.error(`Erro chamando ${method}:`, error);
            return this.simulateCall(method, ...args);
        }
    }
    
    simulateCall(method, ...args) {
        switch (method) {
            case 'get_active_applications':
                return [
                    { pid: 1001, name: 'Discord', volume: 0.8, muted: false },
                    { pid: 1002, name: 'Spotify', volume: 0.6, muted: false },
                    { pid: 1003, name: 'Chrome', volume: 0.7, muted: false }
                ];
            case 'get_spectrum_data':
                return Array.from({ length: 32 }, () => Math.random() * 80 + 10);
            default:
                return true;
        }
    }
    
    async loadChannels() {
        const apps = await this.callPython('get_active_applications');
        
        apps.forEach((app, index) => {
            this.createChannelElement(index + 1, app);
        });
        
        this.logActivity(`${apps.length} aplicações carregadas`);
    }
    
    createChannelElement(channelId, app) {
        const channelsGrid = document.getElementById('channels-grid');
        if (!channelsGrid) return;
        
        const channelHTML = `
            <div class="channel-strip" data-channel-id="${channelId}">
                <div class="channel-header">
                    <div class="channel-title">
                        <span class="channel-number">CH ${channelId}</span>
                        <span class="app-name" style="color: #2196F3; font-weight: bold;">${app.name}</span>
                    </div>
                </div>
                
                <div class="vu-meter">
                    <div class="vu-bars" id="vu-${channelId}"></div>
                </div>
                
                <div class="gain-control">
                    <label>GAIN</label>
                    <input type="range" class="gain-slider" min="0" max="200" value="100" 
                           onchange="setChannelGain(${channelId}, this.value)" data-channel="${channelId}">
                    <span class="gain-value">0dB</span>
                </div>
                
                <div class="channel-buttons">
                    <button class="btn-solo" onclick="toggleSolo(${channelId})" data-channel="${channelId}">SOLO</button>
                    <button class="btn-mute" onclick="toggleMute(${channelId})" data-channel="${channelId}">MUTE</button>
                </div>
                
                <div class="volume-fader">
                    <input type="range" class="fader" min="0" max="100" value="${Math.round(app.volume * 100)}" 
                           onchange="setChannelVolume(${app.pid}, this.value)" data-channel="${channelId}" data-pid="${app.pid}">
                </div>
            </div>
        `;
        
        channelsGrid.insertAdjacentHTML('beforeend', channelHTML);
        this.setupVUMeter(channelId);
        
        this.channels.set(channelId, {
            app: app,
            volume: app.volume * 100,
            muted: false,
            solo: false
        });
    }
    
    setupVUMeter(channelId) {
        const vuContainer = document.getElementById(`vu-${channelId}`);
        if (vuContainer) {
            vuContainer.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const bar = document.createElement('div');
                bar.className = 'vu-bar';
                bar.style.cssText = `
                    width: 8px; height: 6px; margin: 1px; border-radius: 1px;
                    opacity: 0.3; transition: opacity 0.1s ease-out;
                    background-color: hsl(${120 - (i * 10)}, 70%, 50%);
                `;
                vuContainer.appendChild(bar);
            }
            vuContainer.style.cssText = `
                display: grid; grid-template-columns: repeat(4, 1fr);
                grid-gap: 1px; padding: 4px; height: 80px;
                background-color: var(--bg-floating); border-radius: 4px;
            `;
        }
    }
    
    setupSpectrumAnalyzer() {
        const spectrumDisplay = document.getElementById('spectrum-display');
        if (spectrumDisplay) {
            spectrumDisplay.innerHTML = '';
            for (let i = 0; i < 32; i++) {
                const bar = document.createElement('div');
                bar.className = 'spectrum-bar';
                bar.style.cssText = `
                    width: 6px; height: 2px; margin-right: 1px;
                    border-radius: 2px 2px 0 0; transition: height 0.1s ease-out;
                    background-color: hsl(${120 + i * 5}, 70%, 50%);
                `;
                spectrumDisplay.appendChild(bar);
            }
        }
    }
    
    startAnimations() {
        // VU meters
        setInterval(() => {
            this.channels.forEach((channel, channelId) => {
                const level = Math.random() * 12;
                this.updateVUMeter(channelId, level);
            });
        }, 100);
        
        // Spectrum
        setInterval(async () => {
            const data = await this.callPython('get_spectrum_data');
            const bars = document.querySelectorAll('.spectrum-bar');
            data.forEach((value, index) => {
                if (bars[index]) {
                    bars[index].style.height = `${value}%`;
                }
            });
        }, 50);
    }
    
    updateVUMeter(channelId, level) {
        const vuBars = document.querySelectorAll(`#vu-${channelId} .vu-bar`);
        const activeCount = Math.floor(level);
        
        vuBars.forEach((bar, index) => {
            bar.style.opacity = index < activeCount ? '1' : '0.3';
        });
    }
    
    logActivity(message) {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour12: false });
        this.activityLog.unshift({ timestamp, message });
        
        if (this.activityLog.length > 10) {
            this.activityLog = this.activityLog.slice(0, 10);
        }
        
        this.updateActivityDisplay();
        console.log(`[${timestamp}] ${message}`);
    }
    
    updateActivityDisplay() {
        const activityLog = document.getElementById('activity-log');
        if (!activityLog) return;
        
        activityLog.innerHTML = this.activityLog.map(entry => `
            <div class="activity-item">
                <span class="activity-time">${entry.timestamp}</span>
                <span class="activity-text">${entry.message}</span>
            </div>
        `).join('');
    }
    
    showNotification(message, type = 'info') {
        const colors = {
            success: '#4caf50',
            error: '#f44336', 
            warning: '#ff9800',
            info: '#2196f3'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: -350px;
            background: var(--bg-secondary); color: var(--text-normal);
            padding: 12px 16px; border-radius: 8px;
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000; max-width: 300px;
            transition: right 0.3s ease-out;
        `;
        
        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => notification.style.right = '20px');
        setTimeout(() => {
            notification.style.right = '-350px';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// === FUNÇÕES GLOBAIS FUNCIONAIS ===

async function setMasterVolume(value) {
    const result = await window.mixer.callPython('set_master_volume', value / 100);
    document.getElementById('master-value').textContent = `${value}%`;
    window.mixer.updateSliderBackground(document.getElementById('master-volume'), value);
    window.mixer.logActivity(`Master: ${value}%`);
}

async function transportControl(action) {
    await window.mixer.callPython('transport_control', action);
    window.mixer.logActivity(`${action.toUpperCase()}`);
    window.mixer.showNotification(`${action.toUpperCase()} executado`, 'info');
}

async function addChannel() {
    const channelId = await window.mixer.callPython('create_channel');
    window.mixer.createChannelElement(channelId, { 
        name: `Canal ${channelId}`, 
        volume: 0.75, 
        pid: 1000 + channelId 
    });
    window.mixer.logActivity(`Canal ${channelId} criado`);
    window.mixer.showNotification(`Canal ${channelId} adicionado`, 'success');
}

async function toggleMute(channelId) {
    const isActive = await window.mixer.callPython('toggle_mute', channelId);
    const muteBtn = document.querySelector(`[data-channel="${channelId}"].btn-mute`);
    
    if (muteBtn) {
        muteBtn.style.background = isActive ? 
            'linear-gradient(45deg, #f44336, #d32f2f)' :
            'linear-gradient(45deg, #4caf50, #2e7d32)';
        muteBtn.style.boxShadow = isActive ? '0 0 10px #f44336' : 'none';
    }
    
    window.mixer.logActivity(`CH ${channelId}: ${isActive ? 'MUTED' : 'unmuted'}`);
}

async function toggleSolo(channelId) {
    const isActive = await window.mixer.callPython('toggle_solo', channelId);
    const soloBtn = document.querySelector(`[data-channel="${channelId}"].btn-solo`);
    
    if (soloBtn) {
        soloBtn.style.background = isActive ? 
            'linear-gradient(45deg, #ffeb3b, #ff9800)' :
            'linear-gradient(45deg, #ff9800, #f57c00)';
        soloBtn.style.boxShadow = isActive ? '0 0 10px #ffeb3b' : 'none';
    }
    
    window.mixer.logActivity(`CH ${channelId}: ${isActive ? 'SOLO' : 'normal'}`);
}

async function setChannelVolume(pid, volume) {
    await window.mixer.callPython('set_application_volume', pid, volume / 100);
    const channelId = pid - 1000;
    window.mixer.logActivity(`CH ${channelId}: Vol ${volume}%`);
}

async function setChannelGain(channelId, gain) {
    await window.mixer.callPython('set_channel_gain', channelId, gain);
    const dbValue = Math.round((gain - 100) / 5);
    
    // Update gain display
    const gainValue = document.querySelector(`[data-channel="${channelId}"]`).parentElement.querySelector('.gain-value');
    if (gainValue) {
        gainValue.textContent = `${dbValue >= 0 ? '+' : ''}${dbValue}dB`;
    }
}

// Função auxiliar para slider background
function updateSliderBackground(slider, value) {
    const percentage = (value / slider.max) * 100;
    slider.style.background = `linear-gradient(
        to right,
        #2196F3 0%, #2196F3 ${percentage}%,
        #4f545c ${percentage}%, #4f545c 100%
    )`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.mixer = new MixerNativo();
    
    // Setup slider backgrounds
    window.mixer.updateSliderBackground = updateSliderBackground;
    
    // Initial slider setup
    const masterSlider = document.getElementById('master-volume');
    if (masterSlider) {
        updateSliderBackground(masterSlider, 85);
    }
});