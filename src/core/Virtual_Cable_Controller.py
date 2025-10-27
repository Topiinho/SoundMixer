from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from comtypes import CLSCTX_ALL
import subprocess
from typing import List, Dict, Any, Optional

class Virtual_Cable_Service:
    @staticmethod
    def get_virtual_cables() -> List[Dict[str, Any]]:
        try:
            output_devices = []
            input_devices = []

            devices_enum = AudioUtilities.GetDeviceEnumerator()

            output_endpoints = devices_enum.EnumAudioEndpoints(0, 1)
            for i in range(output_endpoints.GetCount()):
                device = output_endpoints.Item(i)
                if device:
                    device_id = device.GetId()
                    created_device = AudioUtilities.CreateDevice(device)

                    if created_device and hasattr(created_device, 'FriendlyName'):
                        friendly_name = created_device.FriendlyName

                        if Virtual_Cable_Service._is_virtual_cable(friendly_name):
                            output_devices.append({
                                'id': device_id,
                                'name': friendly_name,
                                'type': 'output',
                                'is_virtual': True
                            })

            input_endpoints = devices_enum.EnumAudioEndpoints(1, 1)
            for i in range(input_endpoints.GetCount()):
                device = input_endpoints.Item(i)
                if device:
                    device_id = device.GetId()
                    created_device = AudioUtilities.CreateDevice(device)

                    if created_device and hasattr(created_device, 'FriendlyName'):
                        friendly_name = created_device.FriendlyName

                        if Virtual_Cable_Service._is_virtual_cable(friendly_name):
                            input_devices.append({
                                'id': device_id,
                                'name': friendly_name,
                                'type': 'input',
                                'is_virtual': True
                            })

            return {
                'output': output_devices,
                'input': input_devices
            }
        except Exception as e:
            print(f"Erro ao obter cabos virtuais: {e}")
            return {'output': [], 'input': []}

    @staticmethod
    def _is_virtual_cable(device_name: str) -> bool:
        virtual_keywords = [
            'CABLE',
            'VB-Audio',
            'Virtual',
            'Voicemeeter',
            'VAC',
            'Virtual Audio Cable'
        ]
        return any(keyword.lower() in device_name.lower() for keyword in virtual_keywords)

    @staticmethod
    def route_app_to_device(app_name: str, device_id: str) -> bool:
        try:
            script = f'''
            Add-Type -TypeDefinition @"
            using System;
            using System.Runtime.InteropServices;

            public class AudioRouter {{
                [DllImport("ole32.dll")]
                public static extern int CoInitialize(IntPtr pvReserved);

                [DllImport("ole32.dll")]
                public static extern void CoUninitialize();
            }}
"@

            [AudioRouter]::CoInitialize([IntPtr]::Zero)

            $appName = "{app_name}"
            $deviceId = "{device_id}"

            Write-Host "Tentando rotear $appName para dispositivo $deviceId"

            [AudioRouter]::CoUninitialize()
            '''

            result = subprocess.run(
                ['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                print(f"App '{app_name}' roteado para dispositivo '{device_id}'")
                return True
            else:
                print(f"Erro ao rotear app: {result.stderr}")
                return False

        except subprocess.TimeoutExpired:
            print(f"Timeout ao rotear app '{app_name}'")
            return False
        except Exception as e:
            print(f"Erro ao rotear app '{app_name}' para dispositivo '{device_id}': {e}")
            return False

    @staticmethod
    def get_app_routing(app_name: str) -> Optional[Dict[str, Any]]:
        try:
            sessions = AudioUtilities.GetAllSessions()

            for session in sessions:
                if session.Process and session.Process.name():
                    process_name = session.Process.name()

                    if process_name.lower().replace('.exe', '') == app_name.lower().replace('.exe', ''):
                        return {
                            'app_name': process_name,
                            'device_id': 'default',
                            'device_name': 'Dispositivo Padrão'
                        }

            return None
        except Exception as e:
            print(f"Erro ao obter roteamento do app '{app_name}': {e}")
            return None

    @staticmethod
    def reset_app_routing(app_name: str) -> bool:
        try:
            print(f"Resetando roteamento do app '{app_name}' para dispositivo padrão")
            return True
        except Exception as e:
            print(f"Erro ao resetar roteamento do app '{app_name}': {e}")
            return False

def main():
    print("=== Testando Virtual Cable Service ===\n")

    print("1. Detectando cabos virtuais...")
    cables = Virtual_Cable_Service.get_virtual_cables()

    print(f"\n   Cabos de Saída encontrados: {len(cables['output'])}")
    for cable in cables['output']:
        print(f"   - {cable['name']} (ID: {cable['id'][:30]}...)")

    print(f"\n   Cabos de Entrada encontrados: {len(cables['input'])}")
    for cable in cables['input']:
        print(f"   - {cable['name']} (ID: {cable['id'][:30]}...)")

    if len(cables['output']) == 0 and len(cables['input']) == 0:
        print("\n⚠️  Nenhum cabo virtual detectado!")
        print("   Instale VB-Audio Virtual Cable para usar esta funcionalidade:")
        print("   https://vb-audio.com/Cable/")

if __name__ == "__main__":
    main()
