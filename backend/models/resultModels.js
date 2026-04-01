import mongoose from "mongoose";

const performanceEnum = ["Excellent", "Good", "Average", "Needs Work"];

const ResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // category
    technology: {
        type: String,
        required: true,
        enum: ["cyber", "network", "programming"]
    },

    // sub-category
    subject: {
        type: String,
        required: true,
        enum: [
            "offensive", "defensive",
            "CCNA1", "CCNA2", "CCNA3",
            "C_programming", "Python", "HTML", "CSS", "JavaScript"
        ]
    },


    totalQuestions: { type: Number, required: true, min: 0 },
    correct: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, min: 0, default: 0 },

    score: { type: Number, min: 0, max: 100, default: 0 },

    performance: {
        type: String,
        enum: performanceEnum,
        default: "Needs Work"
    }

}, { timestamps: true });


////////////////
ResultSchema.pre("save", function () {
    const total = Number(this.totalQuestions) || 0;
    const correct = Number(this.correct) || 0;

    // 1. Calculate score %
    this.score = total ? Math.round((correct / total) * 100) : 0;

    // 2. Determine performance level
    if (this.score >= 85) this.performance = "Excellent";
    else if (this.score >= 65) this.performance = "Good";
    else if (this.score >= 45) this.performance = "Average";
    else this.performance = "Needs Work";

    // 3. Auto calculate wrong answers
    this.wrong = Math.max(0, total - correct);

    // No next() call needed here for synchronous logic
});

const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);

export default Result;