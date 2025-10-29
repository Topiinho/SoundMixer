# Plano de Refatoração - SoundMixer

## 1. Migração de Linguagem
- Migrar de Python para **C# (.NET 8)** como core da aplicação
- Utilizar **NAudio/CoreAudioAPI** para controle de áudio
- Implementar **WinUI 3** para interface moderna (Windows 11 style)

## 2. Arquitetura
- Separar em 3 camadas: UI (WinUI), Backend (C# + NAudio), Core Audio (módulo nativo se necessário)
- Implementar padrão MVVM para separação de responsabilidades
- Criar sistema de plugins para funcionalidades futuras

## 3. Funcionalidades Core
- Reescrever detecção de aplicações com áudio usando CoreAudioAPI
- Implementar controle de volume individual por app
- Sistema de roteamento básico entre dispositivos
- Integração com Virtual Audio Cables existentes (VB-Audio)

## 4. Interface
- Design baseado em Fluent Design (Windows 11)
- Inspiração visual: EarTrumpet + Discord (tema dark)
- Componentes: sliders, VU meters, activity monitor
- Suporte a temas e customização

## 5. Performance
- Otimização de detecção em tempo real
- Cache inteligente de sessões de áudio
- Baixo consumo de recursos (nativo vs Electron)

## 6. Estrutura do Projeto
```
SoundMixer/
├── src/
│   ├── UI/              # WinUI 3 XAML
│   ├── Core/            # Lógica de negócio
│   ├── Services/        # Audio, Device, Routing
│   └── Models/          # Data models
├── tests/
└── docs/
```

## 7. Fases de Implementação

### Fase 1 - MVP
- Listar apps com áudio ativo
- Controle de volume individual por app
- UI básica com sliders
- Volume master global

### Fase 2 - Roteamento
- Listar dispositivos de entrada/saída
- Permitir seleção de dispositivo por app
- Roteamento básico entre endpoints

### Fase 3 - Virtual Cables
- Integração com Virtual Audio Cables
- Sistema de patches virtuais
- Loopback e mixing avançado

### Fase 4 - UI Polida e Extras
- Interface completa estilo Windows 11
- VU meters e spectrum analyzer
- Hotkeys e atalhos
- Perfis e presets salvos
- Sistema de temas

## 8. Tecnologias e Bibliotecas

### C# / .NET
- **.NET 8**: Framework principal
- **NAudio**: Manipulação de áudio
- **CoreAudioAPI**: Acesso à API de áudio do Windows
- **CSCore**: Alternativa moderna para efeitos e análise

### UI
- **WinUI 3**: Interface nativa moderna
- **XAML**: Markup da interface
- **MVVM Toolkit**: Padrão arquitetural
- **SkiaSharp / LiveCharts2**: Visualizações e gráficos

### Persistência
- **SQLite**: Configurações e presets
- **JSON**: Exportação de perfis

## 9. Referências e Inspirações

### Apps Similares
- **EarTrumpet**: Controle de volume por app
- **ModernFlyouts**: UI moderna para controles de sistema
- **Files App**: Exemplo de WinUI 3 bem implementado

### Design System
- **Fluent Design System**: Guidelines do Windows 11
- **Windows App SDK**: Componentes nativos

## 10. Próximos Passos Imediatos
1. Setup do projeto C# com WinUI 3
2. Configuração de dependências (NAudio, CoreAudioAPI)
3. Estrutura inicial de pastas e arquitetura
4. Implementação do MVP (Fase 1)
