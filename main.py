import os
from src.web.Screem import Window_Service
from src.core.Apps_Controller import Apps_Service
from src.core.Volume_Controller import Apps_Volume_Controller, Master_Volume_Controller


class Api:
    def get_audio_apps(self):
        return Apps_Service.get_all_apps()

    def set_app_volume(self, app_name, volume_level):
        controller = Apps_Volume_Controller(f"{app_name}.exe")
        controller.set_volume(volume_level)
        volume_level = controller.volume

    def toggle_app_mute(self, app_name):
        controller = Apps_Volume_Controller(f"{app_name}.exe")
        isMute = controller.toggle_mute()
        return isMute
    


    def get_audio_master(self):
        controller = Master_Volume_Controller()
        return controller.volume
    
    def toggle_master_mute(self):
        controller = Master_Volume_Controller()
        isMute = controller.toggle_mute()
        return isMute
    
    def get_master_state(self):
        controller = Master_Volume_Controller()
        return controller.get_state()
    
    def set_master_volume(self, volume_level):
        controller = Master_Volume_Controller()
        controller.set_volume(volume_level)
        volume_level = controller.volume
        return volume_level
        






def main():
    api = Api()

    window = Window_Service("Sonus Mixer", "src/web/index.html", js_api=api, icon="src/web/assets/icon.ico")
    window.creat_window()
    window.start()

if __name__ == "__main__":
    main()