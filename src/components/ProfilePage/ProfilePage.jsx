import { useState, useEffect } from "react";
import database from "../../database/FirebaseConfig";
import { ref, onValue } from "firebase/database";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tạo tham chiếu đến vị trí "profiles" trong Firebase Realtime Database
    const profilesRef = ref(database, "profiles");

    // Lấy dữ liệu từ Firebase khi có thay đổi
    onValue(profilesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển đổi dữ liệu từ Firebase thành mảng
        const loadedProfiles = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProfiles(loadedProfiles);
      } else {
        setProfiles([]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Đang tải hồ sơ...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Hồ sơ thú cưng</h2>
      {profiles.length > 0 ? (
        <div className="profile-list">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <p>
                <strong>Ngày, giờ khám:</strong> {profile.timestamp}
              </p>
              <p>
                <strong>Giống:</strong> {profile.race == 1 ? "To" : "Nhỏ"}
              </p>
              <p>
                <strong>Giới tính:</strong> {profile.sex == 0 ? "Đực" : "Cái"}
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
              <p>
                <strong>Chẩn đoán:</strong> {profile.diagnosis}
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
