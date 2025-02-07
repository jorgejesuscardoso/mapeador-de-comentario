import { Outlet } from "react-router-dom"
import HeaderLunar from "../header/header"
import { LayOutContainer } from "./style"

const LayOut = () => {
  return (
    <LayOutContainer>
      <HeaderLunar />
      <Outlet />
    </LayOutContainer>
  )
}

export default LayOut