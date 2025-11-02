using NAudio.CoreAudioApi;
using SoundMixer.Core.Contracts;
using SoundMixer.Core.Models;

namespace SoundMixer.Infrastructure.Providers;

public class NAudioDeviceProvider : IDeviceProvider
{
    public async Task<List<AudioDevice>> GetAudioDevicesAsync()
    {
        var devices = new List<AudioDevice>();

        try
        {
            var deviceEnumerator = new MMDeviceEnumerator();
            var renderDevices = deviceEnumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.Active);
            var defaultDevice = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

            foreach (var device in renderDevices)
            {
                var audioDevice = new AudioDevice
                {
                    Id = device.ID,
                    Name = device.FriendlyName,
                    IsDefault = device.ID == defaultDevice.ID,
                    Volume = device.AudioEndpointVolume.MasterVolumeLevelScalar,
                    IsMuted = device.AudioEndpointVolume.Mute
                };

                devices.Add(audioDevice);
            }
        }
        catch
        {
            // Retorna lista vazia em caso de erro
        }

        return await Task.FromResult(devices);
    }

    public async Task SetDeviceVolumeAsync(string deviceId, float volume)
    {
        try
        {
            var device = GetDevice(deviceId);
            if (device != null)
            {
                device.AudioEndpointVolume.MasterVolumeLevelScalar = Math.Clamp(volume, 0f, 1f);
            }
        }
        catch
        {
            // Ignora erros
        }
        await Task.CompletedTask;
    }

    public async Task SetDeviceMutedAsync(string deviceId, bool muted)
    {
        try
        {
            var device = GetDevice(deviceId);
            if (device != null)
            {
                device.AudioEndpointVolume.Mute = muted;
            }
        }
        catch
        {
            // Ignora erros
        }
        await Task.CompletedTask;
    }

    public async Task SetDefaultDeviceAsync(string deviceId)
    {
        try
        {
            // Nota: Mudar dispositivo padrão no Windows requer privilégios elevados
            // Esta é uma implementação simplificada
            var device = GetDevice(deviceId);
            if (device is not null)
            {
                // Em produção, seria necessário usar APIs do Windows COM
                // Por enquanto, apenas confirmamos que o dispositivo existe
            }
        }
        catch
        {
            // Ignora erros
        }
        await Task.CompletedTask;
    }

    private static MMDevice? GetDevice(string deviceId)
    {
        try
        {
            var deviceEnumerator = new MMDeviceEnumerator();
            var renderDevices = deviceEnumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.Active);

            return renderDevices.FirstOrDefault(d => d.ID == deviceId);
        }
        catch
        {
            return null;
        }
    }
}
