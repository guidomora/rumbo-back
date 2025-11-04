export const emailTemplate = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperar contraseña</title>
    <style>
      :root {
        color-scheme: light;
      }

      body {
        margin: 0;
        padding: 0;
        background-color: #f6f6f6;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #0099c4;
      }

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f6f6;
        padding: 24px 12px;
      }

      .email-container {
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(17, 17, 17, 0.08);
      }

      .header {
        padding: 32px 24px 16px;
        background: linear-gradient(135deg, #0099c4, #0099c4);
        color: #ffffff;
        text-align: center;
      }

      .brand {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin: 0;
      }

      .hero {
        padding: 24px;
        text-align: left;
      }

      .hero h1 {
        margin: 0 0 12px;
        font-size: 22px;
        line-height: 1.3;
        color: #ffffff;
      }

      .hero p {
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 1.6;
        color: #4f4f4f;
      }

      .cta-button {
        display: inline-block;
        padding: 14px 22px;
        border-radius: 999px;
        background-color: #0099c4;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .cta-button:hover,
      .cta-button:focus {
        background-color: #0099c4;
      }

      .support-box {
        margin-top: 32px;
        padding: 18px 20px;
        background-color: #f0f0f0;
        border-radius: 12px;
        color: #3a3a3a;
      }

      .support-box p {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }

      .footer {
        padding: 24px;
        text-align: center;
        font-size: 12px;
        color: #7a7a7a;
      }

      .footer a {
        color: #7a7a7a;
        text-decoration: underline;
      }

      @media (min-width: 600px) {
        .wrapper {
          padding: 48px 0;
        }

        .email-container {
          max-width: 540px;
        }

        .hero h1 {
          font-size: 26px;
        }

        .hero p {
          font-size: 17px;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" align="center">
      <tr>
        <td>
          <table role="presentation" class="email-container" cellspacing="0" cellpadding="0">
            <tr>
              <td class="header">
                <p class="brand">Rumbo</p>
              </td>
            </tr>
            <tr>
              <td class="hero">
                <h1>¿Necesitás restablecer tu contraseña?</h1>
                <p>
                  Recibimos una solicitud para cambiar la contraseña de tu cuenta. Hacé clic en el
                  botón para continuar con el proceso. Este enlace estará activo durante los
                  próximos 30 minutos.
                </p>
                <p style="text-align: center; margin: 28px 0;">
                  <a href="https://tu-dominio.com/auth/reset-password" class="cta-button" target="_blank" rel="noopener noreferrer">
                    Restablecer contraseña
                  </a>
                </p>
                <p>
                  Si vos no solicitaste este cambio, ignorá este correo. Tu contraseña seguirá
                  siendo la misma hasta que accedas al enlace y completes el formulario.
                </p>
                <div class="support-box">
                  <p>
                    ¿Necesitás ayuda? Escribinos a
                    <a href="mailto:soporte@rumbo.com" style="color: #1c1c1c; font-weight: 600; text-decoration: none;">soporte@rumbo.com</a>
                    y con gusto te asistiremos.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>Este correo se envió automáticamente, por favor no respondas.</p>
                <p>
                  © 2024 Rumbo. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`