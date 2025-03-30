'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { IoClose, IoSend, IoAdd } from 'react-icons/io5';
import { BsCheck, BsCheckAll, BsPaperclip } from 'react-icons/bs';
import styles from './ChatMessage.module.css';

// Types
export type MessageStatus = 'sent' | 'delivered' | 'read';

export type Professional = {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
};

// Types pour les pièces jointes
export type AttachmentType = 'image' | 'file';

export type Attachment = {
  id: string;
  type: AttachmentType;
  name: string;
  size: number;
  url?: string;
  previewUrl?: string;
};

// Messages par défaut pour la démo
const DEFAULT_MESSAGES: { [key: number]: Array<{sender: 'user' | 'pro', content: string, time: string, status?: MessageStatus, attachments?: Attachment[]}> } = {
  1: [ // Jessica Jones
    { sender: 'pro', content: "Bonjour, comment allez-vous aujourd'hui ?", time: "09:45" },
    { sender: 'user', content: "Je me porte bien, merci !", time: "09:46", status: 'read' },
    { sender: 'pro', content: "Avez-vous réussi à suivre le régime que je vous ai recommandé ?", time: "09:47" }
  ],
  2: [ // Beverly Crusher
    { sender: 'pro', content: "Bonjour, comment vous sentez-vous après notre dernière séance ?", time: "10:15" },
    { sender: 'user', content: "J'ai encore quelques douleurs au genou droit", time: "10:17", status: 'read' },
    { sender: 'pro', content: "Je vous conseille de continuer les exercices et d'appliquer de la glace après l'effort", time: "10:18" },
    { sender: 'user', content: "D'accord, je vais faire ça", time: "10:20", status: 'delivered' }
  ],
  3: [ // Rocky Balboa
    { sender: 'pro', content: "Hey champion ! Prêt pour votre séance de demain ?", time: "14:30" },
    { sender: 'user', content: "Toujours prêt !", time: "14:32", status: 'read' },
    { sender: 'pro', content: "C'est l'attitude qu'il faut ! N'oubliez pas de vous hydrater avant de venir", time: "14:33" }
  ],
  4: [ // Tony Stark
    { sender: 'pro', content: "Salut ! J'ai développé un nouveau programme d'entraînement pour vous", time: "16:05" },
    { sender: 'user', content: "Super, j'ai hâte de le découvrir", time: "16:10", status: 'sent' },
    { sender: 'pro', content: "Je vous l'envoie ce soir avec toutes les explications", time: "16:12" }
  ]
};

// Réponses automatiques de style iMessage
const AUTO_RESPONSES = [
  "D'accord, je comprends.",
  "Je note vos observations.",
  "Merci pour ces informations.",
  "Je vous tiens au courant.",
  "Souhaitez-vous prendre rendez-vous ?",
  "N'hésitez pas si vous avez d'autres questions."
];

interface ChatMessageProps {
  professional: Professional;
  onClose: () => void;
}

