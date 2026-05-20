import axios from "axios";
import { useNavigate } from "react-router-dom";
export const deleteServer = async (serverId) => {
    const navigate = useNavigate();
    if (window.confirm("Are you sure? This will delete all history for this server.")) {
        try {
            await axios.delete(`http://localhost:8081/api/servers/${serverId}`);
            // Refresh your server list or redirect
            Navigate('/');
        } catch (err) {
            alert("Error deleting server");
        }
    }
};