import mongoose,{Schema} from "mongoose";
const leaderboardSchema = new Schema(
  {
    quizId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Quiz',
      required:true,
    },
    ranking:[
      {
        userId:{
          type:Schema.Types.ObjectId,
          ref:'User'
        },
        score:{
          type:Number,
          required:true,
        },
        dateAchieved:{
          type:Date,
          default:Date.now,
        }
      }
    ]
  },
  {timestamps:true}
)

export const Leaderboard = mongoose.model('Leaderboard',leaderboardSchema)