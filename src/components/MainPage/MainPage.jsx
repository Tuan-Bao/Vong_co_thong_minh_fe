import { useState } from "react";
import axios from "axios";
import "./MainPage.css";
import { ref, set } from "firebase/database";
import database from "../../database/FirebaseConfig";

const MainPage = () => {
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [race, setRace] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");

  const handleGetData = () => {
    // TODO: Implement ESP8266 data fetching
    console.log("Fetching data from ESP8266...");
  };

  const handleDetect = async () => {
    // Chuẩn bị dữ liệu để gửi
    const inputData = {
      race: race === "to" ? 1 : 2,
      sex: sex === "duc" ? 0 : 1,
      age: parseInt(age, 10),
      temperature: parseFloat(temperature),
      heartRate: parseInt(heartRate, 10),
      respiratoryRate: parseInt(respiratoryRate, 10),
    };

    try {
      // Gửi yêu cầu POST đến backend bằng axios
      const response = await axios.post(
        "http://localhost:5000/predict",
        inputData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Nhận kết quả từ backend
      const result = await response.data;
      //console.log(result);
      setDiagnosis(result.diagnosis === 1 ? "Có nguy cơ bệnh" : "Khỏe mạnh");
      setShowAlert(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  const handleSaveProfile = () => {
    const profileData = {
      race: race === "to" ? 1 : 2,
      sex: sex === "duc" ? 0 : 1,
      age: parseInt(age, 10),
      temperature: parseFloat(temperature),
      heartRate: parseInt(heartRate, 10),
      respiratoryRate: parseInt(respiratoryRate, 10),
      diagnosis: diagnosis,
      timestamp: new Date().toISOString(),
    };

    // Lưu dữ liệu vào Firebase
    set(ref(database, "profiles/" + Date.now()), profileData)
      .then(() => {
        console.log("Profile saved successfully!");
        setShowAlert(false);
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
      });
  };

  const exitSaveProfile = () => {
    setShowAlert(false);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Chỉ số sức khỏe</h2>
        </div>
        <div className="card-content">
          <div className="grid-container">
            <input
              type="number"
              placeholder="Nhiệt độ"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Nhịp tim"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Nhịp thở"
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(e.target.value)}
              className="input"
            />
          </div>
          <button onClick={handleGetData} className="button">
            Lấy dữ liệu từ ESP8266
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Thông tin thú cưng</h2>
        </div>
        <div className="card-content">
          <div className="grid-container">
            <select
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="input"
            >
              <option value="">Chọn giống</option>
              <option value="to">To</option>
              <option value="nho">Nhỏ</option>
            </select>

            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="input"
            >
              <option value="">Chọn giới tính</option>
              <option value="duc">Đực</option>
              <option value="cai">Cái</option>
            </select>
            <input
              type="number"
              placeholder="Tuổi"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input"
            />
          </div>
          <button onClick={handleDetect} className="button">
            Phát hiện bệnh
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Kết quả phát hiện</div>
            <div className="modal-content">{diagnosis}</div>
            <div className="modal-footer">
              <button onClick={handleSaveProfile} className="button">
                Lưu hồ sơ
              </button>
              <button onClick={exitSaveProfile} className="exitBtn">
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
