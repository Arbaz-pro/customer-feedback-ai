
import { useState } from "react";
import SelectPage from "./pages/SelectPage";
import UserPage from "./pages/UserPage";
import Admin from "./Admin/Admin";

function App() {
  const [page, setPage] = useState("select");

  const renderPage = () => {
    switch (page) {
      case "user":
        return <UserPage goBack={() => setPage("select")} />;
      case "admin":
        return <Admin />;
      default:
        return <SelectPage setPage={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;