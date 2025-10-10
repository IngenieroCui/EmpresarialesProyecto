using System;
using System.Drawing;
using System.Windows.Forms;

namespace EmpresarialesClienteCSharp.Forms
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Concesionario App - Sistema de Gestión";
            this.Size = new Size(1000, 700);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.AutoScaleMode = AutoScaleMode.Dpi;

            // Crear MenuStrip
            var menuStrip = new MenuStrip();
            menuStrip.BackColor = Color.White;
            menuStrip.Font = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point);

            // Menú Archivo
            var archivoMenu = new ToolStripMenuItem("Archivo");
            archivoMenu.DropDownItems.Add("Salir", null, (s, e) => Application.Exit());

            // Menú Carros
            var carrosMenu = new ToolStripMenuItem("Vehículos");
            carrosMenu.DropDownItems.Add("Registrar Vehículo", null, AbrirFormCrear);
            carrosMenu.DropDownItems.Add(new ToolStripSeparator());
            carrosMenu.DropDownItems.Add("Listar Todos", null, AbrirFormListar);
            carrosMenu.DropDownItems.Add("Buscar por Criterios", null, AbrirFormBuscar);
            carrosMenu.DropDownItems.Add(new ToolStripSeparator());
            carrosMenu.DropDownItems.Add("Actualizar Registro", null, AbrirFormActualizar);
            carrosMenu.DropDownItems.Add("Eliminar Registro", null, AbrirFormEliminar);

            // Menú Mantenimientos
            var mantenimientosMenu = new ToolStripMenuItem("Mantenimientos");
            mantenimientosMenu.DropDownItems.Add("Registrar Mantenimiento", null, AbrirFormCrearMantenimiento);
            mantenimientosMenu.DropDownItems.Add(new ToolStripSeparator());
            mantenimientosMenu.DropDownItems.Add("Listar Mantenimientos", null, AbrirFormListarMantenimientos);
            mantenimientosMenu.DropDownItems.Add(new ToolStripSeparator());
            mantenimientosMenu.DropDownItems.Add("Actualizar Mantenimiento", null, AbrirFormActualizarMantenimiento);
            mantenimientosMenu.DropDownItems.Add("Eliminar Mantenimiento", null, AbrirFormEliminarMantenimiento);

            // Menú Ayuda
            var ayudaMenu = new ToolStripMenuItem("Ayuda");
            ayudaMenu.DropDownItems.Add("Acerca de...", null, MostrarAcercaDe);

            menuStrip.Items.AddRange(new[] { archivoMenu, carrosMenu, mantenimientosMenu, ayudaMenu });

            // Panel Principal con scroll
            var panelPrincipal = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = Color.FromArgb(249, 250, 251),
                AutoScroll = true
            };

            // Panel Hero (Superior azul)
            var panelHero = new Panel
            {
                Location = new Point(0, 0),
                Size = new Size(1000, 250),
                BackColor = Color.FromArgb(37, 99, 235)
            };
            panelHero.Paint += (s, e) => {
                e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                // Gradiente azul
                using (var brush = new System.Drawing.Drawing2D.LinearGradientBrush(
                    panelHero.ClientRectangle,
                    Color.FromArgb(37, 99, 235),
                    Color.FromArgb(29, 78, 216),
                    45f))
                {
                    e.Graphics.FillRectangle(brush, panelHero.ClientRectangle);
                }
            };

            // Badge de versión
            var lblBadge = new Label
            {
                Text = "Sistema Empresarial v2.0.1",
                Font = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(191, 219, 254),
                AutoSize = true,
                Location = new Point(380, 30),
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false
            };

            // Título Principal centrado
            var lblTitulo = new Label
            {
                Text = "Gestión Integral de",
                Font = new Font("Segoe UI", 26, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.White,
                AutoSize = true,
                Location = new Point(280, 70),
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false
            };

            var lblTitulo2 = new Label
            {
                Text = "Vehículos Empresariales",
                Font = new Font("Segoe UI", 26, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(147, 197, 253),
                AutoSize = true,
                Location = new Point(220, 115),
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false
            };

            var lblSubtitulo = new Label
            {
                Text = "Plataforma empresarial para la administración completa del inventario automotriz",
                Font = new Font("Segoe UI", 10, FontStyle.Regular, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(191, 219, 254),
                AutoSize = false,
                Size = new Size(700, 50),
                Location = new Point(150, 170),
                TextAlign = ContentAlignment.TopCenter,
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false
            };

            panelHero.Controls.AddRange(new Control[] { lblBadge, lblTitulo, lblTitulo2, lblSubtitulo });

            // Panel de contenido centrado
            var panelContenido = new Panel
            {
                Location = new Point(0, 250),
                Size = new Size(1000, 420),
                BackColor = Color.Transparent
            };

            // Panel de tarjetas de acciones (centrado)
            var panelTarjetas = new Panel
            {
                Location = new Point(200, 40),
                Size = new Size(600, 380),
                BackColor = Color.White
            };
            panelTarjetas.Paint += (s, e) => {
                e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                // Sombra suave
                using (var path = new System.Drawing.Drawing2D.GraphicsPath())
                {
                    path.AddRectangle(new Rectangle(0, 0, panelTarjetas.Width, panelTarjetas.Height));
                    using (var pen = new Pen(Color.FromArgb(229, 231, 235), 1))
                    {
                        e.Graphics.DrawPath(pen, path);
                    }
                }
            };

            // Título de la sección
            var lblSeccion = new Label
            {
                Text = "Gestión de Inventario",
                Font = new Font("Segoe UI", 16, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(31, 41, 55),
                AutoSize = true,
                Location = new Point(30, 25),
                UseCompatibleTextRendering = false
            };

            var lblSeccionSub = new Label
            {
                Text = "Administre el catálogo de vehículos",
                Font = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(107, 114, 128),
                AutoSize = true,
                Location = new Point(30, 55),
                UseCompatibleTextRendering = false
            };

            // Botones de acción (2 columnas)
            var btnCrear = CrearBotonModerno("Registrar Vehículo", "Agregar nuevo vehículo al inventario", new Point(30, 100), Color.FromArgb(16, 185, 129));
            var btnActualizar = CrearBotonModerno("Actualizar Registro", "Modificar información de vehículos", new Point(310, 100), Color.FromArgb(245, 158, 11));
            var btnListar = CrearBotonModerno("Listar Inventario", "Ver todos los vehículos registrados", new Point(30, 220), Color.FromArgb(59, 130, 246));
            var btnBuscar = CrearBotonModerno("Buscar Vehículo", "Búsqueda avanzada por criterios", new Point(310, 220), Color.FromArgb(168, 85, 247));

            // Asignar eventos de click
            AsignarClickRecursivo(btnCrear, AbrirFormCrear);
            AsignarClickRecursivo(btnListar, AbrirFormListar);
            AsignarClickRecursivo(btnBuscar, AbrirFormBuscar);
            AsignarClickRecursivo(btnActualizar, AbrirFormActualizar);

            panelTarjetas.Controls.AddRange(new Control[] { lblSeccion, lblSeccionSub, btnCrear, btnActualizar, btnListar, btnBuscar });
            panelContenido.Controls.Add(panelTarjetas);

            panelPrincipal.Controls.AddRange(new Control[] { panelHero, panelContenido });

            this.Controls.Add(panelPrincipal);
            this.Controls.Add(menuStrip);
            this.MainMenuStrip = menuStrip;
        }

        private Panel CrearBotonModerno(string titulo, string descripcion, Point ubicacion, Color color)
        {
            var panel = new Panel
            {
                Location = ubicacion,
                Size = new Size(260, 100),
                BackColor = Color.White,
                Cursor = Cursors.Hand,
                Tag = titulo
            };

            // Borde y hover effect
            panel.Paint += (s, e) => {
                e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                e.Graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

                // Borde con color del botón
                using (Pen pen = new Pen(Color.FromArgb(50, color), 2))
                {
                    e.Graphics.DrawRectangle(pen, 0, 0, panel.Width - 1, panel.Height - 1);
                }
            };

            // Color indicator (barra lateral)
            var colorBar = new Panel
            {
                Location = new Point(0, 0),
                Size = new Size(5, 100),
                BackColor = color
            };

            // Título del botón
            var lblTitulo = new Label
            {
                Text = titulo,
                Font = new Font("Segoe UI", 12, FontStyle.Bold, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(31, 41, 55),
                AutoSize = true,
                Location = new Point(20, 25),
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false,
                Cursor = Cursors.Hand
            };

            // Descripción
            var lblDesc = new Label
            {
                Text = descripcion,
                Font = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point),
                ForeColor = Color.FromArgb(107, 114, 128),
                AutoSize = false,
                Size = new Size(230, 35),
                Location = new Point(20, 50),
                BackColor = Color.Transparent,
                UseCompatibleTextRendering = false,
                Cursor = Cursors.Hand
            };

            panel.Controls.AddRange(new Control[] { colorBar, lblTitulo, lblDesc });

            // Hover effect
            panel.MouseEnter += (s, e) => {
                panel.BackColor = Color.FromArgb(249, 250, 251);
            };
            panel.MouseLeave += (s, e) => {
                panel.BackColor = Color.White;
            };

            // Hover effect
            lblTitulo.MouseEnter += (s, e) => panel.BackColor = Color.FromArgb(249, 250, 251);
            lblTitulo.MouseLeave += (s, e) => panel.BackColor = Color.White;
            lblDesc.MouseEnter += (s, e) => panel.BackColor = Color.FromArgb(249, 250, 251);
            lblDesc.MouseLeave += (s, e) => panel.BackColor = Color.White;

            return panel;
        }

        private void AsignarClickRecursivo(Control control, EventHandler handler)
        {
            control.Click += handler;
            foreach (Control child in control.Controls)
            {
                AsignarClickRecursivo(child, handler);
            }
        }

        private Button CrearBoton(string texto, Point ubicacion, Color color)
        {
            var btn = new Button
            {
                Text = texto,
                Size = new Size(440, 60),
                Location = ubicacion,
                BackColor = color,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 12, FontStyle.Bold, GraphicsUnit.Point),
                Cursor = Cursors.Hand,
                TextAlign = ContentAlignment.MiddleCenter,
                UseCompatibleTextRendering = false,
                UseMnemonic = false
            };
            btn.FlatAppearance.BorderSize = 0;
            btn.FlatAppearance.MouseOverBackColor = ControlPaint.Light(color, 0.1f);

            // Mejorar renderizado del botón
            btn.Paint += (s, e) => {
                e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                e.Graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
            };

            return btn;
        }

        private void AbrirFormCrear(object? sender, EventArgs e)
        {
            var formCrear = new CrearCarroForm();
            formCrear.ShowDialog();
        }

        private void AbrirFormListar(object? sender, EventArgs e)
        {
            var formListar = new ListarCarrosForm();
            formListar.ShowDialog();
        }

        private void AbrirFormBuscar(object? sender, EventArgs e)
        {
            var formBuscar = new BuscarCarroForm();
            formBuscar.ShowDialog();
        }

        private void AbrirFormActualizar(object? sender, EventArgs e)
        {
            var formActualizar = new ActualizarCarroForm();
            formActualizar.ShowDialog();
        }

        private void AbrirFormEliminar(object? sender, EventArgs e)
        {
            var formEliminar = new EliminarCarroForm();
            formEliminar.ShowDialog();
        }

        // Métodos para abrir formularios de Mantenimiento
        private void AbrirFormCrearMantenimiento(object? sender, EventArgs e)
        {
            var formCrear = new CrearMantenimientoForm();
            formCrear.ShowDialog();
        }

        private void AbrirFormListarMantenimientos(object? sender, EventArgs e)
        {
            var formListar = new ListarMantenimientosForm();
            formListar.ShowDialog();
        }

        private void AbrirFormActualizarMantenimiento(object? sender, EventArgs e)
        {
            var formActualizar = new ActualizarMantenimientoForm();
            formActualizar.ShowDialog();
        }

        private void AbrirFormEliminarMantenimiento(object? sender, EventArgs e)
        {
            var formEliminar = new EliminarMantenimientoForm();
            formEliminar.ShowDialog();
        }

        private void MostrarAcercaDe(object? sender, EventArgs e)
        {
            MessageBox.Show(
                "AutoConcesionario v2.0.1\n" +
                "Sistema Integral de Gestión de Automóviles\n\n" +
                "Desarrollado por:\n" +
                "- Juan David Reyes\n" +
                "- Julio David Suarez\n" +
                "- Sebastian Felipe Solano\n\n" +
                "Universidad de Ibagué\n" +
                "Facultad de Ingeniería\n" +
                "Desarrollo de Aplicaciones Empresariales",
                "Acerca de...",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }
    }
}
