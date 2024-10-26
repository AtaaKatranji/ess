import { Schema, model } from 'mongoose';
const leaveSchema = new Schema({
    employeeId: Schema.Types.ObjectId,
    date: Date,
    type: String, // 'paid', 'unpaid', 'sick', etc.
  });

const Leave = model('Leave', leaveSchema);
export default Leave;