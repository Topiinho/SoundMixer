using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using SoundMixer.Services;

namespace SoundMixer.ViewModels;

public partial class MainViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string appTitle = "SoundMixer - Controle de Volume por Aplicativo";

    [ObservableProperty]
    private string currentPage = "Main";

    public MainViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    public void NavigateToMixer()
    {
        CurrentPage = "Mixer";
        _navigationService.NavigateToMixer();
    }

    [RelayCommand]
    public void NavigateToSettings()
    {
        CurrentPage = "Settings";
        _navigationService.NavigateToSettings();
    }
}
