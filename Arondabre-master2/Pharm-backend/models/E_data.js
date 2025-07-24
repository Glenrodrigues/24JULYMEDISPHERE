const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const E_dataSchema = new Schema(
  {
      Year: {
        type: String,
        required: true,
      },
      Gender: {
        type: String,
        required: true,
      },
      Adhar_Number: {
        type: String,
        required:'please enter adhar number',

      },
      Country:{
        type:String,
        required:true,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("E_data", E_dataSchema);
