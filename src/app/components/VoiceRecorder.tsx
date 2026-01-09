import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, X, AlertCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onClose: () => void;
  primaryColor?: string;
}

export function VoiceRecorder({ onTranscription, onClose, primaryColor = '#3b82f6' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionError, setPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Helper function to convert hex to rgb with opacity
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring
      monitorAudioLevel();

      toast.success('Recording started');
    } catch (error: any) {
      // Handle microphone access errors gracefully with UI instead of console errors
      setPermissionError(true);
      
      // Provide specific error messages based on error type
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Microphone is already in use by another application.');
      } else {
        setErrorMessage('Could not access microphone. Please check your browser settings.');
      }
      
      toast.error('Microphone access failed');
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1
      
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate speech-to-text processing (in production, you'd use a real API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock transcription - in production, send to speech-to-text API
    const mockTranscriptions = [
      "I need help with booking a flight to New York",
      "I want to file an insurance claim for auto damage",
      "Can you help me transfer money to another account?",
      "I'd like to schedule a doctor's appointment",
      "I need information about my hotel reservation",
    ];
    
    const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    setIsProcessing(false);
    onTranscription(transcription);
    toast.success('Voice recorded successfully');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    stopRecording();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8"
          onClick={onClose}
          aria-label="Cancel recording"
        >
          <X className="h-4 w-4" />
        </Button>

        {permissionError ? (
          /* Permission Error Screen */
          <div className="flex flex-col items-center space-y-6">
            {/* Error Icon */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Microphone Access Required
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {errorMessage}
              </p>
            </div>

            {/* Instructions */}
            <div className="w-full rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 flex-shrink-0 text-yellow-700" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">How to enable microphone access:</p>
                  <ol className="mt-2 list-inside list-decimal space-y-1">
                    <li>Click the lock/info icon in your browser's address bar</li>
                    <li>Find "Microphone" in the permissions list</li>
                    <li>Select "Allow" from the dropdown</li>
                    <li>Reload the page and try again</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setPermissionError(false);
                  setErrorMessage('');
                  startRecording();
                }}
                style={{ backgroundColor: primaryColor }}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Recording Screen */
          <div className="flex flex-col items-center space-y-6">
            {/* Header */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {isProcessing ? 'Processing...' : isRecording ? 'Recording' : 'Voice Input'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {isProcessing ? 'Converting speech to text' : 'Speak clearly into your microphone'}
              </p>
            </div>

            {/* Animated Microphone Icon */}
            <div className="relative">
              {/* Pulsing circles */}
              {isRecording && !isProcessing && (
                <>
                  <div 
                    className="absolute inset-0 animate-ping rounded-full"
                    style={{ 
                      backgroundColor: hexToRgba(primaryColor, 0.4),
                      animationDuration: '2s',
                    }}
                  />
                  <div 
                    className="absolute inset-0 animate-pulse rounded-full"
                    style={{ 
                      backgroundColor: hexToRgba(primaryColor, 0.3),
                      animationDuration: '1.5s',
                    }}
                  />
                </>
              )}
              
              {/* Main circle */}
              <div 
                className="relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: hexToRgba(primaryColor, 0.1),
                  transform: `scale(${1 + audioLevel * 0.2})`,
                }}
              >
                {isProcessing ? (
                  <Loader2 className="h-16 w-16 animate-spin" style={{ color: primaryColor }} />
                ) : (
                  <Mic className="h-16 w-16" style={{ color: primaryColor }} />
                )}
              </div>
            </div>

            {/* Audio visualization bars */}
            {isRecording && !isProcessing && (
              <div className="flex items-center justify-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-150"
                    style={{
                      backgroundColor: primaryColor,
                      height: `${16 + Math.random() * audioLevel * 40}px`,
                      opacity: 0.3 + audioLevel * 0.7,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Recording time */}
            {isRecording && !isProcessing && (
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-gray-900">
                  {formatTime(recordingTime)}
                </div>
                <p className="mt-1 text-xs text-gray-500">Recording duration</p>
              </div>
            )}

            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">Transcribing audio...</span>
              </div>
            )}

            {/* Stop button */}
            {isRecording && !isProcessing && (
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={handleStop}
                style={{ backgroundColor: primaryColor }}
              >
                <Square className="h-5 w-5 fill-current" />
                Stop Recording
              </Button>
            )}

            {/* Tip */}
            {isRecording && !isProcessing && (
              <p className="text-center text-xs text-gray-500">
                Maximum recording time: 60 seconds
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}