export default function ChatMessage({ professional, onClose }: ChatMessageProps) {
  // États
  const [messages, setMessages] = useState<Array<{sender: 'user' | 'pro', content: string, time: string, status?: MessageStatus, attachments?: Attachment[]}>>([]); 
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDate] = useState<string>(new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }));
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  
  // Références
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effet pour charger les messages du professionnel
  useEffect(() => {
    if (professional) {
      // Chargement des messages par défaut pour la démo
      const defaultMsgs = DEFAULT_MESSAGES[professional.id] || [];
      setMessages(defaultMsgs);
      
      // Focus sur le champ de saisie
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      }
    }
  }, [professional]);
  
  // Effet pour faire défiler automatiquement vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAttachments]);
  
  // Effet pour simuler la progression des statuts de message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.sender === 'user' && lastMessage.status === 'sent') {
      // Simuler l'accusé de réception après 1 seconde
      const deliveredTimeout = setTimeout(() => {
        setMessages(prev => 
          prev.map((msg, index) => 
            index === messages.length - 1 ? { ...msg, status: 'delivered' as MessageStatus } : msg
          )
        );
        
        // Simuler la lecture après 3 secondes supplémentaires
        const readTimeout = setTimeout(() => {
          setMessages(prev => 
            prev.map((msg, index) => 
              index === messages.length - 1 ? { ...msg, status: 'read' as MessageStatus } : msg
            )
          );
        }, 3000);
        
        return () => clearTimeout(readTimeout);
      }, 1000);
      
      return () => clearTimeout(deliveredTimeout);
    }
  }, [messages]);
  
  // Fonction pour gérer la sélection de fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Traiter chaque fichier sélectionné
    Array.from(files).forEach(file => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const isImage = file.type.startsWith('image/');
      
      // Créer une URL de prévisualisation pour les images
      let previewUrl = undefined;
      if (isImage) {
        previewUrl = URL.createObjectURL(file);
      }
      
      const newAttachment: Attachment = {
        id,
        type: isImage ? 'image' : 'file',
        name: file.name,
        size: file.size,
        previewUrl
      };
      
      setPendingAttachments(prev => [...prev, newAttachment]);
    });
    
    // Réinitialiser l'input de fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Fonction pour supprimer une pièce jointe en attente
  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => {
      const filtered = prev.filter(att => att.id !== id);
      
      // Libérer les URL d'objets créées
      const removedAtt = prev.find(att => att.id === id);
      if (removedAtt && removedAtt.previewUrl) {
        URL.revokeObjectURL(removedAtt.previewUrl);
      }
      
      return filtered;
    });
  };
  
  // Fonction pour formater la taille de fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (newMessage.trim() === '' && pendingAttachments.length === 0) return;
    
    // Obtenir l'heure actuelle
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Ajouter le message de l'utilisateur
    const userMessage = {
      sender: 'user' as const,
      content: newMessage,
      time: timeString,
      status: 'sent' as MessageStatus,
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setPendingAttachments([]);
    
    // Simuler une réponse du professionnel après un délai (style iMessage)
    setIsTyping(true);
    setTimeout(() => {
      // Sélectionner une réponse aléatoire
      const randomResponse = AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)];
      
      const proMessage = {
        sender: 'pro' as const,
        content: randomResponse,
        time: timeString
      };
      
      setMessages(prev => [...prev, proMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500); // Délai aléatoire entre 1.5 et 3 secondes
  };
  
  // Gérer l'envoi du message avec la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Fonction pour afficher l'indicateur de statut du message
  function renderMessageStatus(status?: MessageStatus) {
    if (!status) return null;
    
    switch (status) {
      case 'sent':
        return <span className={styles.messageStatus}><BsCheck size={14} /></span>;
      case 'delivered':
        return <span className={styles.messageStatus}><BsCheckAll size={14} /></span>;
      case 'read':
        return <span className={`${styles.messageStatus} ${styles.read}`}><BsCheckAll size={14} /></span>;
      default:
        return null;
    }
  }
  
  // Rendre les pièces jointes
  function renderAttachments(attachments?: Attachment[]) {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className={styles.attachmentsContainer}>
        {attachments.map(attachment => (
          <div key={attachment.id} className={styles.attachmentItem}>
            {attachment.type === 'image' && attachment.previewUrl ? (
              <div className={styles.imageAttachment}>
                <img 
                  src={attachment.previewUrl} 
                  alt={attachment.name} 
                  className={styles.attachmentImage}
                />
              </div>
            ) : (
              <div className={styles.fileAttachment}>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{attachment.name}</p>
                  <p className={styles.fileSize}>{formatFileSize(attachment.size)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  // Organiser les messages par expéditeur pour faciliter le regroupement
  const groupMessages = () => {
    const result = [];
    let currentGroup = [];
    let currentSender = null;
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      if (message.sender !== currentSender) {
        if (currentGroup.length > 0) {
          result.push({
            sender: currentSender,
            messages: currentGroup
          });
          currentGroup = [];
        }
        
        currentSender = message.sender;
      }
      
      currentGroup.push(message);
      
      // Si c'est le dernier message, ajouter le groupe
      if (i === messages.length - 1) {
        result.push({
          sender: currentSender,
          messages: currentGroup
        });
      }
    }
    
    return result;
  };
  
  const messageGroups = groupMessages();

  return (
    <div className={styles.chatOverlay}>
      <div className={styles.chatContainer}>
        {/* En-tête du chat */}
        <div className={styles.chatHeader}>
          <div className={styles.proInfo}>
            <div className={styles.proAvatar} style={{ backgroundImage: `url(${professional.image})` }}></div>
            <div className={styles.proDetails}>
              <h3>{professional.name}</h3>
              <p>{professional.title}</p>
            </div>
          </div>
          
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        
        {/* Zone des messages */}
        <div className={styles.messagesContainer}>
          {/* Date du jour (style iMessage) */}
          <div className={styles.dateLabel}>
            {currentDate}
          </div>
          
          {/* Messages groupés par expéditeur */}
          {messageGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex} 
              className={`${styles.messageGroup} ${group.sender === 'user' ? styles.userGroup : styles.proGroup}`}
            >
              {group.messages.map((msg, msgIndex) => (
                <div 
                  key={msgIndex} 
                  className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.proMessage}`}
                >
                  <div className={styles.messageContent}>
                    <p>{msg.content}</p>
                    {renderAttachments(msg.attachments)}
                    
                    <div className={styles.messageFooter}>
                      <span className={styles.messageTime}>{msg.time}</span>
                      {msg.sender === 'user' && renderMessageStatus(msg.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {/* Indicateur de saisie */}
          {isTyping && (
            <div className={`${styles.message} ${styles.proMessage}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {/* Élément invisible pour le défilement automatique */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Zone des pièces jointes en attente */}
        {pendingAttachments.length > 0 && (
          <div className={styles.pendingAttachments}>
            {pendingAttachments.map(attachment => (
              <div key={attachment.id} className={styles.pendingAttachmentItem}>
                {attachment.type === 'image' && attachment.previewUrl ? (
                  <div className={styles.pendingImagePreview}>
                    <img 
                      src={attachment.previewUrl} 
                      alt={attachment.name} 
                      className={styles.previewThumbnail}
                    />
                    <button 
                      className={styles.removeAttachmentButton}
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.pendingFilePreview}>
                    <div className={styles.pendingFileInfo}>
                      <p className={styles.pendingFileName}>{attachment.name}</p>
                      <p className={styles.pendingFileSize}>{formatFileSize(attachment.size)}</p>
                    </div>
                    <button 
                      className={styles.removeAttachmentButton}
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Zone de saisie */}
        <div className={styles.inputContainer}>
          <button 
            className={styles.attachButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <BsPaperclip size={20} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className={styles.hiddenFileInput}
            onChange={handleFileSelect}
            multiple
          />
          
          <input
            type="text"
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            className={styles.messageInput}
          />
          
          <button 
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={newMessage.trim() === '' && pendingAttachments.length === 0}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
