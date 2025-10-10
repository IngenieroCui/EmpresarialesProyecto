using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class CrearMantenimientoForm : Form
    {
        private readonly MantenimientoService _mantenimientoService;
        private TextBox txtPlacaCarro;
        private DateTimePicker dtpFechaMantenimiento;
        private NumericUpDown nudKilometraje;
        private ComboBox cboTipoMantenimiento;
        private NumericUpDown nudCosto;
        private TextBox txtDescripcion;
        private DateTimePicker dtpProximoMantenimiento;
        private CheckBox chkProximoMantenimiento;
        private CheckBox chkCompletado;
        private Button btnGuardar;
        private Button btnCancelar;

        public CrearMantenimientoForm()
        {
            _mantenimientoService = new MantenimientoService();
            InitializeComponent();
            ConfigurarFormulario();
        }

        private void InitializeComponent()
        {
            this.Text = "Crear Nuevo Mantenimiento";
            this.Size = new Size(600, 650);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
        }

        private void ConfigurarFormulario()
        {
            int yPos = 20;
            int labelX = 20;
            int controlX = 180;
            int controlWidth = 360;

            // Título
            var lblTitulo = new Label
            {
                Text = "CREAR NUEVO MANTENIMIENTO",
                Font = new Font("Arial", 14, FontStyle.Bold),
                Location = new Point(20, yPos),
                AutoSize = true
            };
            this.Controls.Add(lblTitulo);
            yPos += 40;

            // Placa del Carro
            var lblPlaca = new Label
            {
                Text = "Placa del Carro: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblPlaca);

            txtPlacaCarro = new TextBox
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                MaxLength = 7,
                CharacterCasing = CharacterCasing.Upper
            };
            txtPlacaCarro.Leave += ValidarPlaca;
            this.Controls.Add(txtPlacaCarro);
            yPos += 35;

            // Fecha de Mantenimiento
            var lblFecha = new Label
            {
                Text = "Fecha Mantenimiento: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblFecha);

            dtpFechaMantenimiento = new DateTimePicker
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Format = DateTimePickerFormat.Custom,
                CustomFormat = "dd/MM/yyyy HH:mm",
                ShowUpDown = false
            };
            this.Controls.Add(dtpFechaMantenimiento);
            yPos += 35;

            // Kilometraje
            var lblKilometraje = new Label
            {
                Text = "Kilometraje (km): *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblKilometraje);

            nudKilometraje = new NumericUpDown
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Minimum = 0,
                Maximum = 1000000,
                ThousandsSeparator = true
            };
            this.Controls.Add(nudKilometraje);
            yPos += 35;

            // Tipo de Mantenimiento
            var lblTipo = new Label
            {
                Text = "Tipo Mantenimiento: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblTipo);

            cboTipoMantenimiento = new ComboBox
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            cboTipoMantenimiento.Items.AddRange(new object[]
            {
                "PREVENTIVO",
                "CORRECTIVO",
                "REVISION",
                "CAMBIO_ACEITE",
                "CAMBIO_LLANTAS",
                "OTROS"
            });
            cboTipoMantenimiento.SelectedIndex = 0;
            this.Controls.Add(cboTipoMantenimiento);
            yPos += 35;

            // Costo
            var lblCosto = new Label
            {
                Text = "Costo: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblCosto);

            nudCosto = new NumericUpDown
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Minimum = 0,
                Maximum = 100000000,
                DecimalPlaces = 0,
                ThousandsSeparator = true
            };
            this.Controls.Add(nudCosto);
            yPos += 35;

            // Descripción
            var lblDescripcion = new Label
            {
                Text = "Descripción: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            this.Controls.Add(lblDescripcion);

            txtDescripcion = new TextBox
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Height = 80,
                Multiline = true,
                MaxLength = 500,
                ScrollBars = ScrollBars.Vertical
            };
            this.Controls.Add(txtDescripcion);
            yPos += 90;

            // Próximo Mantenimiento (Checkbox)
            chkProximoMantenimiento = new CheckBox
            {
                Text = "Programar próximo mantenimiento",
                Location = new Point(labelX, yPos),
                Width = 250
            };
            chkProximoMantenimiento.CheckedChanged += ChkProximoMantenimiento_CheckedChanged;
            this.Controls.Add(chkProximoMantenimiento);
            yPos += 30;

            // Fecha Próximo Mantenimiento
            dtpProximoMantenimiento = new DateTimePicker
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Format = DateTimePickerFormat.Custom,
                CustomFormat = "dd/MM/yyyy",
                Enabled = false
            };
            this.Controls.Add(dtpProximoMantenimiento);
            yPos += 35;

            // Completado
            chkCompletado = new CheckBox
            {
                Text = "Mantenimiento completado",
                Location = new Point(labelX, yPos),
                Width = 250
            };
            this.Controls.Add(chkCompletado);
            yPos += 40;

            // Nota
            var lblNota = new Label
            {
                Text = "* Campos obligatorios",
                Location = new Point(labelX, yPos),
                Width = 200,
                ForeColor = Color.Red,
                Font = new Font("Arial", 8, FontStyle.Italic)
            };
            this.Controls.Add(lblNota);
            yPos += 30;

            // Botones
            btnGuardar = new Button
            {
                Text = "Guardar",
                Location = new Point(controlX, yPos),
                Width = 120,
                Height = 35
            };
            btnGuardar.Click += BtnGuardar_Click;
            this.Controls.Add(btnGuardar);

            btnCancelar = new Button
            {
                Text = "Cancelar",
                Location = new Point(controlX + 140, yPos),
                Width = 120,
                Height = 35
            };
            btnCancelar.Click += (s, e) => this.Close();
            this.Controls.Add(btnCancelar);
        }

        private void ChkProximoMantenimiento_CheckedChanged(object? sender, EventArgs e)
        {
            dtpProximoMantenimiento.Enabled = chkProximoMantenimiento.Checked;
        }

        private void ValidarPlaca(object? sender, EventArgs e)
        {
            string placa = txtPlacaCarro.Text.Trim();
            if (!string.IsNullOrEmpty(placa) && !System.Text.RegularExpressions.Regex.IsMatch(placa, @"^[A-Z]{3}-[0-9]{3}$"))
            {
                MessageBox.Show("La placa debe tener el formato ABC-123",
                    "Formato Incorrecto", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtPlacaCarro.Focus();
            }
        }

        private async void BtnGuardar_Click(object? sender, EventArgs e)
        {
            // Validaciones
            if (string.IsNullOrWhiteSpace(txtPlacaCarro.Text))
            {
                MessageBox.Show("La placa del carro es obligatoria", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtPlacaCarro.Focus();
                return;
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(txtPlacaCarro.Text.Trim(), @"^[A-Z]{3}-[0-9]{3}$"))
            {
                MessageBox.Show("La placa debe tener el formato ABC-123", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtPlacaCarro.Focus();
                return;
            }

            if (string.IsNullOrWhiteSpace(txtDescripcion.Text) || txtDescripcion.Text.Length < 10)
            {
                MessageBox.Show("La descripción debe tener al menos 10 caracteres", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtDescripcion.Focus();
                return;
            }

            if (txtDescripcion.Text.Length > 500)
            {
                MessageBox.Show("La descripción no puede exceder 500 caracteres", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtDescripcion.Focus();
                return;
            }

            try
            {
                var mantenimiento = new Mantenimiento
                {
                    PlacaCarro = txtPlacaCarro.Text.Trim(),
                    FechaMantenimiento = dtpFechaMantenimiento.Value,
                    Kilometraje = (int)nudKilometraje.Value,
                    TipoMantenimiento = cboTipoMantenimiento.SelectedItem?.ToString() ?? "PREVENTIVO",
                    Costo = (double)nudCosto.Value,
                    Descripcion = txtDescripcion.Text.Trim(),
                    ProximoMantenimiento = chkProximoMantenimiento.Checked ? dtpProximoMantenimiento.Value : null,
                    Completado = chkCompletado.Checked
                };

                btnGuardar.Enabled = false;
                btnGuardar.Text = "Guardando...";

                await _mantenimientoService.CrearMantenimientoAsync(mantenimiento);

                MessageBox.Show("Mantenimiento creado exitosamente",
                    "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);

                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al crear el mantenimiento: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnGuardar.Enabled = true;
                btnGuardar.Text = "Guardar";
            }
        }
    }
}
