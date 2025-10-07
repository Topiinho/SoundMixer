import webview
from typing import Optional, Any

class Window_Service:
    """
    Serviço para criação e gerenciamento de janelas PyWebView.
    """

    def __init__(self, title: str, url: str, width: int = 1400, height: int = 800, js_api: Optional[Any] = None, icon: Optional[str] = None) -> None:
        """
        Inicializa o serviço de janela.

        Args:
            title: Título da janela
            url: URL ou caminho do arquivo HTML
            width: Largura da janela em pixels
            height: Altura da janela em pixels
            js_api: API JavaScript para comunicação com Python
            icon: Caminho para o ícone da janela
        """
        self.title = title
        self.url = url
        self.width = width
        self.height = height
        self.js_api = js_api
        self.icon = icon

    def create_window(self) -> Any:
        """
        Cria a janela PyWebView.

        Returns:
            Instância da janela criada
        """
        return webview.create_window(self.title, self.url, width=self.width, height=self.height, js_api=self.js_api)
    
    def start(self) -> None:
        """
        Inicia a aplicação PyWebView.
        """
        webview.start(icon=self.icon)


