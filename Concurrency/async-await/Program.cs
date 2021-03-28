using System;
using System.Threading.Tasks;
namespace async_await
{
    /*
    Console Output:
        Starting something aSync
        Inside synchronous block
        *
        **
        ***
        ****
        *****
        Starting part-2 of aSync
        Hello World!
    */
    class Program
    {
        static void Main(string[] args)
        {
            var p = new Program();
            var t = p.DoSomeAsyncStuff();
            p.DoSomething();
            t.Wait();
            Console.WriteLine("Hello World!");
        }

        internal async Task DoSomeAsyncStuff(){
            System.Console.WriteLine("Starting something aSync");
            int val = 2;
            await Task.Delay(TimeSpan.FromSeconds(val));

            System.Console.WriteLine("Starting part-2 of aSync");
            val*=2;
            await Task.Delay(TimeSpan.FromSeconds(val));
        }
        internal void DoSomething()
        {
            System.Console.WriteLine("Inside synchronous block");
            int val=5;
            for (int i = val; i >= 1; i--)
            {
                    for (var j = i; j <= 5; j++)
                    {
                        Console.Write("*");
                    }
                    Console.WriteLine();
            }
        }
    }
}
