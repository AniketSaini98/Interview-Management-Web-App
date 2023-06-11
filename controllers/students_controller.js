//Require the Student Model
const Student = require("../models/student");
//Require the Course Model
const Course = require("../models/course");
//Require the Batch Model
const Batch = require("../models/batch");
//Require the Enrollment Model
const Enrollment = require("../models/enrollment");
//Require the Interview Model
const Interview = require("../models/interview");
//Require the Score Model
const Score = require("../models/score");
//Require the Result Model
const Result = require("../models/result");
//Require the Company Model
const Company = require("../models/company");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Path Finder Middleware
const { pathFinder } = require("../config/middleware");
//Require Mongoose Library
const mongoose = require("mongoose");

//Adds a new Student to the Database
module.exports.add = async (req, res) => {
	let DSA;
	let REACT;
	let WEB;

	//If there are no courses in the DB then create them
	try {
		let course = await Course.find({});
		if (course.length === 0) {
			DSA = await Course.create({ name: "data structures & algorithms" });
			WEB = await Course.create({ name: "web development" });
			REACT = await Course.create({ name: "react" });
		}
	} catch (error) {
		console.log(error);
	}

	try {
		let {
			name,
			age,
			gender,
			college,
			batch,
			dsa_score,
			react_score,
			web_score,
		} = req.body;

		//Create a new Student
		let student = await Student.create({
			name,
			age: Number(age),
			gender,
			college,
			avatar:
				gender === "male"
					? pathFinder("images/male-avatar.png")
					: pathFinder("images/female-avatar.png"),
			interviews: [],
			scores: [],
			results: [],
		});

		//Find the batch, if it doesn't exist, then create it
		let BATCH = await Batch.findOne({ name: batch });
		if (!BATCH) BATCH = await Batch.create({ name: batch });
		//Add the student to the batch
		BATCH.students.push(student);
		await BATCH.save();

		let obj = {};

		if (!!(DSA && WEB && REACT)) {
			let COURSES = [DSA, WEB, REACT];
			for (let COURSE of COURSES) {
				let SCORE = 0;
				if (COURSE.name === "data structures & algorithms") {
					SCORE = Number(dsa_score);
					obj.dsa = SCORE;
				} else if (COURSE.name === "web development") {
					SCORE = Number(web_score);
					obj.webd = SCORE;
				} else if (COURSE.name === "react") {
					SCORE = Number(react_score);
					obj.react = SCORE;
				}
				//Create student's score for the course
				let score = await Score.create({
					score: SCORE,
					student: student._id,
					course: COURSE._id,
				});
				//Add the score to the course
				COURSE.scores.push(score);
				await COURSE.save();
				//Add the score to the student
				student.scores.push(score);
				await student.save();
				//Find the enrollment for the batch and course, if it doesn't exist, then create it
				let enrollment = await Enrollment.findOne({
					batch: BATCH._id,
					course: COURSE._id,
				});
				if (!enrollment) {
					//Create the enrollment for the batch and course
					enrollment = await Enrollment.create({
						batch: BATCH._id,
						course: COURSE._id,
					});
					//Add the enrollment to the batch
					BATCH.enrollments.push(enrollment);
					await BATCH.save();
					//Add the enrollment to the course
					COURSE.enrollments.push(enrollment);
					await COURSE.save();
					//Update the enrollment with the batch and course
					enrollment.batch.students = BATCH.students;
					enrollment.course.scores = COURSE.scores;
					await enrollment.save();
				} else {
					//Update the enrollment with the batch and course
					enrollment.batch.students = BATCH.students;
					enrollment.course.scores = COURSE.scores;
					await enrollment.save();
					//Update the Batch with the enrollment
					await Batch.findOneAndUpdate(
						{ "enrollments._id": enrollment._id },
						{
							$set: {
								"enrollments.$.batch": enrollment.batch,
								"enrollments.$.course": enrollment.course,
							},
						}
					);
					//Update the Course with the enrollment
					await Course.findOneAndUpdate(
						{ "enrollments._id": enrollment._id },
						{
							$set: {
								"enrollments.$.batch": enrollment.batch,
								"enrollments.$.course": enrollment.course,
							},
						}
					);
				}
			}
		} else {
			let courses = await Course.find({});
			for (let course of courses) {
				let SCORE = 0;
				//Create student's score for the courses
				if (course.name === "data structures & algorithms") {
					SCORE = Number(dsa_score);
					obj.dsa = SCORE;
				} else if (course.name === "web development") {
					SCORE = Number(web_score);
					obj.webd = SCORE;
				} else if (course.name === "react") {
					SCORE = Number(react_score);
					obj.react = SCORE;
				}
				//Create student's score
				let score = await Score.create({
					score: SCORE,
					student: student._id,
					course: course._id,
				});
				//Add the score to the course
				course.scores.push(score);
				await course.save();
				//Add the score to the student
				student.scores.push(score);
				await student.save();
				//Find the enrollment for the batch and course, if it doesn't exist, then create it
				let enrollment = await Enrollment.findOne({
					batch: BATCH._id,
					course: course._id,
				});
				if (!enrollment) {
					//Create the enrollment for the batch and course
					enrollment = await Enrollment.create({
						batch: BATCH._id,
						course: course._id,
					});
					//Add the enrollment to the batch
					BATCH.enrollments.push(enrollment);
					await BATCH.save();
					//Add the enrollment to the course
					course.enrollments.push(enrollment);
					await course.save();
					//Update the enrollment with the batch and course
					enrollment.batch.students = BATCH.students;
					enrollment.course.scores = course.scores;
					await enrollment.save();
				} else {
					//Update the enrollment with the batch and course
					enrollment.batch.students = BATCH.students;
					enrollment.course.scores = course.scores;
					await enrollment.save();
					//Update the Batch with the enrollment
					await Batch.findOneAndUpdate(
						{ "enrollments._id": enrollment._id },
						{
							$set: {
								"enrollments.$.batch": enrollment.batch,
								"enrollments.$.course": enrollment.course,
							},
						}
					);
					//Update the Course with the enrollment
					await Course.findOneAndUpdate(
						{ "enrollments._id": enrollment._id },
						{
							$set: {
								"enrollments.$.batch": enrollment.batch,
								"enrollments.$.course": enrollment.course,
							},
						}
					);
				}
			}
		}

		//Add the batch to the student's batch
		student.batch = BATCH;
		await student.save();

		//Find the interview for the student
		let interviews = await Interview.find({ student: student._id });
		if (interviews.length !== 0) {
			for (let interview of interviews) {
				//Add the interview to the student's interviews
				student.interviews.push(interview);
				await student.save();
			}
		}

		//Find the result for the student
		let results = await Result.find({ student: student._id });
		if (results.length !== 0) {
			for (let result of results) {
				//Add the result to the student's results
				student.results.push(result);
				await student.save();
			}
		}

		//Create the student response object
		obj.id = student._id.toString();
		obj.name = student.name;
		obj.age = student.age;
		obj.gender = student.gender;
		obj.college = student.college;
		obj.batch = student.batch.name;
		obj.status = student.status;
		obj.avatar = student.avatar;

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Created Successfully 🎊 🥳",
			student: obj,
		});
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);

		//Send the response
		return res.status(500).json({
			status: "error",
			message: obj.message,
			response: error,
			error: "Internal Server Error",
		});
	}
};


