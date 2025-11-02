using SoundMixer.ViewModels;

namespace SoundMixer.Views;

public partial class SettingsPage : Page
{
    public SettingsViewModel ViewModel { get; }

    public SettingsPage()
    {
        this.InitializeComponent();

        // Inject SettingsViewModel from DI container
        var app = Application.Current as App;
        ViewModel = app?.GetService<SettingsViewModel>() ?? new SettingsViewModel(null!);
        this.DataContext = ViewModel;
    }
}
