using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class ActualizarMantenimientoForm : Form
    {
        private readonly MantenimientoService _mantenimientoService;
        private Mantenimiento? _mantenimientoActual;

        private TextBox txtId;
        private Button btnBuscar;
        private Panel panelBusqueda;
        private Panel panelFormulario;

        private TextBox txtPlacaCarro;
        private DateTimePicker dtpFechaMantenimiento;
        private NumericUpDown nudKilometraje;
        private ComboBox cboTipoMantenimiento;
        private NumericUpDown nudCosto;
        private TextBox txtDescripcion;
        private DateTimePicker dtpProximoMantenimiento;
        private CheckBox chkProximoMantenimiento;
        private CheckBox chkCompletado;
        private Button btnActualizar;
        private Button btnCancelar;

        public ActualizarMantenimientoForm()
        {
            _mantenimientoService = new MantenimientoService();
            InitializeComponent();
            ConfigurarFormulario();
        }

        private void InitializeComponent()
        {
            this.Text = "Actualizar Mantenimiento";
            this.Size = new Size(600, 720);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
        }

        private void ConfigurarFormulario()
        {
            // Panel de búsqueda
            panelBusqueda = new Panel
            {
                Dock = DockStyle.Top,
                Height = 120,
                Padding = new Padding(10)
            };

            var lblTitulo = new Label
            {
                Text = "ACTUALIZAR MANTENIMIENTO",
                Font = new Font("Arial", 14, FontStyle.Bold),
                Location = new Point(20, 10),
                AutoSize = true
            };
            panelBusqueda.Controls.Add(lblTitulo);

            var lblId = new Label
            {
                Text = "ID del Mantenimiento:",
                Location = new Point(20, 50),
                Width = 150
            };
            panelBusqueda.Controls.Add(lblId);

            txtId = new TextBox
            {
                Location = new Point(180, 47),
                Width = 300
            };
            panelBusqueda.Controls.Add(txtId);

            btnBuscar = new Button
            {
                Text = "Buscar",
                Location = new Point(490, 45),
                Width = 80,
                Height = 25
            };
            btnBuscar.Click += BtnBuscar_Click;
            panelBusqueda.Controls.Add(btnBuscar);

            var lblInfo = new Label
            {
                Text = "Ingrese el ID del mantenimiento que desea actualizar",
                Location = new Point(20, 85),
                AutoSize = true,
                ForeColor = Color.Gray,
                Font = new Font("Arial", 8, FontStyle.Italic)
            };
            panelBusqueda.Controls.Add(lblInfo);

            this.Controls.Add(panelBusqueda);

            // Panel de formulario (inicialmente oculto)
            panelFormulario = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(20),
                Visible = false,
                AutoScroll = true
            };

            CrearFormularioEdicion();
            this.Controls.Add(panelFormulario);
        }

        private void CrearFormularioEdicion()
        {
            int yPos = 10;
            int labelX = 0;
            int controlX = 160;
            int controlWidth = 360;

            // Placa del Carro
            var lblPlaca = new Label
            {
                Text = "Placa del Carro: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblPlaca);

            txtPlacaCarro = new TextBox
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                MaxLength = 7,
                CharacterCasing = CharacterCasing.Upper,
                Enabled = false,
                BackColor = Color.LightGray
            };
            panelFormulario.Controls.Add(txtPlacaCarro);
            yPos += 35;

            // Fecha de Mantenimiento
            var lblFecha = new Label
            {
                Text = "Fecha Mantenimiento: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblFecha);

            dtpFechaMantenimiento = new DateTimePicker
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Format = DateTimePickerFormat.Custom,
                CustomFormat = "dd/MM/yyyy HH:mm"
            };
            panelFormulario.Controls.Add(dtpFechaMantenimiento);
            yPos += 35;

            // Kilometraje
            var lblKilometraje = new Label
            {
                Text = "Kilometraje (km): *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblKilometraje);

            nudKilometraje = new NumericUpDown
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Minimum = 0,
                Maximum = 1000000,
                ThousandsSeparator = true
            };
            panelFormulario.Controls.Add(nudKilometraje);
            yPos += 35;

            // Tipo de Mantenimiento
            var lblTipo = new Label
            {
                Text = "Tipo Mantenimiento: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblTipo);

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
            panelFormulario.Controls.Add(cboTipoMantenimiento);
            yPos += 35;

            // Costo
            var lblCosto = new Label
            {
                Text = "Costo: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblCosto);

            nudCosto = new NumericUpDown
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Minimum = 0,
                Maximum = 100000000,
                DecimalPlaces = 0,
                ThousandsSeparator = true
            };
            panelFormulario.Controls.Add(nudCosto);
            yPos += 35;

            // Descripción
            var lblDescripcion = new Label
            {
                Text = "Descripción: *",
                Location = new Point(labelX, yPos),
                Width = 150
            };
            panelFormulario.Controls.Add(lblDescripcion);

            txtDescripcion = new TextBox
            {
                Location = new Point(controlX, yPos),
                Width = controlWidth,
                Height = 80,
                Multiline = true,
                MaxLength = 500,
                ScrollBars = ScrollBars.Vertical
            };
            panelFormulario.Controls.Add(txtDescripcion);
            yPos += 90;

            // Próximo Mantenimiento (Checkbox)
            chkProximoMantenimiento = new CheckBox
            {
                Text = "Programar próximo mantenimiento",
                Location = new Point(labelX, yPos),
                Width = 250
            };
            chkProximoMantenimiento.CheckedChanged += ChkProximoMantenimiento_CheckedChanged;
            panelFormulario.Controls.Add(chkProximoMantenimiento);
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
            panelFormulario.Controls.Add(dtpProximoMantenimiento);
            yPos += 35;

            // Completado
            chkCompletado = new CheckBox
            {
                Text = "Mantenimiento completado",
                Location = new Point(labelX, yPos),
                Width = 250
            };
            panelFormulario.Controls.Add(chkCompletado);
            yPos += 40;

            // Botones
            btnActualizar = new Button
            {
                Text = "Actualizar",
                Location = new Point(controlX, yPos),
                Width = 120,
                Height = 35
            };
            btnActualizar.Click += BtnActualizar_Click;
            panelFormulario.Controls.Add(btnActualizar);

            btnCancelar = new Button
            {
                Text = "Cancelar",
                Location = new Point(controlX + 140, yPos),
                Width = 120,
                Height = 35
            };
            btnCancelar.Click += (s, e) => this.Close();
            panelFormulario.Controls.Add(btnCancelar);
        }

        private void ChkProximoMantenimiento_CheckedChanged(object? sender, EventArgs e)
        {
            dtpProximoMantenimiento.Enabled = chkProximoMantenimiento.Checked;
        }

        private async void BtnBuscar_Click(object? sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtId.Text))
            {
                MessageBox.Show("Por favor ingrese un ID", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            try
            {
                btnBuscar.Enabled = false;
                btnBuscar.Text = "Buscando...";

                var mantenimiento = await _mantenimientoService.BuscarPorIdAsync(txtId.Text.Trim());

                if (mantenimiento == null)
                {
                    MessageBox.Show("No se encontró un mantenimiento con ese ID",
                        "No Encontrado", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                _mantenimientoActual = mantenimiento;
                CargarDatosEnFormulario(mantenimiento);
                panelFormulario.Visible = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al buscar el mantenimiento: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnBuscar.Enabled = true;
                btnBuscar.Text = "Buscar";
            }
        }

        private void CargarDatosEnFormulario(Mantenimiento mantenimiento)
        {
            txtPlacaCarro.Text = mantenimiento.PlacaCarro;
            dtpFechaMantenimiento.Value = mantenimiento.FechaMantenimiento ?? DateTime.Now;
            nudKilometraje.Value = mantenimiento.Kilometraje;
            cboTipoMantenimiento.SelectedItem = mantenimiento.TipoMantenimiento;
            nudCosto.Value = (decimal)mantenimiento.Costo;
            txtDescripcion.Text = mantenimiento.Descripcion;
            chkCompletado.Checked = mantenimiento.Completado;

            if (mantenimiento.ProximoMantenimiento.HasValue)
            {
                chkProximoMantenimiento.Checked = true;
                dtpProximoMantenimiento.Value = mantenimiento.ProximoMantenimiento.Value;
            }
            else
            {
                chkProximoMantenimiento.Checked = false;
            }
        }

        private async void BtnActualizar_Click(object? sender, EventArgs e)
        {
            if (_mantenimientoActual == null)
            {
                MessageBox.Show("No hay mantenimiento cargado", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Validaciones
            if (string.IsNullOrWhiteSpace(txtDescripcion.Text) || txtDescripcion.Text.Length < 10)
            {
                MessageBox.Show("La descripción debe tener al menos 10 caracteres", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtDescripcion.Focus();
                return;
            }

            try
            {
                _mantenimientoActual.FechaMantenimiento = dtpFechaMantenimiento.Value;
                _mantenimientoActual.Kilometraje = (int)nudKilometraje.Value;
                _mantenimientoActual.TipoMantenimiento = cboTipoMantenimiento.SelectedItem?.ToString() ?? "PREVENTIVO";
                _mantenimientoActual.Costo = (double)nudCosto.Value;
                _mantenimientoActual.Descripcion = txtDescripcion.Text.Trim();
                _mantenimientoActual.ProximoMantenimiento = chkProximoMantenimiento.Checked ? dtpProximoMantenimiento.Value : null;
                _mantenimientoActual.Completado = chkCompletado.Checked;

                btnActualizar.Enabled = false;
                btnActualizar.Text = "Actualizando...";

                await _mantenimientoService.ActualizarMantenimientoAsync(_mantenimientoActual.Id, _mantenimientoActual);

                MessageBox.Show("Mantenimiento actualizado exitosamente",
                    "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);

                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al actualizar el mantenimiento: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnActualizar.Enabled = true;
                btnActualizar.Text = "Actualizar";
            }
        }
    }
}
