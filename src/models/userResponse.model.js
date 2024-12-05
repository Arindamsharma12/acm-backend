import mongoose,{Schema} from "mongoose";
const userResponseSchema = new Schema(
  {
    userId:{
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true,
    },
    quizId:{
      type:Schema.Types.ObjectId,
      ref:'Quiz',
      required:true,
    },
    responses:[
      {
        questionId:{
          type:Schema.Types.ObjectId,
          ref:'Quiz.questions',
          required:true,
        },
        SelectionOption:{
          type:Schema.Types.ObjectId,
          ref:'Quiz.questions.options',
          required:true,
        },
        isCorrect:{
          type:Boolean,
          required:true,
        }
      }
    ],
    score:{
      type:Number,
      required:true
    },
    attemptedAt:{
      type:Date,
      default:Date.now,
    }
  },
  {timestamps:true}
)

export const UserResponse = mongoose.model('UserResponse',userResponseSchema)