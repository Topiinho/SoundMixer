import os
from typing import List, Dict, Any, Optional
from src.web.Screem import Window_Service
from src.core.Apps_Controller import Apps_Service
from src.core.Volume_Controller import Apps_Volume_Controller, Master_Volume_Controller
from src.core.Device_Controller import Devices_Services
from audio_channel import ChannelManager

class Api:
    def __init__(self):
        self.MasterVolumeController = Master_Volume_Controller()
        self.ChannelManager = ChannelManager()
        self.solo_app = None

    def get_audio_apps(self) -> List[Dict[str, Any]]:
        apps = Apps_Service.get_all_apps()
        for app in apps:
            app['is_solo'] = (app['name'] == self.solo_app)
        return apps

    def set_app_volume(self, app_name: str, volume_level: float) -> None:
        try:
            controller = Apps_Volume_Controller(f"{app_name}.exe")
            controller.set_volume(volume_level)
        except Exception as e:
            print(f"Erro inesperado ao definir volume para {app_name}: {e}")

    def toggle_app_mute(self, app_name: str) -> Optional[bool]:
        controller = Apps_Volume_Controller(f"{app_name}.exe")
        return controller.toggle_mute()

    def toggle_app_solo(self, app_name: str) -> Optional[bool]:
        try:
            all_apps = Apps_Service.get_all_apps()
            app_names = [app['name'] for app in all_apps]

            if app_name not in app_names:
                print(f"App '{app_name}' não encontrado")
                return None

            if self.solo_app == app_name:
                self.solo_app = None
                for other_app in app_names:
                    controller = Apps_Volume_Controller(f"{other_app}.exe")
                    controller.set_mute(False)
                print(f"Solo desativado de '{app_name}'")
                return False
            else:
                self.solo_app = app_name
                for other_app in app_names:
                    controller = Apps_Volume_Controller(f"{other_app}.exe")
                    if other_app == app_name:
                        controller.set_mute(False)
                    else:
                        controller.set_mute(True)
                print(f"Solo ativado em '{app_name}'")
                return True
        except Exception as e:
            print(f"Erro ao alternar solo do app '{app_name}': {e}")
            return None

    def get_audio_master(self) -> int:
        return self.MasterVolumeController.volume

    def toggle_master_mute(self) -> bool:
        return self.MasterVolumeController.toggle_mute()

    def get_master_state(self) -> Dict[str, Any]:
        return self.MasterVolumeController.get_state()

    def set_master_volume(self, volume_level: float) -> int:
        self.MasterVolumeController.set_volume(volume_level)
        return self.MasterVolumeController.volume

    def get_inputs_devices(self) -> List[Dict[str, Any]]:
        return Devices_Services.get_input_devices()

    def get_output_devices(self) -> List[Dict[str, Any]]:
        return Devices_Services.get_output_devices()

    def set_output_device(self, device_id: str) -> None:
        try:
            service = Devices_Services()
            service.set_output_device(device_id)
            print(f"Dispositivo de saída alterado: {device_id}")
        except Exception as e:
            print(f"Erro inesperado ao alterar dispositivo de saída: {e}")

    def set_input_device(self, device_id: str) -> None:
        try:
            service = Devices_Services()
            service.set_input_device(device_id)
            print(f"Dispositivo de entrada alterado: {device_id}")
        except Exception as e:
            print(f"Erro inesperado ao alterar dispositivo de entrada: {e}")

    def set_device_volume(self, device_id: str, device_type: str, volume_level: float) -> bool:
        try:
            return Devices_Services.set_device_volume(device_id, device_type, volume_level)
        except Exception as e:
            print(f"Erro ao definir volume do dispositivo {device_id}: {e}")
            return False

    def toggle_device_mute(self, device_id: str, device_type: str) -> Optional[bool]:
        try:
            return Devices_Services.toggle_device_mute(device_id, device_type)
        except Exception as e:
            print(f"Erro ao alternar mute do dispositivo {device_id}: {e}")
            return None

    def get_audio_channels(self) -> Dict[str, List[Dict[str, Any]]]:
        return self.ChannelManager.get_all_channels_by_type()

    def create_channel(self, channel_name: str, channel_type: str = 'output') -> Dict[str, Any]:
        try:
            channel = self.ChannelManager.create_channel(channel_name, channel_type)
            return channel.to_dict()
        except Exception as e:
            print(f"Erro ao criar canal '{channel_name}': {e}")
            return {}

    def remove_channel(self, channel_id: str) -> bool:
        try:
            return self.ChannelManager.remove_channel(channel_id)
        except Exception as e:
            print(f"Erro ao remover canal '{channel_id}': {e}")
            return False

    def set_channel_volume(self, channel_id: str, volume_level: float) -> None:
        try:
            channel = self.ChannelManager.get_channel(channel_id)
            if channel:
                channel.volume = max(0, min(100, volume_level))
                print(f"Volume do canal '{channel.name}' definido para {channel.volume}%")
            else:
                print(f"Canal '{channel_id}' não encontrado")
        except Exception as e:
            print(f"Erro ao definir volume do canal '{channel_id}': {e}")

    def toggle_channel_mute(self, channel_id: str) -> Optional[bool]:
        try:
            channel = self.ChannelManager.get_channel(channel_id)
            if channel:
                channel.is_muted = not channel.is_muted
                status = "mutado" if channel.is_muted else "desmutado"
                print(f"Canal '{channel.name}' foi {status}")
                return channel.is_muted
            else:
                print(f"Canal '{channel_id}' não encontrado")
                return None
        except Exception as e:
            print(f"Erro ao alternar mute do canal '{channel_id}': {e}")
            return None

    def toggle_channel_solo(self, channel_id: str) -> Optional[bool]:
        try:
            channel = self.ChannelManager.get_channel(channel_id)
            if not channel:
                print(f"Canal '{channel_id}' não encontrado")
                return None

            if channel.is_solo:
                channel.is_solo = False
                for ch in self.ChannelManager.channels.values():
                    if ch.type == channel.type and ch.id != channel_id:
                        ch.is_muted = False
                print(f"Solo desativado do canal '{channel.name}'")
                return False
            else:
                for ch in self.ChannelManager.channels.values():
                    if ch.type == channel.type:
                        if ch.id == channel_id:
                            ch.is_solo = True
                            ch.is_muted = False
                        else:
                            ch.is_solo = False
                            ch.is_muted = True
                print(f"Solo ativado no canal '{channel.name}'")
                return True
        except Exception as e:
            print(f"Erro ao alternar solo do canal '{channel_id}': {e}")
            return None

    def add_app_to_channel(self, channel_id: str, app_name: str) -> bool:
        try:
            channel = self.ChannelManager.get_channel(channel_id)
            if channel:
                if app_name not in channel.connected_apps:
                    channel.connected_apps.append(app_name)
                    print(f"App '{app_name}' adicionado ao canal '{channel.name}'")
                    return True
            print(f"Canal '{channel_id}' não encontrado")
            return False
        except Exception as e:
            print(f"Erro ao adicionar app ao canal: {e}")
            return False

    def remove_app_from_channel(self, channel_id: str, app_name: str) -> bool:
        try:
            channel = self.ChannelManager.get_channel(channel_id)
            if channel:
                if app_name in channel.connected_apps:
                    channel.connected_apps.remove(app_name)
                    print(f"App '{app_name}' removido do canal '{channel.name}'")
                    return True
            print(f"Canal '{channel_id}' não encontrado")
            return False
        except Exception as e:
            print(f"Erro ao remover app do canal: {e}")
            return False

def main() -> None:
    api = Api()

    window = Window_Service("Sonus Mixer", "src/web/index.html", js_api=api, icon="src/web/assets/icon.ico")
    window.create_window()
    window.start()

if __name__ == "__main__":
    main()