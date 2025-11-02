using SoundMixer.Core.Models;

namespace SoundMixer.Core.Contracts;

public interface IDeviceProvider
{
    Task<List<AudioDevice>> GetAudioDevicesAsync();
    Task SetDeviceVolumeAsync(string deviceId, float volume);
    Task SetDeviceMutedAsync(string deviceId, bool muted);
    Task SetDefaultDeviceAsync(string deviceId);
}
