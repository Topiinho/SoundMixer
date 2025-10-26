import time
import random

class AudioChannel:
    def __init__(self, name: str, channel_id: str, channel_type: str = 'output'):
        self.id = channel_id
        self.name = name
        self.type = channel_type
        self.volume = 80
        self.is_muted = False
        self.is_solo = False
        self.is_main = False

        random.seed(name)
        self.color = f"hsl({random.randint(0, 360)}, 70%, 50%)"

        self.connected_apps = []
        self.output_device_id = None
        self.input_device_id = None

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "volume": self.volume,
            "is_muted": self.is_muted,
            "is_solo": self.is_solo,
            "is_main": self.is_main,
            "color": self.color,
            "connected_apps": self.connected_apps,
            "output_device": self.output_device_id,
            "input_device": self.input_device_id,
        }

class ChannelManager:
    def __init__(self):
        self.channels = {}
        self._create_default_channels()

    def _create_default_channels(self):
        main_output = AudioChannel(name="Principal", channel_id="main_output", channel_type='output')
        main_output.is_main = True
        main_output.color = '#2563eb'
        main_output.output_device_id = "default"
        self.channels[main_output.id] = main_output

        main_input = AudioChannel(name="Microfone", channel_id="main_input", channel_type='input')
        main_input.is_main = True
        main_input.color = '#dc2626'
        main_input.input_device_id = "default"
        self.channels[main_input.id] = main_input

    def create_channel(self, name: str, channel_type: str) -> AudioChannel:
        channel_id = f"channel_{int(time.time() * 1000)}"
        new_channel = AudioChannel(name=name, channel_id=channel_id, channel_type=channel_type)
        self.channels[channel_id] = new_channel
        print(f"Canal '{name}' (tipo: {channel_type}) criado com ID '{channel_id}'.")
        return new_channel

    def remove_channel(self, channel_id: str) -> bool:
        channel = self.channels.get(channel_id)
        if channel and not channel.is_main:
            del self.channels[channel_id]
            print(f"Canal ID '{channel_id}' removido.")
            return True
        print(f"Falha ao remover canal ID '{channel_id}'. Não encontrado ou é um canal principal.")
        return False

    def get_channel(self, channel_id: str) -> AudioChannel | None:
        return self.channels.get(channel_id)

    def get_all_channels_by_type(self):
        output_channels = [ch.to_dict() for ch in self.channels.values() if ch.type == 'output']
        input_channels = [ch.to_dict() for ch in self.channels.values() if ch.type == 'input']

        output_channels.sort(key=lambda x: not x['is_main'])
        input_channels.sort(key=lambda x: not x['is_main'])

        return {
            "output_channels": output_channels,
            "input_channels": input_channels
        }
