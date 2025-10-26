from pycaw.pycaw import AudioUtilities
from comtypes import CLSCTX_ALL
from pycaw.pycaw import IAudioEndpointVolume
import subprocess
from typing import List, Dict, Any, Optional

class Devices_Services:
    @staticmethod
    def get_output_devices() -> List[Dict[str, Any]]:
        try:
            devices_enum = AudioUtilities.GetDeviceEnumerator()
            devices = devices_enum.EnumAudioEndpoints(0, 1)
            default_device = AudioUtilities.GetSpeakers()

            output_devices = []
            for i in range(devices.GetCount()):
                device = devices.Item(i)
                if device:
                    try:
                        device_id = device.GetId()
                        created_device = AudioUtilities.CreateDevice(device)

                        if created_device and hasattr(created_device, 'FriendlyName'):
                            friendly_name = created_device.FriendlyName
                        else:
                            friendly_name = f"Dispositivos de saida {device_id}"

                        volume = Devices_Services.get_device_volume(device_id, 'output') or 50
                        is_muted = Devices_Services.get_device_mute_state(device_id, 'output')
                        is_default = (default_device.GetId() == device_id) if default_device else False

                        output_devices.append({
                            'id': device_id,
                            'name': friendly_name,
                            'type': 'output',
                            'volume': volume,
                            'is_muted': is_muted,
                            'is_default': is_default
                        })
                    except Exception as e:
                        print(f"Erro ao processar dispositivo de saída: {e}")

            return output_devices
        except Exception as e:
            print(f"Erro ao obter dispositivos de saída: {e}")
            return []

    @staticmethod
    def get_input_devices() -> List[Dict[str, Any]]:
        try:
            devices_enum = AudioUtilities.GetDeviceEnumerator()
            devices = devices_enum.EnumAudioEndpoints(1, 1)
            default_device = AudioUtilities.GetMicrophone()

            input_devices = []
            for i in range(devices.GetCount()):
                device = devices.Item(i)
                if device:
                    try:
                        device_id = device.GetId()
                        created_device = AudioUtilities.CreateDevice(device)

                        if created_device and hasattr(created_device, 'FriendlyName'):
                            friendly_name = created_device.FriendlyName
                        else:
                            friendly_name = f"Dispositivo de Entrada {device_id}"

                        volume = Devices_Services.get_device_volume(device_id, 'input') or 50
                        is_muted = Devices_Services.get_device_mute_state(device_id, 'input')
                        is_default = (default_device.GetId() == device_id) if default_device else False

                        input_devices.append({
                            'id': device_id,
                            'name': friendly_name,
                            'type': 'input',
                            'volume': volume,
                            'is_muted': is_muted,
                            'is_default': is_default
                        })
                    except Exception as e:
                        print(f"Erro ao processar dispositivo de entrada: {e}")

            return input_devices
        except Exception as e:
            print(f"Erro ao obter dispositivos de entrada: {e}")
            return []

    @staticmethod
    def set_output_device(device_id: str) -> bool:
        try:
            script = f'''
            Import-Module AudioDeviceCmdLets -Force
            Set-AudioDevice -ID "{device_id}"
            '''

            result = subprocess.run([
                'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script
            ], capture_output=True, text=True, timeout=5)

            return result.returncode == 0

        except subprocess.TimeoutExpired:
            print("Timeout ao executar script PowerShell para dispositivo de saída")
        except Exception as e:
            print(f"Erro ao definir dispositivo de saída: {e}")

    @staticmethod
    def set_input_device(device_id: str) -> bool:
        try:
            script = f'''
            Import-Module AudioDeviceCmdlets -Force
            Set-AudioDevice -ID "{device_id}" -CommunicationDefault
            '''

            result = subprocess.run([
                'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script
            ], capture_output=True, text=True, timeout=5)

            return result.returncode == 0

        except subprocess.TimeoutExpired:
            print("Timeout ao executar script PowerShell para dispositivo de entrada")
        except Exception as e:
            print(f"Erro ao definir dispositivo de entrada: {e}")

    @staticmethod
    def get_all_devices() -> Dict[str, List[Dict[str, Any]]]:
        return {
            'output_devices': Devices_Services.get_output_devices(),
            'input_devices': Devices_Services.get_input_devices()
        }

    @staticmethod
    def get_device_by_id(device_id: str, device_type: str) -> Optional[Any]:
        try:
            devices_enum = AudioUtilities.GetDeviceEnumerator()
            endpoint_type = 0 if device_type == 'output' else 1
            devices = devices_enum.EnumAudioEndpoints(endpoint_type, 1)

            for i in range(devices.GetCount()):
                device = devices.Item(i)
                if device and device.GetId() == device_id:
                    return device
            return None
        except Exception as e:
            print(f"Erro ao buscar dispositivo {device_id}: {e}")
            return None

    @staticmethod
    def set_device_volume(device_id: str, device_type: str, volume_level: float) -> bool:
        try:
            device = Devices_Services.get_device_by_id(device_id, device_type)
            if not device:
                print(f"Dispositivo {device_id} não encontrado")
                return False

            interface = device.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            volume_interface = interface.QueryInterface(IAudioEndpointVolume)

            volume_scalar = max(0.0, min(1.0, volume_level / 100.0))
            volume_interface.SetMasterVolumeLevelScalar(volume_scalar, None)

            print(f"Volume do dispositivo {device_id} definido para {volume_level}%")
            return True
        except Exception as e:
            print(f"Erro ao definir volume do dispositivo {device_id}: {e}")
            return False

    @staticmethod
    def toggle_device_mute(device_id: str, device_type: str) -> Optional[bool]:
        try:
            device = Devices_Services.get_device_by_id(device_id, device_type)
            if not device:
                print(f"Dispositivo {device_id} não encontrado")
                return None

            interface = device.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            volume_interface = interface.QueryInterface(IAudioEndpointVolume)

            current_mute = volume_interface.GetMute()
            new_mute = not current_mute
            volume_interface.SetMute(new_mute, None)

            print(f"Dispositivo {device_id} {'mutado' if new_mute else 'desmutado'}")
            return new_mute
        except Exception as e:
            print(f"Erro ao alternar mute do dispositivo {device_id}: {e}")
            return None

    @staticmethod
    def get_device_volume(device_id: str, device_type: str) -> Optional[int]:
        try:
            device = Devices_Services.get_device_by_id(device_id, device_type)
            if not device:
                return None

            interface = device.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            volume_interface = interface.QueryInterface(IAudioEndpointVolume)

            volume_scalar = volume_interface.GetMasterVolumeLevelScalar()
            return int(volume_scalar * 100)
        except Exception as e:
            print(f"Erro ao obter volume do dispositivo {device_id}: {e}")
            return None

    @staticmethod
    def get_device_mute_state(device_id: str, device_type: str) -> bool:
        try:
            device = Devices_Services.get_device_by_id(device_id, device_type)
            if not device:
                return False

            interface = device.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            volume_interface = interface.QueryInterface(IAudioEndpointVolume)

            return volume_interface.GetMute()
        except Exception as e:
            print(f"Erro ao obter estado de mute do dispositivo {device_id}: {e}")
            return False

def main():
    pass

if __name__ == "__main__":
    main()