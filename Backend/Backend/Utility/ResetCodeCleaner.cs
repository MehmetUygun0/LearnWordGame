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
                // 1 dakika bekle
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

                // Süresi dolanları temizle
                
                lock (_store.Codes) // Liste üzerinde işlem yaparken kilitleyelim
                {
                    _store.Codes.RemoveAll(x => x.ResetCodeExpiry < DateTime.UtcNow);
                }
                //Console.WriteLine("Temizlikçi: Süresi dolan kodlar havadan silindi.");
            }
        }
    }
}
