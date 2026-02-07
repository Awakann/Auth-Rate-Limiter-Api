
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuditLog from "../models/AuditLog.js";



export const getProtectedData = (req, res) => {
    res.json({
        message: "Protected content.",
        user: req.user,
    });
};



export const registerUser = async (req, res) => {
    try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.render("register", { error: "All fields are required"});
    }


    const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render("register", { error: "Email already exists"});
        }

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt);

   let role = "user";
   if (email === process.env.ADMIN_EMAIL) role = "admin";
   if (email === process.env.DEMO_ADMIN_EMAIL) role = "demoAdmin";

     const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    res.render("login", { 
        success: role === "demoAdmin" 
        ? "Demo Admin account created successfully (read-only-access)"
        : "Registration successful. Please login.",
    });

       await AuditLog.create({
        action: "USER_REGISTERED",
        performedBy: req.user?._id || newUser._id,
        targetUser: newUser._id,
        emailAttempted: email,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
    })

} catch (err) {
    res.render("register", { error: err.message })
}

};




export const loginUser = async (req, res) => {
    try {

    const { email, password } = req.body;

    if (!email, !password) {
        return res.render("login", { error: "All filed are required"})
    }

    const user = await User.findOne({ email }).select("+password");

        if(!user) {
            await AuditLog.create({
                action: "LOGIN_FAILED",
                emailAttempted: email,
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
            });

            return res.render("login", {error: "Inavlid email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            await AuditLog.create({
                action: "LOGIN_FAILED",
                emailAttempted: email,
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
            });

            return res.render("login", { error: "Invalid email or password"});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d"}
        );

        res.cookie('token', token, {
            htttpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        await AuditLog.create({
            action: "LOGIN_SUCCESS",
            performedBy: user._id,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });

        if (user.role === "admin" || user.role === "demoAdmin") {
            return res.redirect("/admin/dashboard");
        } else {
            return res.redirect("/dashboard");
        }

            
    } catch (error) {
        res.render("login", { error: "login Failed." + error.message });
    }

};


export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login")
};

    
