#!/usr/bin/env python3
"""
SoundMixer - Sistema de Configuração
Versão: V1.0

Gerencia configurações persistentes da aplicação.
"""

import json
import os
from typing import Dict, Any, Optional, List
from pathlib import Path


class Config:
    """Gerenciador de configurações do SoundMixer"""
    
    def __init__(self, config_dir: Optional[str] = None):
        if config_dir:
            self.config_dir = Path(config_dir)
        else:
            # Determinar diretório de configuração baseado no sistema
            self.config_dir = self._get_default_config_dir()
        
        self.config_file = self.config_dir / "config.json"
        self.profiles_dir = self.config_dir / "profiles"
        
        # Configurações padrão
        self.default_config = {
            # Interface
            "window_width": 600,
            "window_height": 700,
            "window_x": None,
            "window_y": None,
            "enable_tray_icon": True,
            "minimize_to_tray": True,
            "start_minimized": False,
            
            # Audio Engine
            "scan_interval": 2.0,
            "cleanup_timeout": 10.0,
            "enable_auto_detection": True,
            
            # Virtual Audio (para Windows)
            "enable_virtual_audio": True,
            "virtual_audio_device": "CABLE Input (VB-Audio Virtual Cable)",
            "enable_voice_mix": True,
            "voice_mix_volume": 0.8,
            
            # Supressão de Ruído
            "enable_noise_suppression": False,
            "noise_gate_threshold": -30.0,
            "noise_reduction_strength": 0.5,
            
            # Hotkeys
            "enable_hotkeys": True,
            "hotkey_mute_all": "ctrl+shift+m",
            "hotkey_next_track": "ctrl+shift+n",
            "hotkey_prev_track": "ctrl+shift+p",
            "hotkey_toggle_window": "ctrl+shift+s",
            
            # Perfis
            "enable_profiles": True,
            "auto_load_profiles": True,
            "current_profile": None,
            
            # Sistema
            "startup_with_windows": False,
            "check_updates": True,
            "log_level": "INFO",
            "language": "pt_BR",
            
            # Aparência
            "theme": "default",
            "font_size": 9,
            "show_tooltips": True,
            
            # Desenvolvimento
            "debug_mode": False,
            "mock_audio_apps": True,  # Para desenvolvimento no WSL
        }
        
        self.config = self.default_config.copy()
        self._ensure_directories()
    
    def _get_default_config_dir(self) -> Path:
        """Determina diretório padrão de configuração"""
        if os.name == 'nt':  # Windows
            app_data = os.getenv('APPDATA', os.path.expanduser('~'))
            return Path(app_data) / "SoundMixer"
        else:  # Linux/WSL
            home = os.path.expanduser('~')
            return Path(home) / ".config" / "soundmixer"
    
    def _ensure_directories(self):
        """Cria diretórios necessários"""
        self.config_dir.mkdir(parents=True, exist_ok=True)
        self.profiles_dir.mkdir(parents=True, exist_ok=True)
    
    def load(self) -> bool:
        """Carrega configurações do arquivo"""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    loaded_config = json.load(f)
                
                # Merge com configurações padrão (para novos campos)
                for key, value in loaded_config.items():
                    if key in self.default_config:
                        self.config[key] = value
                
                print(f"✅ Configurações carregadas: {self.config_file}")
                return True
            else:
                print("📋 Usando configurações padrão")
                return False
                
        except Exception as e:
            print(f"⚠️ Erro ao carregar configurações: {e}")
            self.config = self.default_config.copy()
            return False
    
    def save(self) -> bool:
        """Salva configurações no arquivo"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Configurações salvas: {self.config_file}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao salvar configurações: {e}")
            return False
    
    def get(self, key: str, default=None) -> Any:
        """Obtém valor de configuração"""
        return self.config.get(key, default)
    
    def set(self, key: str, value: Any) -> bool:
        """Define valor de configuração"""
        if key in self.default_config:
            self.config[key] = value
            return True
        else:
            print(f"⚠️ Chave de configuração desconhecida: {key}")
            return False
    
    def reset_to_defaults(self):
        """Restaura configurações padrão"""
        self.config = self.default_config.copy()
        print("🔄 Configurações restauradas para padrão")
    
    def get_all(self) -> Dict[str, Any]:
        """Retorna todas as configurações"""
        return self.config.copy()
    
    def update(self, new_config: Dict[str, Any]):
        """Atualiza múltiplas configurações"""
        for key, value in new_config.items():
            self.set(key, value)
    
    # Métodos de conveniência para configurações específicas
    
    def get_window_geometry(self) -> str:
        """Retorna geometria da janela"""
        w = self.get('window_width', 600)
        h = self.get('window_height', 700)
        x = self.get('window_x')
        y = self.get('window_y')
        
        if x is not None and y is not None:
            return f"{w}x{h}+{x}+{y}"
        else:
            return f"{w}x{h}"
    
    def set_window_geometry(self, geometry: str):
        """Define geometria da janela"""
        try:
            # Formato: 600x700+100+50 ou 600x700
            if '+' in geometry:
                size_part, pos_part = geometry.split('+', 1)
                positions = pos_part.split('+')
                self.set('window_x', int(positions[0]))
                if len(positions) > 1:
                    self.set('window_y', int(positions[1]))
            else:
                size_part = geometry
            
            width, height = size_part.split('x')
            self.set('window_width', int(width))
            self.set('window_height', int(height))
            
        except Exception as e:
            print(f"⚠️ Erro ao definir geometria: {e}")
    
    def get_hotkeys(self) -> Dict[str, str]:
        """Retorna todas as hotkeys configuradas"""
        return {
            key: self.get(key) 
            for key in self.config.keys() 
            if key.startswith('hotkey_')
        }
    
    def is_development_mode(self) -> bool:
        """Verifica se está em modo desenvolvimento"""
        return self.get('debug_mode', False) or self.get('mock_audio_apps', False)
    
    def export_config(self, file_path: str) -> bool:
        """Exporta configurações para arquivo"""
        try:
            export_data = {
                'version': '1.0',
                'exported_at': str(Path().cwd()),
                'config': self.config
            }
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)
            
            print(f"📤 Configurações exportadas: {file_path}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao exportar: {e}")
            return False
    
    def import_config(self, file_path: str) -> bool:
        """Importa configurações de arquivo"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                import_data = json.load(f)
            
            if 'config' in import_data:
                # Validar configurações importadas
                imported_config = import_data['config']
                for key, value in imported_config.items():
                    if key in self.default_config:
                        self.config[key] = value
                
                print(f"📥 Configurações importadas: {file_path}")
                return True
            else:
                print("❌ Formato de arquivo inválido")
                return False
                
        except Exception as e:
            print(f"❌ Erro ao importar: {e}")
            return False


