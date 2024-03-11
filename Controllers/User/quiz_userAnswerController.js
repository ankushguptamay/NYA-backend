const db = require('../../Models');
const Quiz_UserAnswer = db.quiz_userAnswer;
const Quiz = db.quiz;
const QuizResult = db.quizResult;
const User = db.user;
const { Op } = require('sequelize');

const checkAnswer = async (answer, userAnswer) => {
    let wrongAnswer = 0, rigthAnswer = 0, attempt = userAnswer.length, skip = 0;
    for (let i = 0; i < answer.length; i++) {
        const quizId = answer[i].id;
        const quizAnswer = answer[i].answer;
        for (let j = 0; j < userAnswer.length; j++) {
            if (quizId === userAnswer[j].quizId) {
                if (!userAnswer[j].answer) {
                    skip = skip + 1;
                } else if (userAnswer[j].answer === quizAnswer) {
                    rigthAnswer = rigthAnswer + 1;
                } else {
                    wrongAnswer = wrongAnswer + 1;
                }
            }
        }
    }
    const response = {
        wrongAnswer: wrongAnswer,
        rigthAnswer: rigthAnswer,
        skip: skip,
        attempt: attempt
    }
    return response;
}

exports.submitQuizAnswer = async (req, res) => {
    try {
        // const answer = [{
        //     quizId:"ndnjnsod",
        //     answer:"a"
        // },{
        //     quizId:"saodao",
        //     answer:"b"
        // },{
        //     quizId:"ndosnodos",
        //     answer:null
        // }];

        let personId;
        if (req.user) {
            personId = req.user.id;
        } else if (req.instructor) {
            personId = req.instructor.id;
        } else if (req.institute) {
            personId = req.institute.id;
        } else {
            return res.status(400).send({
                success: false,
                message: `Attempter is not define!`
            });
        }
        const { answer } = req.body;

        for (let i = 0; i < answer.length; i++) {
            const quiz = await Quiz.findOne({
                where: {
                    id: answer[i].quizId
                }
            });
            if (quiz) {
                const isAttempt = await Quiz_UserAnswer.findOne({
                    where: {
                        personId: personId,
                        quizId: answer[i].quizId
                    }
                });
                if (!isAttempt) {
                    await Quiz_UserAnswer.create({
                        personId: personId,
                        quizId: answer[i].quizId,
                        answer: answer[i].answer
                    });
                }
            }
        }
        res.status(201).send({
            success: true,
            message: `Answer submit successfully!`
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.quizResultForAttempter = async (req, res) => {
    try {
        let personId;
        if (req.user) {
            personId = req.user.id;
        } else if (req.instructor) {
            personId = req.instructor.id;
        } else if (req.institute) {
            personId = req.institute.id;
        } else {
            return res.status(400).send({
                success: false,
                message: `Attempter is not define!`
            });
        }
        // Find Users answer
        const userAnswer = await Quiz_UserAnswer.findAll({
            where: {
                personId: personId
            }
        });
        const answerQuizId = [];
        for (let i = 0; i < userAnswer.length; i++) {
            answerQuizId.push(userAnswer[i].quizId);
        }
        // FindAll Quiz from database
        const quiz = await Quiz.findAll({ where: { id: answerQuizId } });
        if (quiz.length === answerQuizId.length) {
            const response = await checkAnswer(quiz, userAnswer);
            const isResult = await QuizResult.findOne({ where: { personId: personId } });
            if (isResult) {
                await isResult.update({
                    ...isResult,
                    attemptQuiz: response.attempt,
                    skip: response.skip,
                    rigthAnswer: response.rigthAnswer,
                    wrongAnswer: response.wrongAnswer
                });
            } else {
                await QuizResult.create({
                    attemptQuiz: response.attempt,
                    skip: response.skip,
                    rigthAnswer: response.rigthAnswer,
                    wrongAnswer: response.wrongAnswer,
                    personId: personId
                });
            }
        }
        const result = await QuizResult.findOne({ where: { personId: personId } });
        res.status(201).send({
            success: true,
            message: `Result fetched successfully!`,
            data: result
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};