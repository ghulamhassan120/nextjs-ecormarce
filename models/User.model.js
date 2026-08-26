import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", admin],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      uri: {
        type: String,
        trim: true,
      },
      public_id: {
        type: String,
        trim: true,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    deleteAt: {
      type: Boolean,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

// Hash Password
userSchema.pre("save", async (next) => {
  if (!this.isModified.password) return next();
  this.password = await bcrypt.hash(this.password);
  next();
});

// Compare Password 
userSchema.methods={
    comparePassword:async (password)=>{
        return await bcrypt.compare(password,this.password)
    }
}

// export UserModel
const UserModel=mongoose.models.User||mongoose.model("User",userSchema,"users")
export default UserModel