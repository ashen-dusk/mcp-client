import { useCopilotContext, useCopilotMessagesContext } from "@copilotkit/react-core";
import { Message } from "@copilotkit/shared";
import { useEffect, useRef, useState } from "react";

export const checkMicrophonePermission = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    if (permissionStatus.state === "granted") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const requestMicAndPlaybackPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new window.AudioContext();
    await audioContext.resume();
    return { stream, audioContext };
  } catch (err) {
    return null;
  }
};

const startRecording = async (
  mediaStreamRef: { current: MediaStream | null },
  mediaRecorderRef: { current: MediaRecorder | null },
  audioContextRef: { current: AudioContext | null },
  recordedChunks: Blob[],
  onStop: () => void,
) => {
  if (!mediaStreamRef.current || !audioContextRef.current) {
    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new window.AudioContext();
    await audioContextRef.current.resume();
  }

  mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current!);
  mediaRecorderRef.current.start(1000);
  mediaRecorderRef.current.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  };
  mediaRecorderRef.current.onstop = onStop;
};

const stopRecording = (mediaRecorderRef: { current: MediaRecorder | null }) => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
    mediaRecorderRef.current.stop();
  }
};

const transcribeAudio = async (recordedChunks: Blob[], transcribeAudioUrl: string) => {
  const completeBlob = new Blob(recordedChunks, { type: "audio/mp4" });
  const formData = new FormData();
  formData.append("file", completeBlob, "recording.mp4");

  const response = await fetch(transcribeAudioUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const transcription = await response.json();
  return transcription.text;
};

export type PushToTalkState = "idle" | "recording" | "transcribing";

export type SendFunction = (text: string) => Promise<Message>;

export const usePushToTalk = ({
  sendFunction,
}: {
  sendFunction: SendFunction;
}) => {
  const [pushToTalkState, setPushToTalkState] = useState<PushToTalkState>("idle");
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const generalContext = useCopilotContext();
  const messagesContext = useCopilotMessagesContext();
  const context = { ...generalContext, ...messagesContext };

  useEffect(() => {
    if (pushToTalkState === "recording") {
      startRecording(
        mediaStreamRef,
        mediaRecorderRef,
        audioContextRef,
        recordedChunks.current,
        () => {
          setPushToTalkState("transcribing");
        },
      );
    } else {
      stopRecording(mediaRecorderRef);
      if (pushToTalkState === "transcribing") {
        transcribeAudio(recordedChunks.current, context.copilotApiConfig.transcribeAudioUrl!).then(
          async (transcription) => {
            recordedChunks.current = [];
            setPushToTalkState("idle");
            await sendFunction(transcription);
          },
        );
      }
    }

    return () => {
      stopRecording(mediaRecorderRef);
    };
  }, [pushToTalkState]);

  return { pushToTalkState, setPushToTalkState };
};
