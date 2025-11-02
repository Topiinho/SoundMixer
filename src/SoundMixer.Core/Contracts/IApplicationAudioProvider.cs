using SoundMixer.Core.Models;

namespace SoundMixer.Core.Contracts;

public interface IApplicationAudioProvider
{
    Task <List<AudioApplication>> GetActiveApplicationsAsync();
    Task SetApplicationVolumeAsync(int processId, float volume);
    Task SetApplicationMutedAsync(int processId, bool muted);
}