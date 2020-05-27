const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
	googleId: String,
	email: String,
	name: String,
});

mongoose.model("User", userSchema);
