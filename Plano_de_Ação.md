# 📌 Plano de Ação (Roadmap)

## Estrutura de Diretórios

```
SoundMixer/
├── src/
│   ├── core/                    # Módulos principais
│   │   ├── audio_detector.py    # Detecção de apps com áudio
│   │   ├── volume_controller.py # Controle de volume
│   │   └── virtual_cable.py     # Virtual Audio Cables
│   │
│   ├── web/                     # Interface Web
│   │   ├── index.html           # Interface principal
│   │   ├── css/
│   │   │   ├── discord-style.css    # Tema Discord
│   │   │   ├── mixer-components.css # Componentes mixer
│   │   │   └── animations.css       # Animações
│   │   └── js/
│   │       └── mixer.js            # Lógica frontend
│   │
│   └── main.py                     # App principal
│
├── docs/                           # Documentação
├── tests/                          # Testes automatizados
└── requirements.txt                # Dependências
```

## 🗓️ Fase 1 – MVP (Base do Projeto)

* [ ] Configuração do ambiente Python + PyWebView
* [ ] Implementar detecção de apps com áudio (pycaw + psutil)
* [ ] Criar controle básico de volume (individual + master)
* [ ] Interface simples listando apps e sliders de volume

## 🗓️ Fase 2 – Interface e UX

* [ ] Implementar tema estilo Discord (CSS + Bootstrap)
* [ ] Adicionar ícones (Font Awesome)
* [ ] Melhorar responsividade e design dos sliders
* [ ] Criar painel de configurações básicas

## 🗓️ Fase 3 – Funcionalidades Avançadas

* [ ] Suporte a Virtual Audio Cables (roteamento básico)
* [ ] Implementar Mute/Solo por aplicação
* [ ] Adicionar VU Meters (níveis de áudio em tempo real)
* [ ] Criar Spectrum Analyzer simples

## 🗓️ Fase 4 – Estabilidade e Expansão

* [ ] Testes automatizados para core
* [ ] Documentação inicial em `/docs`
* [ ] Activity Log (histórico de ações)
* [ ] Perfis de áudio salvos (Streaming, Jogos, Trabalho)

## 🗓️ Fase 5 – Polimento Final

* [ ] Otimizações de performance
* [ ] Suporte a atalhos de teclado globais
* [ ] Refinamento da interface (animações, microinterações)
* [ ] Preparar release beta


