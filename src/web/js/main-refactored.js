/* SoundMixer - Versão Refatorada com Boas Práticas */

import SoundMixerApp from './core/app.js';

// Aguardar carregamento e inicializar
async function initApp() {
    try {
        console.log('🚀 Iniciando SoundMixer - Versão Refatorada');

        // Criar instância da aplicação
        const app = new SoundMixerApp();

        // Inicializar
        await app.init();

        // Tornar disponível globalmente para debug
        window.SoundMixer = app;

        console.log('🎉 SoundMixer refatorado inicializado com sucesso');

    } catch (error) {
        console.error('💥 Erro crítico na inicialização:', error);

        // Mostrar error boundary
        const errorBoundary = document.getElementById('error-boundary');
        if (errorBoundary) {
            errorBoundary.style.display = 'block';
        }

        // Fallback: carregar versão anterior
        console.log('🔄 Tentando carregar versão de fallback...');
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'js/mixer.js';
        fallbackScript.onload = () => {
            console.log('✅ Fallback carregado com sucesso');
            if (errorBoundary) {
                errorBoundary.style.display = 'none';
            }
        };
        fallbackScript.onerror = () => {
            console.error('❌ Fallback também falhou');
            if (errorBoundary) {
                errorBoundary.innerHTML = '<h2>Erro Crítico</h2><p>Não foi possível carregar o SoundMixer. Recarregue a página.</p>';
            }
        };
        document.head.appendChild(fallbackScript);
    }
}

// Auto-inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Compatibilidade PyWebView
window.addEventListener('pywebviewready', initApp);