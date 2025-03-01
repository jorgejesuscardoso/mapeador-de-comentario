import { Outlet } from "react-router-dom"
import HeaderLunar from "../header/header"
import { ButtonToTop, LayOutContainer } from "./style"
import Footer from "../footer/Footer"

const LayOut = () => {

  const handleToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LayOutContainer>
      <HeaderLunar />
      <Outlet />
      <Footer />
      <ButtonToTop
        onClick={handleToTop}
      >
        <img src="up.png" alt="Para o topo!" />
      </ButtonToTop>
    </LayOutContainer>
  )
}

export default LayOut