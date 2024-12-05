import mongoose,{Schema} from "mongoose";
const quizSchema = new Schema(
  {
    title:{
      type:String,
      required:true,
      trim:true
    },
    description:{
      type:String,
      required:true,
    },
    category:{
      type:String,
      required:true, 
    },
    createdBy:{
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true,
    },
    difficultyLevel:{
      type:String,
      enum:['easy','medium','hard'],
      default:'medium'
    },
    questions:[
      {
        questionText:{
          type:String,
          required:true
        },
        options:[
          {
            optionText:{
              type:String,
              required:true,
            },
            isCorrect:{
              type:Boolean,
              required:true,
            }
          }
        ]
      }
    ],
    timeLimit:{
      type:Number,
      default:0,
    },
    totalMarks:{
      type:Number,
      required:true,
    },
    passingMarks:{
      type:Number,
      required:true,
    },
    attempts:{
      type:Number,
      default:0,
    },
  },
  {timestamps:true}
)

export const Quiz = mongoose.model('Quiz',quizSchema)