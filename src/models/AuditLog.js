import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: String,
    userAgent: String,
    emailAttempted: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
