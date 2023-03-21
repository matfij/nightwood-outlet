import { Document, Model, model, Schema } from "mongoose";
import { PasswordService } from "../services/password-service";

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

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordService.hash(this.password);
    this.password = hashed;
  }
  done();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
