import {
  evaluateInterviewFromAI,
  generateQuestionFromAI,
} from "../services/aiService.js";
import { supabase } from "../config/supabaseClient.js";

export const generateQuestion = async (req, res) => {
  try {
    const {
      role,
      experience,
      skills,
      difficulty,
      level,
      interviewId,
    } = req.body;

    let activeInterviewId = interviewId;
    let interviewRecord = null;

    if (!activeInterviewId) {
      const { data: createdInterview, error: createInterviewError } = await supabase
        .from("interviews")
        .insert([
          {
            user_id: req.user.id,
            role: role || "Python Developer",
            level: level || difficulty || experience || "beginner",
            status: "active",
          },
        ])
        .select("id")
        .single();

      if (createInterviewError) {
        return res.status(500).json({ error: createInterviewError.message });
      }

      activeInterviewId = createdInterview.id;
      interviewRecord = {
        id: activeInterviewId,
        role: role || "Python Developer",
        level: level || difficulty || experience || "beginner",
      };
    } else {
      const { data: existingInterview, error: existingInterviewError } = await supabase
        .from("interviews")
        .select("id, user_id, role, level")
        .eq("id", activeInterviewId)
        .eq("user_id", req.user.id)
        .maybeSingle();

      if (existingInterviewError) {
        return res.status(500).json({ error: existingInterviewError.message });
      }

      if (!existingInterview) {
        return res.status(404).json({ error: "Interview not found" });
      }

      interviewRecord = existingInterview;
    }

    const { data: existingMessages, error: existingMessagesError } = await supabase
      .from("interview_messages")
      .select("role, content, created_at")
      .eq("interview_id", activeInterviewId)
      .order("created_at", { ascending: true });

    if (existingMessagesError) {
      return res.status(500).json({ error: existingMessagesError.message });
    }

    const dbHistory = (existingMessages || []).map((item) => ({
      role: item.role,
      content: item.content,
    }));

    const data = await generateQuestionFromAI({
      role: interviewRecord?.role || role || "Python Developer",
      experience: interviewRecord?.level || "beginner",
      skills: ["python"],
      difficulty: interviewRecord?.level || "medium",
      history: dbHistory,
    });

    const questionText = (data.questionText || "").trim();

    if (questionText) {
      const { error: messageInsertError } = await supabase
        .from("interview_messages")
        .insert([
          {
            interview_id: activeInterviewId,
            role: "assistant",
            content: questionText,
          },
        ]);

      if (messageInsertError) {
        return res.status(500).json({ error: messageInsertError.message });
      }
    }

    res.json({
      questionText,
      audioUrl: `http://localhost:8000${data.audioUrl}`,
      interviewId: activeInterviewId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "AI service failed" });
  }
};

export const transcribeAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const requestedInterviewId = req.body?.interviewId;

    if (!requestedInterviewId) {
      return res.status(400).json({
        error: "interviewId is required",
      });
    }

    const { data: requestedInterview, error: requestedInterviewError } = await supabase
      .from("interviews")
      .select("id")
      .eq("id", requestedInterviewId)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (requestedInterviewError) {
      return res.status(500).json({ error: requestedInterviewError.message });
    }

    if (!requestedInterview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const resolvedInterviewId = requestedInterviewId;

    const formData = new FormData();
    const mimeType = req.file.mimetype || "audio/webm";
    const fileName = req.file.originalname || "answer.webm";

    formData.append(
      "file",
      new Blob([req.file.buffer], { type: mimeType }),
      fileName
    );

    const whisperResponse = await fetch("http://localhost:8000/speech-to-text", {
      method: "POST",
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      return res.status(502).json({
        error: "Speech-to-text service failed",
        details: errorText,
      });
    }

    const data = await whisperResponse.json();
    const transcribedText = (data.text || "").trim();

    if (transcribedText) {
      const { error: messageInsertError } = await supabase
        .from("interview_messages")
        .insert([
          {
            interview_id: resolvedInterviewId,
            role: "user",
            content: transcribedText,
          },
        ]);

      if (messageInsertError) {
        return res.status(500).json({ error: messageInsertError.message });
      }
    }

    res.json({ text: transcribedText, interviewId: resolvedInterviewId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Transcription failed" });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const { data: interviews, error: interviewError } = await supabase
      .from("interviews")
      .select("id, user_id, role, level, status, created_at, evaluation")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (interviewError) {
      return res.status(500).json({ error: interviewError.message });
    }

    if (!interviews || interviews.length === 0) {
      return res.json({ history: [] });
    }

    const interviewIds = interviews.map((item) => item.id);

    const { data: messages, error: messageError } = await supabase
      .from("interview_messages")
      .select("id, interview_id, role, content, created_at")
      .in("interview_id", interviewIds)
      .order("created_at", { ascending: true });

    if (messageError) {
      return res.status(500).json({ error: messageError.message });
    }

    const groupedMessages = (messages || []).reduce((acc, message) => {
      const key = message.interview_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});

    const history = interviews.map((interview) => ({
      ...interview,
      messages: groupedMessages[interview.id] || [],
    }));

    res.json({ history });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ error: "interviewId is required" });
    }

    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .select("id, user_id, role, level, status")
      .eq("id", interviewId)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (interviewError) {
      return res.status(500).json({ error: interviewError.message });
    }

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const { data: messages, error: messageError } = await supabase
      .from("interview_messages")
      .select("role, content, created_at")
      .eq("interview_id", interviewId)
      .order("created_at", { ascending: true });

    if (messageError) {
      return res.status(500).json({ error: messageError.message });
    }

    console.log("Interview messages:", messages);
    const conversation = (messages || []).map((item) => ({
      role: item.role,
      content: item.content,
    }));

    if (conversation.length === 0) {
      return res.status(400).json({
        error: "No interview conversation found to evaluate",
      });
    }
    console.log("Evaluating interview with conversation:", conversation);
    const evaluation = await evaluateInterviewFromAI({
      role: interview.role || "Python Developer",
      experience: interview.level || "beginner",
      skills: ["python"],
      history: conversation,
    });

    let parsedEvaluation = evaluation;

    if (typeof parsedEvaluation === "string") {
      try {
        parsedEvaluation = JSON.parse(parsedEvaluation);
      } catch {
        return res.status(502).json({
          error: "Evaluation service returned non-JSON response",
          details: parsedEvaluation,
        });
      }
    }

    if (parsedEvaluation?.error) {
      return res.status(502).json(parsedEvaluation);
    }

    const { error: updateError } = await supabase
      .from("interviews")
      .update({
        evaluation: parsedEvaluation,
        status: "completed",
      })
      .eq("id", interviewId)
      .eq("user_id", req.user.id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({
      message: "Interview evaluation saved successfully",
      interviewId,
      evaluation: parsedEvaluation,
    });
  } catch (err) {
    console.error("evaluateInterview error:", err?.response?.data || err.message);

    if (err?.response) {
      return res.status(502).json({
        error: "Evaluation service failed",
        details: err.response.data || err.message,
      });
    }

    res.status(500).json({ error: "Failed to evaluate interview", details: err.message });
  }
};
