namespace SoundMixer.Core.Models;

public class RoutingRule
{
    public int Id { get; set; }
    public int ApplicationProcessId { get; set; }
    public string TargetDeviceId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
