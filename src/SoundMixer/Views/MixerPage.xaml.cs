using SoundMixer.ViewModels;

namespace SoundMixer.Views;

public partial class MixerPage : Page
{
    public MixerViewModel ViewModel { get; }

    public MixerPage()
    {
        this.InitializeComponent();

        // Inject MixerViewModel from DI container
        var app = Application.Current as App;
        ViewModel = app?.GetService<MixerViewModel>() ?? new MixerViewModel(null!, null!, null!);
        this.DataContext = ViewModel;
    }
}
