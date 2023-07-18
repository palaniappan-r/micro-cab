import mongoose from 'mongoose';
import { ITrip } from './trip.interface';

export const TripSchema = new mongoose.Schema<ITrip>(
  {
    tripId:{
        type: String
    },
    customer: {
      type: Object
    },
    driver: {
        type: Object
    },
    startPt: {
        type: Object
    },
    endPt:{
        type: Object
    },
    distance:{
        type: Number
    },
    price:{
        type:Number
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    },
    openStatus:{
        type: Boolean
    },
    endStatus:{
        type: Boolean
    }
  })



