using NAudio.CoreAudioApi;
using SoundMixer.Core.Models;

namespace SoundMixer.Infrastructure.Adapters;

public class NAudioSessionAdapter
{
    private readonly AudioSessionControl _session;
    private readonly int _processId;

    public NAudioSessionAdapter(AudioSessionControl session)
    {
        _session = session ?? throw new ArgumentNullException(nameof(session));
        _processId = (int)session.GetProcessID;
    }

    public AudioApplication ToAudioApplication()
    {
        return new AudioApplication
        {
            ProcessId = _processId,
            ProcessName = GetProcessName(_processId),
            Volume = _session.SimpleAudioVolume.Volume,
            IsMuted = _session.SimpleAudioVolume.Mute
        };
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
}
