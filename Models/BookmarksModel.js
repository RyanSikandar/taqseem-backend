const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarksSchema = new Schema({
    driveId: {
        type: Schema.Types.ObjectId,
        ref: 'Fundraiser',
        required: [true, 'Drive ID is required']
    },
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Donor ID is required']
    }
});

const Bookmarks = mongoose.model('Bookmarks', bookmarksSchema);

module.exports = Bookmarks;
