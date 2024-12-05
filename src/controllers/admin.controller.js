import {Quiz} from '../models/quiz.model.js'

const createQuiz = async (req,res)=>{
  try {
    const userId = req.user.id
    const {title,description,category,questions,totalMarks,passingMarks,difficultyLevel,createdBy}= req.body;
    const quiz = new Quiz({
      title,
      description,
      category,
      questions,
      totalMarks,
      passingMarks,
      difficultyLevel,
      createdBy:userId,
    })
    await quiz.save();
    res.status(201).json({message:"Quiz created successfully",quiz})
  } catch (error) {
    res.status(500).json({message:"Failed to create quiz",error:error.message})
  }
}

const getAllQuizzes = async(req,res)=>{
  try{
    const quzzies = await Quiz.find().populate('createdBy','username email')
    res.status(200).json(quzzies)
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:'Failed to fetch quizzes',error:error.message})
  }
}

const getQuizById = async (req,res)=>{
  try{
    const {id} = req.params;
    const quiz = await Quiz.findById(id).populate('createdBy','username email')
    if(!quiz){
      return res.status(404).json({message:'Quiz not found'})
    }
    res.status(200).json(quiz)
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:'Failed to fetch quiz',error:error.message})
  }
}

const updateQuiz = async (req,res)=>{
  try {
    const {id} = req.params;
    const {title,description,category} = req.body
    const updatedQuiz = await Quiz.findByIdAndUpdate(id,{title,description,category},{new:true})
    if(!updateQuiz){
      return res.status(404).json({message:'Quiz not found'})
    }
    res.status(200).json({message:'Quiz updated successfully'})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Failed to update quiz',error:error.message})
  }
}

const deleteQuiz = async(req,res)=>{
  try{
    const { id } = req.params
    const deletedQuiz = await Quiz.findByIdAndDelete(id)
    if(!deletedQuiz){
      return res.status(404).json({message:'Quiz not found'})
    }
    res.status(200).json({message:'Quiz deleted successfully',deletedQuiz})
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:'Failed to delete quiz',error:error.message})
  }
}

export {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
}