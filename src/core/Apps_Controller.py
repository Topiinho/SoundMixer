import psutil
from pycaw.pycaw import AudioUtilities
import win32gui
import win32ui
import win32con
import win32api
from PIL import Image, ImageWin
import io
import base64
from typing import List, Dict, Any, Optional

def get_icon_as_base64(pid: int) -> Optional[str]:
    try:
        proc = psutil.Process(pid)
        exe_path = proc.exe()

        if not exe_path:
            return None

        ico_x = win32api.GetSystemMetrics(win32con.SM_CXICON)
        ico_y = win32api.GetSystemMetrics(win32con.SM_CYICON)
        large, small = win32gui.ExtractIconEx(exe_path, 0)
        hicon = large[0] if large else small[0] if small else None

        if hicon is None:
            return None

        hdc = win32ui.CreateDCFromHandle(win32gui.GetDC(0))
        hbmp = win32ui.CreateBitmap()
        hbmp.CreateCompatibleBitmap(hdc, ico_x, ico_y)
        hdc = hdc.CreateCompatibleDC()
        hdc.SelectObject(hbmp)
        hdc.DrawIcon((0, 0), hicon)

        bmp_info = hbmp.GetInfo()
        bmp_str = hbmp.GetBitmapBits(True)
        img = Image.frombuffer(
            'RGBA',
            (bmp_info['bmWidth'], bmp_info['bmHeight']),
            bmp_str, 'raw', 'BGRA', 0, 1
        )

        with io.BytesIO() as output:
            img.save(output, format="PNG")
            contents = output.getvalue()
        
        encoded_string = base64.b64encode(contents).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"

    except Exception as e:
        print(f"Erro ao obter ícone para PID {pid}: {e}")
        return None
    finally:
        if 'hicon' in locals() and hicon:
            win32gui.DestroyIcon(hicon)

class Apps_Service:
    @staticmethod
    def get_all_apps() -> List[Dict[str, Any]]:
        apps = []
        seen_apps = set()
        sessions = AudioUtilities.GetAllSessions()

        for session in sessions:
            if session.Process and session.Process.name():
                app_name = session.Process.name().replace('.exe', '')

                if app_name not in seen_apps and "svchost" not in app_name:
                    seen_apps.add(app_name)
                    pid = session.Process.pid

                    volume_interface = session.SimpleAudioVolume
                    current_volume = round(volume_interface.GetMasterVolume() * 100)
                    is_muted = volume_interface.GetMute()

                    apps.append({
                        'name': app_name,
                        'pid': pid,
                        'icon': get_icon_as_base64(pid),
                        'volume': current_volume,
                        'is_muted': is_muted
                    })
        return apps

def main():
    appss = Apps_Service()
    apps = appss.get_all_apps()
    for app in apps:
        print(app)

if __name__ == "__main__":
    main()