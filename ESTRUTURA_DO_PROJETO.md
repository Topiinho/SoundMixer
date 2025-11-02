# Estrutura do Projeto SoundMixer

```
SoundMixer/
├── .gitignore
├── README.md
├── SoundMixer.sln
│
└── src/
    │
    ├── SoundMixer.Core/
    │   ├── SoundMixer.Core.csproj
    │   │
    │   ├── Models/
    │   │   ├── AudioApplication.cs
    │   │   ├── AudioDevice.cs
    │   │   └── RoutingRule.cs
    │   │
    │   ├── Contracts/
    │   │   ├── IApplicationAudioProvider.cs
    │   │   ├── IDeviceProvider.cs
    │   │   ├── IApplicationVolumeService.cs
    │   │   └── IDeviceService.cs
    │   │
    │   ├── Services/
    │   │   ├── ApplicationVolumeService.cs
    │   │   └── DeviceService.cs
    │   │
    │   └── Audio/
    │       ├── AudioMixer.cs
    │       └── AudioRouter.cs
    │
    ├── SoundMixer.Infrastructure/
    │   ├── SoundMixer.Infrastructure.csproj
    │   │
    │   ├── Providers/
    │   │   ├── NAudioApplicationProvider.cs
    │   │   ├── NAudioDeviceProvider.cs
    │   │   └── AudioSwitcherProvider.cs
    │   │
    │   └── Adapters/
    │       ├── NAudioSessionAdapter.cs
    │       └── NAudioDeviceAdapter.cs
    │
    └── SoundMixer/
        ├── SoundMixer.csproj
        │
        ├── Models/
        │   └── AudioApplicationViewModel.cs
        │
        ├── ViewModels/
        │   ├── MainViewModel.cs
        │   ├── MixerViewModel.cs
        │   └── SettingsViewModel.cs
        │
        ├── Views/
        │   ├── MainPage.xaml
        │   ├── MainPage.xaml.cs
        │   ├── MixerPage.xaml
        │   ├── MixerPage.xaml.cs
        │   ├── SettingsPage.xaml
        │   └── SettingsPage.xaml.cs
        │
        ├── Services/
        │   ├── NavigationService.cs
        │   └── ThemeService.cs
        │
        ├── Assets/
        │   └── ...
        │
        ├── App.xaml
        ├── App.xaml.cs
        ├── Package.appxmanifest
        ├── app.manifest
        ├── Imports.cs
        └── ...
```
