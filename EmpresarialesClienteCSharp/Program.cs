using System;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Forms;

namespace EmpresarialesClienteCSharp
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            // Habilitar renderizado de alta calidad y DPI awareness
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.SetHighDpiMode(HighDpiMode.SystemAware);

            Application.Run(new MainForm());
        }
    }
}
