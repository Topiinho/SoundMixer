using NAudio.CoreAudioApi;
using SoundMixer.Core.Contracts;
using SoundMixer.Core.Models;

namespace SoundMixer.Infrastructure.Providers;

public class NAudioApplicationProvider : IApplicationAudioProvider
{

    private static AudioSessionControl? FindSession(int processId)
    {
        try
        {
            var deviceEnumerator = new MMDeviceEnumerator();
            var device = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
            var sessionManager = device.AudioSessionManager;

            if (sessionManager == null) return null;

            for (int i = 0; i < sessionManager.Sessions.Count; i++)
            {
                var session = sessionManager.Sessions[i];
                uint sessionProcessId = session?.GetProcessID ?? 0;
                if (sessionProcessId == (uint)processId)
                    return session;
            }
        }
        catch
        {
            // Ignora erros
        }
        return null;
    }

    private static string GetProcessName(int processId)
    {
        try
        {
            var process = System.Diagnostics.Process.GetProcessById(processId);
            return process.ProcessName;
        }
        catch
        {
            return "Unknown";
        }
    }

    public async Task<List<AudioApplication>> GetActiveApplicationsAsync()
    {
        var apps = new List<AudioApplication>();

        try
        {
            var deviceEnumerator = new MMDeviceEnumerator();
            var device = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

            var sessionManager = device.AudioSessionManager;
            if (sessionManager == null)
                return await Task.FromResult(apps);

            for (int i = 0; i < sessionManager.Sessions.Count; i++)
            {
                try
                {
                    var session = sessionManager.Sessions[i];
                    if (session == null) continue;

                    uint processIdUint = session.GetProcessID;
                    int processId = (int)processIdUint;
                    if (processId == 0) continue;

                    var app = new AudioApplication
                    {
                        ProcessId = processId,
                        ProcessName = GetProcessName(processId),
                        Volume = session.SimpleAudioVolume.Volume,
                        IsMuted = session.SimpleAudioVolume.Mute
                    };

                    apps.Add(app);
                }
                catch
                {
                    continue;
                }
            }
        }
        catch
        {
            // Retorna lista vazia se algo der errado
        }

        return await Task.FromResult(apps);
    }

    public async Task SetApplicationVolumeAsync(int processId, float volume)
    {
        try
        {
            var session = FindSession(processId);
            if (session is not null)
            {
                session.SimpleAudioVolume.Volume = Math.Clamp(volume, 0f, 1f);
            }
        }
        catch
        {
            // Ignora erros
        }
        await Task.CompletedTask;
    }

    public async Task SetApplicationMutedAsync(int processId, bool muted)
    {
        try
        {
            var session = FindSession(processId);
            if (session is not null)
            {
                session.SimpleAudioVolume.Mute = muted;
            }
        }
        catch
        {
            // Ignora erros
        }
        await Task.CompletedTask;
    }
}