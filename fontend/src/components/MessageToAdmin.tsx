import React, { useState } from 'react';
import { Send, AlertTriangle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MessageToAdminProps {
  userToken?: string;
  onMessageSent?: () => void;
}

const MessageToAdmin: React.FC<MessageToAdminProps> = ({ userToken, onMessageSent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    is_urgent: false
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "❌ Champs requis",
        description: "Veuillez remplir le sujet et le message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/users/messages/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Message envoyé !",
          description: "Votre message a été envoyé aux administrateurs. Vous recevrez une réponse prochainement.",
          duration: 5000,
        });
        
        setFormData({ subject: '', message: '', is_urgent: false });
        setIsOpen(false);
        onMessageSent?.();
      } else {
        toast({
          title: "❌ Erreur",
          description: data.error || "Impossible d'envoyer le message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur de connexion",
        description: "Impossible de contacter le serveur.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contacter l'administration
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Envoyer un message à l'administration
          </DialogTitle>
          <DialogDescription>
            Envoyez un message aux administrateurs. Ils recevront une notification et vous répondront rapidement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Sujet *
            </label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Objet de votre message"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.subject.length}/200
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message *
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Décrivez votre demande ou question..."
              rows={6}
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.message.length}/2000
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={formData.is_urgent}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_urgent: checked as boolean }))
              }
            />
            <label htmlFor="urgent" className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Message urgent
            </label>
          </div>
          
          {formData.is_urgent && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="text-xs text-orange-700">
                  <strong>Message urgent :</strong> Les administrateurs recevront une notification prioritaire. 
                  Utilisez cette option uniquement pour les demandes nécessitant une réponse rapide.
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.subject.trim() || !formData.message.trim()}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageToAdmin;
