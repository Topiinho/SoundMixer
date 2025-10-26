from pycaw.pycaw import AudioUtilities
import subprocess
from typing import List, Dict, Any

class Devices_Services:
    @staticmethod
    def get_output_devices() -> List[Dict[str, Any]]:
        try:
            devices_enum = AudioUtilities.GetDeviceEnumerator()
            devices = devices_enum.EnumAudioEndpoints(0, 1)

            output_devices = []
            for i in range(devices.GetCount()):
                device = devices.Item(i)
                if device:
                    try:
                        device_id = device.GetId()
                        device = AudioUtilities.CreateDevice(device)

                        if device and hasattr(device, 'FriendlyName'):
                            friendly_name = device.FriendlyName
                        else:
                            friendly_name = f"Dispositivos de saida {device_id}"

                        output_devices.append({
                            'id': device_id,
                            'name': friendly_name,
                            'type': 'output'
                        })
                    except Exception as e:
                        print(f"Erro ao processar dispositivo de saída: {e}")

            return output_devices
        except Exception as e:
            print(f"Erro ao obter dispositivos de saída: {e}")

    @staticmethod
    def get_input_devices() -> List[Dict[str, Any]]:
        try:
            devices_enum = AudioUtilities.GetDeviceEnumerator()
            devices = devices_enum.EnumAudioEndpoints(1, 1)

            input_devices = []
            for i in range(devices.GetCount()):
                device = devices.Item(i)
                if device:
                    try:
                        device_id = device.GetId()
                        device = AudioUtilities.CreateDevice(device)

                        if device and hasattr(device, 'FriendlyName'):
                            friendly_name = device.FriendlyName
                        else:
                            friendly_name = f"Dispositivo de Entrada {device_id}"

                        input_devices.append({
                            'id': device_id,
                            'name': friendly_name,
                            'type': 'input'
                        })
                    except Exception as e:
                        print(f"Erro ao processar dispositivo de saída: {e}")

            return input_devices
        except Exception as e:
            print(f"Erro ao obter dispositivos de entrada: {e}")

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

def main():
    pass

if __name__ == "__main__":
    main()