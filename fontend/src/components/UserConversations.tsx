import React, { useState, useEffect } from 'react';
import { MessageCircle, Reply, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
//import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  subject: string;
  message: string;
  admin_response?: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  created_at: string;
  responded_at?: string;
  admin_name?: string;
}

interface UserConversationsProps {
  userToken?: string;
  refreshTrigger?: number;
}

const UserConversations: React.FC<UserConversationsProps> = ({ userToken, refreshTrigger }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userToken) {
      fetchMessages();
    }
  }, [userToken, refreshTrigger]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/messages/', {
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.results || data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "❌ Message requis",
        description: "Veuillez saisir votre réponse.",
        variant: "destructive",
      });
      return;
    }

    setSendingReply(true);
    try {
      const response = await fetch(`http://localhost:8000/api/users/messages/${messageId}/reply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({ message: replyText }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Réponse envoyée !",
          description: "Votre réponse a été envoyée aux administrateurs.",
        });
        
        setReplyText('');
        setReplyingTo(null);
        fetchMessages();
      } else {
        toast({
          title: "❌ Erreur",
          description: data.error || "Impossible d'envoyer la réponse.",
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
      setSendingReply(false);
    }
  };

  const getStatusIcon = (status: string, isUrgent: boolean) => {
    if (isUrgent) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    switch (status) {
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string, isUrgent: boolean) => {
    if (isUrgent) return 'bg-red-100 text-red-800';
    switch (status) {
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
              <p>Chargement des messages...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Mes conversations ({messages.length})
        </h3>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune conversation
            </h3>
            <p className="text-gray-500">
              Vous n'avez pas encore de messages avec l'administration.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {getStatusIcon(message.status, message.is_urgent)}
                      {message.subject}
                      {message.is_urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(message.status, message.is_urgent)}>
                        {message.status_display}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Message original */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Votre message:
                  </div>
                  <p className="text-sm text-blue-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                {/* Réponse admin */}
                {message.admin_response && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Réponse de l'administration:
                      {message.admin_name && (
                        <span className="font-normal">({message.admin_name})</span>
                      )}
                    </div>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                      {message.admin_response}
                    </p>
                    {message.responded_at && (
                      <div className="text-xs text-green-600 mt-2">
                        Répondu le {formatDate(message.responded_at)}
                      </div>
                    )}
                  </div>
                )}

                {/* Zone de réponse */}
                {message.status === 'responded' && (
                  <div className="border-t pt-4">
                    {replyingTo === message.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tapez votre réponse..."
                          rows={4}
                          maxLength={2000}
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {replyText.length}/2000
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                            >
                              Annuler
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReply(message.id)}
                              disabled={sendingReply || !replyText.trim()}
                            >
                              {sendingReply ? (
                                <>
                                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border border-white border-t-transparent" />
                                  Envoi...
                                </>
                              ) : (
                                <>
                                  <Send className="h-3 w-3 mr-1" />
                                  Envoyer
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(message.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Répondre
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserConversations;
