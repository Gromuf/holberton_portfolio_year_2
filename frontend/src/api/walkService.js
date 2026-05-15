import api from "./client";

export const walkService = {
  // Créer une balade avec les amis sélectionnés
  createWalk: async (organizerId, invitedIds) => {
    // Axios envoie invitedIds dans le body (JSON), et organizerId dans l'URL (?organizerId=...)
    const response = await api.post("/walks/create", invitedIds, {
      params: { organizerId },
    });
    return response.data;
  },

  // Récupérer la balade en cours (si elle existe)
  getActiveWalk: async (petId) => {
    const response = await api.get(`/walks/pet/${petId}/active`);
    // Si le backend renvoie 204 No Content, on retourne null
    return response.status === 204 ? null : response.data;
  },

  // Récupérer les invitations en attente
  getPendingInvitations: async (petId) => {
    const response = await api.get(`/walks/pet/${petId}/invitations`);
    return response.data;
  },

  // Récupérer les participants d'une balade précise
  getParticipants: async (walkId) => {
    const response = await api.get(`/walks/${walkId}/participants`);
    return response.data;
  },

  // Répondre à une invitation
  respondToInvitation: async (invitationId, status) => {
    const response = await api.put(`/walks/invitations/${invitationId}`, null, {
      params: { status },
    });
    return response.data;
  },

  // Terminer la balade
  endWalk: async (walkId) => {
    const response = await api.put(`/walks/${walkId}/end`);
    return response.data;
  },

  // Récupérer la liste des amis (pour les inviter)
  getFriends: async (petId) => {
    const response = await api.get(`/pets/${petId}/friends`);
    return response.data;
  },
};
