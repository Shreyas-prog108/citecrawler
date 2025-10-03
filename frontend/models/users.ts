import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  email: String,
  avatarUrl: String,
  bookmarks: {
    type: [{
      id: String,
      title: String,
      link: String,
      source: String,
      keyword: String,
      abstract: String,
      authors: [String],
      publishedDate: String,
    }],
    default: []
  },
}, { timestamps: true, strict: false });

// Delete the cached model to force reload
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
