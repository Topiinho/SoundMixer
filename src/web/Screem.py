import webview

class Window_Service:
    def __init__(self, title: str, url: str = None, width: int = 1400, height: int = 800):
        self.title = title
        self.url = url
        self.width = width
        self.height = height

    def creat_window(self):
        return webview.create_window(self.title, self.url, self.width, self.height)
    
    def start(self):
        webview.start()


    