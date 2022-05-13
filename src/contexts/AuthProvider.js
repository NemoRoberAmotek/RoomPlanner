import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useMessage } from "./MessageProvider";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [userRooms, setUserRooms] = useState([]);
  const [token, setToken] = useState(null);

  const { setMessage } = useMessage();

  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !user) {
      setToken(localToken);
      authUser(localToken);
      fetchRoomsByToken(localToken);
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const fetchRoomsByToken = async (token) => {
    const res = await fetch("http://localhost:5000/api/rooms", {
      headers: {
        "x-auth-token": token,
      },
    });

    const data = await res.json();

    setUserRooms(data);
  };

  const updateRoom = async (roomData) => {
    if (guest) return;

    const res = await fetch(`http://localhost:5000/api/rooms/${roomData._id}`, {
      method: "PUT",
      headers: {
        "Content-type": "Application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ ...roomData, lastSave: Date.now }),
    });

    const data = await res.json();

    if (res.status === 200) {
      setUserRooms((userRooms) =>
        userRooms.map((userRoom) =>
          userRoom._id === data._id ? data : userRoom
        )
      );
      setMessage({
        title: "Room was saved.",
        content: `Your room '${data.name}' was successfully saved.`,
      });
    } else {
      setMessage({
        title: "An error occured.",
        content: `Your room '${data.name}' could not be saved. Please try again later.`,
      });
    }

    return res;
  };

  const registerUser = async (userData) => {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.status === 200) {
      authUser(data.token);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }

    return data;
  };

  const loginUser = async (credentials) => {
    const res = await fetch("http://localhost:5000/api/auth", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.status === 200) {
      authUser(data.token);
      fetchRoomsByToken(data.token);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }

    return data;
  };

  const authUser = async (token) => {
    const res = await fetch("http://localhost:5000/api/auth", {
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await res.json();

    setUser(data);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setGuest(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const loginGuest = () => {
    setGuest(true);
    navigate("/room/demo-room");
  };

  return (
    <AuthContext.Provider
      value={{
        guest,
        token,
        loginGuest,
        user,
        setUser,
        registerUser,
        loginUser,
        logoutUser,
        userRooms,
        setUserRooms,
        updateRoom,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AuthProvider;
