using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using SoundMixer.Core.Contracts;
using SoundMixer.Core.Models;
using SoundMixer.Services;

namespace SoundMixer.ViewModels;

public partial class MixerViewModel : ObservableObject
{
    private readonly IApplicationVolumeService _applicationVolumeService;
    private readonly IDeviceService _deviceService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private ObservableCollection<AudioApplication> activeApplications = new();

    [ObservableProperty]
    private ObservableCollection<AudioDevice> audioDevices = new();

    [ObservableProperty]
    private bool isLoading = false;

    [ObservableProperty]
    private string statusMessage = "Pronto";

    public MixerViewModel(IApplicationVolumeService applicationVolumeService, IDeviceService deviceService, INavigationService navigationService)
    {
        _applicationVolumeService = applicationVolumeService;
        _deviceService = deviceService;
        _navigationService = navigationService;
    }

    [RelayCommand]
    public async Task LoadApplications()
    {
        try
        {
            IsLoading = true;
            StatusMessage = "Carregando aplicativos...";

            var apps = await _applicationVolumeService.GetActiveApplicationsAsync();

            ActiveApplications.Clear();
            foreach (var app in apps)
            {
                ActiveApplications.Add(app);
            }

            StatusMessage = $"{apps.Count} aplicativos encontrados";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao carregar aplicativos: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task LoadDevices()
    {
        try
        {
            IsLoading = true;
            StatusMessage = "Carregando dispositivos...";

            var devices = await _deviceService.GetAudioDevicesAsync();

            AudioDevices.Clear();
            foreach (var device in devices)
            {
                AudioDevices.Add(device);
            }

            StatusMessage = $"{devices.Count} dispositivos encontrados";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao carregar dispositivos: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    public async Task SetApplicationVolumeAsync(int processId, float volume)
    {
        try
        {
            await _applicationVolumeService.SetApplicationVolumeAsync(processId, volume);
            StatusMessage = $"Volume alterado para {(volume * 100):F0}%";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao alterar volume: {ex.Message}";
        }
    }

    public async Task ToggleApplicationMuteAsync(int processId, bool currentMuteState)
    {
        try
        {
            bool newMuteState = !currentMuteState;
            await _applicationVolumeService.SetApplicationMutedAsync(processId, newMuteState);
            StatusMessage = newMuteState ? "Silenciado" : "Ativado";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao alternar mute: {ex.Message}";
        }
    }

    public async Task SetDeviceVolumeAsync(string deviceId, float volume)
    {
        try
        {
            await _deviceService.SetDeviceVolumeAsync(deviceId, volume);
            StatusMessage = $"Volume do dispositivo alterado para {(volume * 100):F0}%";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao alterar volume do dispositivo: {ex.Message}";
        }
    }

    public async Task ToggleDeviceMuteAsync(string deviceId, bool currentMuteState)
    {
        try
        {
            bool newMuteState = !currentMuteState;
            await _deviceService.SetDeviceMutedAsync(deviceId, newMuteState);
            StatusMessage = newMuteState ? "Dispositivo silenciado" : "Dispositivo ativado";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Erro ao alternar mute do dispositivo: {ex.Message}";
        }
    }

    [RelayCommand]
    public void GoBack()
    {
        _navigationService.NavigateToMain();
    }
}
