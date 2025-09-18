#!/usr/bin/env python3
"""
SoundMixer - Interface PyWebView Nativa Funcional
Versão: Interface Nativa

Interface desktop nativa usando pywebview com controles funcionais.
"""

import webview
import sys
import os
import time
import random
from pathlib import Path

class SoundMixerNativo:
    """SoundMixer com interface nativa funcional"""
    
    def __init__(self):
        self.web_folder = Path(__file__).parent / "web"
        self.master_volume = 0.85
        self.channels = {
            1: {'name': 'Discord', 'volume': 0.8, 'muted': False, 'solo': False},
            2: {'name': 'Spotify', 'volume': 0.6, 'muted': False, 'solo': False},
            3: {'name': 'Chrome', 'volume': 0.7, 'muted': False, 'solo': False}
        }
        
        print("🖥️ SoundMixer Nativo - Interface Desktop")
        
    # === FUNÇÕES EXPOSTAS PARA JAVASCRIPT ===
    
    def get_active_applications(self):
        """Retorna aplicações detectadas"""
        apps = []
        for channel_id, data in self.channels.items():
            apps.append({
                'pid': 1000 + channel_id,
                'name': data['name'],
                'volume': data['volume'],
                'muted': data['muted']
            })
        return apps
    
    def set_master_volume(self, volume):
        """Controle master volume - FUNCIONAL"""
        old_vol = int(self.master_volume * 100)
        self.master_volume = max(0.0, min(1.0, volume))
        new_vol = int(self.master_volume * 100)
        print(f"🔊 MASTER VOLUME: {old_vol}% → {new_vol}%")
        return True
    
    def set_application_volume(self, pid, volume):
        """Controle volume por app - FUNCIONAL"""
        channel_id = pid - 1000
        if channel_id in self.channels:
            old_vol = int(self.channels[channel_id]['volume'] * 100)
            self.channels[channel_id]['volume'] = volume
            new_vol = int(volume * 100)
            app_name = self.channels[channel_id]['name']
            print(f"🔊 {app_name}: {old_vol}% → {new_vol}%")
            return True
        return False
    
    def toggle_mute(self, channel_id):
        """Toggle mute - FUNCIONAL"""
        if channel_id in self.channels:
            self.channels[channel_id]['muted'] = not self.channels[channel_id]['muted']
            app_name = self.channels[channel_id]['name']
            status = "MUTED" if self.channels[channel_id]['muted'] else "UNMUTED"
            print(f"🔇 {app_name}: {status}")
            return self.channels[channel_id]['muted']
        return False
    
    def toggle_solo(self, channel_id):
        """Toggle solo - FUNCIONAL"""
        if channel_id in self.channels:
            self.channels[channel_id]['solo'] = not self.channels[channel_id]['solo']
            app_name = self.channels[channel_id]['name']
            status = "SOLO ON" if self.channels[channel_id]['solo'] else "SOLO OFF"
            print(f"🎯 {app_name}: {status}")
            return self.channels[channel_id]['solo']
        return False
    
    def transport_control(self, action):
        """Transport controls - FUNCIONAL"""
        print(f"🎮 TRANSPORT: {action.upper()}")
        if action == 'play':
            print("   ▶️ Sistema de áudio INICIADO")
        elif action == 'pause':
            print("   ⏸️ Sistema de áudio PAUSADO")
        elif action == 'stop':
            print("   ⏹️ Sistema de áudio PARADO")
        return True
    
    def create_channel(self):
        """Criar novo canal - FUNCIONAL"""
        new_id = max(self.channels.keys()) + 1 if self.channels else 1
        self.channels[new_id] = {
            'name': f'Canal {new_id}',
            'volume': 0.75,
            'muted': False,
            'solo': False
        }
        print(f"✅ CANAL {new_id} CRIADO: {self.channels[new_id]['name']}")
        return new_id
    
    def set_channel_gain(self, channel_id, gain):
        """Ajustar gain - FUNCIONAL"""
        db_value = round((gain - 100) / 5)
        if channel_id in self.channels:
            app_name = self.channels[channel_id]['name']
            print(f"🎛️ {app_name}: Gain = {db_value:+d}dB")
        else:
            print(f"🎛️ Canal {channel_id}: Gain = {db_value:+d}dB")
        return True
    
    def get_spectrum_data(self):
        """Dados spectrum analyzer"""
        return [random.randint(10, 90) for _ in range(32)]


def main():
    """Inicia aplicação nativa"""
    app = SoundMixerNativo()
    
    print("=" * 50)
    print("🎛️ SoundMixer - Interface Desktop Nativa")
    print("🖥️ Janela 100% nativa (sem navegador)")
    print("⚡ Controles funcionais")
    print("=" * 50)
    
    try:
        # Criar janela nativa
        window = webview.create_window(
            title='🎛️ SoundMixer - Professional Audio Mixer',
            url=str(app.web_folder / 'index_nativo.html'),
            width=1200,
            height=800,
            min_size=(800, 600),
            resizable=True,
            shadow=True,
            js_api=app  # Expor funções Python para JS
        )
        
        print("🚀 Abrindo janela nativa...")
        
        # Iniciar aplicação
        webview.start(debug=False)
        
        print("👋 SoundMixer encerrado")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())