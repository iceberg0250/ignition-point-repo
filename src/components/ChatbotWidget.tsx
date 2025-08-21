import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, X } from 'lucide-react';

declare global {
  interface Window {
    ChatEngineSdk?: {
      default: any;
    };
  }
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  const loadChatScript = () => {
    return new Promise((resolve, reject) => {
      if (window.ChatEngineSdk) {
        resolve(window.ChatEngineSdk);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pub-66ae6320517c49c5ada5ed55c7561fda.r2.dev/prod-widget.js';
      script.onload = () => resolve(window.ChatEngineSdk);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const initializeChat = async () => {
    if (!chatContainerRef.current || chatInstanceRef.current) return;

    try {
      setIsLoading(true);
      await loadChatScript();

      if (window.ChatEngineSdk) {
        const ChatEngine = window.ChatEngineSdk.default;
        const AGENT_ID = "dd6b9514-0b43-482a-b1c6-5642f7cb3d87";
        
        // Clear the container first
        chatContainerRef.current.innerHTML = '';
        
        const chat = new ChatEngine({
          agentId: AGENT_ID,
          outboundAgentId: AGENT_ID,
        });

        chatInstanceRef.current = chat;
        chat.start();
      }
    } catch (error) {
      console.error('Failed to load chat widget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (chatInstanceRef.current) {
      try {
        chatInstanceRef.current.destroy?.();
      } catch (error) {
        console.error('Error destroying chat instance:', error);
      }
      chatInstanceRef.current = null;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.innerHTML = '';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-full h-[600px] p-0 gap-0">
          <DialogTitle className="hidden">Chat Support</DialogTitle>
          <DialogDescription className="hidden">
            Chat with our support agent
          </DialogDescription>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Chat Support</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">Loading chat...</div>
              </div>
            ) : (
              <div 
                ref={chatContainerRef} 
                className="h-full w-full"
                style={{ minHeight: '500px' }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;