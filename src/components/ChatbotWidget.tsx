import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, X } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chatbotHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chatbot</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          height: 100vh;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script type="text/javascript" src="https://pub-66ae6320517c49c5ada5ed55c7561fda.r2.dev/prod-widget.js"></script>
      <script type="text/javascript">
        window.onload = function () {
          const ChatEngine = window.ChatEngineSdk.default;
          const AGENT_ID = "dd6b9514-0b43-482a-b1c6-5642f7cb3d87";
          const chat = new ChatEngine({
            agentId: AGENT_ID,
            outboundAgentId: AGENT_ID,
          });

          chat.start();
        };
      </script>
    </body>
    </html>
  `;

  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(chatbotHTML)}`;

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
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {isOpen && (
              <iframe
                src={iframeSrc}
                className="w-full h-full border-0"
                title="Chat Support"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;