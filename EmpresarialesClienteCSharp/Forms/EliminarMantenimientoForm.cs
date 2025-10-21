using System;
using System.Drawing;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class EliminarMantenimientoForm : Form
    {
        private readonly MantenimientoService _mantenimientoService;
        private Mantenimiento? _mantenimientoActual;

        private TextBox txtId;
        private Button btnBuscar;
        private Panel panelBusqueda;
        private Panel panelInformacion;
        private Label lblInfo;
        private Button btnEliminar;
        private Button btnCancelar;

        public EliminarMantenimientoForm()
        {
            _mantenimientoService = new MantenimientoService();
            InitializeComponent();
            ConfigurarFormulario();
        }

        private void InitializeComponent()
        {
            this.Text = "Eliminar Mantenimiento";
            this.Size = new Size(600, 500);
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
                Text = "ELIMINAR MANTENIMIENTO",
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

            var lblInstruccion = new Label
            {
                Text = "Ingrese el ID del mantenimiento que desea eliminar",
                Location = new Point(20, 85),
                AutoSize = true,
                ForeColor = Color.Gray,
                Font = new Font("Arial", 8, FontStyle.Italic)
            };
            panelBusqueda.Controls.Add(lblInstruccion);

            this.Controls.Add(panelBusqueda);

            // Panel de información (inicialmente oculto)
            panelInformacion = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(20),
                Visible = false,
                AutoScroll = true
            };

            // Advertencia
            var lblAdvertencia = new Label
            {
                Text = "⚠️ ADVERTENCIA: Esta acción eliminará permanentemente este mantenimiento",
                Location = new Point(0, 10),
                Width = 540,
                Height = 40,
                BackColor = Color.FromArgb(255, 200, 200),
                BorderStyle = BorderStyle.FixedSingle,
                TextAlign = ContentAlignment.MiddleCenter,
                Font = new Font("Arial", 10, FontStyle.Bold),
                ForeColor = Color.DarkRed
            };
            panelInformacion.Controls.Add(lblAdvertencia);

            // Información del mantenimiento
            lblInfo = new Label
            {
                Location = new Point(0, 60),
                Width = 540,
                Height = 250,
                Font = new Font("Courier New", 9),
                BorderStyle = BorderStyle.FixedSingle,
                Padding = new Padding(10),
                BackColor = Color.White
            };
            panelInformacion.Controls.Add(lblInfo);

            // Botones
            btnEliminar = new Button
            {
                Text = "Confirmar Eliminación",
                Location = new Point(0, 330),
                Width = 260,
                Height = 40,
                BackColor = Color.FromArgb(220, 53, 69),
                ForeColor = Color.White,
                Font = new Font("Arial", 10, FontStyle.Bold)
            };
            btnEliminar.Click += BtnEliminar_Click;
            panelInformacion.Controls.Add(btnEliminar);

            btnCancelar = new Button
            {
                Text = "Cancelar",
                Location = new Point(280, 330),
                Width = 260,
                Height = 40,
                BackColor = Color.Gray,
                ForeColor = Color.White,
                Font = new Font("Arial", 10, FontStyle.Bold)
            };
            btnCancelar.Click += BtnCancelar_Click;
            panelInformacion.Controls.Add(btnCancelar);

            this.Controls.Add(panelInformacion);
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
                MostrarInformacion(mantenimiento);
                panelInformacion.Visible = true;
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

        private void MostrarInformacion(Mantenimiento mantenimiento)
        {
            var info = $@"
=== INFORMACIÓN DEL MANTENIMIENTO ===

ID:                 {mantenimiento.Id}
Placa Carro:        {mantenimiento.PlacaCarro}
Fecha:              {mantenimiento.GetFechaMantenimientoFormateada()}
Tipo:               {mantenimiento.TipoMantenimiento.Replace("_", " ")}
Kilometraje:        {mantenimiento.Kilometraje:N0} km
Costo:              {mantenimiento.Costo:C0}
Estado:             {mantenimiento.ObtenerEstadoMantenimiento()}
Completado:         {(mantenimiento.Completado ? "Sí" : "No")}

Descripción:
{mantenimiento.Descripcion}

Próximo Mant.:      {mantenimiento.GetProximoMantenimientoFormateado()}
Fecha Registro:     {mantenimiento.FechaRegistro?.ToString("dd/MM/yyyy HH:mm") ?? "N/A"}
";

            lblInfo.Text = info;
        }

        private async void BtnEliminar_Click(object? sender, EventArgs e)
        {
            if (_mantenimientoActual == null)
            {
                MessageBox.Show("⚠️ No hay mantenimiento cargado\n\nPor favor, busque y seleccione un mantenimiento antes de intentar eliminarlo.", 
                    "Operación No Disponible", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            var result = MessageBox.Show(
                $"⚠️ CONFIRMAR ELIMINACIÓN\n\n" +
                $"¿Está COMPLETAMENTE SEGURO que desea eliminar este mantenimiento?\n\n" +
                $"Placa: {_mantenimientoActual.PlacaCarro}\n" +
                $"Tipo: {_mantenimientoActual.TipoMantenimiento}\n" +
                $"Costo: {_mantenimientoActual.Costo:C0}\n\n" +
                $"Esta acción NO SE PUEDE DESHACER.",
                "Confirmar Eliminación",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning,
                MessageBoxDefaultButton.Button2
            );

            if (result != DialogResult.Yes)
            {
                return;
            }

            try
            {
                btnEliminar.Enabled = false;
                btnEliminar.Text = "Eliminando...";

                bool eliminado = await _mantenimientoService.EliminarMantenimientoAsync(_mantenimientoActual.Id);

                if (eliminado)
                {
                    MessageBox.Show($"✅ Mantenimiento eliminado exitosamente\n\nEl registro del mantenimiento para el vehículo {_mantenimientoActual.PlacaCarro} ha sido eliminado correctamente del sistema.",
                        "Operación Exitosa", MessageBoxButtons.OK, MessageBoxIcon.Information);

                    this.DialogResult = DialogResult.OK;
                    this.Close();
                }
                else
                {
                    MessageBox.Show("❌ No se pudo eliminar el mantenimiento\n\nEl servidor no pudo procesar la solicitud de eliminación. Por favor, intente nuevamente.",
                        "Error de Operación", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"❌ Error al eliminar el mantenimiento\n\n{ex.Message}\n\nPor favor, verifique su conexión e intente nuevamente.",
                    "Error de Operación", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnEliminar.Enabled = true;
                btnEliminar.Text = "Confirmar Eliminación";
            }
        }

        private void BtnCancelar_Click(object? sender, EventArgs e)
        {
            _mantenimientoActual = null;
            txtId.Clear();
            panelInformacion.Visible = false;
        }
    }
}
