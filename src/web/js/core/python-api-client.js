/* Cliente de API para integração com backend Python */

class PythonAPIClient {
    constructor(stateManager) {
        this.state = stateManager;
        this.mockData = {
            channels: {
                output: [
                    {
                        id: 'main-output',
                        name: 'Faixa Principal',
                        type: 'output',
                        volume: 80,
                        is_muted: false,
                        is_solo: false,
                        is_main: true,
                        color: '#2563eb',
                        connected_apps: ['Discord', 'Spotify'],
                        output_device: 'default-speakers'
                    }
                ],
                input: [
                    {
                        id: 'main-input',
                        name: 'Microfone Principal',
                        type: 'input',
                        volume: 70,
                        is_muted: false,
                        is_solo: false,
                        is_main: true,
                        color: '#dc2626',
                        connected_apps: [],
                        input_device: 'default-mic'
                    }
                ]
            }
        };
    }

    // ===== APIs de Aplicativos =====
    async getAudioApps() {
        try {
            // Verificar se estamos no PyWebView
            if (window.pywebview && window.pywebview.api) {
                const apps = await window.pywebview.api.get_audio_apps();
                console.log('📱 Apps obtidos do Python:', apps);

                // Mapear para formato esperado pela interface
                return apps.map(app => ({
                    name: app.name,
                    volume: app.volume || 50,
                    is_muted: app.is_muted || false,
                    is_solo: false, // Funcionalidade não implementada no backend
                    icon: app.icon || null,
                    pid: app.pid
                }));
            } else {
                // Fallback para dados mock
                console.log('🔧 Usando dados mock para apps');
                return Object.entries(this.state.state.apps).map(([name, state]) => ({
                    name,
                    volume: state.volume,
                    is_muted: state.is_muted,
                    is_solo: state.is_solo,
                    icon: null
                }));
            }
        } catch (error) {
            console.error('❌ Erro ao obter apps:', error);
            return [];
        }
    }

    async setAppVolume(appName, volume) {
        try {
            if (window.pywebview && window.pywebview.api) {
                await window.pywebview.api.set_app_volume(appName, volume);
                console.log(`🔊 Volume do ${appName} definido para ${volume}%`);
            } else {
                // Fallback para mock
                this.state.updateAppState(appName, { volume });
                console.log(`🔧 Mock: Volume do ${appName} definido para ${volume}%`);
            }
        } catch (error) {
            console.error(`❌ Erro ao definir volume do ${appName}:`, error);
        }
    }

    async toggleAppMute(appName) {
        try {
            if (window.pywebview && window.pywebview.api) {
                const isMuted = await window.pywebview.api.toggle_app_mute(appName);
                console.log(`🔇 ${appName} ${isMuted ? 'MUTADO' : 'DESMUTADO'}`);
                return isMuted;
            } else {
                // Fallback para mock
                const currentState = this.state.getAppState(appName);
                if (!currentState) return false;

                const newMuteState = !currentState.is_muted;
                this.state.updateAppState(appName, { is_muted: newMuteState });
                console.log(`🔧 Mock: ${appName} ${newMuteState ? 'MUTADO' : 'DESMUTADO'}`);
                return newMuteState;
            }
        } catch (error) {
            console.error(`❌ Erro ao alternar mute do ${appName}:`, error);
            return false;
        }
    }

    async toggleAppSolo(appName) {
        // Funcionalidade solo não implementada no backend Python
        // Usar implementação mock por enquanto
        try {
            const currentState = this.state.getAppState(appName);
            if (!currentState) return false;

            if (this.state.state.solo.currentApp === appName) {
                this.state.deactivateSolo('app');
                console.log(`⭐ Solo DESATIVADO de ${appName}`);
                return false;
            } else {
                this.state.activateSolo('app', appName);
                console.log(`⭐ Solo ATIVADO em ${appName}`);
                return true;
            }
        } catch (error) {
            console.error(`❌ Erro ao alternar solo do ${appName}:`, error);
            return false;
        }
    }

    // ===== APIs de Volume Master =====
    async getMasterState() {
        try {
            if (window.pywebview && window.pywebview.api) {
                const state = await window.pywebview.api.get_master_state();
                console.log('🎛️ Estado master obtido do Python:', state);
                return state;
            } else {
                // Fallback para mock
                return this.state.getMasterState();
            }
        } catch (error) {
            console.error('❌ Erro ao obter estado master:', error);
            return { volume: 50, is_muted: false };
        }
    }

    async setMasterVolume(volume) {
        try {
            if (window.pywebview && window.pywebview.api) {
                await window.pywebview.api.set_master_volume(volume);
                console.log(`🎛️ Volume master definido para ${volume}%`);
            } else {
                // Fallback para mock
                this.state.updateMasterState({ volume });
                console.log(`🔧 Mock: Volume master definido para ${volume}%`);
            }
        } catch (error) {
            console.error('❌ Erro ao definir volume master:', error);
        }
    }

    async toggleMasterMute() {
        try {
            if (window.pywebview && window.pywebview.api) {
                const isMuted = await window.pywebview.api.toggle_master_mute();
                console.log(`🎛️ Master ${isMuted ? 'MUTADO' : 'DESMUTADO'}`);
                return isMuted;
            } else {
                // Fallback para mock
                const currentState = this.state.getMasterState();
                const newMuteState = !currentState.is_muted;
                this.state.updateMasterState({ is_muted: newMuteState });
                console.log(`🔧 Mock: Master ${newMuteState ? 'MUTADO' : 'DESMUTADO'}`);
                return newMuteState;
            }
        } catch (error) {
            console.error('❌ Erro ao alternar mute master:', error);
            return false;
        }
    }

