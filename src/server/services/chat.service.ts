import { connectToDatabase } from "@/server/db";
import {
  ChatConversationModel,
  type ChatConversationDocument,
  type ChatMessage,
} from "@/server/models/chat-conversation.model";

export interface CreateConversationInput {
  sessionId: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
}

export interface AddMessageInput {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

export async function getOrCreateConversation(
  input: CreateConversationInput,
): Promise<ChatConversationDocument> {
  await connectToDatabase();

  let conversation = await ChatConversationModel.findOne({
    sessionId: input.sessionId,
  }).exec();

  if (!conversation) {
    conversation = await ChatConversationModel.create({
      sessionId: input.sessionId,
      messages: [],
      metadata: input.metadata,
    });
  }

  return conversation.toObject() as ChatConversationDocument;
}

export async function addMessageToConversation(
  input: AddMessageInput,
): Promise<ChatConversationDocument> {
  await connectToDatabase();

  const message: ChatMessage = {
    role: input.role,
    content: input.content,
    timestamp: new Date(),
  };

  const updated = await ChatConversationModel.findOneAndUpdate(
    { sessionId: input.sessionId },
    {
      $push: { messages: message },
    },
    { new: true },
  ).exec();

  if (!updated) {
    throw new Error("Conversation not found");
  }

  return updated.toObject() as ChatConversationDocument;
}

export async function getConversationBySessionId(
  sessionId: string,
): Promise<ChatConversationDocument | null> {
  await connectToDatabase();

  const conversation = await ChatConversationModel.findOne({
    sessionId,
  }).exec();

  return conversation ? (conversation.toObject() as ChatConversationDocument) : null;
}

export async function listAllConversations(): Promise<
  ChatConversationDocument[]
> {
  await connectToDatabase();

  const conversations = await ChatConversationModel.find()
    .sort({ updatedAt: -1 })
    .lean()
    .exec();

  return conversations as ChatConversationDocument[];
}

export async function updateConversationLeadInfo(
  sessionId: string,
  leadInfo: {
    userEmail?: string;
    userName?: string;
    userPhone?: string;
    enquiryId?: string;
  },
): Promise<ChatConversationDocument> {
  await connectToDatabase();

  const updated = await ChatConversationModel.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        userEmail: leadInfo.userEmail,
        userName: leadInfo.userName,
        userPhone: leadInfo.userPhone,
        enquiryId: leadInfo.enquiryId,
        leadCaptured: true,
      },
    },
    { new: true },
  ).exec();

  if (!updated) {
    throw new Error("Conversation not found");
  }

  return updated.toObject() as ChatConversationDocument;
}

