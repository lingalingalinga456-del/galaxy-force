// components/design-system/components/FloatingAIAssistant.tsx
'use client';
import { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Galaxy AI. How can I help you find trusted workers today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: input }] })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <div className="w-14 h-14 rounded-full bg-warm-red flex items-center justify-center shadow-xl animate-pulse" onClick={() => setOpen(!open)}>
        <Sparkles className="w-7 h-7 text-white" />
      </div>
      
      {open && (
        <div className="w-96 h-[480px] bg-white rounded-card shadow-card flex flex-col border border-warm-border">
          <div className="flex items-center justify-between p-4 border-b border-warm-border bg-warm-beige rounded-t-card">
            <h3 className="font-semibold text-warm-ink">Galaxy AI Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                'max-w-[85%] px-4 py-2 rounded-lg',
                msg.role === 'user' ? 'bg-warm-red text-white ml-auto' : 'bg-warm-beige text-warm-ink'
              )}>
                {msg.content}
              </div>
            ))}
          </div>
          
          <form onSubmit={sendMessage} className="p-4 border-t border-warm-border flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="default">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}