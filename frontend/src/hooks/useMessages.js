import { useState, useEffect } from "react";
import api from "../api/client";

export function useMessages() {
  const [myPets, setMyPets] = useState([]);
  const [activePet, setActivePet] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        const res = await api.get("/pets");
        setMyPets(res.data);
        if (res.data.length > 0) setActivePet(res.data[0]);
      } catch (err) {
        console.error("Erreur chargement mes animaux", err);
      }
    };
    fetchMyPets();
  }, []);

  useEffect(() => {
    if (activePet) {
      const fetchContacts = async () => {
        try {
          const res = await api.get(`/friendships/pet/${activePet.id}/friends`);
          setContacts(res.data);
          setSelectedContact(null);
          setMessages([]);
        } catch (err) {
          console.error("Erreur chargement contacts", err);
        }
      };
      fetchContacts();
    }
  }, [activePet]);

  useEffect(() => {
    if (activePet && selectedContact) {
      const fetchHistory = async () => {
        try {
          const res = await api.get("/messages/history", {
            params: { pet1Id: activePet.id, pet2Id: selectedContact.id },
          });
          setMessages(res.data);
          // Dès qu'on charge l'historique, on marque comme lu
          markAsRead(selectedContact.id);
        } catch (err) {
          console.error("Erreur historique", err);
        }
      };
      fetchHistory();
    }
  }, [activePet, selectedContact]);

  const markAsRead = async (senderId) => {
    if (!activePet || !senderId) return;
    try {
      await api.put(
        `/messages/read?senderId=${senderId}&receiverId=${activePet.id}`,
      );

      // On prévient le MainLayout qu'il doit revérifier les notifs
      window.dispatchEvent(new Event("messagesMarkedAsRead"));
    } catch (err) {
      console.error("Erreur marquage lecture", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePet || !selectedContact) return;

    try {
      const messageData = {
        content: newMessage,
        senderPet: { id: parseInt(activePet.id) },
        receiverPet: { id: parseInt(selectedContact.id) },
        sentAt: new Date().toISOString(),
        isRead: false,
      };

      const res = await api.post("/messages/send", messageData);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(
        "Erreur envoi détaillée :",
        err.response?.data || err.message,
      );
    }
  };

  return {
    myPets,
    activePet,
    setActivePet,
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
  };
}
