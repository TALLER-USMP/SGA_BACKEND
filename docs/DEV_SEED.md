# Seed de Desarrollo

Este proyecto incluye un seed manual para preparar una base local o de staging con datos mínimos de prueba.

## Uso

Configura primero `DATABASE_URL`, `DATABASE_SSL` y `JWT_SECRET` en `.env` o `local.settings.json`.

```powershell
npm run db:seed:dev
```

El script es idempotente: se puede ejecutar varias veces sin duplicar roles, usuarios demo ni el sílabo base.

## Datos que crea o actualiza

- Roles base:
  - `1`: `docente`
  - `2`: `indeterminado`
  - `3`: `coordinadora_academica`
  - `4`: `director_escuela`

- Usuarios demo:
  - `docente.demo@usmp.edu.pe`
  - `coordinador.demo@usmp.edu.pe`
  - `director.demo@usmp.edu.pe`

- Sílabo demo:
  - Código: `09112108051`
  - Nombre: `Taller de Proyectos`
  - Semestre: `2026-I`

El script también imprime tokens JWT locales de prueba para validar `/api/auth/me`.

## Alcance

Este seed está pensado para desarrollo, QA local o staging controlado. No debe ejecutarse automáticamente en producción.
