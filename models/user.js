const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collection("users")
            .insertOne(this)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => console.log(err));
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: new ObjectId(id) })
            .then((result) => {
                return result;
            })
            .catch((err) => console.log(err));
    }
}

module.exports = User;
