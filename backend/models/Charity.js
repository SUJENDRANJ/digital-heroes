import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Charity name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Charity image is required']
  },
  events: [{
    title: String,
    date: Date,
    description: String,
    location: String
  }]
}, {
  timestamps: true
});

const Charity = mongoose.model('Charity', charitySchema);
export default Charity;
