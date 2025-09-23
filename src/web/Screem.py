import webview

class Window_Service:
    def __init__(self, title: str, url: str, width: int = 1400, height: int = 800, js_api=None):
        self.title = title
        self.url = url
        self.width = width
        self.height = height
        self.js_api = js_api

    def creat_window(self):
        return webview.create_window(self.title, self.url, width=self.width, height=self.height, js_api=self.js_api)
    
    def start(self):
        webview.start()


    