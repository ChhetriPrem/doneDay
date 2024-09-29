const mongoose = require("mongoose");
const { string } = require("zod");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Users = new Schema({
  email: String,
  password: String,
  username: String,
  userId: { type: ObjectId, default: null },
});

const Todos = new Schema({
  title: String,
  description: String,
  done: Boolean,
  userId: { type: ObjectId, default: null },
});

const UserModel = mongoose.model("donedayUsers", Users);
const TodoModel = mongoose.model("donedayTodo", Todos);

module.exports = {
  UserModel,
  TodoModel,
};
