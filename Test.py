from src.libs import GetAllSessions, psutil

def obter_apps_com_audio():
    apps = []
    sessions = GetAllSessions()

    for session in sessions:
        # Verifica se a sessão tem processo associado
        if session.Process:
            # Pega informações do processo
            pid = session.Process.pid

            # Usa psutil para pegar o nome
            try:
                processo = psutil.Process(pid)
                nome = processo.name()

                # Pega o volume (SimpleAudioVolume)
                volume = session.SimpleAudioVolume
                nivel_volume = int(volume.GetMasterVolume() * 100)

                apps.append({
                    'nome': nome,
                    'pid': pid,
                    'volume': nivel_volume
                })
            except:
                pass  # Processo pode ter fechado

    return apps

if __name__ == "__main__":
      apps = obter_apps_com_audio()
      print(f"Apps com áudio: {len(apps)}")
      for app in apps:
          print(f"  - {app['nome']}: {app['volume']}%")