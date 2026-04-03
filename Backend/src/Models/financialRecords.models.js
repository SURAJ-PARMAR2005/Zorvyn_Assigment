const mongoose = require("mongoose");


const financialRecordsSchema = new mongoose.Schema({
    user :{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    amount : {
        type : Number,
        required : true,
        min : [0,"Amount must be a positive number"],
    },
    type : {
        type : String,
        enum : ["income", "expense"],
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
    }
    ,
   notes : {
    type : String,
    maxlength : [500,"notes cannot exceed 500 characters"]
   },
   isDeleted: {
    type : Boolean,
    default : false,
    select : false,
   }

},
{
    timestamps : true,
}
)

//indexing use krr leta hu 
financialRecordsSchema.index({ user: 1, date: -1 });
financialRecordsSchema.index({ user: 1, type: 1 });
financialRecordsSchema.index({ user: 1, category: 1 });

// financialRecordsSchema.pre(/^find/, function (next) {
//   this.where({ isDeleted: false });
//   next();
// });


const financialRecordModel = mongoose.model("Record",financialRecordsSchema);

module.exports = financialRecordModel;