const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  clientName: { type: String, required: true },   // nome completo
  phone:      { type: String, required: true },   // era tel
  email:      { type: String, required: true },
  service:      { type: String, required: true },
  professional:{ type: String, required: true },
  date:       { type: Date,   required: true },
  time:       { type: String, required: true },
  notes:      String,

  status: {
    type: String,
    enum: ['agendado','confirmado','finalizado','cancelado'],
    default: 'agendado'
  }
}, { timestamps: true });   // createdAt / updatedAt automáticos

module.exports = mongoose.model('Customer', CustomerSchema);