//Deletes the student from the database
module.exports.delete = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		//Find the student
		let student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
				error: "Not Found",
			});
		}

		//Updating the Batch's Students List
		let batchId = student.batch && student.batch._id;
		let batch = null; // Initialize the batch variable

		if (batchId) {
			batch = await Batch.findById(batchId);
			if (batch) {
				batch.students.pull(student);
				await batch.save();
			}
		}

		//Updating Course's Scores & Deleting the Score
		let scores = await Score.find({ student: student._id });
		for (let score of scores) {
			let course = await Course.findById(score.course._id);

			//Updating Course's Scores
			if (course) {
				course.scores.pull(score);
				await course.save();
			}

			//Delete Score
			await Score.deleteOne({ _id: score._id });
			// await score.remove();

			
			//Updating Enrollments List for the above updated Batch and Course
			let enrollment = await Enrollment.findOne({
				batch: batch._id,
				course: course._id,
			});
			
			//If enrollment exists
			if (enrollment) {
				//Update the enrollment with the batch students and course scores
				enrollment.batch.students = batch.students;
				enrollment.course.scores = course.scores;
				await enrollment.save();
				//Updating the Batch with the enrollment's batch & course
				await Batch.findOneAndUpdate(
					{ "enrollments._id": enrollment._id },
					{
						$set: {
							"enrollments.$.batch": enrollment.batch,
							"enrollments.$.course": enrollment.course,
						},
					}
				);
				//Updating the Course with the enrollment's batch & course
				await Course.findOneAndUpdate(
					{ "enrollments._id": enrollment._id },
					{
						$set: {
							"enrollments.$.batch": enrollment.batch,
							"enrollments.$.course": enrollment.course,
						},
					}
				);
			}

		//Delete Batch if it has no Students  
		if (batch && batch.students.length === 0) {
			let enrollments = await Enrollment.find({ batch: batch._id });
			for (let enrollment of enrollments) {
				//Updating the Course by deleting the enrollment
				let course = await Course.findById(enrollment.course._id);
				course.enrollments.pull(enrollment);
				await course.save();
				//Delete Enrollment
				await Enrollment.deleteOne({ _id: enrollment._id });			
			}
			//Delete Batch
			await Batch.deleteOne({ _id: batch._id });
		}		  

		//Delete the Interviews
		let interviews = await Interview.find({ student: student._id });

		//Updating those Companies which have the above Interviews List
		await Company.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);

		// let results = await Result.find({ student: student._id });

		// //Updating those Companies which have the above Results List
		// await Company.updateMany(
		// 	{ results: { $in: results } },
		// 	{ $pull: { results: { $in: results } } }
		// );

		// let interviewIds = [];

		// //Delete the Results
		// for (let result of results) {
		// 	await result.remove();
		// }

		let results = await Result.find({ student: student._id });

		// Updating those Companies which have the above Results List
		await Company.updateMany(
		{ results: { $in: results } },
		{ $pull: { results: { $in: results } } }
		);

		// let interviewIds = [];

		// // Delete the Results
		// for (let result of results) {
		// 	await Result.deleteOne({ _id: result._id }); // Use deleteOne instead of remove
		// }


		// //Delete the Interviews
		// for (let interview of interviews) {
		// 	interviewIds.push(interview.id);
		// 	await interview.remove();
		// }

		let interviewIds = [];

		// Delete the Results
		for (let result of results) {
			await Result.deleteOne({ _id: result._id }); // Use deleteOne instead of remove
		}

		// Delete the Interviews
		for (let interview of interviews) {
			interviewIds.push(interview.id);
			await Interview.deleteOne({ _id: interview._id }); // Use deleteOne instead of remove
		}


		//Deleting the Student
		let studentID = student.id;
		await Student.deleteOne({ _id: studentID });

		// await student.remove();

		//If there are no students in the database
		let students = await Student.find({});
		if (students.length === 0) {
			students = [];

			//Delete the results and interviews collections
			await Interview.deleteMany({});
			await Result.deleteMany({});
			await Company.updateMany(
				{},
				{ $set: { interviews: [], results: [] } }
			);
		}

		let companies = await Company.find({}).populate("interviews");
		if (companies.length === 0) companies = [];

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Deleted Successfully 🎊 🥳",
			students: students,
			companies: companies,
			interviewIDs: interviewIds,
			studentID: studentID,
		});
	}
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);

		//Send the response
		return res.status(500).json({
			status: "error",
			message: obj.message,
			response: error,
			error: "Internal Server Error",
		});
	}
};