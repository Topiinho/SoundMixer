using Microsoft.Extensions.DependencyInjection;
using Microsoft.UI.Xaml.Navigation;
using SoundMixer.Core.Contracts;
using SoundMixer.Core.Services;
using SoundMixer.Infrastructure.Providers;
using SoundMixer.Services;
using SoundMixer.ViewModels;

namespace SoundMixer
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {
        private Window window = Window.Current;
        private Frame? rootFrame;
        private ServiceProvider? serviceProvider;

        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
            this.InitializeComponent();
            SetupServices();
        }

        /// <summary>
        /// Configures Dependency Injection container
        /// </summary>
        private void SetupServices()
        {
            var services = new ServiceCollection();

            // Register UI Services
            services.AddSingleton<INavigationService, NavigationService>();

            // Register Infrastructure Providers
            services.AddSingleton<IApplicationAudioProvider, NAudioApplicationProvider>();
            services.AddSingleton<IDeviceProvider, NAudioDeviceProvider>();

            // Register Core Services
            services.AddSingleton<IApplicationVolumeService>(sp =>
                new ApplicationVolumeService(sp.GetRequiredService<IApplicationAudioProvider>())
            );

            services.AddSingleton<IDeviceService>(sp =>
                new DeviceService(sp.GetRequiredService<IDeviceProvider>())
            );

            // Register ViewModels
            services.AddSingleton<MixerViewModel>(sp =>
                new MixerViewModel(
                    sp.GetRequiredService<IApplicationVolumeService>(),
                    sp.GetRequiredService<IDeviceService>(),
                    sp.GetRequiredService<INavigationService>()
                )
            );

            services.AddSingleton<MainViewModel>(sp =>
                new MainViewModel(sp.GetRequiredService<INavigationService>())
            );

            services.AddSingleton<SettingsViewModel>(sp =>
                new SettingsViewModel(sp.GetRequiredService<INavigationService>())
            );

            serviceProvider = services.BuildServiceProvider();
        }

        /// <summary>
        /// Gets a service instance from the DI container
        /// </summary>
        public T GetService<T>() where T : class
        {
            return serviceProvider?.GetRequiredService<T>() ?? throw new InvalidOperationException($"Service {typeof(T).Name} not found");
        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used such as when the application is launched to open a specific file.
        /// </summary>
        /// <param name="e">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            window ??= new Window();

            if (window.Content is not Frame)
            {
                rootFrame = new Frame();
                rootFrame.NavigationFailed += OnNavigationFailed;
                window.Content = rootFrame;

                // Set the Frame for NavigationService
                var navigationService = GetService<INavigationService>();
                if (navigationService is NavigationService navService)
                {
                    navService.SetFrame(rootFrame);
                }
            }
            else
            {
                rootFrame = window.Content as Frame;
            }

            rootFrame?.Navigate(typeof(MainPage), e.Arguments);
            window.Activate();
        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception("Failed to load Page " + e.SourcePageType.FullName);
        }
    }
}
