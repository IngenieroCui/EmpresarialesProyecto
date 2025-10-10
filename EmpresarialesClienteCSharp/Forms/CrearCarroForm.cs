using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class CrearCarroForm : Form
    {
        private readonly CarroService _carroService;
        private TextBox txtMarca = null!, txtColor = null!, txtPlaca = null!, txtModelo = null!, txtAnio = null!, txtPuertas = null!, txtPrecio = null!;
        private ComboBox cmbCombustible = null!, cmbEstado = null!, cmbTransmision = null!;
        private CheckBox chkAireAcondicionado = null!;

        public CrearCarroForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Registrar Vehículo - Concesionario App";
            this.Size = new Size(650, 750);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.White;
            this.AutoScaleMode = AutoScaleMode.Dpi;

            // Panel principal
            var panel = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(20),
                AutoScroll = true
            };

            // Título
            var lblTitulo = new Label
            {
                Text = "Registrar Nuevo Vehículo",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.FromArgb(30, 58, 138),
                AutoSize = true,
                Location = new Point(20, 20)
            };

            int y = 70;

            // Crear campos del formulario
            txtPlaca = CrearCampoTexto(panel, "Placa (ABC-123):", y); y += 60;
            txtMarca = CrearCampoTexto(panel, "Marca:", y); y += 60;
            txtModelo = CrearCampoTexto(panel, "Modelo:", y); y += 60;
            txtColor = CrearCampoTexto(panel, "Color:", y); y += 60;
            txtAnio = CrearCampoTexto(panel, "Año:", y); y += 60;
            txtPuertas = CrearCampoTexto(panel, "Número de Puertas (2-5):", y); y += 60;
            txtPrecio = CrearCampoTexto(panel, "Precio:", y); y += 60;

            // Combustible
            var lblCombustible = new Label
            {
                Text = "Combustible:",
                Location = new Point(20, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            cmbCombustible = new ComboBox
            {
                Location = new Point(20, y + 25),
                Size = new Size(panel.Width - 60, 30),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            cmbCombustible.Items.AddRange(new[] { "GASOLINA", "DIESEL", "HIBRIDO", "ELECTRICO" });
            cmbCombustible.SelectedIndex = 0;
            panel.Controls.AddRange(new Control[] { lblCombustible, cmbCombustible });
            y += 60;

            // Estado
            var lblEstado = new Label
            {
                Text = "Estado:",
                Location = new Point(20, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            cmbEstado = new ComboBox
            {
                Location = new Point(20, y + 25),
                Size = new Size(panel.Width - 60, 30),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            cmbEstado.Items.AddRange(new[] { "NUEVO", "USADO", "EXCELENTE", "BUENO", "REGULAR" });
            cmbEstado.SelectedIndex = 0;
            panel.Controls.AddRange(new Control[] { lblEstado, cmbEstado });
            y += 60;

            // Transmisión
            var lblTransmision = new Label
            {
                Text = "Transmisión:",
                Location = new Point(20, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            cmbTransmision = new ComboBox
            {
                Location = new Point(20, y + 25),
                Size = new Size(panel.Width - 60, 30),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            cmbTransmision.Items.AddRange(new[] { "MANUAL", "AUTOMATICA" });
            cmbTransmision.SelectedIndex = 0;
            panel.Controls.AddRange(new Control[] { lblTransmision, cmbTransmision });
            y += 60;

            // Aire Acondicionado
            chkAireAcondicionado = new CheckBox
            {
                Text = "Tiene Aire Acondicionado",
                Location = new Point(20, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10),
                Checked = false
            };
            panel.Controls.Add(chkAireAcondicionado);
            y += 50;

            // Botones
            var btnGuardar = new Button
            {
                Text = "Guardar Vehículo",
                Size = new Size(260, 50),
                Location = new Point(20, y),
                BackColor = Color.FromArgb(5, 150, 105),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnGuardar.FlatAppearance.BorderSize = 0;
            btnGuardar.Click += BtnGuardar_Click;

            var btnCancelar = new Button
            {
                Text = "Cancelar",
                Size = new Size(260, 50),
                Location = new Point(300, y),
                BackColor = Color.FromArgb(220, 38, 38),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnCancelar.FlatAppearance.BorderSize = 0;
            btnCancelar.Click += (s, e) => this.Close();

            panel.Controls.AddRange(new Control[] { lblTitulo, btnGuardar, btnCancelar });
            this.Controls.Add(panel);
        }

        private TextBox CrearCampoTexto(Panel panel, string etiqueta, int y)
        {
            var lbl = new Label
            {
                Text = etiqueta,
                Location = new Point(20, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10, FontStyle.Regular, GraphicsUnit.Point),
                UseCompatibleTextRendering = false,
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            var txt = new TextBox
            {
                Location = new Point(20, y + 25),
                Size = new Size(panel.Width - 60, 30),
                Font = new Font("Segoe UI", 11, FontStyle.Regular, GraphicsUnit.Point),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            panel.Controls.AddRange(new Control[] { lbl, txt });
            return txt;
        }

        private async void BtnGuardar_Click(object? sender, EventArgs e)
        {
            try
            {
                // Validaciones
                if (string.IsNullOrWhiteSpace(txtPlaca.Text) ||
                    string.IsNullOrWhiteSpace(txtMarca.Text) ||
                    string.IsNullOrWhiteSpace(txtModelo.Text))
                {
                    MessageBox.Show("Por favor, complete todos los campos obligatorios.", "Error de Validación",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                if (!int.TryParse(txtAnio.Text, out int anio) || anio < 1950 || anio > 2025)
                {
                    MessageBox.Show("El año debe ser un número entre 1950 y 2025.", "Error de Validación",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                if (!int.TryParse(txtPuertas.Text, out int puertas) || puertas < 2 || puertas > 5)
                {
                    MessageBox.Show("El número de puertas debe estar entre 2 y 5.", "Error de Validación",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                if (!double.TryParse(txtPrecio.Text, out double precio) || precio <= 0)
                {
                    MessageBox.Show("El precio debe ser un número mayor que 0.", "Error de Validación",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                // Crear objeto Carro
                var carro = new Carro
                {
                    Placa = txtPlaca.Text.ToUpper(),
                    Marca = txtMarca.Text.ToUpper(),
                    Modelo = txtModelo.Text.ToUpper(),
                    Color = txtColor.Text.ToUpper(),
                    Anio = anio,
                    NumeroPuertas = puertas,
                    Precio = precio,
                    Combustible = cmbCombustible.SelectedItem?.ToString() ?? "GASOLINA",
                    Estado = cmbEstado.SelectedItem?.ToString() ?? "NUEVO",
                    TipoTransmision = cmbTransmision.SelectedItem?.ToString() ?? "MANUAL",
                    TieneAireAcondicionado = chkAireAcondicionado.Checked
                };

                // Guardar en el servicio
                await _carroService.CrearCarroAsync(carro);

                MessageBox.Show("Carro creado exitosamente!", "Éxito",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);

                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al crear el carro: {ex.Message}", "Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
