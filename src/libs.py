import os
import sys
import logging


try:
    import psutil
    import comtypes
    from pycaw.pycaw import AudioUtilities, ISimpleAudioVolume
    import webview

except ImportError as e:
    print(f"[ERRO] Biblioteca não encontrada: {e}")
    print("Execute: pip install -r requirements.txt")
    sys.exit(1)


def create_window(titulo: str, url: str = None, largura: int = 1400, altura: int = 800):
    return webview.create_window(titulo, url, width=largura, height=altura)

def start():
    webview.start()

def GetAllSessions():
      return AudioUtilities.GetAllSessions()