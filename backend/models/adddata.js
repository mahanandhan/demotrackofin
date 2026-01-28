import mongoose from "mongoose";

const AddDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    count: {
        type: Number,
        required: true
    }
})

const AddData = mongoose.model("AddData", AddDataSchema);

export default AddData;