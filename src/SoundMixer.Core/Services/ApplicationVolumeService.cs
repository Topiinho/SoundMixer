using SoundMixer.Core.Contracts;
using SoundMixer.Core.Models;

namespace SoundMixer.Core.Services;

public class ApplicationVolumeService : IApplicationVolumeService
{
    private readonly IApplicationAudioProvider _provider;

    public ApplicationVolumeService(IApplicationAudioProvider provider)
    {
        _provider = provider;
    }

    public async Task<List<AudioApplication>> GetActiveApplicationsAsync()
    {
        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        return await _provider.GetActiveApplicationsAsync();
    }

    public async Task SetApplicationVolumeAsync(int processId, float volume)
    {
        if (volume < 0f || volume > 1f)
            throw new ArgumentOutOfRangeException(nameof(volume), "Volume deve estar entre 0.0 e 1.0");

        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        await _provider.SetApplicationVolumeAsync(processId, volume);
    }

    public async Task SetApplicationMutedAsync(int processId, bool muted)
    {
        if (_provider == null)
            throw new InvalidOperationException("Provider não foi injetado corretamente.");

        await _provider.SetApplicationMutedAsync(processId, muted);
    }
}
