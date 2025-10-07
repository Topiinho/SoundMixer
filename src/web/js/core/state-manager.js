/* Gerenciador de Estado Centralizado */

class StateManager {
    constructor() {
        this.state = {
            apps: {
                "Discord": { volume: 75, is_muted: false, is_solo: false },
                "Spotify": { volume: 60, is_muted: false, is_solo: false },
                "Chrome": { volume: 85, is_muted: true, is_solo: false },
                "Steam": { volume: 45, is_muted: false, is_solo: false },
                "OBS Studio": { volume: 90, is_muted: false, is_solo: false }
            },
            master: { volume: 80, is_muted: false },
            profile: {
                name: "Vitor Pinho",
                avatar: "assets/profile-default.svg",
                startupEnabled: true
            },
            solo: {
                currentApp: null,
                currentChannel: null
            },
            channels: {
                output: [
                    { id: "main", name: "Faixa Principal", volume: 100, is_muted: false, is_solo: false, color: "#2563eb", connected_apps: ["Discord", "Chrome"], is_main: true, output_device: "speaker1", type: "output" },
                    { id: "channel2", name: "Canal Streaming", volume: 85, is_muted: false, is_solo: false, color: "#dc2626", connected_apps: ["OBS Studio"], is_main: false, output_device: "speaker2", type: "output" },
                    { id: "channel3", name: "Canal Música", volume: 70, is_muted: false, is_solo: false, color: "#16a34a", connected_apps: ["Spotify"], is_main: false, output_device: "speaker1", type: "output" },
                    { id: "channel4", name: "Canal Gaming", volume: 90, is_muted: true, is_solo: false, color: "#ca8a04", connected_apps: ["Steam"], is_main: false, output_device: "speaker3", type: "output" }
                ],
                input: [
                    { id: "mic_main", name: "Microfone Principal", volume: 80, is_muted: false, is_solo: false, color: "#059669", connected_apps: [], is_main: true, input_device: "mic1", type: "input" },
                    { id: "mic_stream", name: "Mic Streaming", volume: 75, is_muted: false, is_solo: false, color: "#dc2626", connected_apps: [], is_main: false, input_device: "mic2", type: "input" }
                ]
            },
            devices: {
                input: [
                    { id: "mic1", name: "Microfone (Realtek High Definition Audio)", is_default: true, volume: 75, is_muted: false },
                    { id: "mic2", name: "Headset Microphone (USB Audio Device)", is_default: false, volume: 60, is_muted: false },
                    { id: "mic3", name: "Webcam Microphone (C920 HD Pro)", is_default: false, volume: 80, is_muted: true }
                ],
                output: [
                    { id: "speaker1", name: "Alto-falantes (Realtek High Definition Audio)", is_default: true, volume: 85, is_muted: false },
                    { id: "speaker2", name: "Headphones (USB Audio Device)", is_default: false, volume: 70, is_muted: false },
                    { id: "speaker3", name: "Monitor Audio (HDMI)", is_default: false, volume: 50, is_muted: true }
                ]
            }
        };

        this.listeners = new Set();
        this.channelIdCounter = 5;
    }

    // Getters seguros
    getAppState(appName) {
        return this.state.apps[appName] || null;
    }

    getMasterState() {
        return { ...this.state.master };
    }

    getChannels() {
        return {
            output_channels: [...this.state.channels.output],
            input_channels: [...this.state.channels.input]
        };
    }

    getDevices() {
        return {
            input: [...this.state.devices.input],
            output: [...this.state.devices.output]
        };
    }

    // Setters com validação
    updateAppState(appName, updates) {
        if (this.state.apps[appName]) {
            this.state.apps[appName] = { ...this.state.apps[appName], ...updates };
            this.notifyListeners('app-updated', { appName, state: this.state.apps[appName] });
        }
    }

    updateMasterState(updates) {
        this.state.master = { ...this.state.master, ...updates };
        this.notifyListeners('master-updated', this.state.master);
    }

    updateChannelState(channelId, updates) {
        const allChannels = [...this.state.channels.output, ...this.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (channel) {
            Object.assign(channel, updates);
            this.notifyListeners('channel-updated', { channelId, state: channel });
        }
    }

    // Sistema de solo
    activateSolo(type, id) {
        if (type === 'app') {
            this.state.solo.currentApp = id;
            // Mutar outros apps
            Object.keys(this.state.apps).forEach(app => {
                if (app !== id) {
                    this.state.apps[app].is_muted = true;
                } else {
                    this.state.apps[app].is_solo = true;
                    this.state.apps[app].is_muted = false;
                }
            });
        } else if (type === 'channel') {
            this.state.solo.currentChannel = id;

            // Encontrar o canal
            const allChannels = [...this.state.channels.output, ...this.state.channels.input];
            const channel = allChannels.find(c => c.id === id);

            if (channel) {
                channel.is_solo = true;

                // Mutar outros canais do mesmo tipo
                const channelsOfSameType = channel.type === 'input' ?
                    this.state.channels.input :
                    this.state.channels.output;

                channelsOfSameType.forEach(ch => {
                    if (ch.id !== id) {
                        ch.is_muted = true;
                    } else {
                        ch.is_muted = false; // Garantir que canal solo não está mudo
                    }
                });
            }
        }

        this.notifyListeners('solo-activated', { type, id });
    }

    deactivateSolo(type, id = null) {
        if (type === 'app') {
            const currentApp = this.state.solo.currentApp;
            this.state.solo.currentApp = null;

            Object.keys(this.state.apps).forEach(app => {
                this.state.apps[app].is_solo = false;
                this.state.apps[app].is_muted = false;
            });
        } else if (type === 'channel') {
            this.state.solo.currentChannel = null;

            // Encontrar o canal
            const allChannels = [...this.state.channels.output, ...this.state.channels.input];
            const channel = allChannels.find(c => c.id === id);

            if (channel) {
                channel.is_solo = false;

                // Restaurar outros canais do mesmo tipo
                const channelsOfSameType = channel.type === 'input' ?
                    this.state.channels.input :
                    this.state.channels.output;

                channelsOfSameType.forEach(ch => {
                    ch.is_muted = false;
                });
            }
        }

        this.notifyListeners('solo-deactivated', { type, id });
    }

    // Sistema de observação
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('Erro no listener:', error);
            }
        });
    }

}

export default StateManager;