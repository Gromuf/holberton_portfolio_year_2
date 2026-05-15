import { useState, useEffect, useCallback } from "react";
import api from "../api/client";

export function useWalk(activePetId = null) {
  const [activeWalk, setActiveWalk] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWalkData = useCallback(async () => {
    if (!activePetId) return;
    try {
      const [walkRes, invitsRes] = await Promise.all([
        api.get(`/walks/pet/${activePetId}/active`),
        api.get(`/walks/pet/${activePetId}/invitations`),
      ]);
      setActiveWalk(walkRes.status === 204 ? null : walkRes.data);
      setInvitations(invitsRes.data);
    } catch (err) {
      console.error("Erreur chargement balades", err);
    }
  }, [activePetId]);

  useEffect(() => {
    fetchWalkData();
    const interval = setInterval(fetchWalkData, 5000);
    return () => clearInterval(interval);
  }, [fetchWalkData]);

  const createWalk = async (organizerId, invitedIds, description) => {
    try {
      await api.post("/walks/create", invitedIds, {
        params: { organizerId, description },
      });
      await fetchWalkData();
    } catch (err) {
      console.error("Erreur création balade", err);
    }
  };

  const respondToInvitation = async (invitationId, status) => {
    try {
      await api.put(`/walks/invitations/${invitationId}`, null, {
        params: { status },
      });
      await fetchWalkData();
    } catch (err) {
      console.error("Erreur réponse invitation", err);
    }
  };

  const endWalk = async (walkId) => {
    try {
      await api.put(`/walks/${walkId}/end`);
      await fetchWalkData();
    } catch (err) {
      console.error("Erreur fin balade", err);
    }
  };

  return {
    activeWalk,
    invitations,
    loading,
    createWalk,
    respondToInvitation,
    endWalk,
  };
}
