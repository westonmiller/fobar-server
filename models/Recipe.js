import mongoose from 'mongoose';

const Schema = mongoose.Schema

const recipeSchema = new Schema({
  name: String,
  directions: String,
  description: String,
  image: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;