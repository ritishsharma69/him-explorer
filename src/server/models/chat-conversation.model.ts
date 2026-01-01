import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatConversationDocument {
  _id: Types.ObjectId;
  sessionId: string;
  messages: ChatMessage[];
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
  leadCaptured: boolean;
  enquiryId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ChatConversationSchema = new Schema<ChatConversationDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
    userEmail: { type: String, lowercase: true, trim: true },
    userName: { type: String, trim: true },
    userPhone: { type: String, trim: true },
    metadata: {
      userAgent: { type: String },
      ipAddress: { type: String },
      referrer: { type: String },
    },
    leadCaptured: { type: Boolean, default: false },
    enquiryId: { type: Schema.Types.ObjectId, ref: "Enquiry" },
  },
  {
    timestamps: true,
  },
);

export const ChatConversationModel: Model<ChatConversationDocument> =
  (mongoose.models.ChatConversation as Model<ChatConversationDocument>) ||
  mongoose.model<ChatConversationDocument>(
    "ChatConversation",
    ChatConversationSchema,
  );

