from pycaw.pycaw import AudioUtilities
import subprocess

class Devices_Services:
    @staticmethod
    def get_output_devices():
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
                        print(e)
            
            return output_devices
        
        except Exception as e:
            print(f"Erro ao obter dispositivos de saída: {e}")
            return []
        

    @staticmethod
    def get_input_devices():
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
                        print(e)
            
            return input_devices
        
        except Exception as e:
            print(f"Erro ao obter dispositivos de entrada: {e}")
            return []
        
    def set_output_device(device_id):
        try:
            script = f'''
            Import-Module AudioDeviceCmdLets -Force
            Set-AudioDevice -ID "{device_id}"
            '''

            result = subprocess.run([
                'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script
            ], capture_output=True, text=True, timeout=5)

            return result.returncode == 0
        
        except Exception as e:
            print(e)
            return False
        
    def set_input_device(device_id):
        try:
            script = f'''
            Import-Module AudioDeviceCmdlets -Force
            Set-AudioDevice -ID "{device_id}" -CommunicationDefault
            '''

            result = subprocess.run([
                'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script
            ], capture_output=True, text=True, timeout=5)

            return result.returncode == 0

        except Exception as e:
            print(e)
            return False










# ===========================================================================

    @staticmethod
    def get_all_devices():
        """Retorna dispositivos separados por tipo"""
        return {
            'output_devices': Devices_Services.get_output_devices(),
            'input_devices': Devices_Services.get_input_devices()
        }


    @staticmethod
    def print_devices():
        """Imprime todos os dispositivos de forma organizada"""
        devices = Devices_Services.get_all_devices()

        print("=== DISPOSITIVOS DE SAÍDA ATIVOS ===")
        for device in devices['output_devices']:
            print(f"Nome: {device['name']}")
            print(f"ID: {device['id']}")
            print(f"Tipo: {device['type']}")
            print("-" * 50)

        print("\n=== DISPOSITIVOS DE ENTRADA ATIVOS ===")
        for device in devices['input_devices']:
            print(f"Nome: {device['name']}")
            print(f"ID: {device['id']}")
            print(f"Tipo: {device['type']}")
            print("-" * 50)

def main():
    service = Devices_Services()
    service.print_devices()

    # Exemplo de como usar as funções separadamente
    output_devices = service.get_output_devices()
    input_devices = service.get_input_devices()

    print(f"\nTotal de dispositivos de saída ativos: {len(output_devices)}")
    print(f"Total de dispositivos de entrada ativos: {len(input_devices)}")

if __name__ == "__main__":
    main()