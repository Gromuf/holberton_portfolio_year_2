import React, { useEffect, useRef } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useMessages } from "../hooks/useMessages";
import Button from "../components/Common/Button";
import styles from "./Messages.module.css";

export default function Messages({logout, onAddPetClick, onAcceptRequest, onRejectRequest, ...socialProps}) {
  const {
    myPets, activePet, setActivePet,
    contacts, selectedContact, setSelectedContact,
    messages, newMessage, setNewMessage, sendMessage
  } = useMessages();

  const scrollRef = useRef(null);

  // Auto-scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MainLayout hideRightSidebar={true}
      logout={logout}
      onAddPetClick={onAddPetClick}
      onAcceptRequest={onAcceptRequest}
      onRejectRequest={onRejectRequest}
      {...socialProps}
    >
      <div className={styles.messagingContainer}>
        
        {/* COLONNE GAUCHE : SÉLECTEUR ET CONTACTS */}
        <div className={styles.sidebar}>
          <div className={styles.petSwitcher}>
            <label>Discuter en tant que :</label>
            <select 
              value={activePet?.id || ""} 
              onChange={(e) => {
                const pet = myPets.find(p => p.id === parseInt(e.target.value));
                setActivePet(pet);
              }}
            >
              {myPets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.contactList}>
            <h3>Amis de {activePet?.name}</h3>
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={`${styles.contactItem} ${selectedContact?.id === contact.id ? styles.activeContact : ""}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <img src={contact.imageUrl || "/default-pet.png"} alt={contact.name} />
                  <span>{contact.name}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyHint}>Aucun ami trouvé pour cet animal.</p>
            )}
          </div>
        </div>

        {/* COLONNE DROITE : FENÊTRE DE CHAT */}
        <div className={styles.chatWindow}>
          {selectedContact ? (
            <>
              <div className={styles.chatHeader}>
                <img src={selectedContact.imageUrl || "/default-pet.png"} alt={selectedContact.name} />
                <h2>{selectedContact.name}</h2>
              </div>

              <div className={styles.messageList} ref={scrollRef}>
                {messages.map((msg) => {
                  const isMine = msg.senderPet.id === activePet.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={`${styles.messageWrapper} ${isMine ? styles.myMsg : styles.theirMsg}`}
                    >
                      <div className={styles.messageBubble}>
                        {msg.content}
                        <span className={styles.timestamp}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form className={styles.inputArea} onSubmit={sendMessage}>
                <input 
                  type="text" 
                  placeholder="Écrivez votre message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" variant="success" disabled={!newMessage.trim()}>
                  Envoyer
                </Button>
              </form>
            </>
          ) : (
            <div className={styles.noChatSelected}>
              <p>Sélectionnez un ami pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}