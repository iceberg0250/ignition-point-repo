import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [chatEngine, setChatEngine] = useState<any>(null);

  useEffect(() => {
    // Load the ChatEngine script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://pub-66ae6320517c49c5ada5ed55c7561fda.r2.dev/prod-widget.js';
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.ChatEngineSdk && isOpen && !chatEngine) {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        const ChatEngine = window.ChatEngineSdk.default;
        const AGENT_ID = "dd6b9514-0b43-482a-b1c6-5642f7cb3d87";
        
        const chat = new ChatEngine({
          agentId: AGENT_ID,
          outboundAgentId: AGENT_ID,
          container: chatContainer, // Try to contain it in the specific container
        });

        setChatEngine(chat);
        chat.start();
      }
    }
  }, [isScriptLoaded, isOpen, chatEngine]);

  const handleClose = () => {
    setIsOpen(false);
    if (chatEngine) {
      // Clean up the chat instance if needed
      setChatEngine(null);
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
            <div id="chat-container" className="h-full w-full absolute inset-0">
              {isOpen && isScriptLoaded && (
                <div className="h-full w-full" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;