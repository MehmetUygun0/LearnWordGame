namespace Backend.Utility
{
    public class ResetCodeCleanerTask : BackgroundService
    {
        private readonly ResetCodeStore _store;

        public ResetCodeCleanerTask(ResetCodeStore store)
        {
            _store = store;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
                catch (OperationCanceledException) // TaskCanceledException bu sınıftan türetilir
                {
                    // Servis dururken bekleme iptal edildi — düzgün çıkış
                    break;
                }

                lock (_store.Codes)
                {
                    _store.Codes.RemoveAll(x => x.ResetCodeExpiry < DateTime.UtcNow);
                }
            }
        }
    }
}
