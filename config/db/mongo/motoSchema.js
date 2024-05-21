import mongoose, { Schema } from 'mongoose'
import { randomUUID } from 'node:crypto'

const motoSchema = new mongoose.Schema(
  {
    id: {
      type: String
    },
    img: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    new: {
      type: Boolean,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    velMax: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Moto', motoSchema)
