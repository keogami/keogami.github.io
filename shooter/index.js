import { Screen } from "./modules/Screen.js";

const $ = document

const screen = new Screen($.querySelector("canvas#main"))
screen.Resize(innerWidth, innerHeight)
screen.SetBackground("black")