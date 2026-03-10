// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

Random rnd = new Random();
List<int> liste = new List<int>();

for (int j = 0; j < 5; j++)
{
    liste.Add(rnd.Next(1, 10));
}

liste.Add(rnd.Next(1, 10) * 10);

Console.WriteLine("Liste: " + string.Join(", ", liste));

int hedef = rnd.Next(100, 1000);
List<int> currentListe = new List<int>(liste);

int i = 0;
while (i < 1)
{
    for (int aIdx = 0; aIdx < currentListe.Count; aIdx++)
    {
        int a = currentListe[aIdx];
        currentListe.RemoveAt(aIdx);

        for (int bIdx = 0; bIdx < currentListe.Count; bIdx++)
        {
            int b = currentListe[bIdx];
            currentListe.RemoveAt(bIdx);

            Console.WriteLine($"Seçilenler: {a}, {b}");
            Console.WriteLine("Kalan Liste: " + string.Join(", ", currentListe));
            break;
        }
        aIdx = 0;
    }
    i++;
}
