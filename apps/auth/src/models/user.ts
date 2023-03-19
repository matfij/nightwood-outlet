import { Model, model, Schema } from "mongoose";

// user fields
interface UserAttrs {
  email: string;
  password: string;
}

// user repository (collection)
interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// user instance (document)
interface UserDocument extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
