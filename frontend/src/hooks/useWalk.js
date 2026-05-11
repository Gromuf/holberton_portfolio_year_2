import { useState, useEffect, useCallback } from "react";
import api from "../api/client";

export function useWalk(activePet) {
  const [isWalking, setIsWalking] = useState(activePet?.isWalking || false);
  const [friendInWalk, setFriendInWalk] = useState(null);

  // On initialise l'état avec ce qui est stocké dans le navigateur (si présent)
  const [dismissedFriendId, setDismissedFriendId] = useState(() => {
    const saved = sessionStorage.getItem("dismissedWalkNotif");
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    if (activePet) {
      setIsWalking(activePet.isWalking);
    }
  }, [activePet]);

  const checkFriends = useCallback(async () => {
    if (!activePet) return;

    try {
      const res = await api.get(`/walks/check-friends/${activePet.id}`);

      if (res.data && res.data.length > 0) {
        const foundFriend = res.data[0];

        // On n'affiche la notif que si l'ID n'est pas celui stocké en session
        if (foundFriend.id !== dismissedFriendId) {
          setFriendInWalk(foundFriend);
        } else {
          setFriendInWalk(null);
        }
      } else {
        setFriendInWalk(null);
        // Si plus personne n'est dehors, on nettoie pour permettre une future notif
        if (dismissedFriendId) {
          setDismissedFriendId(null);
          sessionStorage.removeItem("dismissedWalkNotif");
        }
      }
    } catch (err) {
      console.error("Erreur check balade amis", err);
    }
  }, [activePet, dismissedFriendId]);

  useEffect(() => {
    checkFriends();
    const interval = setInterval(checkFriends, 5000);
    return () => clearInterval(interval);
  }, [checkFriends]);

  const toggleWalk = async (petId, status) => {
    try {
      await api.post(`/walks/${petId}/${status ? "start" : "stop"}`);
      if (activePet && petId === activePet.id) {
        setIsWalking(status);
      }
    } catch (err) {
      console.error("Erreur action balade", err);
    }
  };

  const muteFriend = async (friendId) => {
    if (!activePet) return;
    try {
      await api.post(`/walks/${activePet.id}/mute/${friendId}`);
      dismissNotification(friendId);
    } catch (err) {
      console.error("Erreur mute ami", err);
    }
  };

  // On sauvegarde l'ID dans le sessionStorage pour qu'il survive au changement de page
  const dismissNotification = (friendId) => {
    const numericId = Number(friendId);
    setDismissedFriendId(numericId);
    setFriendInWalk(null);
    sessionStorage.setItem("dismissedWalkNotif", numericId);
  };

  return {
    isWalking,
    friendInWalk,
    toggleWalk,
    muteFriend,
    dismissNotification,
  };
}
