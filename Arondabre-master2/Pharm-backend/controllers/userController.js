const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

const Seller = require("../models/seller");
const Item = require("../models/item");
const User = require("../models/user");
const Account = require("../models/account");
const Order = require("../models/order");
const io = require("../util/socket");
const app = require("../app");
const Doctor = require("../models/doctor");

exports.getPharmacys = (req, res, next) => {
  Seller.find()
    .populate("account", "isVerified")
    .sort({ createdAt: -1 })
    .then((sellers) => {
      const sellersFinal = sellers.filter((Pharmacy) => {
        return Pharmacy.account.isVerified === true;
      });
      res.status(200).json({
        Pharmacys: sellersFinal,
        totalItems: sellersFinal.length,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

// exports.getPharmacys = (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = 6;
//   let totalItems;
//   Seller.find()
//     .countDocuments()
//     .then((totalCount) => {
//       totalItems = totalCount;

//       return Seller.find().sort({ createdAt: -1 });
//       // .skip((currentPage - 1) * perPage)
//       // .limit(perPage);
//     })
//     .then((sellers) => {
//       res.status(200).json({
//         restaurants: sellers,
//         totalItems: totalItems,
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };

exports.postCart = (req, res, next) => {
  const itemId = req.body.itemId;
  let targetItem;
  if (!itemId) {
    const error = new Error("ItemId not provided");
    error.statusCode = 404;
    throw error;
  }
  Item.findById(itemId)
    .then((item) => {
      targetItem = item;
      return Account.findById(req.loggedInUserId);
    })
    .then((account) => {
      return User.findOne({ account: account._id });
    })
    .then((user) => {
      return user.addToCart(targetItem);
    })
    .then((result) => {
      res.status(200).json({ message: "Item successfully added to cart." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  Account.findById(req.loggedInUserId)
    .then((account) => {
      return User.findOne({ account: account._id });
    })
    .then((user) => {
      return user.populate("cart.items.itemId").execPopulate();
    })
    .then((user) => {
      const cartItems = user.cart.items;
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice = totalPrice + item.quantity * item.itemId.price;
      });
      res.json({ cart: cartItems, totalPrice: totalPrice });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.postCartDelete = (req, res, next) => {
  const itemId = req.body.itemId;
  if (!itemId) {
    const error = new Error("ItemId not provided");
    error.statusCode = 404;
    throw error;
  }
  Account.findById(req.loggedInUserId)
    .then((account) => {
      return User.findOne({ account: account._id });
    })
    .then((user) => {
      return user.removeFromCart(itemId);
    })
    .then((result) => {
      res.status(200).json({ message: "Item successfully removed from cart." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.postCartRemove = (req, res, next) => {
  const itemId = req.params.itemId;
  if (!itemId) {
    const error = new Error("ItemId not provided");
    error.statusCode = 404;
    throw error;
  }
  Account.findById(req.loggedInUserId)
    .then((account) => {
      return User.findOne({ account: account._id });
    })
    .then((user) => {
      return user.reduceQuantity(itemId);
    })
    .then((result) => {
      res.status(200).json({ message: "Item successfully updated." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getPharmacy = (req, res, next) => {
  const restId = req.params.restId;
  Seller.findById(restId)
    .populate("items")
    // .then((seller) => {
    //   return Item.find({ _id: { $in: seller.items } });
    // })
    .then((Pharmacy) => {
      res.json({ result: Pharmacy });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.postAddress = (req, res, next) => {
  // const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  //   // Build your resulting errors however you want! String, object, whatever - it works!
  //   return `${param}: ${msg}`;
  // };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const phoneNo = req.body.phoneNo;
  const street = req.body.street;
  const locality = req.body.locality;
  const aptName = req.body.aptName;
  const zip = req.body.zip;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const formattedAddress = req.body.formattedAddress;

  Account.findById(req.loggedInUserId)
    .then((account) => {
      return User.findOne({ account: account._id });
    })
    .then((user) => {
      return User.findByIdAndUpdate(
        { _id: user._id },
        {
          address: {
            street: street,
            locality: locality,
            zip: zip,
            phoneNo: phoneNo,
            aptName: aptName,
            lat: lat,
            lng: lng,
          },
          formattedAddress: formattedAddress,
        },
        { new: true }
      );
    })
    .then((result) => {
      res.json({ item: result });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};


// exports.getLoggedInUser = (req, res, next) => {
//   const authHeader = req.get("Authorization");
//   if (!authHeader) {
//     const error = new Error("Not authenticated");
//     error.statusCode = 401;
//     throw error;
//   }

//   const token = authHeader.split(" ")[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
//   } catch (err) {
//     err.statusCode = 500;
//     throw err;
//   }
//   if (!decodedToken) {
//     const error = new Error("Not authenticated");
//     error.statusCode = 401;
//     throw error;
//   }

//   const accountId = decodedToken.accountId;
//   let accountObj;
//   let sellerObj;

//   Account.findById(accountId)
//     .then((account) => {
//       if (!account) {
//         const error = new Error("Internal server error");
//         error.statusCode = 500;
//         throw error;
//       }
//       accountObj = account;
//       return User.findOne({ account: account._id }).populate({
//         path: "account",
//         select: ["email", "role"],
//       });
//     })
//     .then((user) => {
//       if (user) {
//         return user;
//       } else {
//         return Seller.findOne({ account: accountObj._id })
//           .populate("items")
//           .populate({ path: "account", select: ["email", "role"] })

//           .then((Seller) => {
//             if (Seller) {
//               return Seller;
//             } else{
//               return Doctor.findOne({ account:accountObj._id })
//                 .populate({path: "account",select : ["email","role"]});
//             }
//           });
//       }
//     })
//     .then((result) => {
//       res.json({ result });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };

exports.getLoggedInUser = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
    if (!decodedToken) throw new Error("Not authenticated");

    const account = await Account.findById(decodedToken.accountId);
    if (!account) throw new Error("Account not found");

    let result = null;

    if (account.role === "ROLE_USER") {
      result = await User.findOne({ account: account._id }).populate({
        path: "account",
        select: ["email", "role"],
      });
    } else if (account.role === "ROLE_SELLER") {
      result = await Seller.findOne({ account: account._id })
        .populate("items")
        .populate({ path: "account", select: ["email", "role"] });
    } else if (account.role === "ROLE_DOCTOR") {
      result = await Doctor.findOne({ account: account._id }).populate({
        path: "account",
        select: ["email", "role"],
      });
    }

    if (!result) throw new Error("User profile not found");

    res.status(200).json({ result });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const accountObj = await Account.findById(req.loggedInUserId);
    const userObj = await User.findOne({ account: accountObj._id });
    const result = await userObj.populate("cart.items.itemId").execPopulate();

    const sellers = result.cart.items.reduce((acc, item) => {
      const creatorId = item.itemId.creator;
      if (!acc[creatorId]) {
        acc[creatorId] = [];
      }
      acc[creatorId].push(item);
      return acc;
    }, {});

    const orderPromises = Object.entries(sellers).map(async ([sellerId, cartItems]) => {
      let sellerOrDoctor = await Seller.findById(sellerId);

      // If not found in Seller, check Doctor
      if (!sellerOrDoctor) {
        sellerOrDoctor = await Doctor.findById(sellerId);
      }

      if (!sellerOrDoctor) {
        console.error("No Seller or Doctor found for ID:", sellerId);
        return;
      }

      const items = cartItems.map((i) => ({
        quantity: i.quantity,
        item: { ...i.itemId._doc },
      }));

      const order = new Order({
        user: {
          email: accountObj.email,
          name: result.firstName,
          address: result.address,
          userId: result,
        },
        items,
        status: "Placed",
        seller: {
          name: sellerOrDoctor.name,
          phone: sellerOrDoctor.address.phoneNo,
          sellerId: sellerOrDoctor._id,
        },
      });

      const savedOrder = await order.save();

      for (const clientId of Object.keys(app.clients)) {
        if (clientId.toString() === sellerOrDoctor._id.toString()) {
          io.getIO().sockets.connected[
            app.clients[clientId].socket
          ]?.emit("orders", { action: "create", order: savedOrder });
        }
      }
    });

    await Promise.all(orderPromises);
    await userObj.clearCart();
    res.status(200).json({ result });

  } catch (err) {
    console.error("Order error:", err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


// exports.postOrder = (req, res, next) => {
//   let accountObj;
//   let userObj;
//   Account.findById(req.loggedInUserId)
//     .then((account) => {
//       accountObj = account;
//       return User.findOne({ account: account._id });
//     })
//     .then((user) => {
//       userObj = user;
//       return user.populate("cart.items.itemId").execPopulate();
//     })
//     .then((result) => {
//       const sellers = result.cart.items.reduce((acc, item) => {
//         if (!acc[item.itemId.creator]) {
//           acc[item.itemId.creator] = [];
//         }

//         acc[item.itemId.creator].push(item);
//         return acc;
//       }, {});

//       for (let [seller, cartItem] of Object.entries(sellers)) {
//         Seller.findById(seller).then((seller) => {
//           const items = cartItem.map((i) => {
//             return { quantity: i.quantity, item: { ...i.itemId._doc } };
//           });
//           const order = new Order({
//             user: {
//               email: accountObj.email,
//               name: result.firstName,
//               address: result.address,
//               userId: result,
//             },
//             items: items,
//             status: "Placed",
//             seller: {
//               name: seller.name,
//               phone: seller.address.phoneNo,
//               sellerId: seller,
//             },
//           });

//           order.save();
//           for (const clientId of Object.keys(app.clients)) {
//             // console.log(app.clients[clientId].socket);
//             if (clientId.toString() === seller._id.toString()) {
//               io.getIO().sockets.connected[
//                 app.clients[clientId].socket
//               ].emit("orders", { action: "create", order: order });
//             }
//           }
//         });
//       }
//       return result;
//     })
//     .then((result) => {
//       return userObj.clearCart();
//     })
//     .then((result) => {
//       res.status(200).json({ result });
//     })
//     .catch((err) => {
//       if (!err.statusCode) err.statusCode = 500;
//       next(err);
//     });
// };

exports.getOrders = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const accountId = decodedToken.accountId;

  Account.findById(accountId)
    .then((account) => {
      if (account.role === "ROLE_USER")
        return User.findOne({ account: account._id });
      if (account.role === "ROLE_SELLER")
        return Seller.findOne({ account: account._id });
      if (account.role === "ROLE_DOCTOR") // ade change kele DCOTOR
        return Doctor.findOne({ account: account._id });
    })
    .then((result) => {
      if (result instanceof User)
        return Order.find({ "user.userId": result._id }).sort({
          createdAt: -1,
        });
      if (result instanceof Seller)
        return Order.find({ "seller.sellerId": result._id }).sort({
          createdAt: -1,
        });
      if (result instanceof Doctor) 
        return Order.find({ "seller.sellerId": result._id }).sort({
           createdAt: -1 
        });
        

    })
    .then((orders) => {
      res.status(200).json({ orders });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.postOrderStatus = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const accountId = decodedToken.accountId;

  const orderId = req.params.orderId;
  if (!req.body.status) {
    const error = new Error("Status Not Provided");
    error.statusCode = 404;
    throw error;
  }
  const status = req.body.status;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        const error = new Error(
          "Could not find any Order with the given orderId"
        );
        error.statusCode = 404;
        throw error;
      }

      order.status = status;
      return order.save();
    })
    .then((updatedOrder) => {
      io.getIO().emit("orders", { action: "update", order: updatedOrder });
      res.status(200).json({ updatedOrder });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getConnectedClients = (req, res, next) => {
  res.json({ clients: app.clients });
};

exports.getPharmacyByAddress = (req, res, next) => {
  const lat1 = req.params.lat;
  const lon1 = req.params.lng;

  Seller.find()
    .populate("account", "isVerified")
    .sort({ createdAt: -1 })
    .then((sellers) => {
      const sellersVerified = sellers.filter((Pharmacy) => {
        return Pharmacy.account.isVerified === true;
      });

      const sellersFinal = sellersVerified.reduce((result, seller) => {
        const lat2 = seller.address.lat;
        const lon2 = seller.address.lng;

        const R = 6371; // kms
        const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in km
        console.log(d)
        if (d < 10) result.push(seller);

        return result;
      }, []);

      return sellersFinal;
    })
    .then((results) => {
      res.status(200).json({
        Pharmacys: results,
        totalItems: results.length,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};


// exports.getDoctorList = (req, res, next) => {
  
//   const authHeader = req.get("Authorization");
//   if (!authHeader) {
//     const error = new Error("Not authenticated");
//     error.statusCode = 401;
//     throw error;
//   }

//   const token = authHeader.split(" ")[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
//   } catch (err) {
//     err.statusCode = 500;
//     throw err;
//   }
//   if (!decodedToken) {
//     const error = new Error("Not authenticated");
//     error.statusCode = 401;
//     throw error;
//   }

  
//   const speciality = req.query.speciality;
//   let doctors;
//   if (speciality) {
//     doctors = Doctor.find({ tags: { $regex: speciality, $options: "i" } });

//   } else {
//     doctors = Doctor.find();
//   }

//   doctors
//   .then((doctors) => {
//     res.status(200).json(doctors);
//   })
//   .catch((error) => {
//     res.status(500).json({ message: 'Error fetching doctors', error });
//   })
// };

exports.getDoctorList = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey-foodWebApp");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const speciality = req.query.speciality;
  let doctors;

  if (speciality) {
    doctors = Doctor.find({
      tags: { $regex: speciality, $options: "i" },
    });
  } else {
    doctors = Doctor.find();
  }

  doctors
    .then((doctors) => {
      res.status(200).json(doctors);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching doctors", error });
    });
};
