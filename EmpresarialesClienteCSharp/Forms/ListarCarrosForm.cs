using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class ListarCarrosForm : Form
    {
        private readonly CarroService _carroService;
        private DataGridView dgvCarros = null!;

        public ListarCarrosForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
            CargarCarros();
        }

        private void InitializeComponent()
        {
            this.Text = "Inventario de Vehículos - Concesionario App";
            this.Size = new Size(1100, 650);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.White;
            this.AutoScaleMode = AutoScaleMode.Dpi;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;

            var lblTitulo = new Label
            {
                Text = "Inventario de Vehículos",
                Font = new Font("Segoe UI", 22, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(30, 58, 138),
                Location = new Point(20, 20),
                AutoSize = true,
                UseCompatibleTextRendering = false
            };

            dgvCarros = new DataGridView
            {
                Location = new Point(20, 70),
                Size = new Size(1040, 480),
                ReadOnly = true,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
                BackgroundColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle,
                Font = new Font("Segoe UI", 10, FontStyle.Regular, GraphicsUnit.Point),
                RowTemplate = { Height = 30 }
            };
            dgvCarros.EnableHeadersVisualStyles = false;
            dgvCarros.ColumnHeadersDefaultCellStyle.BackColor = Color.FromArgb(30, 58, 138);
            dgvCarros.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
            dgvCarros.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 10, FontStyle.Bold, GraphicsUnit.Point);
            dgvCarros.ColumnHeadersHeight = 35;

            var btnRefrescar = new Button
            {
                Text = "Actualizar Datos",
                Size = new Size(160, 45),
                Location = new Point(20, 560),
                BackColor = Color.FromArgb(30, 64, 175),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnRefrescar.FlatAppearance.BorderSize = 0;
            btnRefrescar.Click += (s, e) => CargarCarros();

            this.Controls.AddRange(new Control[] { lblTitulo, dgvCarros, btnRefrescar });
        }

        private async void CargarCarros()
        {
            try
            {
                var carros = await _carroService.ObtenerTodosLosCarrosAsync();
                dgvCarros.DataSource = carros;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"❌ Error al cargar los vehículos\n\n{ex.Message}\n\nPor favor, verifique su conexión al servidor e intente nuevamente.", 
                    "Error de Operación", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
