import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'lapsed', 'cancelled'],
    default: 'inactive'
  },
  selectedCharityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity'
  },
  charityPercentage: {
    type: Number,
    min: 10,
    max: 100,
    default: 10
  },
  scores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
