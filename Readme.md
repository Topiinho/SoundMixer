# Projeto Sonus Mixer

## 📋 Visão Geral

O **Sonus Mixer** é um mixer de áudio profissional para Windows, com interface moderna inspirada em ferramentas como **Discord**, **OBS Studio** e **VoiceMeeter**. O objetivo é oferecer **controle granular** de áudio por aplicação, roteamento virtual e monitoramento em tempo real, tudo em uma interface intuitiva e leve (sem Electron).

---

## 🎯 Objetivos do Projeto

### Objetivo Principal

Criar um **mixer de áudio desktop nativo** para Windows que permita controle individual e global de áudio com foco em usabilidade, performance e design moderno.

### Objetivos Específicos

* ✅ Controle individual de volume por aplicativo
* ✅ Interface nativa com **PyWebView**
* ✅ Detecção automática de aplicações com áudio
* ✅ Suporte a **Virtual Audio Cables**
* ✅ Sistema de roteamento flexível
* ✅ Hot-reload para desenvolvimento
* ✅ Visual inspirado no Discord (tema escuro)

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

#### Backend (Python)

* **Python 3.11+**: Linguagem principal
* **pycaw**: Controle via Windows Core Audio API
* **psutil**: Informações de processos
* **comtypes**: Interface COM para Windows
* **PyWebView**: Interface nativa sem Electron

#### Frontend (Web)

* **HTML5**: Estrutura semântica
* **CSS3**: Estilo (tema Discord)
* **JavaScript Vanilla**: Lógica sem frameworks pesados
* **Bootstrap 5**: Componentes UI
* **Font Awesome**: Ícones

### Estrutura de Diretórios

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

---

## 🔧 Funcionalidades Principais

### 1. Detecção de Aplicações

* **Automática**: Detecta apps com sessões de áudio ativas
* **Tempo Real**: Atualização via botão refresh
* **Filtros**: Ignora processos do sistema
* **Cache**: Otimização de performance

### 2. Controle de Volume

* **Individual**: Por aplicação (0–100%)
* **Master**: Volume global do sistema
* **Mute/Solo**: Por canal

### 3. Interface Visual

* **Tema Discord**: Dark mode profissional
* **VU Meters**: Visualização de níveis
* **Spectrum Analyzer**: Análise espectral
* **Activity Log**: Registro de atividades

### 4. Virtual Audio Cables

* **Roteamento**: Entre aplicações
* **Mixing**: Combinação de múltiplas fontes
* **Loopback**: Captura interna
* **Patches**: Conexões virtuais

---

## 🎯 Casos de Uso

### 1. Streamer

* Controlar Discord vs Game vs Música
* Criar mix para transmissão
* Mute rápido durante live

### 2. Usuário Casual

* Ajustar volume do Spotify
* Mutar Discord em jogos
* Equalizar volumes entre apps

---

## 📄 Licença

MIT License – Projeto de código aberto

---

## 👥 Contribuidores

* **Desenvolvedor Principal**: Vitor Pinho Alcantara
* **UI/UX**: Inspirado no Discord
* **Testes**: Comunidade
