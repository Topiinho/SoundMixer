using SoundMixer.ViewModels;

namespace SoundMixer.Views
{
    /// <summary>
    /// Main application page with navigation
    /// </summary>
    public partial class MainPage : Page
    {
        public MainViewModel ViewModel { get; }

        public MainPage()
        {
            this.InitializeComponent();

            // Inject MainViewModel from DI container
            var app = Application.Current as App;
            ViewModel = app?.GetService<MainViewModel>() ?? new MainViewModel(null!);
            this.DataContext = ViewModel;
        }
    }
}
