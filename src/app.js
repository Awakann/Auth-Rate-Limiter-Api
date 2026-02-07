import express from "express";
import cors from "cors";
import path from "path";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import viewRoutes from './routes/viewRoutes.js'
import adminRoutes from "./routes/adminRoutes.js";;
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        eq: (a, b) => a ===b,
    },
})
);

app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src/views"));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true} ))
app.use(express.static(path.join(process.cwd(), "src/views/public")));
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.user = null;
    if (req.cookies.token) {
        try{
            const jwt = require("jsonwebtoken");
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            res.locals.user = { id: decoded.id, role: decoded.role};
        } catch (err) {
            res.locals.user = null;
        }
    }
    next();
});

app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", viewRoutes);


app.get("/", (req, res) => res.render("home", { title: "Auth Fullstack Demo" }));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'auth-rate-limiter-api',
        uptime: process.uptime()
    })
});


export default app;