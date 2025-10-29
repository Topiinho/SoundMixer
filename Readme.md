# 🎧 SoundMixer

Um mixer de áudio profissional para Windows, desenvolvido em C# com WinUI 3, oferecendo controle granular de áudio por aplicação e roteamento virtual.

## 🎯 Sobre o Projeto

SoundMixer é um aplicativo desktop moderno que permite controlar individualmente o volume de cada aplicação que emite som no Windows, além de oferecer recursos avançados de roteamento de áudio entre dispositivos.

### Características Principais

- ✅ **Controle Individual de Volume** - Ajuste o volume de cada aplicação separadamente
- ✅ **Detecção Automática** - Identifica automaticamente apps com áudio ativo
- ✅ **Interface Moderna** - Design baseado em Fluent Design (Windows 11)
- ✅ **Roteamento de Áudio** - Direcione áudio de apps para diferentes dispositivos
- 🚧 **Virtual Audio Cables** - Sistema de cabos de áudio virtuais (planejado)
- 🚧 **Perfis e Presets** - Salve configurações de volume (planejado)

## 🛠️ Tecnologias Utilizadas

### Framework e UI
- **.NET 9.0** - Framework principal
- **WinUI 3** - Interface de usuário moderna
- **Windows App SDK** - APIs do Windows

### Bibliotecas
- **NAudio** (2.2.1) - Controle de áudio e manipulação
- **NAudio.Wasapi** - API de áudio do Windows (WASAPI)
- **CommunityToolkit.Mvvm** (8.4.0) - Framework MVVM

### Arquitetura
- **MVVM Pattern** - Separação de responsabilidades
- **Dependency Injection** - Injeção de dependências
- **Clean Architecture** - Camadas bem definidas

## 📋 Requisitos do Sistema

- **OS:** Windows 10 version 1809 (build 17763) ou superior
- **Recomendado:** Windows 11
- **.NET:** .NET 9.0 SDK
- **IDE:** Visual Studio 2022 (v17.8+) ou VSCode

## 🚀 Como Executar

### Via Visual Studio

1. Abra `SoundMixer.sln` no Visual Studio 2022
2. Selecione a plataforma **x64** na barra de ferramentas
3. Pressione **F5** para compilar e executar

### Via Linha de Comando

```bash
# Navegar até a pasta do projeto
cd C:\path\to\SoundMixer

# Compilar o projeto
dotnet build -p:Platform=x64

# Executar o aplicativo
dotnet run --project SoundMixer.csproj -p:Platform=x64
```

## 📂 Estrutura do Projeto

```
SoundMixer/
├── SoundMixer/                     # Projeto WinUI 3 (Interface)
│   ├── Views/                      # Páginas XAML
│   ├── ViewModels/                 # ViewModels (MVVM)
│   ├── Models/                     # Modelos de dados
│   ├── Services/                   # Serviços da UI
│   ├── Controls/                   # Controles customizados
│   ├── Converters/                 # Value Converters
│   ├── Themes/                     # Temas e estilos
│   ├── Helpers/                    # Utilitários
│   └── Assets/                     # Ícones e imagens
│
├── SoundMixer.Core/                # Class Library (Lógica de Negócio)
│   ├── Models/                     # Modelos de domínio
│   ├── Services/                   # Serviços de áudio (NAudio)
│   ├── Contracts/                  # Interfaces
│   └── Helpers/                    # Utilitários
│
└── README.md                       # Este arquivo
```

## 🎯 Roadmap

### Fase 1 - MVP (Em Andamento)
- [x] Estrutura base do projeto
- [x] Configuração WinUI 3 + NAudio
- [ ] Listar aplicações com áudio ativo
- [ ] Controle de volume individual por app
- [ ] UI básica com sliders
- [ ] Volume master global

### Fase 2 - Roteamento
- [ ] Listar dispositivos de entrada/saída
- [ ] Permitir seleção de dispositivo por app
- [ ] Roteamento básico entre endpoints

### Fase 3 - Virtual Cables
- [ ] Integração com Virtual Audio Cables
- [ ] Sistema de patches virtuais
- [ ] Loopback e mixing avançado

### Fase 4 - UI Polida e Extras
- [ ] Interface completa estilo Windows 11
- [ ] VU meters e spectrum analyzer
- [ ] Hotkeys e atalhos
- [ ] Perfis e presets salvos
- [ ] Sistema de temas

> 📖 Para detalhes completos do roadmap, consulte: [Plano_de_Refatoracao.md](Plano_de_Refatoracao.md)

## 🎨 Inspirações

- **EarTrumpet** - Controle de volume por aplicação
- **Discord** - Design moderno e intuitivo
- **OBS Studio** - Sistema de mixer profissional
- **VoiceMeeter** - Roteamento de áudio virtual

## 📚 Recursos e Referências

### Projetos Similares
- [EarTrumpet](https://github.com/File-New-Project/EarTrumpet) - Volume Control for Windows
- [ModernFlyouts](https://github.com/ModernFlyouts-Community/ModernFlyouts) - Modern UI for Windows flyouts

### Documentação
- [WinUI 3 Docs](https://learn.microsoft.com/windows/apps/winui/)
- [NAudio GitHub](https://github.com/naudio/NAudio)
- [MVVM Toolkit](https://learn.microsoft.com/dotnet/communitytoolkit/mvvm/)

## 🤝 Contribuindo

Contribuições são bem-vindas! Este é um projeto em desenvolvimento ativo.

## 📄 Licença

MIT License - Projeto de código aberto

## 👨‍💻 Autor

**Vitor Pinho Alcantara**

---

**Status do Projeto:** 🚧 Em Desenvolvimento Ativo

**Última Atualização:** Outubro 2025
