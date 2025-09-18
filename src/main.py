#!/usr/bin/env python3
"""
SoundMixer - Sistema de Mixer de Áudio para Windows
Versão: V1.0
Autor: Claude Code + Usuário
Data: 17/09/2025

Ponto de entrada principal da aplicação.
"""

import sys
import os
import tkinter as tk
from tkinter import messagebox
import threading
import time

# Adicionar src ao path para imports relativos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from ui.main_window_modern import MainWindowModern as MainWindow
    from ui.tray_icon import TrayIcon
    from core.audio_engine import AudioEngine
    from utils.config import Config
except ImportError as e:
    print(f"❌ Erro ao importar módulos: {e}")
    print("Certifique-se de que todas as dependências estão instaladas")
    sys.exit(1)


class SoundMixer:
    """Classe principal do SoundMixer"""
    
    def __init__(self):
        self.config = Config()
        self.audio_engine = None
        self.main_window = None
        self.tray_icon = None
        self.running = False
        
    def initialize(self):
        """Inicializa todos os componentes"""
        try:
            print("🎵 Iniciando SoundMixer...")
            
            # Carregar configurações
            self.config.load()
            print("✅ Configurações carregadas")
            
            # Inicializar engine de áudio (placeholder no WSL)
            self.audio_engine = AudioEngine()
            print("✅ Audio Engine inicializado")
            
            # Criar interface principal
            self.main_window = MainWindow(self.config, self.audio_engine)
            print("✅ Interface principal criada")
            
            # Inicializar ícone da bandeja (se habilitado)
            if self.config.get('enable_tray_icon', True):
                self.tray_icon = TrayIcon(self.main_window)
                print("✅ Ícone da bandeja configurado")
            
            self.running = True
            print("🚀 SoundMixer inicializado com sucesso!")
            
        except Exception as e:
            error_msg = f"❌ Erro na inicialização: {e}"
            print(error_msg)
            messagebox.showerror("Erro de Inicialização", error_msg)
            sys.exit(1)
    
    def run(self):
        """Loop principal da aplicação"""
        if not self.running:
            self.initialize()
        
        try:
            # Iniciar loop da interface
            print("🎮 Entrando no loop principal...")
            self.main_window.run()
            
        except KeyboardInterrupt:
            print("\n🛑 Interrupção por teclado detectada")
            self.shutdown()
        except Exception as e:
            print(f"❌ Erro no loop principal: {e}")
            self.shutdown()
    
    def shutdown(self):
        """Encerra a aplicação graciosamente"""
        print("🔄 Encerrando SoundMixer...")
        
        try:
            if self.tray_icon:
                self.tray_icon.stop()
                print("✅ Ícone da bandeja removido")
            
            if self.audio_engine:
                self.audio_engine.cleanup()
                print("✅ Audio Engine finalizado")
            
            if self.config:
                self.config.save()
                print("✅ Configurações salvas")
            
            self.running = False
            print("👋 SoundMixer encerrado com sucesso!")
            
        except Exception as e:
            print(f"⚠️ Erro durante encerramento: {e}")


def main():
    """Função principal de entrada"""
    print("=" * 50)
    print("🎵 SoundMixer V1.0 - Mixer de Áudio")
    print("=" * 50)
    
    # Verificar sistema operacional
    if sys.platform != "linux" and sys.platform != "win32":
        print("❌ Sistema operacional não suportado")
        print("Suportados: Windows, Linux (desenvolvimento)")
        sys.exit(1)
    
    # Verificar versão do Python
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ necessário")
        print(f"Versão atual: {sys.version}")
        sys.exit(1)
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    print(f"✅ Sistema: {sys.platform}")
    
    # Criar e executar aplicação
    app = SoundMixer()
    
    try:
        app.run()
    except Exception as e:
        print(f"❌ Erro fatal: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()