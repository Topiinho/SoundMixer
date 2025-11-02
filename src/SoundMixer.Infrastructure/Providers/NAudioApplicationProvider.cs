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
            {
                System.Diagnostics.Debug.WriteLine("SessionManager is null");
                return await Task.FromResult(apps);
            }

            System.Diagnostics.Debug.WriteLine($"Found {sessionManager.Sessions.Count} audio sessions");

            for (int i = 0; i < sessionManager.Sessions.Count; i++)
            {
                try
                {
                    var session = sessionManager.Sessions[i];
                    if (session == null) continue;

                    uint processIdUint = session.GetProcessID;
                    int processId = (int)processIdUint;

                    System.Diagnostics.Debug.WriteLine($"Session {i}: ProcessID={processId}");

                    if (processId == 0) continue;

                    var processName = GetProcessName(processId);
                    var volume = session.SimpleAudioVolume.Volume;
                    var isMuted = session.SimpleAudioVolume.Mute;

                    var app = new AudioApplication
                    {
                        ProcessId = processId,
                        ProcessName = processName,
                        Volume = volume,
                        IsMuted = isMuted
                    };

                    System.Diagnostics.Debug.WriteLine($"Added app: {processName} (PID: {processId}, Volume: {volume}, Muted: {isMuted})");
                    apps.Add(app);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error processing session {i}: {ex.Message}");
                    continue;
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error in GetActiveApplicationsAsync: {ex.Message}");
        }

        System.Diagnostics.Debug.WriteLine($"Returning {apps.Count} applications");
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