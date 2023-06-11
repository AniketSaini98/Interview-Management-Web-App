//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const enrollmentSchema = new mongoose.Schema(
	{
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
		batch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Batch",
		},
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

//Export the Model
module.exports = Enrollment;