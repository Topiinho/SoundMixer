import webview
from typing import Optional, Any

class Window_Service:
    def __init__(self, title: str, url: str, width: int = 1400, height: int = 800, js_api: Optional[Any] = None, icon: Optional[str] = None) -> None:
        self.title = title
        self.url = url
        self.width = width
        self.height = height
        self.js_api = js_api
        self.icon = icon

    def create_window(self) -> Any:
        return webview.create_window(self.title, self.url, width=self.width, height=self.height, js_api=self.js_api)

    def start(self) -> None:
        webview.start(icon=self.icon)

