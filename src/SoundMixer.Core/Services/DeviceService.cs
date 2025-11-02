using SoundMixer.Core.Contracts;
using SoundMixer.Core.Models;

namespace SoundMixer.Core.Services;

public class DeviceService : IDeviceService
{
    private readonly IDeviceProvider _provider;

    public DeviceService(IDeviceProvider provider)
    {
        _provider = provider;
    }

    public async Task<List<AudioDevice>> GetAudioDevicesAsync()
    {
        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        return await _provider.GetAudioDevicesAsync();
    }

    public async Task SetDeviceVolumeAsync(string deviceId, float volume)
    {
        if (string.IsNullOrWhiteSpace(deviceId))
            throw new ArgumentException("Device ID não pode ser vazio.", nameof(deviceId));

        if (volume < 0f || volume > 1f)
            throw new ArgumentOutOfRangeException(nameof(volume), "Volume deve estar entre 0.0 e 1.0");

        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        await _provider.SetDeviceVolumeAsync(deviceId, volume);
    }

    public async Task SetDeviceMutedAsync(string deviceId, bool muted)
    {
        if (string.IsNullOrWhiteSpace(deviceId))
            throw new ArgumentException("Device ID não pode ser vazio.", nameof(deviceId));

        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        await _provider.SetDeviceMutedAsync(deviceId, muted);
    }

    public async Task SetDefaultDeviceAsync(string deviceId)
    {
        if (string.IsNullOrWhiteSpace(deviceId))
            throw new ArgumentException("Device ID não pode ser vazio.", nameof(deviceId));

        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        await _provider.SetDefaultDeviceAsync(deviceId);
    }
}
