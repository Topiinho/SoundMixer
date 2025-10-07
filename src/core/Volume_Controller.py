from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from typing import Optional, Dict, Any
from ..utils.logger import setup_logger

logger = setup_logger(__name__)


class Apps_Volume_Controller:
    def __init__(self, process_name: str) -> None:
        self.process_name = process_name
        self.session = self._get_session()
        if self.session:
            self.volume = self.session.SimpleAudioVolume.GetMasterVolume()
            self.interface = self.session.SimpleAudioVolume
        else:
            self.volume = None
            logger.warning(f"Processo '{self.process_name}' não encontrado.")

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
            logger.info(f"'{self.process_name}' foi {status}.")
            return is_muted
        else:
            logger.error(f"Não foi possível alternar o mudo. Processo '{self.process_name}' não encontrado.")
            return None
    
    def set_volume(self, level: float) -> None:
        if not (0 <= level <= 100):
            logger.error(f"Volume deve estar entre 0 e 100, recebido: {level}")

        if not self.session:
            logger.error(f"Sessão de áudio não encontrada para processo '{self.process_name}'")

        try:
            volume = max(0.0, min(1.0, level / 100.0))
            self.interface.SetMasterVolume(volume, None)
            self.volume = self.session.SimpleAudioVolume.GetMasterVolume()
            volume = int(self.volume * 100)
            logger.info(f"Volume de '{self.process_name}' definido para {volume}%.")
        except Exception as e:
            logger.error(f"Erro ao definir volume: {e}")
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
        logger.info(f"Volume master {status}.")
        return new_mute_state

    def set_volume(self, level: float) -> None:
        volume = max(0.0, min(1.0, level / 100.0))
        self.controller.SetMasterVolumeLevelScalar(volume, None)
        self.volume = self._get_volume()
        logger.info(f"Volume master definido para {self.volume}%.")


def main():
    logger.info("🔊 === DEMONSTRAÇÃO: CONTROLE DE VOLUME ===")

    try:
        logger.info("📊 Testando Volume Master...")
        master = Master_Volume_Controller()

        initial_state = master.get_state()
        logger.info(f"   🔊 Volume Inicial: {initial_state['volume']}%")
        logger.info(f"   🔇 Mutado: {'Sim' if initial_state['is_muted'] else 'Não'}")

        logger.info("🔧 Testando alteração de volume...")
        master.set_volume(75)
        logger.info(f"   ✅ Volume alterado para: {master.volume}%")

        master.set_volume(initial_state['volume'])
        logger.info(f"   🔄 Volume restaurado para: {master.volume}%")

        logger.info("\n✅ Demonstração concluída com sucesso!")
        logger.info("💡 Para controlar apps individuais, use Apps_Volume_Controller()")

    except Exception as e:
        logger.error(f"❌ Erro na demonstração: {e}")


if __name__ == "__main__":
    main()