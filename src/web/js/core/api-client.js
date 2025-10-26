class APIClient {
    constructor(stateManager) {
        this.state = stateManager;
    }

    async getAudioApps() {
        const apps = Object.entries(this.state.state.apps).map(([name, state]) => ({
            name,
            volume: state.volume,
            is_muted: state.is_muted,
            is_solo: state.is_solo,
            icon: null
        }));

        return Promise.resolve(apps);
    }

    async setAppVolume(appName, volume) {
        this.state.updateAppState(appName, { volume });
        console.log(`Mock: Volume do ${appName} definido para ${volume}%`);
        return Promise.resolve();
    }

    async toggleAppMute(appName) {
        const currentState = this.state.getAppState(appName);
        if (!currentState) return Promise.resolve(false);

        const newMuteState = !currentState.is_muted;
        this.state.updateAppState(appName, { is_muted: newMuteState });
        console.log(`Mock: ${appName} ${newMuteState ? 'MUTADO' : 'DESMUTADO'}`);
        return Promise.resolve(newMuteState);
    }

    async toggleAppSolo(appName) {
        const currentState = this.state.getAppState(appName);
        if (!currentState) return Promise.resolve(false);

        if (this.state.state.solo.currentApp === appName) {
            this.state.deactivateSolo('app');
            console.log(`Mock: Solo DESATIVADO de ${appName}`);
            return Promise.resolve(false);
        } else {
            this.state.activateSolo('app', appName);
            console.log(`Mock: Solo ATIVADO em ${appName}`);
            return Promise.resolve(true);
        }
    }

    async getMasterState() {
        return Promise.resolve(this.state.getMasterState());
    }

    async setMasterVolume(volume) {
        this.state.updateMasterState({ volume });
        console.log(`Mock: Volume master definido para ${volume}%`);
        return Promise.resolve();
    }

    async toggleMasterMute() {
        const currentState = this.state.getMasterState();
        const newMuteState = !currentState.is_muted;
        this.state.updateMasterState({ is_muted: newMuteState });
        console.log(`Mock: Master ${newMuteState ? 'MUTADO' : 'DESMUTADO'}`);
        return Promise.resolve(newMuteState);
    }

    async getAudioDevices() {
        return Promise.resolve(this.state.getDevices());
    }

    async setDefaultDevice(deviceId, deviceType) {
        console.log(`Mock: Definindo ${deviceType} padrão para ${deviceId}`);

        this.state.state.devices[deviceType].forEach(device => {
            device.is_default = device.id === deviceId;
        });

        return Promise.resolve();
    }

    async setDeviceVolume(deviceId, deviceType, volume) {
        console.log(`Mock: Volume do dispositivo ${deviceId} definido para ${volume}%`);

        const device = this.state.state.devices[deviceType].find(d => d.id === deviceId);
        if (device) {
            device.volume = volume;
        }

        return Promise.resolve();
    }

    async toggleDeviceMute(deviceId, deviceType) {
        const device = this.state.state.devices[deviceType].find(d => d.id === deviceId);
        if (device) {
            device.is_muted = !device.is_muted;
            console.log(`Mock: Dispositivo ${deviceId} ${device.is_muted ? 'MUTADO' : 'DESMUTADO'}`);
            return Promise.resolve(device.is_muted);
        }
        return Promise.resolve(false);
    }

    async getAudioChannels() {
        return Promise.resolve({
            output_channels: this.state.state.channels.output,
            input_channels: this.state.state.channels.input
        });
    }

    async setChannelVolume(channelId, volume) {
        const allChannels = [...this.state.state.channels.output, ...this.state.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (channel) {
            channel.volume = volume;
            console.log(`Mock: Volume do ${channel.name} definido para ${volume}%`);
        }

        return Promise.resolve();
    }

    async toggleChannelMute(channelId) {
        const allChannels = [...this.state.state.channels.output, ...this.state.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (channel) {
            channel.is_muted = !channel.is_muted;
            console.log(`Mock: ${channel.name} ${channel.is_muted ? 'MUTADO' : 'DESMUTADO'}`);
            return Promise.resolve(channel.is_muted);
        }

        return Promise.resolve(false);
    }

    async toggleChannelSolo(channelId) {
        const allChannels = [...this.state.state.channels.output, ...this.state.state.channels.input];
        const channel = allChannels.find(c => c.id === channelId);

        if (!channel) return Promise.resolve(false);

        if (this.state.state.solo.currentChannel === channelId) {
            this.state.deactivateSolo('channel', channelId);
            console.log(`Mock: Solo DESATIVADO da faixa ${channel.name}`);
            return Promise.resolve(false);
        } else {
            if (this.state.state.solo.currentChannel) {
                this.state.deactivateSolo('channel', this.state.state.solo.currentChannel);
            }

            this.state.activateSolo('channel', channelId);
            console.log(`Mock: Solo ATIVADO na faixa ${channel.name}`);
            return Promise.resolve(true);
        }
    }

    async createChannel(channelName, channelType = 'output') {
        const newChannel = {
            id: `${channelType}_${Date.now()}`,
            name: channelName,
            volume: 80,
            is_muted: false,
            is_solo: false,
            color: channelType === 'input' ? "#059669" : "#6366f1",
            connected_apps: [],
            is_main: false,
            type: channelType
        };

        if (channelType === 'input') {
            newChannel.input_device = "mic1";
            this.state.state.channels.input.push(newChannel);
        } else {
            newChannel.output_device = "speaker1";
            this.state.state.channels.output.push(newChannel);
        }

        console.log(`Mock: Canal "${channelName}" (${channelType}) criado com ID: ${newChannel.id}`);
        return Promise.resolve(newChannel);
    }

    async removeChannel(channelId) {
        let index = this.state.state.channels.output.findIndex(c => c.id === channelId);
        if (index > -1) {
            const channel = this.state.state.channels.output[index];
            this.state.state.channels.output.splice(index, 1);
            console.log(`Mock: Canal de saída "${channel.name}" removido`);
            return Promise.resolve();
        }

        index = this.state.state.channels.input.findIndex(c => c.id === channelId);
        if (index > -1) {
            const channel = this.state.state.channels.input[index];
            this.state.state.channels.input.splice(index, 1);
            console.log(`Mock: Canal de entrada "${channel.name}" removido`);
            return Promise.resolve();
        }

        return Promise.resolve();
    }
}

export default APIClient;