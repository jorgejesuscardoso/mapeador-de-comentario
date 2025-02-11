import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/login"
import Home from "./pages/home/Home"
import LayOut from "./component/layout/LayOut"
import FindComments from "./pages/findComments/findComments"
import Members from "./pages/member/member"
import Shop from "./pages/shop/Shop"
import Subs from "./pages/subs/Subs"
import Dashboard from "./pages/dashboard/Dashboard"
import RegisterMember from "./pages/dashboard/register"
import ManagerMember from "./pages/dashboard/Manager"

function App() {

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/" element={<LayOut />} >
        <Route path="/home" element={<Home />} />
        <Route path="/bot" element={<FindComments />} />
        <Route path="/member" element={<Members />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/subs" element={<Subs />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/register" element={<RegisterMember />} />
        <Route path="/manager" element={<ManagerMember />} />

      </Route>
    </Routes>
  )
}

export default App
