namespace SoundMixer.Core.Models;

public class AudioApplication
{
    public int ProcessId { get; set; }
    public string ProcessName { get; set; }
    public float Volume { get; set; }
    public bool IsMuted { get; set; }
    public string IconPath { get; set; }
}