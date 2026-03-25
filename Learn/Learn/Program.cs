// See https://aka.ms/new-console-template for more information
using System.Diagnostics;

int Faktroriyal(int n)
{
    if (n == 0)
        return 1;

    return Faktroriyal(n - 1) * n;
}
int Topla(int n)
{
    if (n == 3)
        return 6;
    return Topla(n - 1) + n;
}
int Power(int a, int b)
{
    if (b == 1)
        return a;

    return Power(a, b - 1) * a;
}
Power(2,500);
Console.ReadLine();
