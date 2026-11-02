import { MercadoPagoConfig, Preference } from 'mercadopago'

export default async function handler(req, res) {
  // Solo se permiten peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // Configuración con el Access Token real entregado por el cliente
  const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-4531200994384887-060423-2dbd3ad5ea58fd64eccf6817b75a7838-1677555801',
  })

  try {
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: req.body.items,
        payer: req.body.payer,
        back_urls: req.body.back_urls,
        auto_return: 'approved',
      },
    })

    // Retorna el link oficial de pago generado por Mercado Pago
    return res.status(200).json({ id: response.id, init_point: response.init_point })
  } catch (error) {
    console.error('Error al procesar con Mercado Pago:', error)
    return res.status(500).json({ error: error.message || 'Error al crear la preferencia de pago' })
  }
}