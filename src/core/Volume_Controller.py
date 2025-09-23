from pycaw.pycaw import AudioUtilities

class Volume_Controller:
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