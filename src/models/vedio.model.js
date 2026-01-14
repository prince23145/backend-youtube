import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema(
  {
    vedioFile: {
      type: String, //cloudnary url
      require: true,
    },
    thumbnail: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    desciption: {
      type: String,
      require: true,
    },
    duration: {
      type: Number, //cloudnary url
      require: true,
    },
    views: {
      type: number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

  },
  { timestamps: true },
);

vedioSchema.plugin(mongooseAggregatePaginate )
export const Vedio = mongoose.model("Vedio", vedioSchema);
 