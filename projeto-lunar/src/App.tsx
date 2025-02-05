import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/login"
import Home from "./pages/home/Home"
import LayOut from "./component/layout/LayOut"
import FindComments from "./pages/findComments/findComments"

function App() {

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/" element={<LayOut />} >
        <Route path="/home" element={<Home />} />
        <Route path="/bot" element={<FindComments />} />
      </Route>
    </Routes>
  )
}

export default App
