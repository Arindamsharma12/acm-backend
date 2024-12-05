import { Quiz } from "../models/quiz.model.js";
import { UserResponse } from "../models/userResponse.model.js";

const submitResponse = async (req,res)=>{
  try{
    const userId = req.user
    const {quizId,responses} = req.body
    const quiz = await Quiz.findById(quizId).populate('questions.options')
    if(!quiz){
      return res.status(404).json({message:'Quiz not found'})
    }

    let score = 0;

    // Calculate score
    responses.forEach((response) => {
      // Find the corresponding question
      const question = quiz.questions.find((q) => q._id.toString() === response.questionId);

      if (question) {
        // Find the selected option
        const selectedOption = question.options.find(
          (option) => option._id.toString() === response.SelectionOption
        );

        // If the selected option is correct, increment the score
        if (selectedOption && selectedOption.isCorrect) {
          score += 1;
        }
      }
    });

    const isPassed = score >= quiz.passingMarks;
    const userResponse = new UserResponse({
      userId,
      quizId,
      responses,
      score,
      isPassed,
    })
    await userResponse.save();
    res.status(201).json({
      message:'Response submitted successfully',
      userResponse,
    })
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:'Failed to submit response',error:error.message})
  }
}

export {
  submitResponse
}