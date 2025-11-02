using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using SoundMixer.Services;

namespace SoundMixer.ViewModels;

public partial class SettingsViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private bool autoStartEnabled = false;

    [ObservableProperty]
    private bool minimizeToTrayEnabled = true;

    [ObservableProperty]
    private bool rememberVolumeEnabled = true;

    [ObservableProperty]
    private string updateCheckFrequency = "Weekly";

    public SettingsViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    public void SaveSettings()
    {
        // TODO: Implementar persistência de configurações
    }

    [RelayCommand]
    public void ResetToDefaults()
    {
        AutoStartEnabled = false;
        MinimizeToTrayEnabled = true;
        RememberVolumeEnabled = true;
        UpdateCheckFrequency = "Weekly";
    }

    [RelayCommand]
    public void CheckForUpdates()
    {
        // TODO: Implementar verificação de atualizações
    }

    [RelayCommand]
    public void GoBack()
    {
        _navigationService.NavigateToMain();
    }
}
