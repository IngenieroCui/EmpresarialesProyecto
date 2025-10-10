using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class ActualizarCarroForm : Form
    {
        private readonly CarroService _carroService;
        private TextBox txtPlacaBuscar = null!, txtMarca = null!, txtColor = null!, txtModelo = null!, txtAnio = null!, txtPuertas = null!, txtPrecio = null!;
        private ComboBox cmbCombustible = null!, cmbEstado = null!, cmbTransmision = null!;
        private CheckBox chkAireAcondicionado = null!;
        private Panel panelEdicion = null!;
        private Carro? carroActual;

        public ActualizarCarroForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Actualizar Carro";
            this.Size = new Size(700, 750);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.White;

            var panel = new Panel { Dock = DockStyle.Fill, Padding = new Padding(20), AutoScroll = true };

            var lblTitulo = new Label
            {
                Text = "Actualizar Registro de Vehículo",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.FromArgb(30, 58, 138),
                Location = new Point(20, 20),
                AutoSize = true
            };

            var lblBuscar = new Label
            {
                Text = "1. Buscar Carro por Placa:",
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Location = new Point(20, 70),
                AutoSize = true
            };

            txtPlacaBuscar = new TextBox
            {
                Location = new Point(20, 100),
                Size = new Size(Math.Max(300, panel.Width - 260), 30),
                Font = new Font("Segoe UI", 10),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };

            var btnBuscar = new Button
            {
                Text = "Buscar Vehículo",
                Size = new Size(200, 40),
                Location = new Point(Math.Max(340, panel.Width - 220), 100),
                BackColor = Color.FromArgb(30, 64, 175),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Cursor = Cursors.Hand,
                Anchor = AnchorStyles.Top | AnchorStyles.Right
            };
            btnBuscar.FlatAppearance.BorderSize = 0;
            btnBuscar.Click += BtnBuscar_Click;

            panelEdicion = new Panel
            {
                Location = new Point(20, 160),
                Size = new Size(panel.Width - 60, 510),
                Visible = false,
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.FromArgb(245, 245, 245),
                AutoScroll = true,
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };

            var lblEditar = new Label
            {
                Text = "2. Editar Información:",
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                Location = new Point(10, 10),
                AutoSize = true
            };
            panelEdicion.Controls.Add(lblEditar);

            int y = 50;
            txtMarca = CrearCampoTexto(panelEdicion, "Marca:", y); y += 60;
            txtModelo = CrearCampoTexto(panelEdicion, "Modelo:", y); y += 60;
            txtColor = CrearCampoTexto(panelEdicion, "Color:", y); y += 60;
            txtAnio = CrearCampoTexto(panelEdicion, "Año:", y); y += 60;
            txtPuertas = CrearCampoTexto(panelEdicion, "Número de Puertas:", y); y += 60;
            txtPrecio = CrearCampoTexto(panelEdicion, "Precio:", y); y += 60;

            cmbCombustible = CrearCombo(panelEdicion, "Combustible:", y, new[] { "GASOLINA", "DIESEL", "HIBRIDO", "ELECTRICO" }); y += 60;
            cmbEstado = CrearCombo(panelEdicion, "Estado:", y, new[] { "NUEVO", "USADO", "EXCELENTE", "BUENO", "REGULAR" }); y += 60;
            cmbTransmision = CrearCombo(panelEdicion, "Transmisión:", y, new[] { "MANUAL", "AUTOMATICA" }); y += 60;

            chkAireAcondicionado = new CheckBox
            {
                Text = "Tiene Aire Acondicionado",
                Location = new Point(10, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 10)
            };
            panelEdicion.Controls.Add(chkAireAcondicionado);
            y += 50;

            var btnActualizar = new Button
            {
                Text = "Guardar Cambios",
                Size = new Size(300, 50),
                Location = new Point(10, y),
                BackColor = Color.FromArgb(245, 158, 11),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnActualizar.FlatAppearance.BorderSize = 0;
            btnActualizar.Click += BtnActualizar_Click;
            panelEdicion.Controls.Add(btnActualizar);

            panel.Controls.AddRange(new Control[] { lblTitulo, lblBuscar, txtPlacaBuscar, btnBuscar, panelEdicion });
            this.Controls.Add(panel);
        }

        private TextBox CrearCampoTexto(Panel container, string etiqueta, int y)
        {
            var lbl = new Label
            {
                Text = etiqueta,
                Location = new Point(10, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 9),
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            var txt = new TextBox
            {
                Location = new Point(10, y + 20),
                Size = new Size(container.Width - 30, 25),
                Font = new Font("Segoe UI", 9),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            container.Controls.AddRange(new Control[] { lbl, txt });
            return txt;
        }

        private ComboBox CrearCombo(Panel container, string etiqueta, int y, string[] items)
        {
            var lbl = new Label
            {
                Text = etiqueta,
                Location = new Point(10, y),
                AutoSize = true,
                Font = new Font("Segoe UI", 9),
                Anchor = AnchorStyles.Top | AnchorStyles.Left
            };
            var cmb = new ComboBox
            {
                Location = new Point(10, y + 20),
                Size = new Size(container.Width - 30, 25),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 9),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            cmb.Items.AddRange(items);
            container.Controls.AddRange(new Control[] { lbl, cmb });
            return cmb;
        }

        private async void BtnBuscar_Click(object? sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(txtPlacaBuscar.Text))
                {
                    MessageBox.Show("Por favor, ingrese una placa.", "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                carroActual = await _carroService.BuscarPorPlacaAsync(txtPlacaBuscar.Text.ToUpper());

                if (carroActual != null)
                {
                    txtMarca.Text = carroActual.Marca;
                    txtModelo.Text = carroActual.Modelo;
                    txtColor.Text = carroActual.Color;
                    txtAnio.Text = carroActual.Anio.ToString();
                    txtPuertas.Text = carroActual.NumeroPuertas.ToString();
                    txtPrecio.Text = carroActual.Precio.ToString();
                    cmbCombustible.SelectedItem = carroActual.Combustible;
                    cmbEstado.SelectedItem = carroActual.Estado;
                    cmbTransmision.SelectedItem = carroActual.TipoTransmision;
                    chkAireAcondicionado.Checked = carroActual.TieneAireAcondicionado;
                    panelEdicion.Visible = true;
                }
                else
                {
                    MessageBox.Show("No se encontró ningún carro con esa placa.", "No encontrado", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al buscar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void BtnActualizar_Click(object? sender, EventArgs e)
        {
            try
            {
                if (carroActual == null) return;

                carroActual.Marca = txtMarca.Text.ToUpper();
                carroActual.Modelo = txtModelo.Text.ToUpper();
                carroActual.Color = txtColor.Text.ToUpper();
                carroActual.Anio = int.Parse(txtAnio.Text);
                carroActual.NumeroPuertas = int.Parse(txtPuertas.Text);
                carroActual.Precio = double.Parse(txtPrecio.Text);
                carroActual.Combustible = cmbCombustible.SelectedItem?.ToString() ?? "GASOLINA";
                carroActual.Estado = cmbEstado.SelectedItem?.ToString() ?? "NUEVO";
                carroActual.TipoTransmision = cmbTransmision.SelectedItem?.ToString() ?? "MANUAL";
                carroActual.TieneAireAcondicionado = chkAireAcondicionado.Checked;

                await _carroService.ActualizarCarroAsync(carroActual.Placa, carroActual);

                MessageBox.Show("Carro actualizado exitosamente!", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al actualizar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
