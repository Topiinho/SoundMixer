import psutil
from pycaw.pycaw import AudioUtilities

class Apps_Service:
    def __init__(self):
        pass

    def get_All_apps():
        apps = []
        sessions = AudioUtilities.GetAllSessions
        for session in sessions:
            if session.Process:
                pid = session.Process.pid

                try:
                    process = psutil.Process(pid)
                    name = process.name()

                    apps.append({
                        'name': name,
                        'pid': pid
                    })
                except:
                    pass
        return apps
    
