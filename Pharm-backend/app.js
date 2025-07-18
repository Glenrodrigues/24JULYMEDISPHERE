const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv =require('dotenv').config();
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/item");
const userRoutes = require("./routes/user");
const fileupload = require('express-fileupload');
const cors = require('cors');





const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Math.floor(Math.random() * 90000) + 10000 + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  )
    cb(null, true);
  else cb(null, false);
};

const app = express();

app.use(cors());

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

//set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", upload.array("avatar", 10), authRoutes);
app.use("/seller", upload.single("avatar"), itemRoutes);
app.use(bodyParser.json({ limit: "80mb" }))
app.use(bodyParser.urlencoded({ limit: "80mb", extended: true, parameterLimit: 50000 }))
//app.use(fileupload({useTempFiles: true}))
app.use(userRoutes);

//error middleware
app.use((error, req, res, next) => {
  console.log(error + "------------$$--------------");
  const statusCode = error.statusCode || 500;
  const message = error.message;
  let errorsPresent;
  if (error.errors) {
    errorsPresent = error.errors;
  }

  res.status(statusCode).json({
    message: message,
    errors: errorsPresent,
  });
});

const clients = {};
//const dbUrl='mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@pharmacy.0fohegp.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority'
const dbUrl=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jevfdlf.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`
const connectionParams={
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false

}
//mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@foodapp.mjg4p.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority
//const dbUrl="mongodb+srv://GlenRodrigues:E3IW2WcV2V3x5ybU@foodapp.mjg4p.mongodb.net/foodapp?retryWrites=true&w=majority"
mongoose
  .connect(dbUrl,connectionParams)

  .then((result) => {
    console.log("Connected to db");
    const server = app.listen(process.env.PORT || 3002);
    const io = require("./util/socket").init(server);
    io.on("connection", (socket) => {
      socket.on("add-user", (data) => {
        clients[data.userId] = {
          socket: socket.id,
        };
      });

      //Removing the socket on disconnect
      socket.on("disconnect", () => {
        for (const userId in clients) {
          if (clients[userId].socket === socket.id) {
            delete clients[userId];
            break;
          }
        }
      });
    });
  })
  .catch((err) => console.log(err));

exports.clients = clients;
