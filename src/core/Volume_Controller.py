from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume


class Apps_Volume_Controller:
    def __init__(self, process_name):
        self.process_name = process_name
        self.session = self._get_session()
        if self.session:
            self.volume = self.session.SimpleAudioVolume.GetMasterVolume()
        else:
            self.volume = None
            print(f"Aviso: Processo '{self.process_name}' não encontrado.")

    def _get_session(self):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            if session.Process and session.Process.name() == self.process_name:
                return session
        return None
    
    def toggle_mute(self):
        if self.session:
            interface = self.session.SimpleAudioVolume
            interface.SetMute(not interface.GetMute(), None)

            status = "mutado" if interface.GetMute() else "desmutado"
            print(f"'{self.process_name}' foi {status}.")
        else:
            print(f"Não foi possível alternar o mudo. Processo '{self.process_name}' não encontrado.")
    
    def set_volume(self, level):
        if self.session:
            interface = self.session.SimpleAudioVolume
            
            volume = max(0.0, min(1.0, level / 100.0))

            interface.SetMasterVolume(volume, None)
            self.volume = volume
            print(f"Volume de '{self.process_name}' definido para {volume}%.")
        else:
            print(f"Não foi possível definir o volume. Processo '{self.process_name}' não encontrado.")


class Master_Volume_Controller:
    def __init__(self):
        self.speakers = AudioUtilities.GetSpeakers()
        self.controller = self.volume_control()
        self.volume = self._get_volume()

    def volume_control(self):
        interface = self.speakers.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume_control = cast(interface, POINTER(IAudioEndpointVolume))
        return volume_control
    
    def _get_volume(self):
        volume = int(self.controller.GetMasterVolumeLevelScalar() * 100)
        return volume
    
    def toggle_mute(self):
        self.controller.SetMute(not self.controller.GetMute(), None)

    def set_volume(self, level):
        volume = max(0.0, min(1.0, level / 100.0))
        self.controller.SetMasterVolumeLevelScalar(volume, None)
        self.volume = self._get_volume()


def main():
    master = Master_Volume_Controller()
    print(master.volume)
    master.set_volume(100)
    print(master.volume)

if __name__ == "__main__":
    main()