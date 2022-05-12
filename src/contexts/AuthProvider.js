import { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [userRooms, setUserRooms] = useState([]);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      authUser(localToken);
      fetchRoomsByToken(localToken);
    }
  }, []);

  const fetchRoomsByToken = async (token) => {
    const res = await fetch("http://localhost:5000/api/rooms", {
      headers: {
        "x-auth-token": token,
      },
    });

    const data = await res.json();

    setUserRooms(data);
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
    setGuest(false);
    localStorage.removeItem("token");
  };

  const loginGuest = () => {
    setGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        guest,
        loginGuest,
        user,
        setUser,
        registerUser,
        loginUser,
        logoutUser,
        userRooms,
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
