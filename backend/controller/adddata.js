import AddData from "../models/adddata.js";

export const adddata = async (req, res) => {
  try {
    const { title, photo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newData = new AddData({
      title,
      photo,
      count: 0 // backend controls this
    });

    await newData.save();

    res.status(201).json({
      message: "Data added successfully",
      data: newData
    });

  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const incrementCount = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AddData.findByIdAndUpdate(
      id,
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Count incremented",
      data
    });

  } catch (error) {
    console.error("Error incrementing count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const decrementCount = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AddData.findByIdAndUpdate(
      id,
      { $inc: { count: -1 } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Count decremented",
      data
    });

  } catch (error) {
    console.error("Error decrementing count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getData = async (req, res) => {
    try {
        const data = await AddData.find();
        res.status(200).json({ data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteAllData = async (req, res) => {
    try {
      await AddData.deleteMany({});
      res.status(200).json({ message: "All data deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
}