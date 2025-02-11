import { Outlet } from "react-router-dom"
import HeaderLunar from "../header/header"
import { LayOutContainer } from "./style"
import Footer from "../footer/Footer"

const LayOut = () => {
  return (
    <LayOutContainer>
      <HeaderLunar />
      <Outlet />
      <Footer />
    </LayOutContainer>
  )
}

export default LayOut