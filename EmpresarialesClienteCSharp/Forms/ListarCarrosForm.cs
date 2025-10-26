using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Threading.Tasks;
using System.Windows.Forms;
using EmpresarialesClienteCSharp.Services;
using EmpresarialesClienteCSharp.Models;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class ListarCarrosForm : Form
    {
        private readonly CarroService _carroService;

        private DataGridView dgvCarros = null!;
        private Label lblResumen = null!;

        // Filtros
        private TextBox txtPlaca = null!;
        private TextBox txtMarca = null!;
        private TextBox txtModelo = null!;
        private TextBox txtColor = null!;
        private TextBox txtAnio = null!;
        private TextBox txtPrecioMin = null!;
        private TextBox txtPrecioMax = null!;
        private TextBox txtNumeroPuertas = null!;
        private ComboBox cboEstado = null!;
        private ComboBox cboCombustible = null!;
        private ComboBox cboTransmision = null!;
        private ComboBox cboAireAcondicionado = null!;

        public ListarCarrosForm()
        {
            _carroService = new CarroService();
            InitializeComponent();
            Load += async (_, __) => await CargarCarrosAsync();
        }

        private void InitializeComponent()
        {
            Text = "Inventario de Vehículos - Concesionario App";
            Size = new Size(1150, 720);
            MinimumSize = new Size(920, 600);
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = Color.White;
            AutoScaleMode = AutoScaleMode.Dpi;
            FormBorderStyle = FormBorderStyle.Sizable;
            MaximizeBox = true;

            var mainLayout = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 1,
                RowCount = 4,
                Padding = new Padding(20),
                BackColor = Color.White
            };
            mainLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
            mainLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            mainLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            mainLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100F));
            mainLayout.RowStyles.Add(new RowStyle(SizeType.AutoSize));

            var lblTitulo = new Label
            {
                Text = "Inventario de Vehículos",
                Font = new Font("Segoe UI", 24, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(30, 58, 138),
                AutoSize = true,
                Margin = new Padding(0, 0, 0, 10),
                UseCompatibleTextRendering = false
            };
            mainLayout.Controls.Add(lblTitulo, 0, 0);

            var filtrosGroup = CrearGrupoFiltros();
            mainLayout.Controls.Add(filtrosGroup, 0, 1);

            dgvCarros = new DataGridView
            {
                Dock = DockStyle.Fill,
                ReadOnly = true,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
                BackgroundColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle,
                AutoGenerateColumns = true,
                Font = new Font("Segoe UI", 10, FontStyle.Regular, GraphicsUnit.Point),
                RowTemplate = { Height = 32 },
                SelectionMode = DataGridViewSelectionMode.FullRowSelect,
                MultiSelect = false
            };
            dgvCarros.EnableHeadersVisualStyles = false;
            dgvCarros.ColumnHeadersDefaultCellStyle.BackColor = Color.FromArgb(30, 58, 138);
            dgvCarros.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
            dgvCarros.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 10, FontStyle.Bold, GraphicsUnit.Point);
            dgvCarros.ColumnHeadersHeight = 38;

            mainLayout.Controls.Add(dgvCarros, 0, 2);

            lblResumen = new Label
            {
                Text = "Mostrando 0 vehículos",
                Font = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(71, 85, 105),
                AutoSize = true,
                Margin = new Padding(0, 10, 0, 0)
            };
            mainLayout.Controls.Add(lblResumen, 0, 3);

            Controls.Add(mainLayout);
        }

        private GroupBox CrearGrupoFiltros()
        {
            var groupBox = new GroupBox
            {
                Text = "Filtros de búsqueda",
                Dock = DockStyle.Top,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink,
                Font = new Font("Segoe UI", 10, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(30, 64, 175),
                Padding = new Padding(16)
            };

            var container = new TableLayoutPanel
            {
                Dock = DockStyle.Fill,
                ColumnCount = 1,
                RowCount = 2,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink
            };
            container.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            container.RowStyles.Add(new RowStyle(SizeType.AutoSize));

            var filtrosPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink,
                WrapContents = true,
                FlowDirection = FlowDirection.LeftToRight,
                Margin = new Padding(0),
                Padding = new Padding(0)
            };

            txtPlaca = CrearTextBox("Ej: ABC123");
            txtMarca = CrearTextBox("Ej: Toyota");
            txtModelo = CrearTextBox("Ej: Corolla");
            txtColor = CrearTextBox("Ej: Rojo");
            txtAnio = CrearTextBox("Año");
            txtNumeroPuertas = CrearTextBox("2, 4, 5");
            txtPrecioMin = CrearTextBox("Precio mínimo");
            txtPrecioMax = CrearTextBox("Precio máximo");

            cboEstado = CrearCombo(new[]
            {
                new ComboOption("Todos", null),
                new ComboOption("Nuevo", "NUEVO"),
                new ComboOption("Usado", "USADO"),
                new ComboOption("Excelente", "EXCELENTE")
            });

            cboCombustible = CrearCombo(new[]
            {
                new ComboOption("Todos", null),
                new ComboOption("Gasolina", "GASOLINA"),
                new ComboOption("Híbrido", "HIBRIDO"),
                new ComboOption("Eléctrico", "ELECTRICO")
            });

            cboTransmision = CrearCombo(new[]
            {
                new ComboOption("Todas", null),
                new ComboOption("Manual", "MANUAL"),
                new ComboOption("Automática", "AUTOMATICA")
            });

            cboAireAcondicionado = CrearCombo(new[]
            {
                new ComboOption("Todos", null),
                new ComboOption("Sí", "true"),
                new ComboOption("No", "false")
            });

            filtrosPanel.Controls.Add(CrearCampoFiltro("Placa", txtPlaca));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Marca", txtMarca));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Modelo", txtModelo));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Color", txtColor));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Año", txtAnio));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Número de puertas", txtNumeroPuertas));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Estado", cboEstado));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Combustible", cboCombustible));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Transmisión", cboTransmision));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Aire acondicionado", cboAireAcondicionado));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Precio mínimo", txtPrecioMin));
            filtrosPanel.Controls.Add(CrearCampoFiltro("Precio máximo", txtPrecioMax));

            var accionesPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink,
                FlowDirection = FlowDirection.RightToLeft,
                WrapContents = false,
                Margin = new Padding(0, 10, 0, 0)
            };

            var btnAplicarFiltros = CrearBotonAccion("Aplicar filtros", Color.FromArgb(30, 64, 175));
            btnAplicarFiltros.Click += async (s, e) => await AplicarFiltrosAsync();

            var btnRefrescar = CrearBotonAccion("Actualizar datos", Color.FromArgb(22, 101, 216));
            btnRefrescar.Click += async (s, e) => await CargarCarrosAsync();

            var btnLimpiarFiltros = CrearBotonAccion("Limpiar filtros", Color.FromArgb(148, 163, 184));
            btnLimpiarFiltros.Click += async (s, e) =>
            {
                LimpiarFiltros();
                await CargarCarrosAsync();
            };

            accionesPanel.Controls.Add(btnAplicarFiltros);
            accionesPanel.Controls.Add(btnRefrescar);
            accionesPanel.Controls.Add(btnLimpiarFiltros);

            container.Controls.Add(filtrosPanel, 0, 0);
            container.Controls.Add(accionesPanel, 0, 1);

            groupBox.Controls.Add(container);
            return groupBox;
        }

        private static TextBox CrearTextBox(string placeholder)
        {
            return new TextBox
            {
                Width = 220,
                Height = 32,
                Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point),
                PlaceholderText = placeholder
            };
        }

        private static ComboBox CrearCombo(IEnumerable<ComboOption> opciones)
        {
            var combo = new ComboBox
            {
                Width = 220,
                Height = 32,
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point)
            };

            foreach (var opcion in opciones)
            {
                combo.Items.Add(opcion);
            }

            if (combo.Items.Count > 0)
            {
                combo.SelectedIndex = 0;
            }

            return combo;
        }

        private static Panel CrearCampoFiltro(string etiqueta, Control control)
        {
            var panel = new Panel
            {
                Width = 240,
                Height = 76,
                Margin = new Padding(0, 0, 16, 12)
            };

            var label = new Label
            {
                Text = etiqueta,
                Font = new Font("Segoe UI", 9F, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(71, 85, 105),
                AutoSize = true,
                Location = new Point(0, 0),
                UseCompatibleTextRendering = false
            };

            control.Location = new Point(0, 30);
            control.Width = panel.Width - 4;

            panel.Controls.Add(control);
            panel.Controls.Add(label);
            control.BringToFront();

            return panel;
        }

        private static Button CrearBotonAccion(string texto, Color colorFondo)
        {
            var boton = new Button
            {
                Text = texto,
                AutoSize = true,
                BackColor = colorFondo,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold, GraphicsUnit.Point),
                Margin = new Padding(10, 0, 0, 0),
                Padding = new Padding(14, 8, 14, 8),
                Cursor = Cursors.Hand
            };
            boton.FlatAppearance.BorderSize = 0;
            return boton;
        }

        private async Task AplicarFiltrosAsync()
        {
            var filtros = ConstruirFiltros();
            if (filtros == null)
            {
                return;
            }

            await CargarCarrosAsync(filtros);
        }

        private void LimpiarFiltros()
        {
            txtPlaca.Text = string.Empty;
            txtMarca.Text = string.Empty;
            txtModelo.Text = string.Empty;
            txtColor.Text = string.Empty;
            txtAnio.Text = string.Empty;
            txtNumeroPuertas.Text = string.Empty;
            txtPrecioMin.Text = string.Empty;
            txtPrecioMax.Text = string.Empty;

            if (cboEstado.Items.Count > 0) cboEstado.SelectedIndex = 0;
            if (cboCombustible.Items.Count > 0) cboCombustible.SelectedIndex = 0;
            if (cboTransmision.Items.Count > 0) cboTransmision.SelectedIndex = 0;
            if (cboAireAcondicionado.Items.Count > 0) cboAireAcondicionado.SelectedIndex = 0;
        }

        private Dictionary<string, string>? ConstruirFiltros()
        {
            var filtros = new Dictionary<string, string>();

            void AgregarSiNoVacio(string clave, string? valor)
            {
                if (!string.IsNullOrWhiteSpace(valor))
                {
                    filtros[clave] = valor.Trim();
                }
            }

            AgregarSiNoVacio("placa", txtPlaca.Text);
            AgregarSiNoVacio("marca", txtMarca.Text);
            AgregarSiNoVacio("modelo", txtModelo.Text);
            AgregarSiNoVacio("color", txtColor.Text);

            if (!string.IsNullOrWhiteSpace(txtAnio.Text))
            {
                if (int.TryParse(txtAnio.Text, out var anio))
                {
                    filtros["anio"] = anio.ToString();
                }
                else
                {
                    MostrarMensajeValidacion("Ingrese un año válido en formato numérico.");
                    txtAnio.Focus();
                    return null;
                }
            }

            if (!string.IsNullOrWhiteSpace(txtNumeroPuertas.Text))
            {
                if (int.TryParse(txtNumeroPuertas.Text, out var puertas))
                {
                    filtros["numeroPuertas"] = puertas.ToString();
                }
                else
                {
                    MostrarMensajeValidacion("El número de puertas debe ser un valor numérico.");
                    txtNumeroPuertas.Focus();
                    return null;
                }
            }

            if (cboEstado.SelectedItem is ComboOption estado && !string.IsNullOrEmpty(estado.Value))
            {
                filtros["estado"] = estado.Value!;
            }

            if (cboCombustible.SelectedItem is ComboOption combustible && !string.IsNullOrEmpty(combustible.Value))
            {
                filtros["combustible"] = combustible.Value!;
            }

            if (cboTransmision.SelectedItem is ComboOption transmision && !string.IsNullOrEmpty(transmision.Value))
            {
                filtros["tipoTransmision"] = transmision.Value!;
            }

            if (cboAireAcondicionado.SelectedItem is ComboOption aire && !string.IsNullOrEmpty(aire.Value))
            {
                filtros["tieneAireAcondicionado"] = aire.Value!;
            }

            if (!string.IsNullOrWhiteSpace(txtPrecioMin.Text))
            {
                if (double.TryParse(txtPrecioMin.Text, out var precioMin) && precioMin >= 0)
                {
                    filtros["precioMin"] = precioMin.ToString(CultureInfo.InvariantCulture);
                }
                else
                {
                    MostrarMensajeValidacion("Ingrese un valor numérico válido para el precio mínimo.");
                    txtPrecioMin.Focus();
                    return null;
                }
            }

            if (!string.IsNullOrWhiteSpace(txtPrecioMax.Text))
            {
                if (double.TryParse(txtPrecioMax.Text, out var precioMax) && precioMax >= 0)
                {
                    filtros["precioMax"] = precioMax.ToString(CultureInfo.InvariantCulture);
                }
                else
                {
                    MostrarMensajeValidacion("Ingrese un valor numérico válido para el precio máximo.");
                    txtPrecioMax.Focus();
                    return null;
                }
            }

            if (filtros.TryGetValue("precioMin", out var minStr) && filtros.TryGetValue("precioMax", out var maxStr))
            {
                if (double.TryParse(minStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var min) &&
                    double.TryParse(maxStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var max) &&
                    min > max)
                {
                    MostrarMensajeValidacion("El precio mínimo no puede ser mayor al precio máximo.");
                    txtPrecioMin.Focus();
                    return null;
                }
            }

            return filtros;
        }

        private async Task CargarCarrosAsync(Dictionary<string, string>? filtros = null)
        {
            try
            {
                List<Carro> carros;

                if (filtros != null && filtros.Count > 0)
                {
                    carros = await _carroService.BuscarPorCriteriosAsync(filtros);
                }
                else
                {
                    carros = await _carroService.ObtenerTodosLosCarrosAsync();
                }

                dgvCarros.DataSource = null;
                dgvCarros.DataSource = carros;

                lblResumen.Text = filtros != null && filtros.Count > 0
                    ? $"{carros.Count} vehículo(s) coinciden con los filtros aplicados."
                    : $"{carros.Count} vehículo(s) registrados en total.";
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"❌ Error al cargar los vehículos\n\n{ex.Message}\n\nPor favor, verifique su conexión al servidor e intente nuevamente.",
                    "Error de operación",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }
        }

        private static void MostrarMensajeValidacion(string mensaje)
        {
            MessageBox.Show(mensaje, "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        private sealed class ComboOption
        {
            public string Text { get; }
            public string? Value { get; }

            public ComboOption(string text, string? value)
            {
                Text = text;
                Value = value;
            }

            public override string ToString() => Text;
        }
    }
}

