const getClientName = () => {
  const path = window.location.pathname.split('/');
  let clientName = path[1]; // "/clientName/..."
  if (!clientName || clientName.trim() === '') {
    clientName = 'meeting-room-booking'; // Default client name if not found in URL
  }
  return clientName;
};

export default getClientName;
