import mongoose,{Schema} from "mongoose";

const adminSettingSchema = new Schema(
  {
    maxAttemptsPreQuiz:{
      type:Number,
      default:3,
    },
    defaultPassingMarks:{
      type:Number,
      default:50,
    },
    quizCategories:[
      {
        type:Schema.Types.ObjectId,
        ref:'Category'
      }
    ]
  },
  {timestamps:true}
)

export const AdminSetting = mongoose.model('AdminSetting',adminSettingSchema)