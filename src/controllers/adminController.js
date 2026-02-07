import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";




export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();


    res.render("admin/dashboard", {
      users,
      isAdmin: req.user.role === "admin",
      isDemoAdmin: req.user.role === "demoAdmin",
    });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard")
  }
};



export const updateUserRole = async (req, res) => {
  if (req.user.role === "admin") {
    return res.redirect("/admin/dashboard");
  }

  await User.findByIdAndUpdate(req.params.id, {
    role: req.body.role,
  });

  await AuditLog.create({
  action: "ROLE_UPDATED",
  performedBy: req.user._id,
  emailAttempted: email,
  targetUser: req.params.id,
  ipAddress: req.ip,
});

  res.redirect("/admin/dashboard");
};



export const deleteUser = async (req, res) => {
  if (req.user.role === "demoAdmin") {
    return res.redirect("/admin/dashboard");
  }

  await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");

      await AuditLog.create({
        action: "USER_DELETED",
        performedBy: req.user._id,
        targetUser: req.params.id,
        ipAddress: req.ip,
      });
};

export const viewAuditLogs = async (req, res) =>{
  const logs = await AuditLog.find()
    .populate("performedBy", "name email")
    .populate("targetUser", "name email")
    .sort({ createdAt: -1 })
    .lean();
  res.render("admin/audit-logs", { logs });
};
 