"""
Configurações centralizadas do SoundMixer.
"""
import os
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class AudioSettings:
    """Configurações relacionadas ao áudio."""

    # Processos a serem ignorados na detecção
    excluded_processes: List[str] = None

    # Timeout para scripts PowerShell (segundos)
    powershell_timeout: int = 5

    # Volume padrão para novas aplicações
    default_app_volume: int = 100

    # Volume máximo permitido (proteção auditiva)
    max_volume: int = 100

    def __post_init__(self):
        if self.excluded_processes is None:
            self.excluded_processes = [
                "svchost", "dwm", "winlogon", "csrss",
                "audiodg", "lsass", "smss", "wininit"
            ]


@dataclass
class UISettings:
    window_width: int = 1400
    window_height: int = 800

    auto_refresh_interval: int = 5

    theme: str = "dark"

    show_app_icons: bool = True


@dataclass
class LoggingSettings:
    log_level: str = "INFO"

    log_file: Optional[str] = None

    max_log_size_mb: int = 10
    backup_count: int = 3

    date_format: str = "%Y-%m-%d %H:%M:%S"


@dataclass
class AppSettings:
    app_name: str = "Sonus Mixer"
    version: str = "1.0.0"

    assets_dir: str = "src/web/assets"
    interface_file: str = "src/web/index.html"
    icon_file: str = "src/web/assets/icon.ico"

    audio: AudioSettings = None
    ui: UISettings = None
    logging: LoggingSettings = None

    def __post_init__(self):
        if self.audio is None:
            self.audio = AudioSettings()
        if self.ui is None:
            self.ui = UISettings()
        if self.logging is None:
            self.logging = LoggingSettings()


settings = AppSettings()


def load_settings_from_env() -> AppSettings:
    log_level = os.getenv("SOUND_MIXER_LOG_LEVEL", settings.logging.log_level)
    log_file = os.getenv("SOUND_MIXER_LOG_FILE", settings.logging.log_file)

    window_width = int(os.getenv("SOUND_MIXER_WINDOW_WIDTH", settings.ui.window_width))
    window_height = int(os.getenv("SOUND_MIXER_WINDOW_HEIGHT", settings.ui.window_height))

    powershell_timeout = int(os.getenv("SOUND_MIXER_PS_TIMEOUT", settings.audio.powershell_timeout))
    max_volume = int(os.getenv("SOUND_MIXER_MAX_VOLUME", settings.audio.max_volume))

    settings.logging.log_level = log_level
    settings.logging.log_file = log_file
    settings.ui.window_width = window_width
    settings.ui.window_height = window_height
    settings.audio.powershell_timeout = powershell_timeout
    settings.audio.max_volume = max_volume

    return settings


def get_settings() -> AppSettings:
    return settings