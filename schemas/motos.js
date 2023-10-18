import z from 'zod'

const motoSchema = z.object({
  img: z
    .string({
      required_error: 'Image is required',
      invalid_type_error: 'Image must be a valid url',
    })
    .url({
      message: 'Image must be a valid url',
    }),
  model: z
    .string({
      required_error: 'Model is required',
      invalid_type_error: 'Model must be a valid model',
    })
    .min(3)
    .max(30),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a valid description',
    })
    .min(10)
    .max(100),
  city: z.array(
    z.enum([
      'Bogotá',
      'Medellín',
      'Cali',
      'Barranquilla',
      'Cartagena',
      'Cúcuta',
      'Pereira',
      'Tunja',
      'Villavicencio',
      'Girardot',
      'Santander',
    ]),
    {
      required_error: 'City is required',
      invalid_type_error: 'City must be a valid city',
    },
  ),
  brand: z.array(z.enum(['Kawasaki', 'Yamaha', 'Honda', 'Suzuki', 'BMW', 'Ducati', 'KTM']), {
    required_error: 'Brand is required',
    invalid_type_error: 'Brand must be a valid brand',
  }),
  price: z.number().min(1000).max(12000),
  new: z.boolean(),
  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a valid year',
    })
    .min(2007)
    .max(2024),
  color: z.array(z.enum(['green', 'black', 'gray', 'white', 'red', 'blue', 'yellow', 'orange', 'purple']), {
    required_error: 'Color is required',
    invalid_type_error: 'Color must be a valid color',
  }),
  velMax: z
    .number({
      required_error: 'VelMax is required',
      invalid_type_error: 'VelMax must be a valid velMax',
    })
    .min(100)
    .max(350),
})

export function validateMoto(input) {
  return motoSchema.safeParse(input)
}

export function validatePartialMoto(input) {
  return motoSchema.partial().safeParse(input)
}
