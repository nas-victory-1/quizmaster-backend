import mongoose from 'mongoose';

// interface UserInterface {
//     id: string,
//     name: string,
//     email: string,
//     isAdmin: string,
//     score: number,// leaderboard score
//     joinedAt: Date
// }

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},
    {timestamps: true}
)

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;