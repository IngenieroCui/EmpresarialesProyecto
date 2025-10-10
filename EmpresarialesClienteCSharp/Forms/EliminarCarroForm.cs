using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class EliminarCarroForm : Form
    {
        private readonly CarroService _carroService;
        private TextBox txtPlaca = null!;
        private Label lblInfo = null!;

        public EliminarCarroForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Eliminar Carro";
            this.Size = new Size(600, 400);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.White;

            var lblTitulo = new Label
            {
                Text = "Eliminar Vehículo del Inventario",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.FromArgb(220, 38, 38),
                Location = new Point(20, 20),
                AutoSize = true
            };

            var lblPlaca = new Label
            {
                Text = "1. Buscar Carro por Placa:",
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Location = new Point(20, 70),
                AutoSize = true
            };

            txtPlaca = new TextBox
            {
                Location = new Point(20, 100),
                Size = new Size(300, 30),
                Font = new Font("Segoe UI", 10)
            };

            var btnBuscar = new Button
            {
                Text = "Buscar Vehículo",
                Size = new Size(220, 40),
                Location = new Point(340, 100),
                BackColor = Color.FromArgb(30, 64, 175),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnBuscar.FlatAppearance.BorderSize = 0;
            btnBuscar.Click += BtnBuscar_Click;

            lblInfo = new Label
            {
                Text = "",
                Location = new Point(20, 160),
                Size = new Size(540, 120),
                Font = new Font("Segoe UI", 10),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.FromArgb(245, 245, 245),
                Padding = new Padding(10)
            };

            var btnEliminar = new Button
            {
                Text = "Eliminar Vehículo",
                Size = new Size(260, 50),
                Location = new Point(20, 300),
                BackColor = Color.FromArgb(220, 38, 38),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Enabled = false,
                Cursor = Cursors.Hand
            };
            btnEliminar.FlatAppearance.BorderSize = 0;
            btnEliminar.Click += BtnEliminar_Click;

            var btnCancelar = new Button
            {
                Text = "Cancelar",
                Size = new Size(260, 50),
                Location = new Point(300, 300),
                BackColor = Color.FromArgb(107, 114, 128),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnCancelar.FlatAppearance.BorderSize = 0;
            btnCancelar.Click += (s, e) => this.Close();

            this.Controls.AddRange(new Control[] { lblTitulo, lblPlaca, txtPlaca, btnBuscar, lblInfo, btnEliminar, btnCancelar });
        }

        private async void BtnBuscar_Click(object? sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(txtPlaca.Text))
                {
                    MessageBox.Show("Por favor, ingrese una placa.", "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                var carro = await _carroService.BuscarPorPlacaAsync(txtPlaca.Text.ToUpper());

                if (carro != null)
                {
                    lblInfo.Text = $"Marca: {carro.Marca}\n" +
                                   $"Modelo: {carro.Modelo}\n" +
                                   $"Color: {carro.Color}\n" +
                                   $"Año: {carro.Anio}\n" +
                                   $"Precio: ${carro.Precio:N2}";

                    ((Button)this.Controls[5]).Enabled = true;
                }
                else
                {
                    MessageBox.Show("No se encontró ningún carro con esa placa.", "No encontrado", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    lblInfo.Text = "";
                    ((Button)this.Controls[5]).Enabled = false;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al buscar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void BtnEliminar_Click(object? sender, EventArgs e)
        {
            try
            {
                var result = MessageBox.Show(
                    "¿Está seguro que desea eliminar este carro?\n\nEsta acción no se puede deshacer.",
                    "Confirmar Eliminación",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning
                );

                if (result == DialogResult.Yes)
                {
                    await _carroService.EliminarCarroAsync(txtPlaca.Text.ToUpper());
                    MessageBox.Show("Carro eliminado exitosamente!", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al eliminar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
