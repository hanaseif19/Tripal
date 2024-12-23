const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    mobileNumber: {
      type: String,
      required: false,
      default: "",
    },
    nationality: {
      type: String,
      required: false,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      required: false,
      default: 0,
    },
    languagesSpoken: {
      type: [String],
      required: false,
      default: [],
    },
    education: [
      {
        degree: {
          type: String,
          required: false,
        },
        institution: {
          type: String,
          required: false,
        },
        yearOfCompletion: {
          type: Number,
          required: false,
        },
      },
    ],
    previousWork: [
      {
        companyName: {
          type: String,
          required: false,
        },
        position: {
          type: String,
          required: false,
        },
        location: {
          type: String,
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0.0,
    },
    profilePicture: {
      type: String,
      required: false,
      default: "",
    },

    notificationList:[ {
      message: String,
      read: {type:Boolean , default: false} ,
      createdAt:{type:Date , default: Date.now} 
    }]
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
module.exports = TourGuide;
