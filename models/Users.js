const { Schema, model } = require('mongoose');

// const FriendsSchema = new Schema(
//     {
//         firendId: {
//             type: Schema.Types.ObjectId,
//             default: ()=> new Types.ObjectId()
//         },
//         friendBody: {
//             type: String,
//             required: true,
//             maxlength: 280
//         },
//         username: {
//             type: String,
//             required: true
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now,
//             get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
//         }
//     },
//     {
//         toJSON: {
//             getters: true
//         }
//     }
// );

const UsersSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thoughts'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
);


UsersSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});


const Users = model('Users', UsersSchema);


module.exports = Users;