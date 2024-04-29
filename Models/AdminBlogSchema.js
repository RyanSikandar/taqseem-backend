const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminBlogSchema = new Schema({
    driveId: {
        type: Schema.Types.ObjectId,
        ref: 'Fundraiser',
        required: [true, 'Drive ID is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String
    }
});

const AdminBlog = mongoose.model('AdminBlog', adminBlogSchema);

module.exports = AdminBlog;
