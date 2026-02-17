import React, { useState, useRef, useEffect } from 'react';
import { Message, ClinicalProfile } from '../types';
import { generateTherapistResponse, updateProfileFromSession, generateSOAPNote } from '../services/ai';
import { saveClinicalNote } from '../app/actions';

interface ChatInterfaceProps {
  messages: Message[];
  profile: ClinicalProfile;
  onSendMessage: (msg: Message) => Promise<void> | void;
  onUpdateProfile: (profile: ClinicalProfile) => Promise<void> | void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, profile, onSendMessage, onUpdateProfile }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleEndSession = async () => {
    if (!confirm("End session and generate clinical notes?")) return;
    
    setIsProcessing(true);
    try {
        // 1. Generate SOAP Note
        const note = await generateSOAPNote(messages);
        if (note) {
            await saveClinicalNote(note); // Save to DB
            alert("Session ended. Clinical note generated successfully.");
        }
        
        // 2. Update Profile
        const updatedProfile = await updateProfileFromSession(profile, messages);
        await onUpdateProfile(updatedProfile);
        
    } catch (e) {
        console.error(e);
        alert("Error ending session.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setInput('');
    setIsTyping(true);
    
    // Save User Message
    await onSendMessage(userMsg);

    try {
      const responseText = await generateTherapistResponse(messages.concat(userMsg), input, profile);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      
      // Save AI Message
      await onSendMessage(aiMsg);
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden relative">
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center flex-col">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 font-medium">Analyzing session & updating clinical records...</p>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fas fa-robot"></i>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Serenity AI</h3>
            <p className="text-xs text-slate-400">In Session • {profile.name}</p>
          </div>
        </div>
        <button 
            onClick={handleEndSession}
            className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm px-3 py-1 rounded hover:bg-red-500/10" 
            title="End Session & Generate Notes"
        >
          <i className="fas fa-file-medical"></i> End Session
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-100 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[10px] opacity-50 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl p-4 rounded-bl-none flex gap-2 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};