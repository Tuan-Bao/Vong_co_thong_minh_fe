import { useState } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);

  return (
    <div className="profile-container">
      <h2>Hồ sơ thú cưng</h2>
      {profiles.length > 0 ? (
        <div className="profile-list">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <p>
                <strong>Giống:</strong> {profile.race}
              </p>
              <p>
                <strong>Giới tính:</strong> {profile.sex}
              </p>
              <p>
                <strong>Tuổi:</strong> {profile.age}
              </p>
              <p>
                <strong>Nhiệt độ:</strong> {profile.temperature}
              </p>
              <p>
                <strong>Nhịp tim:</strong> {profile.heartRate}
              </p>
              <p>
                <strong>Nhịp thở:</strong> {profile.respiratoryRate}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có hồ sơ nào.</p>
      )}
    </div>
  );
};

export default ProfilePage;
