import webview

class Window_Service:
    def __init__(self, title: str, url: str = None):
        self.title = title
        self.url = url

    def load_html(self):
        with open(self.url, "r", encoding="utf-8") as html:
            return html.read()

    def creat_window(self):
        html = {"html": Window_Service.load_html(self)}
        return webview.create_window(self.title, url=None, js_api=None, **html)
    
    def start(self):
        webview.start()


    