    // ===== APIs de Dispositivos =====
    async getAudioDevices() {
        try {
            if (window.pywebview && window.pywebview.api) {
                const [outputDevices, inputDevices] = await Promise.all([
                    window.pywebview.api.get_output_devices(),
                    window.pywebview.api.get_inputs_devices()
                ]);

                console.log('🔊 Dispositivos obtidos do Python:', { outputDevices, inputDevices });

                // Mapear para formato esperado
                const devices = {
                    output: outputDevices.map(device => ({
                        id: device.id,
                        name: device.name,
                        type: device.type,
                        is_default: device.is_default || false,
                        volume: device.volume || 50,
                        is_muted: device.is_muted || false
                    })),
                    input: inputDevices.map(device => ({
                        id: device.id,
                        name: device.name,
                        type: device.type,
                        is_default: device.is_default || false,
                        volume: device.volume || 50,
                        is_muted: device.is_muted || false
                    }))
                };

                return devices;
            } else {
                // Fallback para mock
                console.log('🔧 Usando dados mock para dispositivos');
                return this.state.getDevices();
            }
        } catch (error) {
            console.error('❌ Erro ao obter dispositivos:', error);
            return { output: [], input: [] };
        }
    }

    async setDefaultDevice(deviceId, deviceType) {
        try {
            if (window.pywebview && window.pywebview.api) {
                if (deviceType === 'output') {
                    await window.pywebview.api.set_output_device(deviceId);
                } else if (deviceType === 'input') {
                    await window.pywebview.api.set_input_device(deviceId);
                }
                console.log(`🔧 Dispositivo ${deviceType} padrão definido: ${deviceId}`);
            } else {
                // Fallback para mock
                this.state.state.devices[deviceType].forEach(device => {
                    device.is_default = device.id === deviceId;
                });
                console.log(`🔧 Mock: Dispositivo ${deviceType} padrão: ${deviceId}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao definir dispositivo ${deviceType}:`, error);
        }
    }

    async setDeviceVolume(deviceId, deviceType, volume) {
        try {
            // Volume de dispositivos não implementado no backend Python
            console.log(`🔧 Mock: Volume do dispositivo ${deviceId} definido para ${volume}%`);

            const device = this.state.state.devices[deviceType]?.find(d => d.id === deviceId);
            if (device) {
                device.volume = volume;
            }
        } catch (error) {
            console.error(`❌ Erro ao definir volume do dispositivo ${deviceId}:`, error);
        }
    }

    async toggleDeviceMute(deviceId, deviceType) {
        try {
            // Mute de dispositivos não implementado no backend Python
            const device = this.state.state.devices[deviceType]?.find(d => d.id === deviceId);
            if (device) {
                device.is_muted = !device.is_muted;
                console.log(`🔧 Mock: Dispositivo ${deviceId} ${device.is_muted ? 'MUTADO' : 'DESMUTADO'}`);
                return device.is_muted;
            }
            return false;
        } catch (error) {
            console.error(`❌ Erro ao alternar mute do dispositivo ${deviceId}:`, error);
            return false;
        }
    }

    // ===== APIs de Canais (Mock - não implementado no backend) =====
    async getAudioChannels() {
        try {
            console.log('🔧 Usando dados mock para canais');
            return this.mockData.channels;
        } catch (error) {
            console.error('❌ Erro ao obter canais:', error);
            return { output: [], input: [] };
        }
    }

    async setChannelVolume(channelId, volume) {
        console.log(`🔧 Mock: Volume do canal ${channelId} definido para ${volume}%`);
        // Implementação mock
        const allChannels = [...this.mockData.channels.output, ...this.mockData.channels.input];
        const channel = allChannels.find(c => c.id === channelId);
        if (channel) {
            channel.volume = volume;
        }
    }

    async toggleChannelMute(channelId) {
        console.log(`🔧 Mock: Alternando mute do canal ${channelId}`);
        const allChannels = [...this.mockData.channels.output, ...this.mockData.channels.input];
        const channel = allChannels.find(c => c.id === channelId);
        if (channel) {
            channel.is_muted = !channel.is_muted;
            return channel.is_muted;
        }
        return false;
    }

    async toggleChannelSolo(channelId) {
        console.log(`🔧 Mock: Alternando solo do canal ${channelId}`);
        const allChannels = [...this.mockData.channels.output, ...this.mockData.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (channel) {
            // Desativar solo de outros canais do mesmo tipo
            const channelsOfSameType = channel.type === 'output' ?
                this.mockData.channels.output : this.mockData.channels.input;

            channelsOfSameType.forEach(c => {
                if (c.id !== channelId) {
                    c.is_solo = false;
                }
            });

            // Alternar solo do canal atual
            channel.is_solo = !channel.is_solo;
            return channel.is_solo;
        }
        return false;
    }

    async createChannel(channelName, type) {
        console.log(`🔧 Mock: Criando canal ${channelName} (${type})`);

        const newChannel = {
            id: `channel-${Date.now()}`,
            name: channelName,
            type: type,
            volume: 80,
            is_muted: false,
            is_solo: false,
            is_main: false,
            color: type === 'input' ? '#dc2626' : '#2563eb',
            connected_apps: [],
            [type === 'input' ? 'input_device' : 'output_device']: 'default'
        };

        this.mockData.channels[type].push(newChannel);
        return newChannel;
    }

    async removeChannel(channelId) {
        console.log(`🔧 Mock: Removendo canal ${channelId}`);

        this.mockData.channels.output = this.mockData.channels.output.filter(c => c.id !== channelId);
        this.mockData.channels.input = this.mockData.channels.input.filter(c => c.id !== channelId);
    }
}

export default PythonAPIClient;