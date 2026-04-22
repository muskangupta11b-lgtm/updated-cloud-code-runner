const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Testing Mongo...");

    await mongoose.connect("mongodb+srv://muskangupta11b_db_user:jrdey@cluster0.mosa02h.mongodb.net/codeRunner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
    });

    console.log("Connected ✅");
  } catch (err) {
    console.log("Error ❌");
    console.log(err);
  }
}

test();