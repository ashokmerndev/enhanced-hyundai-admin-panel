import { useState, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  File,
  X,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'other';
  url: string;
  size: string;
}

interface MessageWithAttachment {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  attachments?: Attachment[];
}

export default function Support() {
  const { chats } = useAdmin();
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [localMessages, setLocalMessages] = useState<MessageWithAttachment[]>([]);
  const [showChatList, setShowChatList] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredChats = chats.filter((chat) =>
    chat.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getFileType = (file: File): 'image' | 'document' | 'audio' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, acceptType?: string) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max file size is 10MB.`);
        return;
      }

      const attachment: Attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file),
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
      };
      newAttachments.push(attachment);
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    toast.success(`${newAttachments.length} file(s) attached`);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;

    const newMessage: MessageWithAttachment = {
      id: Date.now().toString(),
      sender: 'admin',
      text: message,
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setAttachments([]);
    toast.success('Message sent');
  };

  const getAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const allMessages: MessageWithAttachment[] = [
    ...(selectedChat?.messages || []).map((m) => ({ ...m, attachments: undefined })),
    ...localMessages.filter((m) => selectedChat?.id === chats[0]?.id),
  ];

  const handleSelectChat = (chat: typeof selectedChat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Customer Support</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">Manage customer conversations and inquiries</p>
      </div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)]">
          <CardContent className="p-0 h-full">
            <div className="flex h-full">
              {/* Chat List - Hidden on mobile when chat is selected */}
              <div className={cn(
                "w-full md:w-1/3 border-r border-border flex flex-col",
                !showChatList && "hidden md:flex"
              )}>
                <div className="p-3 sm:p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={cn(
                        'p-3 sm:p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-smooth',
                        selectedChat?.id === chat.id && 'bg-muted'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            {chat.customerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">{chat.customerName}</p>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs ml-2 shrink-0">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                            <Badge
                              variant={chat.status === 'open' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {chat.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat Messages - Full width on mobile when chat is selected */}
              <div className={cn(
                "flex-1 flex flex-col",
                showChatList && "hidden md:flex"
              )}>
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 sm:p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="md:hidden h-8 w-8 shrink-0"
                          onClick={handleBackToList}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            {selectedChat.customerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">{selectedChat.customerName}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {selectedChat.status === 'open' ? 'Active now' : 'Conversation closed'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3 sm:p-4">
                      <div className="space-y-3 sm:space-y-4">
                        {allMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'flex',
                              msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[85%] sm:max-w-[70%] rounded-lg p-2.5 sm:p-3',
                                msg.sender === 'admin'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              )}
                            >
                              {msg.text && <p className="text-sm">{msg.text}</p>}
                              
                              {/* Attachments Display */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {msg.attachments.map((attachment) => (
                                    <div key={attachment.id}>
                                      {attachment.type === 'image' ? (
                                        <div className="relative group">
                                          <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="max-w-full rounded-lg max-h-40 sm:max-h-48 object-cover"
                                          />
                                          <a
                                            href={attachment.url}
                                            download={attachment.name}
                                            className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Download className="h-3 w-3" />
                                          </a>
                                        </div>
                                      ) : attachment.type === 'audio' ? (
                                        <div className="bg-background/20 rounded-lg p-2">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Music className="h-4 w-4" />
                                            <span className="text-xs truncate">{attachment.name}</span>
                                          </div>
                                          <audio controls className="w-full h-8">
                                            <source src={attachment.url} />
                                          </audio>
                                        </div>
                                      ) : (
                                        <a
                                          href={attachment.url}
                                          download={attachment.name}
                                          className={cn(
                                            'flex items-center gap-2 p-2 rounded-lg',
                                            msg.sender === 'admin'
                                              ? 'bg-primary-foreground/20 hover:bg-primary-foreground/30'
                                              : 'bg-background/50 hover:bg-background/70'
                                          )}
                                        >
                                          {getAttachmentIcon(attachment.type)}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{attachment.name}</p>
                                            <p className="text-xs opacity-70">{attachment.size}</p>
                                          </div>
                                          <Download className="h-3 w-3 shrink-0" />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <p
                                className={cn(
                                  'text-xs mt-1',
                                  msg.sender === 'admin'
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Attachment Preview */}
                    {attachments.length > 0 && (
                      <div className="px-3 sm:px-4 py-2 border-t border-border bg-muted/30">
                        <div className="flex flex-wrap gap-2">
                          {attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="relative group flex items-center gap-2 bg-background rounded-lg p-2 pr-8"
                            >
                              {attachment.type === 'image' ? (
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex items-center justify-center">
                                  {getAttachmentIcon(attachment.type)}
                                </div>
                              )}
                              <div className="max-w-[80px] sm:max-w-[100px]">
                                <p className="text-xs font-medium truncate">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">{attachment.size}</p>
                              </div>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="absolute top-1 right-1 p-1 hover:bg-destructive/20 rounded-full transition-colors"
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message Input */}
                    <div className="p-3 sm:p-4 border-t border-border">
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = 'image/*';
                                  fileInputRef.current.click();
                                }
                              }}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Image
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx';
                                  fileInputRef.current.click();
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Document
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = 'audio/*';
                                  fileInputRef.current.click();
                                }
                              }}
                            >
                              <Music className="h-4 w-4 mr-2" />
                              Audio
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = '*';
                                  fileInputRef.current.click();
                                }
                              }}
                            >
                              <File className="h-4 w-4 mr-2" />
                              Any File
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 text-sm"
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          size="icon" 
                          className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                          disabled={!message.trim() && attachments.length === 0}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4">
                      <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}