import { test, expect } from '@playwright/test';

// Flujo 1: Home público — listado y filtros
test('Home muestra pistas y filtra correctamente', async ({ page }) => {
  await page.goto('/');

  // Título principal visible
  await expect(page.getByRole('heading', { name: /Pistas de Pádel/i })).toBeVisible();

  // Hay tarjetas de pistas
  const cards = page.locator('a[href*="/pistas/"]');
  await expect(cards.first()).toBeVisible();

  // Filtrar por texto: buscar "Actur"
  await page.getByPlaceholder(/Buscar por nombre/i).fill('Actur');
  await expect(page.getByText(/Actur/)).toBeVisible();

  // Limpiar filtro
  await page.getByPlaceholder(/Buscar por nombre/i).fill('');
});

// Flujo 2: Registro → login → ver mis reservas
test('Usuario puede registrarse e iniciar sesión', async ({ page }) => {
  const email = `testuser_${Date.now()}@example.com`;

  // Ir a registro
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /Crear cuenta/i })).toBeVisible();

  // Rellenar formulario
  await page.getByPlaceholder('Tu nombre').fill('Usuario Test');
  await page.getByPlaceholder('tu@email.com').fill(email);
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('password123');
  await page.getByPlaceholder('Repite la contraseña').fill('password123');
  await page.getByRole('button', { name: /Crear cuenta/i }).click();

  // Debe redirigir a Home y mostrar el nombre en el navbar
  await expect(page).toHaveURL('/');
  await expect(page.getByText('Usuario Test')).toBeVisible();

  // Ir a Mis Reservas
  await page.getByRole('link', { name: /Mis Reservas/i }).click();
  await expect(page).toHaveURL('/mis-reservas');
  await expect(page.getByRole('heading', { name: /Mis Reservas/i })).toBeVisible();
});

// Flujo 3: Login con credenciales incorrectas → error
test('Login muestra error con credenciales incorrectas', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('tu@email.com').fill('noexiste@email.com');
  await page.getByPlaceholder('••••••••').fill('wrongpassword');
  await page.getByRole('button', { name: /Iniciar sesión/i }).click();

  // Debe aparecer mensaje de error
  await expect(page.getByText(/Credenciales incorrectas/i)).toBeVisible();
});

// Flujo 4: Admin login → acceso al dashboard
test('Admin puede acceder al dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('tu@email.com').fill('admin@padelzgz.com');
  await page.getByPlaceholder('••••••••').fill('admin123');
  await page.getByRole('button', { name: /Iniciar sesión/i }).click();

  // Debe aparecer enlace al Dashboard en el navbar
  await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();

  // Navegar al dashboard
  await page.getByRole('link', { name: /Dashboard/i }).click();
  await expect(page).toHaveURL('/admin');

  // Ver título y tarjetas de stats
  await expect(page.getByRole('heading', { name: /Dashboard Administrador/i })).toBeVisible();
  await expect(page.getByText('Reservas activas')).toBeVisible();
  await expect(page.getByText('Usuarios registrados')).toBeVisible();
});

// Flujo 5: Ruta protegida redirige a login sin sesión
test('Ruta protegida redirige a login si no hay sesión', async ({ page }) => {
  // Asegurar que no hay sesión
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('padelzgz_token');
    localStorage.removeItem('padelzgz_user');
  });

  // Intentar acceder a mis-reservas directamente
  await page.goto('/mis-reservas');
  await expect(page).toHaveURL('/login');
});

// Flujo 6: Usuario normal no puede acceder al dashboard de admin
test('Usuario normal es bloqueado del dashboard de admin', async ({ page }) => {
  // Login como usuario normal
  await page.goto('/login');
  await page.getByPlaceholder('tu@email.com').fill('carlos@email.com');
  await page.getByPlaceholder('••••••••').fill('user123');
  await page.getByRole('button', { name: /Iniciar sesión/i }).click();
  await expect(page).toHaveURL('/');

  // Intentar ir a /admin directamente
  await page.goto('/admin');

  // Debe redirigir a home (no tiene rol admin)
  await expect(page).toHaveURL('/');
});

// Flujo 7: Persistencia de sesión al recargar
test('La sesión persiste al recargar la página', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.getByPlaceholder('tu@email.com').fill('carlos@email.com');
  await page.getByPlaceholder('••••••••').fill('user123');
  await page.getByRole('button', { name: /Iniciar sesión/i }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByText('Carlos Martínez')).toBeVisible();

  // Recargar
  await page.reload();

  // Sigue logueado
  await expect(page.getByText('Carlos Martínez')).toBeVisible();
  await expect(page.getByRole('link', { name: /Mis Reservas/i })).toBeVisible();
});
