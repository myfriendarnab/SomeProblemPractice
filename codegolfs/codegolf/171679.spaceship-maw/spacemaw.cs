namespace CodeGolf
{
    using  System.Linq;
    public class SpaceMaw
    {
        private string _input;
        public SpaceMaw()
        {
            Console.WriteLine("Enter any 10 character string like '0123456789' without any spaces");
            string input = Console.ReadLine();
            if (string.IsNullOrEmpty(input) || input.Length != 10)    
            {
                System.Console.WriteLine("NOT A VALID INPUT considering '0123456789' as DEFAULT");
                input = "0123456789";
            }
            _input = input;
        }
        public void DisplayOutput(){
            Console.WriteLine($"INPUT: {_input}");
            char _SPACE = ' ';
            var display = new List<string>();
            for (int i = 0;i<_input.Length;i++)
            {   
                char[] charray = Enumerable.Repeat(_SPACE,i+1).ToArray();

                var output = 
                        _input
                        .ToCharArray()
                        .Select(x =>
                            {
                                charray[0] = x;
                                return new string(new ReadOnlySpan<char>(charray));
                            });
                
                display.Add(string.Join("", output));
            }
            display.Concat(display.SkipLast(1).ToArray().Reverse()).ToList().ForEach(Console.WriteLine);
        }
    }
}