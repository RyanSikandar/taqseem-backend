const Bookmarks = require("../Models/BookmarksModel");

const getAllBookmarks = async (req, res) => {
    try {
        const { donorId } = req.params;
        const bookmarks = await Bookmarks.find({ donorId });

        res.json({ success: true, bookmarks });
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
}

const removeBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        await Bookmarks.findByIdAndDelete(id);

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
}

const addBookmark = async (req, res) => {
    try {
        const { donorId, driveId } = req.body;
        const bookmark = await Bookmarks.create({ donorId, driveId });

        res.json({ success: true, bookmark });
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
}

module.exports = {
    getAllBookmarks,
    removeBookmark,
    addBookmark
}