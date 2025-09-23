from src.web.Screem import Window_Service

def main():
    window = Window_Service("Sound Mixer", "src/web/index.html")
    window.creat_window()
    window.start()



if __name__ == "__main__":
    main()