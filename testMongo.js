const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Testing Mongo...");

    await mongoose.connect("mongodb://muskangupta11b_db_user:jrdey@ac-a6uvdur-shard-00-00.mosa02h.mongodb.net:27017,ac-a6uvdur-shard-00-01.mosa02h.mongodb.net:27017,ac-a6uvdur-shard-00-02.mosa02h.mongodb.net:27017/codeRunner?ssl=true&replicaSet=atlas-25guz4-shard-0&authSource=admin&appName=Cluster0", {
      serverSelectionTimeoutMS: 5000
    });

    console.log("Connected ✅");
  } catch (err) {
    console.log("Error ❌");
    console.log(err);
  }
}

test();