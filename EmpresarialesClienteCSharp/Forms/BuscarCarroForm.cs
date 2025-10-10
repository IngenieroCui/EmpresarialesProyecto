using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class BuscarCarroForm : Form
    {
        private readonly CarroService _carroService;
        private TextBox txtPlaca = null!;
        private DataGridView dgvResultados = null!;

        public BuscarCarroForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Buscar Carro";
            this.Size = new Size(900, 600);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.White;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;

            var lblTitulo = new Label
            {
                Text = "🔍 Buscar Carro por Placa",
                Font = new Font("Segoe UI", 16, FontStyle.Bold),
                Location = new Point(20, 20),
                AutoSize = true
            };

            var lblPlaca = new Label
            {
                Text = "Placa:",
                Location = new Point(20, 70),
                AutoSize = true,
                Font = new Font("Segoe UI", 10)
            };

            txtPlaca = new TextBox
            {
                Location = new Point(20, 95),
                Size = new Size(300, 30),
                Font = new Font("Segoe UI", 10)
            };

            var btnBuscar = new Button
            {
                Text = "🔍 Buscar",
                Size = new Size(150, 35),
                Location = new Point(340, 95),
                BackColor = Color.FromArgb(124, 58, 237),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold)
            };
            btnBuscar.Click += BtnBuscar_Click;

            dgvResultados = new DataGridView
            {
                Location = new Point(20, 150),
                Size = new Size(840, 400),
                ReadOnly = true,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
                BackgroundColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle
            };

            this.Controls.AddRange(new Control[] { lblTitulo, lblPlaca, txtPlaca, btnBuscar, dgvResultados });
        }

        private async void BtnBuscar_Click(object? sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(txtPlaca.Text))
                {
                    MessageBox.Show("Por favor, ingrese una placa.", "Validación",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                var carro = await _carroService.BuscarPorPlacaAsync(txtPlaca.Text.ToUpper());

                if (carro != null)
                {
                    dgvResultados.DataSource = new[] { carro };
                }
                else
                {
                    MessageBox.Show("No se encontró ningún carro con esa placa.", "No encontrado",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    dgvResultados.DataSource = null;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al buscar: {ex.Message}", "Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
