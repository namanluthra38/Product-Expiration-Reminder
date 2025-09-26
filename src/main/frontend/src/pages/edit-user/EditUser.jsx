import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditUser.css";
import Footer from "../../components/footer/footer";
import DHeader from "../../components/dashboard-header/dheader";

function EditUser() {
  const [userData, setUserData] = useState({ userName: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/signup");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/signup");
        } else {
          const data = await response.json();
          setUserData({ userName: data.userName, email: data.email });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  const enableEdit = (field) => {
    document.getElementById(field).disabled = false;
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };



    const updateUser = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");

      if (!userData.userName || !userData.email) {
        alert("All fields are required.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          alert("Failed to update user details.");
          return;
        }

        const data = await response.json();
        localStorage.setItem("jwtToken", data.token);
        alert("User details updated successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };


  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const changePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/user/${userId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update password.");
        return;
      }

      alert("Password updated successfully! Please log in again.");
      localStorage.clear();
      navigate("/signup");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <>
    <DHeader/>


    <div className="edit-user-container">
      <h2 className="edit-user-title">Edit User Details</h2>
      <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
        <div className="edit-user-form-group">
          <label htmlFor="userName" className="edit-user-label">Username:</label>
          <input
            id="userName"
            type="text"
            className="edit-user-input"
            value={userData.userName}
            onChange={handleInputChange}
            disabled
          />
          <button
            type="button"
            className="edit-user-button edit-user-edit-btn"
            onClick={() => enableEdit("userName")}
          >
            Edit
          </button>
        </div>

        <div className="edit-user-form-group">
          <label htmlFor="email" className="edit-user-label">Email:</label>
          <input
            id="email"
            type="email"
            className="edit-user-input"
            value={userData.email}
            onChange={handleInputChange}
            disabled
          />
          <button
            type="button"
            className="edit-user-button edit-user-edit-btn"
            onClick={() => enableEdit("email")}
          >
            Edit
          </button>
        </div>

        <button
          type="button"
          className="edit-user-button edit-user-save-btn"
          onClick={updateUser}
        >
          Save Changes
        </button>
      </form>

      <h2 className="edit-user-title">Change Password</h2>
      <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
        <div className="edit-user-form-group">
          <label htmlFor="oldPassword" className="edit-user-label">Old Password:</label>
          <input
            id="oldPassword"
            type="password"
            className="edit-user-input"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="edit-user-form-group">
          <label htmlFor="newPassword" className="edit-user-label">New Password:</label>
          <input
            id="newPassword"
            type="password"
            className="edit-user-input"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="edit-user-form-group">
          <label htmlFor="confirmPassword" className="edit-user-label">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            className="edit-user-input"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          type="button"
          className="edit-user-button edit-user-save-btn"
          onClick={changePassword}
        >
          Change Password
        </button>
      </form>
    </div>
    <Footer/>

    </>
  );
}

export default EditUser;
