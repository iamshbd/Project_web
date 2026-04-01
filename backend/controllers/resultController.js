import Result from "../models/resultModels.js";

export async function createResult(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const { technology, subject, level, totalQuestions, correct } = req.body;

        // 🔥 validation
        if (!technology || !subject || !level) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        if (totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing score data"
            });
        }

        const total = Number(totalQuestions);
        const correctAns = Number(correct);

        if (correctAns > total) {
            return res.status(400).json({
                success: false,
                message: "Correct answers cannot exceed total questions"
            });
        }

        const payload = {
            technology,
            subject,
            level,
            totalQuestions: total,
            correct: correctAns,
            user: req.user.id
        };

        const created = await Result.create(payload);

        return res.status(201).json({
            success: true,
            message: "Result Created",
            result: created
        });

    } catch (err) {
        console.error("CreateResult Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
//list the result   

export async function listResults(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const { technology, subject } = req.query;

        const query = { user: req.user.id };

        if (technology && technology !== "all") {
            query.technology = technology;
        }

        if (subject && subject !== "all") {
            query.subject = subject;
        }

        const items = await Result.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            results: items
        });

    } catch (err) {
        console.error("ListResults Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}