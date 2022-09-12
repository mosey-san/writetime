import mongoose, { Schema } from 'mongoose';

const app = new Schema({
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
});

const schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  refresh_tokens: {
    type: [String],
    required: true,
  },
  app: {
    type: app,
    required: true,
  },
});

export const User = mongoose.model('User', schema);
