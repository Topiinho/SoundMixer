from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from typing import Optional, Dict, Any

class Apps_Volume_Controller:
    def __init__(self, process_name: str) -> None:
        self.process_name = process_name
        self.session = self._get_session()
        if self.session:
            self.volume = self.session.SimpleAudioVolume.GetMasterVolume()
            self.interface = self.session.SimpleAudioVolume
        else:
            self.volume = None
            print(f"Processo '{self.process_name}' não encontrado.")

    def _get_session(self) -> Optional[Any]:
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            if session.Process and session.Process.name() == self.process_name:
                return session
        return None

    def toggle_mute(self) -> Optional[bool]:
        if self.session:
            self.interface.SetMute(not interface.GetMute(), None)

            is_muted = self.interface.GetMute()
            status = "mutado" if is_muted else "desmutado"
            print(f"'{self.process_name}' foi {status}.")
            return is_muted
        else:
            print(f"Não foi possível alternar o mudo. Processo '{self.process_name}' não encontrado.")
            return None

    def set_volume(self, level: float) -> None:
        if not (0 <= level <= 100):
            print(f"Volume deve estar entre 0 e 100, recebido: {level}")

        if not self.session:
            print(f"Sessão de áudio não encontrada para processo '{self.process_name}'")

        try:
            volume = max(0.0, min(1.0, level / 100.0))
            self.interface.SetMasterVolume(volume, None)
            self.volume = self.session.SimpleAudioVolume.GetMasterVolume()
            volume = int(self.volume * 100)
            print(f"Volume de '{self.process_name}' definido para {volume}%.")
        except Exception as e:
            print(f"Erro ao definir volume: {e}")
            raise


class Master_Volume_Controller:
    def __init__(self) -> None:
        self.speakers = AudioUtilities.GetSpeakers()
        self.controller = self.volume_control()
        self.volume = self._get_volume()

    def get_state(self) -> Dict[str, Any]:
        return {
            'volume': self._get_volume(),
            'is_muted': self.controller.GetMute()
        }

    def volume_control(self) -> Any:
        interface = self.speakers.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume_control = cast(interface, POINTER(IAudioEndpointVolume))
        return volume_control

    def _get_volume(self) -> int:
        volume = int(self.controller.GetMasterVolumeLevelScalar() * 100)
        return volume

    def toggle_mute(self) -> bool:
        current_mute_state = self.controller.GetMute()
        self.controller.SetMute(not current_mute_state, None)

        new_mute_state = self.controller.GetMute()
        status = "Mutado" if new_mute_state else "Desmutado"
        print(f"Volume master {status}.")
        return new_mute_state

    def set_volume(self, level: float) -> None:
        volume = max(0.0, min(1.0, level / 100.0))
        self.controller.SetMasterVolumeLevelScalar(volume, None)
        self.volume = self._get_volume()
        print(f"Volume master definido para {self.volume}%.")


def main():
    controller = Master_Volume_Controller()
    controller.set_volume(100)

if __name__ == "__main__":
    main()