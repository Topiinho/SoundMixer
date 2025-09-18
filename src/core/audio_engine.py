#!/usr/bin/env python3
"""
SoundMixer - Audio Engine Core
Versão: V1.0

Responsável por detectar aplicativos com áudio e controlar volumes.
No WSL: Simula detecção para desenvolvimento.
No Windows: Usa APIs reais (pycaw, psutil).
"""

import sys
import time
import threading
from typing import Dict, List, Optional
import psutil


class AudioApplication:
    """Representa um aplicativo com capacidades de áudio"""
    
    def __init__(self, pid: int, name: str, volume: float = 1.0):
        self.pid = pid
        self.name = name
        self.volume = volume
        self.muted = False
        self.last_seen = time.time()
        self.track_id = None  # ID da faixa atribuída
        
    def __str__(self):
        status = "🔇" if self.muted else f"🔊{int(self.volume * 100)}%"
        return f"{self.name} (PID:{self.pid}) {status}"
    
    def to_dict(self):
        """Converte para dicionário para JSON"""
        return {
            'pid': self.pid,
            'name': self.name,
            'volume': self.volume,
            'muted': self.muted,
            'track_id': self.track_id
        }


class AudioEngine:
    """Engine principal de áudio"""
    
    def __init__(self):
        self.applications: Dict[int, AudioApplication] = {}
        self.is_windows = sys.platform == "win32"
        self.running = False
        self.detection_thread = None
        self.update_callbacks = []
        
        # Configurações
        self.scan_interval = 2.0  # segundos
        self.cleanup_timeout = 10.0  # segundos
        
        print(f"🎵 AudioEngine inicializado ({'Windows' if self.is_windows else 'WSL/Linux'})")
    
    def start_detection(self):
        """Inicia detecção automática de aplicativos"""
        if self.running:
            return
        
        self.running = True
        self.detection_thread = threading.Thread(target=self._detection_loop, daemon=True)
        self.detection_thread.start()
        print("🔍 Detecção de aplicativos iniciada")
    
    def stop_detection(self):
        """Para detecção automática"""
        self.running = False
        if self.detection_thread:
            self.detection_thread.join(timeout=3.0)
        print("🛑 Detecção de aplicativos parada")
    
    def _detection_loop(self):
        """Loop principal de detecção"""
        while self.running:
            try:
                self._scan_applications()
                self._cleanup_dead_applications()
                self._notify_callbacks()
                time.sleep(self.scan_interval)
            except Exception as e:
                print(f"⚠️ Erro na detecção: {e}")
                time.sleep(self.scan_interval)
    
    def _scan_applications(self):
        """Escaneia aplicativos com áudio ativo"""
        if self.is_windows:
            self._scan_windows_audio()
        else:
            self._scan_linux_mock()
    
    def _scan_windows_audio(self):
        """Escaneia aplicativos no Windows usando pycaw"""
        try:
            # TODO: Implementar com pycaw quando testarmos no Windows
            # Por enquanto, usa detecção genérica
            self._scan_generic_processes()
        except ImportError:
            print("⚠️ pycaw não disponível, usando detecção genérica")
            self._scan_generic_processes()
    
    def _scan_linux_mock(self):
        """Simula detecção no Linux para desenvolvimento"""
        # Aplicativos comuns que podem ter áudio
        audio_apps = [
            'firefox', 'chrome', 'chromium', 'spotify', 'vlc', 
            'discord', 'steam', 'obs', 'audacity', 'pulseaudio'
        ]
        
        current_pids = set()
        
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                proc_info = proc.info
                if any(app in proc_info['name'].lower() for app in audio_apps):
                    pid = proc_info['pid']
                    name = proc_info['name']
                    current_pids.add(pid)
                    
                    if pid not in self.applications:
                        # Novo aplicativo detectado
                        app = AudioApplication(pid, name)
                        self.applications[pid] = app
                        print(f"🎵 Novo app detectado: {app}")
                    else:
                        # Atualizar timestamp
                        self.applications[pid].last_seen = time.time()
                        
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
    
    def _scan_generic_processes(self):
        """Detecção genérica baseada em nomes de processos"""
        audio_keywords = [
            'audio', 'sound', 'music', 'media', 'player', 'stream',
            'spotify', 'discord', 'chrome', 'firefox', 'vlc', 'obs'
        ]
        
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                proc_info = proc.info
                name_lower = proc_info['name'].lower()
                
                if any(keyword in name_lower for keyword in audio_keywords):
                    pid = proc_info['pid']
                    name = proc_info['name']
                    
                    if pid not in self.applications:
                        app = AudioApplication(pid, name)
                        self.applications[pid] = app
                        print(f"🎵 App detectado: {app}")
                    else:
                        self.applications[pid].last_seen = time.time()
                        
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
    
    def _cleanup_dead_applications(self):
        """Remove aplicativos que não estão mais rodando"""
        current_time = time.time()
        dead_pids = []
        
        for pid, app in self.applications.items():
            if current_time - app.last_seen > self.cleanup_timeout:
                dead_pids.append(pid)
        
        for pid in dead_pids:
            app = self.applications.pop(pid)
            print(f"🗑️ App removido: {app.name} (PID:{pid})")
    
    def get_applications(self) -> List[AudioApplication]:
        """Retorna lista de aplicativos detectados"""
        return list(self.applications.values())
    
    def get_application(self, pid: int) -> Optional[AudioApplication]:
        """Retorna aplicativo específico por PID"""
        return self.applications.get(pid)
    
    def set_application_volume(self, pid: int, volume: float) -> bool:
        """Define volume de um aplicativo (0.0 a 1.0)"""
        if pid not in self.applications:
            return False
        
        volume = max(0.0, min(1.0, volume))
        self.applications[pid].volume = volume
        
        if self.is_windows:
            # TODO: Implementar controle real no Windows
            pass
        
        print(f"🔊 Volume {self.applications[pid].name}: {int(volume * 100)}%")
        return True
    
    def mute_application(self, pid: int, muted: bool = True) -> bool:
        """Muta/desmuta um aplicativo"""
        if pid not in self.applications:
            return False
        
        self.applications[pid].muted = muted
        
        if self.is_windows:
            # TODO: Implementar mute real no Windows
            pass
        
        status = "mutado" if muted else "desmutado"
        print(f"🔇 {self.applications[pid].name} {status}")
        return True
    
    def assign_to_track(self, pid: int, track_id: int) -> bool:
        """Atribui aplicativo a uma faixa específica"""
        if pid not in self.applications:
            return False
        
        self.applications[pid].track_id = track_id
        print(f"📍 {self.applications[pid].name} → Faixa {track_id}")
        return True
    
    def add_update_callback(self, callback):
        """Adiciona callback para mudanças de estado"""
        self.update_callbacks.append(callback)
    
    def _notify_callbacks(self):
        """Notifica callbacks sobre mudanças"""
        for callback in self.update_callbacks:
            try:
                callback(self.applications)
            except Exception as e:
                print(f"⚠️ Erro em callback: {e}")
    
    def get_stats(self) -> Dict:
        """Retorna estatísticas do engine"""
        return {
            'total_apps': len(self.applications),
            'running': self.running,
            'platform': 'Windows' if self.is_windows else 'Linux',
            'scan_interval': self.scan_interval
        }
    
    def cleanup(self):
        """Limpeza final"""
        self.stop_detection()
        self.applications.clear()
        print("🧹 AudioEngine finalizado")