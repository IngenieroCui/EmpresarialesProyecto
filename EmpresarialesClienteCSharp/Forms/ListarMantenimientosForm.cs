using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Models;
using EmpresarialesClienteCSharp.Services;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class ListarMantenimientosForm : Form
    {
        private readonly MantenimientoService _mantenimientoService;
        private DataGridView dgvMantenimientos;
        private TextBox txtFiltroPlaca;
        private ComboBox cboFiltroTipo;
        private ComboBox cboFiltroEstado;
        private Button btnBuscar;
        private Button btnLimpiar;
        private Button btnRefrescar;
        private Label lblTotal;
        private Label lblCostoTotal;

        public ListarMantenimientosForm()
        {
            _mantenimientoService = new MantenimientoService();
            InitializeComponent();
            ConfigurarFormulario();
            CargarMantenimientos();
        }

        private void InitializeComponent()
        {
            this.Text = "Lista de Mantenimientos";
            this.Size = new Size(1200, 700);
            this.StartPosition = FormStartPosition.CenterScreen;
        }

        private void ConfigurarFormulario()
        {
            // Panel de filtros
            var panelFiltros = new Panel
            {
                Dock = DockStyle.Top,
                Height = 100,
                Padding = new Padding(10)
            };

            var lblTitulo = new Label
            {
                Text = "LISTA DE MANTENIMIENTOS",
                Font = new Font("Arial", 16, FontStyle.Bold),
                Location = new Point(10, 10),
                AutoSize = true
            };
            panelFiltros.Controls.Add(lblTitulo);

            // Filtro por placa
            var lblPlaca = new Label
            {
                Text = "Placa del Carro:",
                Location = new Point(10, 50),
                AutoSize = true
            };
            panelFiltros.Controls.Add(lblPlaca);

            txtFiltroPlaca = new TextBox
            {
                Location = new Point(120, 47),
                Width = 120,
                MaxLength = 7
            };
            txtFiltroPlaca.CharacterCasing = CharacterCasing.Upper;
            panelFiltros.Controls.Add(txtFiltroPlaca);

            // Filtro por tipo
            var lblTipo = new Label
            {
                Text = "Tipo:",
                Location = new Point(260, 50),
                AutoSize = true
            };
            panelFiltros.Controls.Add(lblTipo);

            cboFiltroTipo = new ComboBox
            {
                Location = new Point(310, 47),
                Width = 150,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            cboFiltroTipo.Items.AddRange(new object[]
            {
                "Todos",
                "PREVENTIVO",
                "CORRECTIVO",
                "REVISION",
                "CAMBIO_ACEITE",
                "CAMBIO_LLANTAS",
                "OTROS"
            });
            cboFiltroTipo.SelectedIndex = 0;
            panelFiltros.Controls.Add(cboFiltroTipo);

            // Filtro por estado
            var lblEstado = new Label
            {
                Text = "Estado:",
                Location = new Point(480, 50),
                AutoSize = true
            };
            panelFiltros.Controls.Add(lblEstado);

            cboFiltroEstado = new ComboBox
            {
                Location = new Point(540, 47),
                Width = 120,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            cboFiltroEstado.Items.AddRange(new object[] { "Todos", "Completados", "Pendientes" });
            cboFiltroEstado.SelectedIndex = 0;
            panelFiltros.Controls.Add(cboFiltroEstado);

            // Botones
            btnBuscar = new Button
            {
                Text = "Buscar",
                Location = new Point(680, 45),
                Width = 80,
                Height = 25
            };
            btnBuscar.Click += BtnBuscar_Click;
            panelFiltros.Controls.Add(btnBuscar);

            btnLimpiar = new Button
            {
                Text = "Limpiar",
                Location = new Point(770, 45),
                Width = 80,
                Height = 25
            };
            btnLimpiar.Click += BtnLimpiar_Click;
            panelFiltros.Controls.Add(btnLimpiar);

            btnRefrescar = new Button
            {
                Text = "Refrescar",
                Location = new Point(860, 45),
                Width = 80,
                Height = 25
            };
            btnRefrescar.Click += (s, e) => CargarMantenimientos();
            panelFiltros.Controls.Add(btnRefrescar);

            this.Controls.Add(panelFiltros);

            // Panel de estadísticas
            var panelEstadisticas = new Panel
            {
                Dock = DockStyle.Top,
                Height = 40,
                Padding = new Padding(10)
            };

            lblTotal = new Label
            {
                Text = "Total: 0",
                Location = new Point(10, 10),
                AutoSize = true,
                Font = new Font("Arial", 10, FontStyle.Bold)
            };
            panelEstadisticas.Controls.Add(lblTotal);

            lblCostoTotal = new Label
            {
                Text = "Costo Total: $0",
                Location = new Point(150, 10),
                AutoSize = true,
                Font = new Font("Arial", 10, FontStyle.Bold)
            };
            panelEstadisticas.Controls.Add(lblCostoTotal);

            this.Controls.Add(panelEstadisticas);

            // DataGridView
            dgvMantenimientos = new DataGridView
            {
                Dock = DockStyle.Fill,
                AutoGenerateColumns = false,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                ReadOnly = true,
                SelectionMode = DataGridViewSelectionMode.FullRowSelect,
                MultiSelect = false
            };

            dgvMantenimientos.Columns.AddRange(new DataGridViewColumn[]
            {
                new DataGridViewTextBoxColumn { HeaderText = "ID", DataPropertyName = "Id", Width = 100 },
                new DataGridViewTextBoxColumn { HeaderText = "Placa Carro", DataPropertyName = "PlacaCarro", Width = 100 },
                new DataGridViewTextBoxColumn { HeaderText = "Fecha", DataPropertyName = "FechaMantenimiento", Width = 150 },
                new DataGridViewTextBoxColumn { HeaderText = "Tipo", DataPropertyName = "TipoMantenimiento", Width = 130 },
                new DataGridViewTextBoxColumn { HeaderText = "Kilometraje", DataPropertyName = "Kilometraje", Width = 100 },
                new DataGridViewTextBoxColumn { HeaderText = "Costo", DataPropertyName = "Costo", Width = 120 },
                new DataGridViewTextBoxColumn { HeaderText = "Estado", Width = 100 },
                new DataGridViewTextBoxColumn { HeaderText = "Descripción", DataPropertyName = "Descripcion", Width = 300 }
            });

            dgvMantenimientos.CellFormatting += DgvMantenimientos_CellFormatting;
            this.Controls.Add(dgvMantenimientos);
        }

        private async void CargarMantenimientos()
        {
            try
            {
                dgvMantenimientos.DataSource = null;
                var mantenimientos = await _mantenimientoService.ObtenerTodosLosMantenimientosAsync();
                dgvMantenimientos.DataSource = mantenimientos;
                ActualizarEstadisticas(mantenimientos);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al cargar mantenimientos: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void BtnBuscar_Click(object? sender, EventArgs e)
        {
            try
            {
                List<Mantenimiento> mantenimientos;

                if (!string.IsNullOrWhiteSpace(txtFiltroPlaca.Text))
                {
                    mantenimientos = await _mantenimientoService.BuscarPorCarroAsync(txtFiltroPlaca.Text.Trim());
                }
                else
                {
                    mantenimientos = await _mantenimientoService.ObtenerTodosLosMantenimientosAsync();
                }

                // Aplicar filtros locales
                string? tipo = cboFiltroTipo.SelectedIndex > 0 ? cboFiltroTipo.SelectedItem?.ToString() : null;
                bool? completado = cboFiltroEstado.SelectedIndex == 1 ? true :
                                  cboFiltroEstado.SelectedIndex == 2 ? false : null;

                mantenimientos = _mantenimientoService.FiltrarMantenimientos(
                    mantenimientos, tipo, completado);

                dgvMantenimientos.DataSource = null;
                dgvMantenimientos.DataSource = mantenimientos;
                ActualizarEstadisticas(mantenimientos);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al buscar: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnLimpiar_Click(object? sender, EventArgs e)
        {
            txtFiltroPlaca.Clear();
            cboFiltroTipo.SelectedIndex = 0;
            cboFiltroEstado.SelectedIndex = 0;
            CargarMantenimientos();
        }

        private void ActualizarEstadisticas(List<Mantenimiento> mantenimientos)
        {
            lblTotal.Text = $"Total: {mantenimientos.Count}";
            double costoTotal = mantenimientos.Sum(m => m.Costo);
            lblCostoTotal.Text = $"Costo Total: {costoTotal:C0}";
        }

        private void DgvMantenimientos_CellFormatting(object? sender, DataGridViewCellFormattingEventArgs e)
        {
            if (dgvMantenimientos.Columns[e.ColumnIndex].HeaderText == "Estado" && e.RowIndex >= 0)
            {
                var mantenimiento = dgvMantenimientos.Rows[e.RowIndex].DataBoundItem as Mantenimiento;
                if (mantenimiento != null)
                {
                    string estado = mantenimiento.ObtenerEstadoMantenimiento();
                    e.Value = estado;

                    // Colorear según el estado
                    if (estado == "COMPLETADO")
                    {
                        dgvMantenimientos.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.LightGreen;
                    }
                    else if (estado == "URGENTE")
                    {
                        dgvMantenimientos.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.LightCoral;
                    }
                    else
                    {
                        dgvMantenimientos.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.LightYellow;
                    }
                }
            }
            else if (dgvMantenimientos.Columns[e.ColumnIndex].HeaderText == "Costo" && e.Value != null)
            {
                e.Value = string.Format("{0:C0}", e.Value);
                e.FormattingApplied = true;
            }
            else if (dgvMantenimientos.Columns[e.ColumnIndex].HeaderText == "Kilometraje" && e.Value != null)
            {
                e.Value = string.Format("{0:N0} km", e.Value);
                e.FormattingApplied = true;
            }
            else if (dgvMantenimientos.Columns[e.ColumnIndex].HeaderText == "Fecha" && e.Value != null)
            {
                if (e.Value is DateTime fecha)
                {
                    e.Value = fecha.ToString("dd/MM/yyyy HH:mm");
                    e.FormattingApplied = true;
                }
            }
        }
    }
}