class ProfileManager:
    """Gerenciador de perfis de configuração"""
    
    def __init__(self, config: Config):
        self.config = config
        self.profiles_dir = config.profiles_dir
    
    def save_profile(self, name: str, track_configs: Dict) -> bool:
        """Salva perfil com configurações de faixas"""
        try:
            profile_data = {
                'name': name,
                'created_at': str(Path().cwd()),
                'tracks': track_configs,
                'settings': {
                    'scan_interval': self.config.get('scan_interval'),
                    'enable_virtual_audio': self.config.get('enable_virtual_audio'),
                    'enable_noise_suppression': self.config.get('enable_noise_suppression'),
                }
            }
            
            profile_file = self.profiles_dir / f"{name}.json"
            with open(profile_file, 'w', encoding='utf-8') as f:
                json.dump(profile_data, f, indent=2, ensure_ascii=False)
            
            print(f"📋 Perfil salvo: {name}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao salvar perfil: {e}")
            return False
    
    def load_profile(self, name: str) -> Optional[Dict]:
        """Carrega perfil por nome"""
        try:
            profile_file = self.profiles_dir / f"{name}.json"
            if profile_file.exists():
                with open(profile_file, 'r', encoding='utf-8') as f:
                    profile_data = json.load(f)
                
                print(f"📋 Perfil carregado: {name}")
                return profile_data
            else:
                print(f"❌ Perfil não encontrado: {name}")
                return None
                
        except Exception as e:
            print(f"❌ Erro ao carregar perfil: {e}")
            return None
    
    def list_profiles(self) -> List[str]:
        """Lista todos os perfis disponíveis"""
        try:
            profiles = []
            for profile_file in self.profiles_dir.glob("*.json"):
                profiles.append(profile_file.stem)
            return sorted(profiles)
        except Exception as e:
            print(f"❌ Erro ao listar perfis: {e}")
            return []
    
    def delete_profile(self, name: str) -> bool:
        """Remove perfil"""
        try:
            profile_file = self.profiles_dir / f"{name}.json"
            if profile_file.exists():
                profile_file.unlink()
                print(f"🗑️ Perfil removido: {name}")
                return True
            else:
                print(f"❌ Perfil não encontrado: {name}")
                return False
                
        except Exception as e:
            print(f"❌ Erro ao remover perfil: {e}")
            return False