import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interfaces/user";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
userSchema.methods.isValidPassword = async function(this: IUser, password: string): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(password, user.password);
}

userSchema.pre<IUser>("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model("User", userSchema)