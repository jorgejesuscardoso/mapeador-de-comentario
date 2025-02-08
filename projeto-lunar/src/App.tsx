import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/login"
import Home from "./pages/home/Home"
import LayOut from "./component/layout/LayOut"
import FindComments from "./pages/findComments/findComments"
import Members from "./pages/member/member"

function App() {

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/" element={<LayOut />} >
        <Route path="/home" element={<Home />} />
        <Route path="/bot" element={<FindComments />} />
        <Route path="/member" element={<Members />} />
      </Route>
    </Routes>
  )
}

export default App
