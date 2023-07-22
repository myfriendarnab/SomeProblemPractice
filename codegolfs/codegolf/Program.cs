namespace CodeGolf
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var p = new Program();
            Console.WriteLine("ENTER KEY TO RUN FOLLOWING CODEGOLF PROBLEM:");
            Console.WriteLine("1 --> 171679.spaceship-maw");
            var key = Console.ReadLine();
            switch(key){
                case "1":
                    p.RunSpaceMaw();
                    break;
                default:
                    break;   
            }
        }

        private void RunSpaceMaw()
        {
            var spaceMaw = new SpaceMaw();  
        } 
    }
}