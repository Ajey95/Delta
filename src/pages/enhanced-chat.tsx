import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, SmilePlus, Search, MoreVertical, Phone, Video, Pin, Users, Star, Clock, Check, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
      if (data.length > 0) {
        setActiveChat(data[0].id);
      }
    } catch (err) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      chatId: activeChat,
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const renderMessage = (msg) => (
    <div key={msg.id} className={`flex ${msg.sender.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end max-w-md gap-2">
        {!msg.sender.isCurrentUser && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={msg.sender.avatar} />
            <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className={`rounded-lg p-3 ${
          msg.sender.isCurrentUser ? 'bg-purple-600 text-white' : 'bg-gray-100'
        }`}>
          <div className="font-semibold text-sm">{msg.sender.name}</div>
          <div className="break-words">{msg.text}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            {msg.sender.isCurrentUser && (
              <span className="text-xs">
                {msg.status === 'read' ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-screen flex">
      {/* Rest of the JSX remains the same, but using the state variables */}
      {/* Chat list section */}
      <div className="w-1/4 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 p-2 rounded-lg border bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats
            .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((chat) => (
              <div
                key={chat.id}
                className={`p-4 hover:bg-purple-50 cursor-pointer border-b ${
                  activeChat === chat.id ? 'bg-purple-50' : ''
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {chat.name}
                      {chat.type === 'group' && (
                        <Users className="h-4 w-4 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {chat.lastMessageTime}
                    {chat.unreadCount > 0 && (
                      <Badge className="ml-2 bg-purple-600">{chat.unreadCount}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {chat.members.slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="w-6 h-6">
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {chat.members.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{chat.members.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat content section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="font-bold">{chats.find(c => c.id === activeChat)?.name}</h2>
              <Badge variant="outline">
                {chats.find(c => c.id === activeChat)?.members.length} members
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SmilePlus className="h-4 w-4" />
            </Button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg border"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button 
              size="icon" 
              onClick={sendMessage} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;