import os
from typing import List, Dict, Any, Optional
from src.web.Screem import Window_Service
from src.core.Apps_Controller import Apps_Service
from src.core.Volume_Controller import Apps_Volume_Controller, Master_Volume_Controller
from src.core.Device_Controller import Devices_Services


class Api:
    def __init__(self):
        self.MasterVolumeController = Master_Volume_Controller()

    def get_audio_apps(self) -> List[Dict[str, Any]]:
        return Apps_Service.get_all_apps()

    def set_app_volume(self, app_name: str, volume_level: float) -> None:
        try:
            controller = Apps_Volume_Controller(f"{app_name}.exe")
            controller.set_volume(volume_level)
        except Exception as e:
            print(f"Erro inesperado ao definir volume para {app_name}: {e}")

    def toggle_app_mute(self, app_name: str) -> Optional[bool]:
        controller = Apps_Volume_Controller(f"{app_name}.exe")
        return controller.toggle_mute()

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



def main() -> None:
    api = Api()

    window = Window_Service("Sonus Mixer", "src/web/index.html", js_api=api, icon="src/web/assets/icon.ico")
    window.create_window()
    window.start()

if __name__ == "__main__":
    main()