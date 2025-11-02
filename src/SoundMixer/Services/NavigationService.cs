using Microsoft.UI.Xaml.Controls;
using SoundMixer.Views;

namespace SoundMixer.Services;

public interface INavigationService
{
    void NavigateToMixer();
    void NavigateToSettings();
    void NavigateToMain();
}

public class NavigationService : INavigationService
{
    private Frame? _frame;

    public void SetFrame(Frame frame)
    {
        _frame = frame;
    }

    public void NavigateToMixer()
    {
        _frame?.Navigate(typeof(MixerPage));
    }

    public void NavigateToSettings()
    {
        _frame?.Navigate(typeof(SettingsPage));
    }

    public void NavigateToMain()
    {
        _frame?.Navigate(typeof(MainPage));
    }
}
